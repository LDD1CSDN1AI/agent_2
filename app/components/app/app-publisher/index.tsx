import {
  memo,
  useCallback,
  useState,
  useMemo,
  useEffect
} from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import Toast from '@/app/components/base/toast'
import { RiArrowDownSLine } from '@remixicon/react'
import type { ModelAndParameter } from '../configuration/debug/types'
import PublishWithMultipleModel from './publish-with-multiple-model'
import Button from '@/app/components/base/button'
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '@/app/components/base/portal-to-follow-elem'
import EmbeddedModal from '@/app/components/app/overview/embedded'
import { useStore as useAppStore } from '@/app/components/app/store'
import { useGetLanguage } from '@/context/i18n'
import WorkflowToolConfigureButton from '@/app/components/tools/workflow-tool/configure-button'
import ReleaseModal from '@/app/(commonLayout)/apps/component/base/releaseModal/releaseModal'
import { getQueryParams } from '@/utils/getUrlParams'
import type { InputVar } from '@/app/components/workflow/types'
import { fetchWorkflowToolDetailByAppID, createWorkflowToolProvider } from '@/service/tools'
import { publishName } from '@/service/apps'
import ReleaseModalMerge from '@/app/(commonLayout)/apps/component/base/releaseModalMerge'

export type AppPublisherProps = {
  disabled?: boolean
  publishDisabled?: boolean
  publishedAt?: number
  /** only needed in workflow / chatflow mode */
  draftUpdatedAt?: number
  debugWithMultipleModel?: boolean
  multipleModelConfigs?: ModelAndParameter[]
  /** modelAndParameter is passed when debugWithMultipleModel is true */
  onPublish?: (modelAndParameter?: ModelAndParameter) => Promise<any> | any
  onRestore?: () => Promise<any> | any
  onToggle?: (state: boolean) => void
  crossAxisOffset?: number
  toolPublished?: boolean
  inputs?: InputVar[]
  onRefreshData?: () => void
}

