import { useMemo } from 'react'
import type { HeaderProps } from '@/app/components/workflow/header'
import Header from '@/app/components/workflow/header'
import { useStore as useAppStore } from '@/app/components/app/store'
import ChatVariableTrigger from './chat-variable-trigger'
import FeaturesTrigger from './features-trigger'
import { useResetWorkflowVersionHistory } from '@/service/use-workflow'

const WorkflowHeader = (props: any) => {
  const { editHistoyData } = props;
  const appDetail = useAppStore(s => s.appDetail)
  const resetWorkflowVersionHistory = useResetWorkflowVersionHistory(appDetail!.id)


  const getHistory = (value: any) => {

    editHistoyData(value);
  }

  const headerProps: HeaderProps = useMemo(() => {
    return {
      normal: {
        components: {
          left: <ChatVariableTrigger />,
          middle: <FeaturesTrigger />,
        },
      },
      restoring: {
        onRestoreSettled: resetWorkflowVersionHistory,
      },
      getHistory
    }
  }, [resetWorkflowVersionHistory])

  return (
    <Header {...headerProps} />
  )
}

export default WorkflowHeader
