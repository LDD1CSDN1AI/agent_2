import { post } from '@/service/base'
import type { AdminAppliedType, AdminApplyingType } from '@/models/log'
import type { PageParams, PageResponse } from '@/app/components/custom/pro-table'
import type { ApplyParams, RequestParams } from '@/app/(commonLayout)/apps/component/managerPage/applying'
import type { ApplyedRequestParams } from '@/app/(commonLayout)/apps/component/managerPage/applyed'

export const fetchAllApplicaion = (body: PageParams<RequestParams>) => {
  return post<PageResponse<AdminApplyingType>>('/application/admin/apply/process/page/list', { body })
}
export const fetchAllReview = (body: PageParams<ApplyedRequestParams>) => {
  return post<PageResponse<AdminAppliedType>>('/application/admin/app/process/page/list', { body })
}

export const fetchProcessAllApplicaion = (body: PageParams<ApplyedRequestParams>) => {
  return post<PageResponse<AdminAppliedType>>('/application/admin/app/process_all/page/list', { body })
}

export const applyProcess = (body: ApplyParams) => {
  return post<{ data: { result: string; process_id: string }[] }>('/application/process/auth', { body })
}

export const deleteApplyRequest = (body: { process_id: string }) => {
  return post<{ data: { result: string; process_id: string }[] }>('/application/process/delete', { body })
}