const AppPublisher = ({
  disabled = false,
  publishDisabled = false,
  publishedAt,
  draftUpdatedAt,
  debugWithMultipleModel = false,
  multipleModelConfigs = [],
  onPublish,
  onRestore,
  onToggle,
  crossAxisOffset = 0,
  toolPublished,
  inputs,
  onRefreshData,
}: AppPublisherProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [published, setPublished] = useState(false)
  const [open, setOpen] = useState(false)
  const appDetail = useAppStore(state => state.appDetail)
  const [release, setRelease] = useState(false)
  const [detail, setDetail] = useState<any>()
  const { app_base_url: appBaseURL = '', access_token: accessToken = '' } = appDetail?.site ?? {}
  const appMode = (appDetail?.mode !== 'completion' && appDetail?.mode !== 'workflow') ? 'chat' : appDetail.mode
  const appURL = `${appBaseURL}/${appMode}/${accessToken}`

  const language = useGetLanguage()
  const formatTimeFromNow = useCallback((time: number) => {
    return dayjs(time).locale(language === 'zh_Hans' ? 'zh-cn' : language.replace('_', '-')).fromNow()
  }, [language])
  const [listData, setListName] = useState([])
  const publicName = async () => {
    const res = await publishName()
    setListName(res)
    setRelease(true)
  }
  const handlePublish = async (modelAndParameter?: ModelAndParameter) => {
    console.log('Publish')
    setRelease(true)
    const res = await publishName()
    setListName(res)



    // try {
    //   await onPublish?.(modelAndParameter)
    //   setPublished(true)
    // }
    // catch (e) {
    //   setPublished(false)  这个成功了变成true
    // }
  }

  const createHandle = async (data: any & { workflow_app_id: string }) => {
    try {
      await createWorkflowToolProvider(data)
      onRefreshData?.()
      // getDetail(appDetail?.id)
      Toast.notify({
        type: 'success',
        message: t('common.api.actionSuccess'),
      })
      // setShowModal(false)
    }
    catch (e) {
      Toast.notify({ type: 'error', message: (e as Error).message })
    }
    router.push('/apps')
  }

  const handleRestore = useCallback(async () => {
    try {
      await onRestore?.()
      setOpen(false)
    }
    catch (e) { }
  }, [onRestore])

  const handleTrigger = useCallback(() => {
    const state = !open

    if (disabled) {
      setOpen(false)
      return
    }

    onToggle?.(state)
    setOpen(state)

    if (state)
      setPublished(false)
  }, [disabled, onToggle, open])

  const [embeddingModalOpen, setEmbeddingModalOpen] = useState(false)

  const payload = useMemo(() => {
    let parameters: any[] = []
    if (!!!toolPublished) {
      parameters = (inputs || []).map((item) => {
        return {
          name: item.variable,
          description: '',
          form: 'llm',
          required: item.required,
          type: item.type,
        }
      })
    }
    else if (detail && detail.tool) {
      parameters = (inputs || []).map((item) => {
        return {
          name: item.variable,
          required: item.required,
          type: item.type === 'paragraph' ? 'string' : item.type,
          description: detail.tool.parameters.find((param: any) => param.name === item.variable)?.llm_description || '',
          form: detail.tool.parameters.find((param: any) => param.name === item.variable)?.form || 'llm',
        }
      })
    }
    return {
      icon: detail?.icon || {
        content: appDetail?.icon,
        background: appDetail?.icon_background,
      },
      label: detail?.label || appDetail?.name,
      name: detail?.name || '',
      description: detail?.description || appDetail?.description,
      parameters,
      labels: detail?.tool?.labels || [],
      privacy_policy: detail?.privacy_policy || '',
      ...(!!toolPublished
        ? {
          workflow_tool_id: detail?.workflow_tool_id,
        }
        : {
          workflow_app_id: appDetail?.id,
        })
    }
  }, [detail, !!toolPublished, appDetail?.id, appDetail?.name, appDetail?.description, inputs])

  return (
    <PortalToFollowElem
      open={open}
      onOpenChange={setOpen}
      placement='bottom-end'
      offset={{
        mainAxis: 4,
        crossAxis: crossAxisOffset,
      }}
    >
      <PortalToFollowElemTrigger onClick={
        // handleTrigger
        () => publicName()
      }>
        <Button
          variant='primary'
          // className='pl-3 pr-2'
          disabled={disabled}
        >
          {t('workflow.common.publish')}
          {/* <RiArrowDownSLine className='w-4 h-4 ml-0.5' /> */}
        </Button>
      </PortalToFollowElemTrigger>
      <PortalToFollowElemContent className='z-[11]'>
        <div className='w-[336px] bg-white rounded-2xl border-[0.5px] border-gray-200 shadow-xl'>
          <div className='p-4 pt-3'>
            <div className='flex items-center h-6 text-xs font-medium text-gray-500 uppercase'>
              {publishedAt ? t('workflow.common.latestPublished') : t('workflow.common.currentDraftUnpublished')}
            </div>
            {publishedAt
              ? (
                <div className='flex justify-between items-center h-[18px]'>
                  <div className='flex items-center mt-[3px] mb-[3px] leading-[18px] text-[13px] font-medium text-gray-700'>
                    {t('workflow.common.publishedAt')} {formatTimeFromNow(publishedAt)}
                  </div>
                  <Button
                    className={`
                      ml-2 px-2 text-primary-600
                      ${published && 'text-primary-300 border-gray-100'}
                    `}
                    size='small'
                    onClick={handleRestore}
                    disabled={published}
                  >
                    {t('workflow.common.restore')}
                  </Button>
                </div>
              )
              : (
                <div className='flex items-center h-[18px] leading-[18px] text-[13px] font-medium text-gray-700'>
                  {t('workflow.common.autoSaved')} · {Boolean(draftUpdatedAt) && formatTimeFromNow(draftUpdatedAt!)}
                </div>
              )}
            {debugWithMultipleModel
              ? (
                <PublishWithMultipleModel
                  multipleModelConfigs={multipleModelConfigs}
                  onSelect={item => handlePublish(item)}
                // textGenerationModelList={textGenerationModelList}
                />
              )
              : (
                <Button
                  variant='primary'
                  className='w-full mt-3'
                  onClick={() => handlePublish()}
                  disabled={publishDisabled || published}
                >
                  {
                    published
                      ? t('workflow.common.published')
                      : publishedAt ? t('workflow.common.update') : t('workflow.common.publish')
                  }
                </Button>
              )
            }
          </div>
          {/* <div className='p-4 pt-3 border-t-[0.5px] border-t-black/5'> */}
          {/* <SuggestedAction disabled={!publishedAt} link={appURL} icon={<PlayCircle />}>{t('workflow.common.runApp')}</SuggestedAction> */}
          {/* {appDetail?.mode === 'workflow'
              ? (
                <SuggestedAction
                  disabled={!publishedAt}
                  link={`${appURL}${appURL.includes('?') ? '&' : '?'}mode=batch`}
                  icon={<LeftIndent02 className='w-4 h-4' />}
                >
                  {t('workflow.common.batchRunApp')}
                </SuggestedAction>
              )
              : (
                <SuggestedAction
                  onClick={() => {
                    setEmbeddingModalOpen(true)
                    handleTrigger()
                  }}
                  disabled={!publishedAt}
                  icon={<CodeBrowser className='w-4 h-4' />}
                >
                  {t('workflow.common.embedIntoSite')}
                </SuggestedAction>
              )} */}
          {/* <SuggestedAction disabled={!publishedAt} link='./develop' icon={<FileText className='w-4 h-4' />}>{t('workflow.common.accessAPIReference')}</SuggestedAction> */}
          {/* {appDetail?.mode === 'workflow' && (
              <WorkflowToolConfigureButton
                disabled={!publishedAt}
                published={!!toolPublished}
                detailNeedUpdate={!!toolPublished && published}
                workflowAppId={appDetail?.id}
                icon={{
                  content: appDetail?.icon,
                  background: appDetail?.icon_background,
                }}
                name={appDetail?.name}
                description={appDetail?.description}
                inputs={inputs}
                handlePublish={handlePublish}
                onRefreshData={onRefreshData}
              />
            )}
          </div> */}
        </div>
      </PortalToFollowElemContent>
      <EmbeddedModal
        siteInfo={appDetail?.site}
        isShow={embeddingModalOpen}
        onClose={() => setEmbeddingModalOpen(false)}
        appBaseUrl={appBaseURL}
        accessToken={accessToken}
      />
      {
        release ? (<ReleaseModalMerge
          listData={listData}
          onClose={() => setRelease(false)}
          release={release}
          appId={appDetail?.id}
          // status={getQueryParams('status')}
          tabClick={getQueryParams('tabClick')}
          payload={payload}
          onCreate={createHandle}
          currentTab={'workflow'}
        />) : null

      }
    </PortalToFollowElem >
  )
}

export default memo(AppPublisher)
