import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { useWorkflow } from '../hooks'
import { useStore } from '@/app/components/workflow/store'
import useTimestamp from '@/hooks/use-timestamp'
import { workspaceBack } from '@/service/apps'

const EditingTitle = () => {
  const { t } = useTranslation()
  const { formatTime } = useTimestamp()
  const { formatTimeFromNow } = useWorkflow()
  const router = useRouter()
  const draftUpdatedAt = useStore(state => state.draftUpdatedAt)
  const publishedAt = useStore(state => state.publishedAt)
  const isSyncingWorkflowDraft = useStore(s => s.isSyncingWorkflowDraft)
  const urlId = window.location
  const app_Id = urlId.pathname.split('/app/')[1].split('/')[0]
  const onBack = async () => {
    await workspaceBack({
      appId: app_Id
    })
    router.back()
  }
  return (
    <div className='flex items-center h-[18px] text-xs text-gray-500'>
      {
        !!draftUpdatedAt && (
          <>
            <div style={{ fontSize: '14px', color: 'gray', marginRight: '10px', cursor: 'pointer' }} onClick={() => {
              onBack()
            }}>返回上一页</div>
            {t('workflow.common.autoSaved')} {formatTime(draftUpdatedAt / 1000, 'HH:mm:ss')}
          </>
        )
      }
      <span className='flex items-center mx-1'>·</span>
      {
        publishedAt
          ? `${t('workflow.common.published')} ${formatTimeFromNow(publishedAt)}`
          : t('workflow.common.unpublished')
      }
      {
        isSyncingWorkflowDraft && (
          <>
            <span className='flex items-center mx-1'>·</span>
            {t('workflow.common.syncingData')}
          </>
        )
      }
    </div>
  )
}

export default memo(EditingTitle)
