import type { CommonNodeType, ValueSelector, VarType } from '@/app/components/workflow/types'

export type VarGroupItem = {
  output_type: VarType
  variables: ValueSelector[]
}
export type OutputVar = Record<string, {
  type: any
  children: null // support nest in the future,
}>

export type ParameterPasserNodeType = CommonNodeType & VarGroupItem & {
  advanced_settings: {
    group_enabled: boolean
    groups: ({
      group_name: string
      groupId: string
    } & VarGroupItem)[]
  }
  outputs: OutputVar
}
