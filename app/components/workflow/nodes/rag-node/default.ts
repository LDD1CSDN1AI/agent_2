import { BlockEnum } from '../../types'
import type { NodeDefault } from '../../types'
import type { RAGNodeType } from './types'
import { ALL_CHAT_AVAILABLE_BLOCKS, ALL_COMPLETION_AVAILABLE_BLOCKS } from '@/app/components/workflow/constants'

const nodeDefault: NodeDefault<RAGNodeType> = {
  defaultValue: {
    variables: [],
    user_select_scene: '',
    params: '',
  },
  getAvailablePrevNodes(isChatMode: boolean) {
    const nodes = isChatMode
      ? ALL_CHAT_AVAILABLE_BLOCKS
      : ALL_COMPLETION_AVAILABLE_BLOCKS.filter(type => type !== BlockEnum.End)
    return nodes
  },
  getAvailableNextNodes(isChatMode: boolean) {
    const nodes = isChatMode
      ? ALL_CHAT_AVAILABLE_BLOCKS
      : ALL_COMPLETION_AVAILABLE_BLOCKS
    return nodes
  },
  checkValid(payload: RAGNodeType, t: any) {
    let errorMessages = ''
    const { user_select_scene } = payload
    // if (!user_select_scene)
    //   errorMessages = t('workflow.errorMsg.fieldRequired', { field: t('workflow.nodes.answer.answer') })

    return {
      isValid: !errorMessages,
      errorMessage: errorMessages,
    }
  },
}

export default nodeDefault
