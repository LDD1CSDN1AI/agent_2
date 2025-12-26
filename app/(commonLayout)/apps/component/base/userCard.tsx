import React, { useEffect, useState, useRef, useContext } from 'react'
import { Input, Modal, Popover, Tag, message } from 'antd'
import { useRouter } from 'next/navigation'
import { useRequest } from 'ahooks'
import { ExclamationCircleFilled } from '@ant-design/icons'
import Image from 'next/image'
import cn from 'classnames'
import { useTranslation } from 'react-i18next'
import styles from './baseStyle.module.scss'
import type { App } from '@/types/app'
import { getRedirection } from '@/utils/app-redirection'
import { useAppContext } from '@/context/app-context'
import { deleteApp, workspaceEdit, publishName, exportAppConfig } from '@/service/apps'
import { copyCardApi, removeCustomCollection } from '@/service/tools'
import { fetchMoveAppid, getProcessList } from '@/service/log'
import editIcon from '@/public/image/editIcon.png'
import Toast from '@/app/components/base/toast'
import { statusShow } from '@/utils/constant'
import CreateModal from '@/app/(commonLayout)/apps/component/base/createModal'
import type { OpenTypes } from '@/app/(commonLayout)/apps/component/base/createModal'
import { getQueryParams } from '@/utils/getUrlParams'
import { verifySceneEncoding } from "@/service/apps";
import { createWorkflowToolProvider } from '@/service/tools'
import { fetchWorkflowDraft } from '@/service/workflow'
import { copyCard } from '../common'
import ReleaseModalMerge from './releaseModalMerge'
type Props = {
  data?: App | undefined
  plugin?: any
  styleCss?: React.CSSProperties
  areaList?: any
  activeArea?: any
  tabClick?: string
  headerImag?: string
  tenantName?: string
  currentTab?: string
  mutate?: () => void
  fromType?: string
  appId?: string
}
const { confirm } = Modal
// 个人空间卡片样式
const UserCard: React.FC<Props> = (props) => {
  const { appId, data, plugin, styleCss, areaList, activeArea, tabClick, headerImag, currentTab = '', mutate, fromType } = props

  const params = new URLSearchParams({
    data: JSON.stringify(data),
  })

  const { t } = useTranslation()


  const [newName, setNewName] = useState(data?.name || '');
  const category = getQueryParams('category')
  const owner = getQueryParams('role')
  const consoleTokenFromLocalStorage = localStorage?.getItem('console_token')
  const { isCurrentWorkspaceEditor } = useAppContext()
  const { push } = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalCopyOpen, setIsModalCopyOpen] = useState(false)
  const [isDefaule, setIsDefaule] = useState(false)
  const [release, setRelease] = useState(false)
  const [directRelease, setDirectRelease] = useState(false)
  const [isName, setNameIS] = useState<any>('')
  const [isPopover, setPopover] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState<OpenTypes>({
    isOpen: false,
    title: '',
    mode: 'agent-chat',
  })
  const [defaultAvatarNumber, setDefaultAvatarNumber] = useState<any>('1')
  const [payload, setPayload] = useState<any>({})
  const [parameters, setParameters] = useState<any>([])
  const [descriptions, setDescriptions] = useState<any>('')
  const [activeTab, setActiveTab] = useState(activeArea)
  const triggerRef = useRef(null); // 用于引用触发器组件
  const contentRef = useRef(null); // content的引用

  const { run: deleteRun } = useRequest(
    async (param) => {
      const result: any = await deleteApp(param)
      mutate?.()
      console.log("result.success------------------------------->", result.success)
      console.log("result.message------------------------------->", result.message)
      // if (!result.success) {
      //   message.info(result.message);
      // } else {
      //   message.success(result.message);
      // }
      if (result.status_code === 200) {
        message.success(result.result);
      } else {
        message.info(result.result);
      }
      if (result.detail === 'App not found.') {
        Toast.notify({
          type: 'error',
          message: '已删除',
        })
      }
      return result
    },
    { manual: true },
  )

  // 插件删除
  const { run: deletePluginsRun } = useRequest(
    async (param) => {
      const params = { provider: param, tenant_id: getQueryParams('tenant_id') }
      const result: any = await removeCustomCollection(params)
      mutate?.()
      console.log("result.success------------------------------->", result.success)
      console.log("result.message------------------------------->", result.message)

      if (result.result === "success") {
        message.success("删除成功！");
      }

      if (result.detail === 'App not found.') {
        Toast.notify({
          type: 'error',
          message: '已删除',
        })
      }
      return result
    },
    { manual: true },
  )

  const showModal = () => {
    setIsModalOpen(true)
  }

  const onExport = async (include = false) => {
    try {
      const { data: dataValue } = await exportAppConfig({
        appID: data?.id ?? plugin?.id,
        include,
      })
      const a = document.createElement('a')
      const file = new Blob([dataValue], { type: 'application/yaml' })
      a.href = URL.createObjectURL(file)
      a.download = `${(data?.name ?? plugin?.name)}.yml`
      a.click()
    }
    catch (e) {
      Toast.notify({ type: 'error', message: t('app.exportFailed') })
    }
  }

  const handleOk = async () => {
    try {
      if (activeTab === activeArea) {
        Toast.notify({
          type: 'error',
          message: '迁移的目标不可与当前空间相同',
        })
      }
      else {
        if (!activeTab) {
          Toast.notify({
            type: 'error',
            message: '请选择目标空间',
          })
        }
        else {
          await fetchMoveAppid({ url: `/apps/${data?.id}/move`, body: { mode: data?.mode, to_tenant_id: activeTab } })
          setIsModalOpen(false)
        }
      }
    }
    catch {
      Toast.notify({
        type: 'error',
        message: '迁移失败',
      })
    }
    setIsModalOpen(false)
  }

  const handleCance = () => {
    setIsModalOpen(false)
  }
  const getIsDefault = () => {
    const isHas = areaList.find((item: any) => item.key === activeArea)
    if (isHas && isHas.name === '默认空间')
      setIsDefaule(true)
    else
      setIsDefaule(false)
  }
  const getOperStatus = async () => {
    if (tabClick === '3') {
      const res = await workspaceEdit({
        appId: data?.id ?? plugin?.id,
      })

      if (res.result !== 'success') {
        return message.error('多人在编辑请稍等...')
      }
      return false
    }
    return false
  }
  const workflow = async (e?: any, appId?: any) => {
    e?.preventDefault()
    // setPopover(!isPopover)
    const name = newName || (data?.name ?? plugin?.name)
    const isGotoNextPage = await getOperStatus()
    if (isGotoNextPage) return

    if (tabClick === '2' && plugin?.status !== 'published')
      return history.pushState(null, '', `/agent-platform-web/tools/createByUrl?original_provider=${plugin?.name}&fromType=${fromType}&tenant_id=${activeArea}&app_id=${data?.id ?? plugin?.id}&tabClick=${tabClick}&status=${plugin?.status}&desc=${plugin?.description?.zh_Hans || plugin?.desc}&console_token=${consoleTokenFromLocalStorage}&category=${category}`)

    if (data?.status !== 'published') {
      // console.log("----------------------------->>>>>>>>>>>>>appId", appId)
      // console.log("----------------------------->>>>>>>>>>>>>data", data)
      getRedirection(isCurrentWorkspaceEditor, {
        ...data,
        tenant_id: activeArea,
        fromType: fromType,
        status: data?.status ?? plugin?.status,
        tabClick,
        category,
        name: name,
        id: appId || data?.id,
        appId: appId || (data?.id ?? plugin?.id)
      }, push, activeArea)
    }




  }
  const edit = async (e: any) => {
    e.preventDefault()
    const isGotoNextPage = await getOperStatus()
    if (isGotoNextPage) return
    if (tabClick === '2')
      return history.pushState(null, '', `/agent-platform-web/tools/createByUrl?original_provider=${plugin?.name}&tenant_id=${activeArea}&fromType=${fromType}&app_id=${plugin?.id}&tabClick=${tabClick}&name=${data?.name ?? plugin?.name}&desc=${plugin?.description?.zh_Hans || plugin?.desc}&console_token=${consoleTokenFromLocalStorage}&header_imag=${plugin?.header_imag}&category=${category}`)
    getRedirection(isCurrentWorkspaceEditor, {
      ...data,
      tenant_id: activeArea,
      fromType,
      tabClick: tabClick,
      name: data?.name ?? plugin?.name,
      status: data?.status ?? plugin?.status,
      category: category
    }, push, activeArea)
  }


  const createHandle = async (data: any & { workflow_app_id: string }) => {
    try {
      await createWorkflowToolProvider(data).then((res: any) => {
        message.success('发布为Agent插件成功！')
      }).catch((e: any) => {
        message.error('发布为Agent插件失败，请重试！')
      })
    }
    catch (e) {
      Toast.notify({ type: 'error', message: (e as Error).message })
    }
  }

  const paramsterFun = async (callback1: any, callback2: any) => {
    await fetchWorkflowDraft(`/apps/${data?.id}/workflows/draft`).then((res: any) => {
      let nodes: any[] = []
      res.graph.nodes.map((item: any) => {
        if (item.data.type === 'start' && item.data.variables) {
          if (item.data.variables.length > 0) {
            item.data.variables.map((i: any) => {
              nodes.push({
                description: '',
                form: 'llm',
                name: i.variable,
                required: i.required,
                type: i.type
              })
            })
          }
        }
      })
      setParameters(nodes)
    }).then(() => {
      verifySceneEncoding({ url: `/apps/${data?.id}` }).then((res: any) => {
        setDescriptions(res.desc || res.description)
      }).then(() => {
        callback1()
        callback2()
      })
    })
  }

  useEffect(() => {
    getIsDefault()
  }, [areaList, activeArea, data, plugin])
  const [listData, setListName] = useState([])
  const publicName = async () => {
    setDirectRelease(directRelease || false);
    const res = await publishName()
    setListName(res)
    if (currentTab !== 'workflow' && (data?.status === 'published' || plugin?.status === 'published'))
      return message.info('已发布，请勿重复操作！')
    else if (currentTab === 'workflow') {
      paramsterFun(
        () => setRelease(true),
        () => setPopover(false)
      )
    } else {
      setRelease(true)
      setPopover(false)
    }

  }

  const cancelCopy = () => {
    setNewName('')
    setIsModalCopyOpen(false)
  }

  const getTabName = () => {
    switch (tabClick) {
      case '1':
        return { name: 'Agent', mode: 'agent-chat' };
      case '2':
        return { name: '插件', mode: 'chat' };
      case '3':
        return { name: '工作流', mode: 'workflow' };
      case '4':
        return { name: '智能体', mode: 'metabolic' };
      case '5':
        return { name: '对话流', mode: 'advanced-chat' };
      default:
        return { name: '' };
    }
  }

  const content = (
    <div className='text-[#1C2748]' ref={contentRef}>

      {
        (data?.status === 'published' || plugin?.status === 'published') ? null : (
          <p className='h-[3.5vh] leading-[3.5vh] hover:bg-[#EEEEEE] rounded-[2px] pl-[5px] pr-[5px] cursor-pointer'
            onClick={() => publicName()}
          >{(tabClick === '2' || tabClick === '4' || tabClick === '5') ? '发布应用' : '发布'}</p>
        )
      }
      {
        currentTab === 'workflow' && (data?.status === 'published' || plugin?.status === 'published') && (category === 'area' || category === 'workSpaceSecondPage') && (!data?.is_agent_use) ? (
          <p className='h-[3.5vh] leading-[3.5vh] hover:bg-[#EEEEEE] rounded-[2px] pl-[5px] pr-[5px] cursor-pointer'
            onClick={() => {
              // fetchWorkflowToolDetailByAppID(data?.id ?? plugin?.id).then((res: any) => {
              //   setPayload(res)
              //   setRelease(true)
              //   setPopover(false)
              // }).catch((err) => {
              //   message.error('获取工作流详情失败，请重试！')
              // })
              paramsterFun(
                () => setRelease(true),
                () => setPopover(false)
              )
            }}
          >发布可被Agent调用</p>
        ) : null
      }
      {
        (data?.status === 'published' || plugin?.status === 'published') ? null : (
          <p className='h-[3.5vh] leading-[3.5vh] hover:bg-[#EEEEEE] rounded-[2px] pl-[5px] pr-[5px] cursor-pointer' onClick={(e) => edit(e)}>编辑</p>
        )
      }
      {
        // copyCard
        (getTabName().mode === 'workflow' || getTabName().mode === 'agent-chat') && (statusShow(data?.status ?? plugin?.status)?.statusName === '未发布') &&
        <p className='h-[3.5vh] leading-[3.5vh] hover:bg-[#EEEEEE] rounded-[2px] pl-[5px] pr-[5px] cursor-pointer' onClick={() => setIsModalCopyOpen(true)}>复制</p>
      }
      {/* {
        // copyCard
        (getTabName().mode === 'agent-chat') && (statusShow(data?.status ?? plugin?.status)?.statusName === '未发布') &&
        <p className='h-[3.5vh] leading-[3.5vh] hover:bg-[#EEEEEE] rounded-[2px] pl-[5px] pr-[5px] cursor-pointer' onClick={() => onExport()}>导出</p>
      } */}
      {/* {
        (data?.status === 'published' || plugin?.status === 'published' && true) ? null : (
          category === 'workSpaceSecondPage'
            ? <p className='h-[3.5vh] leading-[3.5vh] hover:bg-[#EEEEEE] rounded-[2px] pl-[5px] pr-[5px] cursor-pointer' onClick={(e) => {
              e.stopPropagation()
              window.location.href = `/agent-platform-web/apps?category=editAuthority&params=${params.toString()}&tenant_id=${activeArea}&status=${data?.status ?? plugin?.status}&role=${owner}`
            }}>编辑权限</p> : null
        )
      } */}
      {(data?.status === 'published' || plugin?.status === 'published') && (tabClick === '1' || tabClick === '3') && (
        <p className='h-[3.5vh] leading-[3.5vh] hover:bg-[#EEEEEE] rounded-[2px] pl-[5px] pr-[5px] cursor-pointer'
          onClick={(e) => {
            e.stopPropagation()
            window.open(`/agent-platform-web/explore/installed/${data?.id}?tanent_id=${activeArea}`)
          }}>立即体验</p>
      )}
      <p className='h-[3.5vh] leading-[3.5vh] hover:bg-[#EEEEEE] rounded-[2px] pl-[5px] pr-[5px] text-[#E60808] cursor-pointer' onClick={
        (e) => {
          e.stopPropagation()
          confirm({
            title: '确定删除该卡片么？',
            icon: <ExclamationCircleFilled />,
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
              if (tabClick === '2')
                deletePluginsRun(plugin?.name)
              else
                deleteRun(data?.id ?? '')
            },
          })
          setPopover(false)
        }
      }>删除</p>
    </div >
  )

  // 此为全局关闭卡片小弹窗的方法
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      const path = event.composedPath(); // 获取事件路径
      if (
        triggerRef.current &&
        !path.includes(triggerRef.current) &&
        !path.includes(contentRef.current)
      ) {
        setPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className={cn('pl-[2vw] w-[25.3vw] h-[21vh] bg-sky-80 border-[#E0E6EC] border relative rounded-[8px]', styles.hoverCss)}
        style={{ backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', ...styleCss }}
        onClick={(e) => workflow(e)}
      >
        <div className='my-auto'>
          <div className='flex pt-[21px]'>
            <img className='h-[5.5vh] align-top' src={`/agent-platform-web/image/${data ? (data?.header_image ? data?.header_image : headerImag) : (plugin?.header_image ? plugin?.header_image : headerImag)}.png`} alt="" style={{ aspectRatio: '1/1', objectFit: 'cover', margin: '10px 10px 0px 0px' }} />
            <div className='mr-[9px]'>
              <div className='max-w-[14.8vw] color-[#1C2748] text-[20px] text-ellipsis overflow-hidden whitespace-nowrap' title={data?.name ?? plugin?.name}>{data?.name ?? plugin?.name}</div>
              <div>
                <Tag bordered={false} color={statusShow(data?.status ?? plugin?.status)?.type}>
                  {statusShow(data?.status ?? plugin?.status)?.statusName}
                </Tag>
              </div>
            </div>
            {(plugin?.status === 'published')
              ? null
              : (
                <Image src={editIcon} alt='img' width={20} className='mr-[10px] h-[20px] my-auto' onClick={(e) => {
                  e.stopPropagation()
                  setIsAddOpen({
                    id: data?.id || plugin?.id,
                    isOpen: true,
                    title: `编辑${getTabName().name}`,
                    titleName: `${getTabName().name}`,
                    data: data || plugin,
                    mode: getTabName().mode,
                  })
                  setDefaultAvatarNumber(data?.header_image?.slice(-1))
                }} />
              )}
          </div>
          <div className='w-[22.8vw] h-[5.1vh] text-[#1C2748] text-[12px] mt-[8px] mr-[24px] text-ellipsis overflow-hidden' style={{ display: '-webkit-box', lineClamp: 2, boxOrient: 'vertical' }}>{data?.description || plugin?.desc}</div>
          <div className='absolute w-[2.08vw] h-[3.7vh] right-[15px] bottom-[15px] hover:bg-[#EEEEEE] rounded-[8px]' style={{ lineHeight: '20px' }} onClick={(e) => {
            e.stopPropagation()
          }}>
            <Popover open={isPopover} content={content} trigger="click">
              <div ref={triggerRef} onClick={() => setPopover(!isPopover)} className='text-[20px] text-center z-20' style={{ userSelect: 'none' }}>...</div>
            </Popover>
          </div>
        </div>
      </div>
      <Modal
        className={styles.modalGlobal}
        title={`${getTabName().name}复制`}
        open={isModalCopyOpen}
        onOk={() => copyCard({ name: newName, icon: '', icon_background: '', fromType, mode: currentTab, tenant_id: activeArea, app_id: data?.id ?? plugin?.id, callback: (id) => { workflow(null, id); cancelCopy() } })}
        onCancel={() => cancelCopy()}
        okText='确定'
        cancelText='取消'
      >
        <div style={{ margin: '4px 0' }}>
          新命名：<Input defaultValue={data?.name} onChange={(e) => setNewName(e.target.value)} />
        </div>
      </Modal >
      <Modal
        className={styles.modalGlobal}
        title="迁移至"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCance}
        okText='确定'
        cancelText='取消'
      >
        <div className='grid grid-cols-3'>
          {areaList?.map((item: any) => (
            <div key={item.key}
              className={cn('my-auto mx-auto py-[6px] px-[20px] border rounded-[4px] mb-[10px]',
                activeTab === item.key
                  ? 'border-[#216EFF] bg-[rgba(33,110,255,0.1)] text-[#216EFF]'
                  : 'border-[#BBBDC0] text-[#BBBDC0]',
              )}
              onClick={() => setActiveTab(item.key)}>
              {item.name}
            </div>
          ))}
        </div>
      </Modal>
      {
        release ? <ReleaseModalMerge
          listData={listData}
          fromType={fromType}
          tenant_id={activeArea}
          directRelease={directRelease}
          appId={data?.id ?? plugin?.id}
          appName={props?.tenantName || ''}
          tabClick={tabClick}
          release={release}
          isShowPublished={currentTab === 'workflow' && (data?.status === 'published' || plugin?.status === 'published') ? true : false}
          onClose={() => setRelease(false)}
          payload={payload}
          parameter={parameters}
          descriptions={descriptions}
          currentTab={currentTab}
          data={data}
          onCreate={createHandle}
          mutate={mutate}
        /> : null
      }

      {
        isAddOpen.isOpen ?
          <CreateModal
            tenant_id={activeArea}
            status={data?.status ?? plugin?.status}
            appId={data?.id ?? plugin?.id}
            tabClick={tabClick}
            isAddOpen={isAddOpen}
            defaultAvatarNumber={defaultAvatarNumber}
            onClose={(val: boolean) => {
              setIsAddOpen({ ...isAddOpen, isOpen: val })
              mutate?.()
            }}
            mutate={mutate}
          /> : null
      }
    </>
  )
}

export default UserCard
