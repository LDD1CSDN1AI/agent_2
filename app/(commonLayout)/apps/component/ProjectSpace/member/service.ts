import { get, post } from '@/service/base'
import type { ResultAccountList } from '@/models/log'
import {
  ProjectAccountResponse,
  ProjectAccountType,
  UpdateMemberDto,
} from '@/app/(commonLayout)/apps/component/ProjectSpace/member/interface'
import { PageParams, PageResponse } from '@/app/components/custom/pro-table'

export const fetchAllUser = (body: { tenant_id: string; name: string }) => {
  return post<ResultAccountList[] | null>('/getAllAccountNormal', { body })
}

export const fetchProjectUser = (tenant_id: string) => {
  return get<ProjectAccountResponse>(`/getTenantDetail/${tenant_id}`)
}

export const updateProjectMember = (body: UpdateMemberDto) => {
  return post<{ result: string; message: string }>('/addMembers', { body })
}

export const fetchMemberList = (body: PageParams<{ tenant_id: string }>) => {
  return post<PageResponse<ProjectAccountType>>('/getTenantMember', { body })
}

export const deleteMemberRequest = (tenant_id: string, account_id: string) => {
  return get<{ result: string }>(`/deleteMember?account_id=${account_id}&tenant_id=${tenant_id || ''}`)
}

export const updateRole = (body: { tenant_id: string; account_id: string; role: ProjectAccountType['role'] }) => {
  return post<{ result: string }>('/updateRole', { body })
}
