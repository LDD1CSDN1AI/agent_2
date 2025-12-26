import type { CommonNodeType, Variable } from '@/app/components/workflow/types'

export type RAGNodeType = CommonNodeType & {
  variables: Variable[]
  user_select_scene: string,
  job_type_name: string,
  query: string,
  params: any,
  prov: any
}
