export type ProjectAccountResponse = {
  id: string
  name: string
  description: string
  accounts: ProjectAccountType[]
}
export type ProjectAccountType = {
  account_id: string
  role: 'normal' | 'owner' | 'admin' | 'editor'
  name: string
  employee_number: string
}

export type UpdateMemberDto = {
  tenant_id: string
  accounts: { account_id: string; role: string }[]
}
