import type { Fetcher } from 'swr'
import { get, post } from './base'
import type {
  AgentLogDetailRequest,
  AgentLogDetailResponse,
  AnnotationsCountResponse,
  ChatConversationFullDetailResponse,
  ChatConversationsRequest,
  ChatConversationsResponse,
  ChatMessagesRequest,
  ChatMessagesResponse,
  CompletionConversationFullDetailResponse,
  CompletionConversationsRequest,
  CompletionConversationsResponse,
  ConversationListResponse,
  ConversationMoveAppId,
  ConversationMoveAppIds,
  LogMessageAnnotationsRequest,
  LogMessageAnnotationsResponse,
  LogMessageFeedbacksRequest,
  LogMessageFeedbacksResponse,
  ResultAccountList,
  WorkflowLogsRequest,
  WorkflowLogsResponse,
  WorkflowRunDetailResponse,
  createTenantType,
  updateTenantType,
} from '@/models/log'
import type { NodeTracingListResponse } from '@/types/workflow'

export const fetchMoveAppid: Fetcher<LogMessageFeedbacksResponse, { url: string; body: ConversationMoveAppId }> = ({ url, body }) => {
  return post<LogMessageFeedbacksResponse>(url, { body })
}

export const getAccountList: Fetcher<Array<ResultAccountList>, { url: string; body: ConversationMoveAppIds }> = ({ url, body }) => {
  return post<Array<ResultAccountList>>(url, { body })
}

export const getProcessList: Fetcher<any, { url: string; body: any }> = ({ url, body }) => {
  return post<any>(url, { body })
}

export const getTenantMember: Fetcher<any, { url: string; body: any }> = ({ url, body }) => {
  return post<any>(url, { body })
}

export const updateRole: Fetcher<any, { url: string; body: any }> = ({ url, body }) => {
  return post<any>(url, { body })
}

export const permissionsList: Fetcher<any, { url: string; body: any }> = ({ url, body }) => {
  return post<any>(url, { body })
}

export const getAllAccount: Fetcher<any, { url: string; body: any }> = ({ url, body }) => {
  return post<any>(url, { body })
}

export const getPermissions: Fetcher<any, { url: string; body: any }> = ({ url, body }) => {
  return post<any>(url, { body })
}

export const toAudit: Fetcher<any, { url: string; body: any }> = ({ url, body }) => {
  return post<any>(url, { body })
}

export const getProfile: Fetcher<any, { url: string; params?: any }> = ({ url, params }) => {
  return get<any>(url, params)
}

export const editPermissions: Fetcher<any, { url: string; body: any }> = ({ url, body }) => {
  return post<any>(url, { body })
}



export const createTenant: Fetcher<Array<LogMessageFeedbacksResponse>, { url: string; body: createTenantType }> = ({ url, body }) => {
  return post<Array<LogMessageFeedbacksResponse>>(url, { body })
}

export const updateTenant: Fetcher<Array<LogMessageFeedbacksResponse>, { url: string; body: updateTenantType }> = ({ url, body }) => {
  return post<Array<LogMessageFeedbacksResponse>>(url, { body })
}

export const fetchConversationList: Fetcher<ConversationListResponse, { name: string; appId: string; params?: Record<string, any> }> = ({ appId, params }) => {
  return get<ConversationListResponse>(`/console/api/apps/${appId}/messages`, params)
}

// (Text Generation Application) Session List
export const fetchCompletionConversations: Fetcher<CompletionConversationsResponse, { url: string; params?: CompletionConversationsRequest }> = ({ url, params }) => {
  return get<CompletionConversationsResponse>(url, { params })
}

// (Text Generation Application) Session Detail
export const fetchCompletionConversationDetail: Fetcher<CompletionConversationFullDetailResponse, { url: string }> = ({ url }) => {
  return get<CompletionConversationFullDetailResponse>(url, {})
}

// (Chat Application) Session List
export const fetchChatConversations: Fetcher<ChatConversationsResponse, { url: string; params?: ChatConversationsRequest }> = ({ url, params }) => {
  return get<ChatConversationsResponse>(url, { params })
}

// (Chat Application) Session Detail
export const fetchChatConversationDetail: Fetcher<ChatConversationFullDetailResponse, { url: string }> = ({ url }) => {
  return get<ChatConversationFullDetailResponse>(url, {})
}

// (Chat Application) Message list in one session
export const fetchChatMessages: Fetcher<ChatMessagesResponse, { url: string; params: ChatMessagesRequest }> = ({ url, params }) => {
  return get<ChatMessagesResponse>(url, { params })
}

export const updateLogMessageFeedbacks: Fetcher<LogMessageFeedbacksResponse, { url: string; body: LogMessageFeedbacksRequest }> = ({ url, body }) => {
  return post<LogMessageFeedbacksResponse>(url, { body })
}

export const updateLogMessageAnnotations: Fetcher<LogMessageAnnotationsResponse, { url: string; body: LogMessageAnnotationsRequest }> = ({ url, body }) => {
  return post<LogMessageAnnotationsResponse>(url, { body })
}

export const fetchAnnotationsCount: Fetcher<AnnotationsCountResponse, { url: string }> = ({ url }) => {
  return get<AnnotationsCountResponse>(url)
}

export const fetchWorkflowLogs: Fetcher<WorkflowLogsResponse, { url: string; params?: WorkflowLogsRequest }> = ({ url, params }) => {
  return get<WorkflowLogsResponse>(url, { params })
}

export const fetchRunDetail = ({ appID, runID }: { appID: string; runID: string }) => {
  return get<WorkflowRunDetailResponse>(`/apps/${appID}/workflow-runs/${runID}`)
}

export const fetchTracingList: Fetcher<NodeTracingListResponse, { url: string }> = ({ url }) => {
  return get<NodeTracingListResponse>(url)
}

export const fetchAgentLogDetail = ({ appID, params }: { appID: string; params: AgentLogDetailRequest }) => {
  return get<AgentLogDetailResponse>(`/apps/${appID}/agent/logs`, { params })
}
export const getAccountDetail: Fetcher<AnnotationsCountResponse, { url: string }> = ({ url }) => {
  return get<AnnotationsCountResponse>(url)
}
export const updateAccountCompany: Fetcher<any, { url: string; body: any }> = ({ url, body }) => {
  return post<any>(url, { body })
}
// export const getAccountDetail: Fetcher<CommonResponse, { appId: string; }> = ({ appId }) => {
//   return get(`/app/${appId}/check_app_is_can_edit`,)
// }