import type { CommonNodeType, Variable } from '@/app/components/workflow/types'

export type AgentNodeType = CommonNodeType & {
  variables: Variable[]
  answer: string
}
