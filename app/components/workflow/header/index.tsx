import type { FC } from 'react'
import {
  memo,
  useCallback,
  useMemo,
  useState,
  useEffect
} from 'react'
import { RiApps2AddLine } from '@remixicon/react'
import { useNodes } from 'reactflow'
import { useTranslation } from 'react-i18next'
import { useContext } from 'use-context-selector'
import {
  useStore,
  useWorkflowStore,
} from '../store'
import {
  BlockEnum,
  InputVarType,
} from '../types'
import { message, Modal } from 'antd'
import type { StartNodeType } from '../nodes/start/types'
import {
  useChecklistBeforePublish,
  useNodesReadOnly,
  useNodesSyncDraft,
  useWorkflow,
  useWorkflowMode,
  useWorkflowRun,
  useWorkflowUpdate,
} from '../hooks'
import AppPublisher from '../../app/app-publisher'
import { ToastContext } from '../../base/toast'
import RunAndHistory from './run-and-history'
import EditingTitle from './editing-title'
import RunningTitle from './running-title'
import RestoringTitle from './restoring-title'
import ViewHistory from './view-history'
import EnvButton from './env-button'
import Button from '@/app/components/base/button'
import { useStore as useAppStore } from '@/app/components/app/store'
import { publishWorkflow } from '@/service/workflow'
import { ArrowNarrowLeft } from '@/app/components/base/icons/src/vender/line/arrows'
import { useFeatures } from '@/app/components/base/features/hooks'
import DataList from '@/app/(commonLayout)/apps/component/base/dataList'
import { getQueryParams } from '@/utils/getUrlParams'
import { WorkflowsInfo, Workflows } from '@/service/apps'
import ChatVariableTrigger from '@/app/components/workflow-app/components/workflow-header/chat-variable-trigger'
type headerProps = {
  getHistory: any
}
const Header: FC<headerProps> = (props) => {
  const { getHistory } = props
  const { t } = useTranslation()
  const [isHistory, setHistory] = useState(false)
  const workflowStore = useWorkflowStore()
  const [showModal, setShowModal] = useState(false);
  const appDetail = useAppStore(s => s.appDetail)
  const appSidebarExpand = useAppStore(s => s.appSidebarExpand)
  const appID = appDetail?.id
  const {
    getNodesReadOnly,
  } = useNodesReadOnly()
  const { handleLayout } = useWorkflow()
  const publishedAt = useStore(s => s.publishedAt)
  const draftUpdatedAt = useStore(s => s.draftUpdatedAt)
  const toolPublished = useStore(s => s.toolPublished)
  const nodes = useNodes<StartNodeType>()
  const startNode = nodes.find(node => node.data.type === BlockEnum.Start)
  const startVariables = startNode?.data.variables
  const fileSettings = useFeatures(s => s.features.file)
  const [dataList, setDataList] = useState([])
  const [info, setInfo] = useState<any>()
  const urlId = window.location
  const app_Id = urlId.pathname.split('/app/')[1].split('/workflow')[0]

  const getHistoryList = async () => {
    const result: any = await Workflows({
      appId: app_Id
    })
    const dataSource: any = (result || []).map((item: any, index: number) => {
      return {
        key: index,
        time: item.history_time,
        name: item.update_man_name,
        version_name: item.version_name,
        emid: (<Button className='rounded border  mx-2' onClick={() => emit(item.workflow_id)}>编辑</Button>)
      }
    })
    setDataList(dataSource)
    setHistory(!isHistory)
  }
  const emit = async (id: any) => {
    getHistory({
      isLoading: true,
      data: null
    })
    const result: any = await WorkflowsInfo({
      appId: app_Id,
      workflow_id: id
    })
    if (result.detail == false) {
      return message.success(result.detail)
    }
    getHistory({
      isLoading: false,
      data: result
    })
    setInfo(result)
    setHistory(false)
  }

  const variables = useMemo(() => {
    const data = startVariables || []
    if (fileSettings?.image?.enabled) {
      return [
        ...data,
        {
          type: InputVarType.files,
          variable: '__image',
          required: false,
          label: 'files',
        },
      ]
    }

    return data
  }, [fileSettings?.image?.enabled, startVariables])

  const {
    handleLoadBackupDraft,
    handleBackupDraft,
    handleRestoreFromPublishedWorkflow,
  } = useWorkflowRun()
  const { handleCheckBeforePublish } = useChecklistBeforePublish()
  const { handleSyncWorkflowDraft } = useNodesSyncDraft()
  const { notify } = useContext(ToastContext)
  const {
    normal,
    restoring,
    viewHistory,
  } = useWorkflowMode()
  const { handleRefreshWorkflowDraft } = useWorkflowUpdate()

  const handleShowFeatures = useCallback(() => {
    const {
      showFeaturesPanel,
      isRestoring,
      setShowFeaturesPanel,
    } = workflowStore.getState()
    if (getNodesReadOnly() && !isRestoring)
      return
    setShowFeaturesPanel(!showFeaturesPanel)
  }, [workflowStore, getNodesReadOnly])

  const handleSave = () => {
    handleSyncWorkflowDraft(true)
    notify({ type: 'success', message: '保存成功' })
  }

  const goLayout = () => {
    if (getNodesReadOnly())
      return
    handleLayout()
  }

  const handleCancelRestore = useCallback(() => {
    handleLoadBackupDraft()
    workflowStore.setState({ isRestoring: false })
  }, [workflowStore, handleLoadBackupDraft])

  const handleRestore = useCallback(() => {
    workflowStore.setState({ isRestoring: false })
    workflowStore.setState({ backupDraft: undefined })
    // handleSyncWorkflowDraft(true)
  }, [workflowStore])

  const onPublish = useCallback(async () => {
    if (handleCheckBeforePublish()) {
      const res = await publishWorkflow(`/apps/${appID}/workflows/publish`)

      if (res) {
        notify({ type: 'success', message: t('common.api.actionSuccess') })
        workflowStore.getState().setPublishedAt(res.created_at)
      }
    }
    else {
      throw new Error('Checklist failed')
    }
  }, [appID, handleCheckBeforePublish, notify, t, workflowStore])

  const onStartRestoring = useCallback(() => {
    workflowStore.setState({ isRestoring: true })
    handleBackupDraft()
    handleRestoreFromPublishedWorkflow()
  }, [handleBackupDraft, handleRestoreFromPublishedWorkflow, workflowStore])

  const onPublisherToggle = useCallback((state: boolean) => {
    // if (state)
    //   handleSyncWorkflowDraft(true)
  }, [handleSyncWorkflowDraft])

  const handleGoBackToEdit = useCallback(() => {
    handleLoadBackupDraft()
    workflowStore.setState({ historyWorkflowData: undefined })
  }, [workflowStore, handleLoadBackupDraft])

  const handleToolConfigureUpdate = useCallback(() => {
    workflowStore.setState({ toolPublished: true })
  }, [workflowStore])
  const columns = [
    {
      title: '修改时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '修改人',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '版本名称',
      dataIndex: 'version_name',
      key: 'version_name',
    },
    {
      title: '操作',
      dataIndex: 'emid',
      key: 'emid',
    },
  ];
  return (
    <div
      className='absolute top-0 left-0 z-10 flex items-center justify-between w-full px-3 h-14'
      style={{
        background: 'linear-gradient(180deg, #F9FAFB 0%, rgba(249, 250, 251, 0.00) 100%)',
        zIndex: 99,
      }}
    >
      <div>
        {/* {
          appSidebarExpand === 'collapse' && (
            <div className='text-xs font-medium text-gray-700'>{appDetail?.name}</div>
          )
        } */}
        {
          normal && <EditingTitle />
        }
        {
          viewHistory && <RunningTitle />
        }
        {
          restoring && <RestoringTitle />
        }
      </div>
      {
        normal && (
          <div className='flex items-center gap-2'>

            {/* <source type="video/mp4" />
              您的浏览器不支持视频播放
            </video> */}
            <Modal
              footer={[
                <Button key="back" onClick={() => setShowModal(false)}>
                  关闭
                </Button>]}
              open={showModal} onClose={() => setShowModal(false)}>
              <video muted src={"/agent-platform-web/image/example11.mp4"} controls />
            </Modal>

            <Button
              className='mr-2'
              onClick={() => setShowModal(true)}
            >
              操作演示视频
            </Button>
            <Button
              className='mr-2'
              onClick={goLayout}
            >
              一键优化
            </Button>
            <ChatVariableTrigger />
            <EnvButton />
            <div className='w-[1px] h-3.5 bg-gray-200'></div>
            <RunAndHistory />
            <div className='mx-2 w-[1px] h-3.5 bg-gray-200'></div>
            <Button
              className='mr-2'
              onClick={handleSave}
            >
              {t('workflow.common.save')}
            </Button>
            {/* 工作流功能 图片取消 */}
            {/* <Button className='text-components-button-secondary-text' onClick={handleShowFeatures}>
              <RiApps2AddLine className='w-4 h-4 mr-1 text-components-button-secondary-text' />
              {t('workflow.common.features')}
            </Button> */}
            <Button className='text-components-button-secondary-text' onClick={() => getHistoryList()}>
              历史记录
            </Button>
            <AppPublisher
              {...{
                publishedAt,
                draftUpdatedAt,
                disabled: Boolean(getNodesReadOnly()),
                toolPublished,//
                inputs: variables,//
                onRefreshData: handleToolConfigureUpdate,
                onPublish,
                onRestore: onStartRestoring,
                onToggle: onPublisherToggle,
                crossAxisOffset: 4,
              }}
            />
          </div>
        )
      }
      {
        viewHistory && (
          <div className='flex items-center'>
            <ViewHistory withText />
            <div className='mx-2 w-[1px] h-3.5 bg-gray-200'></div>
            <Button
              variant='primary'
              className='mr-2'
              onClick={handleGoBackToEdit}
            >
              <ArrowNarrowLeft className='w-4 h-4 mr-1' />
              {t('workflow.common.goBackToEdit')}
            </Button>
          </div>
        )
      }
      {
        restoring && (
          <div className='flex items-center'>
            <Button className='text-components-button-secondary-text' onClick={handleShowFeatures}>
              <RiApps2AddLine className='w-4 h-4 mr-1 text-components-button-secondary-text' />
              {t('workflow.common.features')}
            </Button>
            <div className='mx-2 w-[1px] h-3.5 bg-gray-200'></div>
            <Button
              className='mr-2'
              onClick={handleCancelRestore}
            >
              {t('common.operation.cancel')}
            </Button>
            <Button
              onClick={handleRestore}
              variant='primary'
            >
              {t('workflow.common.restore')}

            </Button>
          </div>
        )
      }
      {
        isHistory ?
          <DataList
            dataList='个人空间'
            columns={columns}
            dataSource={dataList}
            onClose={() => setHistory(!isHistory)}
          /> : null
      }
    </div>
  )
}

export default memo(Header)
