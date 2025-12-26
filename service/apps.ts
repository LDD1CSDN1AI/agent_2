import type { Fetcher } from 'swr'
import { del, get, patch, post, put } from './base'
import type { ApikeysListResponse, AppDailyConversationsResponse, AppDailyEndUsersResponse, AppDailyMessagesResponse, AppDetailResponse, AppListResponse, AppStatisticsResponse, AppTemplatesResponse, AppTokenCostsResponse, AppVoicesListResponse, CreateApiKeyResponse, GenerationIntroductionResponse, TracingConfig, TracingStatus, UpdateAppModelConfigResponse, UpdateAppSiteCodeResponse, UpdateOpenAIKeyResponse, ValidateOpenAIKeyResponse, WorkflowDailyConversationsResponse, pluginPublishedTo1, pluginPublishedTo, apiAddType } from '@/models/app'
import type { CommonResponse } from '@/models/common'
import type { AppMode, ModelConfig } from '@/types/app'
import type { TracingProvider } from '@/app/(commonLayout)/app/(appDetailLayout)/[appId]/overview/tracing/type'
import header from '@/app/components/workflow/header'
import GlobalUrl from '@/GlobalUrl'

export const fetchAppList: Fetcher<AppListResponse, { url: string; params?: Record<string, any> }> = ({ url, params }) => {
  return get<AppListResponse>(GlobalUrl.defaultUrlIp + "/console/api" + url, { params })
}

export const fetchAppDetail = ({ url, id }: { url: string; id: string }) => {
  return get<AppDetailResponse>(GlobalUrl.defaultUrlIp + "/console/api" + `${url}/${id}`)
}

export const fetchAppTemplates: Fetcher<AppTemplatesResponse, { url: string }> = ({ url }) => {
  return get<AppTemplatesResponse>(url)
}

export const createApp: Fetcher<AppDetailResponse, { name: string; icon: string; icon_background: string; mode: AppMode; description?: string; config?: ModelConfig; tenant_id?: string; header_image?: string }> = ({ name, icon, icon_background, mode, description, config, tenant_id, header_image }) => {
  return post<AppDetailResponse>('apps', { body: { name, icon, icon_background, mode, description, model_config: config, tenant_id, header_image } })
}

export const updateAppInfo: Fetcher<AppDetailResponse, { appID: string; name: string; tenant_id: string; icon: string; icon_background: string; description: string; header_image?: string }> = ({ appID, tenant_id, name, icon, icon_background, description, header_image }) => {
  return put<AppDetailResponse>(`apps/${appID}`, { body: { name, icon, icon_background, description, header_image, tenant_id } })
}

export const updateRename: Fetcher<AppDetailResponse, { id: string; provider: string; tenant_id: string; description?: string }> = ({ provider, id, tenant_id, description }) => {
  return post<AppDetailResponse>(`/workspaces/current/tool-provider/api/rename`, { body: { provider, id, tenant_id, description } })
}

export const copyApp: Fetcher<AppDetailResponse, { appID: string; name: string; icon: string; icon_background: string; mode: AppMode; description?: string }> = ({ appID, name, icon, icon_background, mode, description }) => {
  return post<AppDetailResponse>(`apps/${appID}/copy`, { body: { name, icon, icon_background, mode, description } })
}

export const getAppDailyMessages: Fetcher<AppDailyMessagesResponse, { url: string; params: Record<string, any> }> = ({ url, params }) => {
  return get<AppDailyMessagesResponse>(url, { params })
}

export const exportAppConfig: Fetcher<{ data: string }, { appID: string; include?: boolean }> = ({ appID, include = false }) => {
  return get<{ data: string }>(`apps/${appID}/export?include_secret=${include}`)
}

export const queryModelConfigDraft = ({ id }: { id: string }) => {
  return get<any>(`apps/${id}/model-config/draft`)
}

export const importApp: Fetcher<AppDetailResponse, { data: string; tenant_id?: string; name?: string; description?: string; icon?: string; icon_background?: string }> = ({ data, tenant_id, name, description, icon, icon_background }) => {
  return post<AppDetailResponse>('apps/import', { body: { data, tenant_id, name, description, icon, icon_background } })
}

export const switchApp: Fetcher<{ new_app_id: string }, { appID: string; name: string; icon: string; icon_background: string }> = ({ appID, name, icon, icon_background }) => {
  return post<{ new_app_id: string }>(`apps/${appID}/convert-to-workflow`, { body: { name, icon, icon_background } })
}

export const deleteApp: Fetcher<CommonResponse, string> = async (appID) => {
  return await del<CommonResponse>(`apps/${appID}`)
}

export const updateAppSiteStatus: Fetcher<AppDetailResponse, { url: string; body: Record<string, any> }> = ({ url, body }) => {
  return post<AppDetailResponse>(url, { body })
}

export const updateAppApiStatus: Fetcher<AppDetailResponse, { url: string; body: Record<string, any> }> = ({ url, body }) => {
  return post<AppDetailResponse>(url, { body })
}

// path: /apps/{appId}/rate-limit
export const updateAppRateLimit: Fetcher<AppDetailResponse, { url: string; body: Record<string, any> }> = ({ url, body }) => {
  return post<AppDetailResponse>(url, { body })
}

export const updateAppSiteAccessToken: Fetcher<UpdateAppSiteCodeResponse, { url: string }> = ({ url }) => {
  return post<UpdateAppSiteCodeResponse>(url)
}

export const updateAppSiteConfig = ({ url, body }: { url: string; body: Record<string, any> }) => {
  return post<AppDetailResponse>(url, { body })
}

export const getAppDailyConversations: Fetcher<AppDailyConversationsResponse, { url: string; params: Record<string, any> }> = ({ url, params }) => {
  return get<AppDailyConversationsResponse>(url, { params })
}

export const getWorkflowDailyConversations: Fetcher<WorkflowDailyConversationsResponse, { url: string; params: Record<string, any> }> = ({ url, params }) => {
  return get<WorkflowDailyConversationsResponse>(url, { params })
}

export const getAppStatistics: Fetcher<AppStatisticsResponse, { url: string; params: Record<string, any> }> = ({ url, params }) => {
  return get<AppStatisticsResponse>(url, { params })
}

export const getAppDailyEndUsers: Fetcher<AppDailyEndUsersResponse, { url: string; params: Record<string, any> }> = ({ url, params }) => {
  return get<AppDailyEndUsersResponse>(url, { params })
}

export const getAppTokenCosts: Fetcher<AppTokenCostsResponse, { url: string; params: Record<string, any> }> = ({ url, params }) => {
  return get<AppTokenCostsResponse>(url, { params })
}

export const updateAppModelConfig: Fetcher<UpdateAppModelConfigResponse, { url: string; body: Record<string, any> }> = ({ url, body }) => {
  return post<UpdateAppModelConfigResponse>(url, { body })
}

// For temp testing
export const fetchAppListNoMock: Fetcher<AppListResponse, { url: string; params: Record<string, any> }> = ({ url, params }) => {
  return get<AppListResponse>(url, params)
}

export const fetchApiKeysList: Fetcher<ApikeysListResponse, { url: string; params: Record<string, any> }> = ({ url, params }) => {
  return get<ApikeysListResponse>(url, params)
}

export const delApikey: Fetcher<CommonResponse, { url: string; params: Record<string, any> }> = ({ url, params }) => {
  return del<CommonResponse>(url, params)
}

export const createApikey: Fetcher<CreateApiKeyResponse, { url: string; body: Record<string, any> }> = ({ url, body }) => {
  return post<CreateApiKeyResponse>(url, body)
}

export const validateOpenAIKey: Fetcher<ValidateOpenAIKeyResponse, { url: string; body: { token: string } }> = ({ url, body }) => {
  return post<ValidateOpenAIKeyResponse>(url, { body })
}

export const updateOpenAIKey: Fetcher<UpdateOpenAIKeyResponse, { url: string; body: { token: string } }> = ({ url, body }) => {
  return post<UpdateOpenAIKeyResponse>(url, { body })
}

export const generationIntroduction: Fetcher<GenerationIntroductionResponse, { url: string; body: { prompt_template: string } }> = ({ url, body }) => {
  return post<GenerationIntroductionResponse>(url, { body })
}

export const fetchAppVoices: Fetcher<AppVoicesListResponse, { appId: string; language?: string }> = ({ appId, language }) => {
  language = language || 'en-US'
  return get<AppVoicesListResponse>(`apps/${appId}/text-to-audio/voices?language=${language}`)
}

// Tracing
export const fetchTracingStatus: Fetcher<TracingStatus, { appId: string }> = ({ appId }) => {
  return get(`/apps/${appId}/trace`)
}

export const updateTracingStatus: Fetcher<CommonResponse, { appId: string; body: Record<string, any> }> = ({ appId, body }) => {
  return post(`/apps/${appId}/trace`, { body })
}

export const fetchTracingConfig: Fetcher<TracingConfig & { has_not_configured: true }, { appId: string; provider: TracingProvider }> = ({ appId, provider }) => {
  return get(`/apps/${appId}/trace-config`, {
    params: {
      tracing_provider: provider,
    },
  })
}

export const addTracingConfig: Fetcher<CommonResponse, { appId: string; body: TracingConfig }> = ({ appId, body }) => {
  return post(`/apps/${appId}/trace-config`, { body })
}

export const updateTracingConfig: Fetcher<CommonResponse, { appId: string; body: TracingConfig }> = ({ appId, body }) => {
  return patch(`/apps/${appId}/trace-config`, { body })
}

export const removeTracingConfig: Fetcher<CommonResponse, { appId: string; provider: TracingProvider }> = ({ appId, provider }) => {
  return del(`/apps/${appId}/trace-config?tracing_provider=${provider}`)
}
// agent 个人空间发布
export const publishedPersonal: Fetcher<CommonResponse, { appId: string; body: pluginPublishedTo }> = ({ appId, body }) => {
  return post(`/apps/${appId}/published/personal`, { body })
}
// agent 广场
export const agentFaBu: Fetcher<CommonResponse, { appId: string; body: pluginPublishedTo }> = ({ appId, body }) => {
  return post(`/apps/${appId}/audit/public`, { body })
}

// 发布到共享广场
export const shareReleaseAudit: Fetcher<CommonResponse, { appId: string; body: pluginPublishedTo }> = ({ appId, body }) => {
  return post(`/apps/${appId}/audit/share_public`, { body })
}

// 插 件发布到个人空间
export const pluginPublishedToPersonalSpace: Fetcher<CommonResponse, { appId: string; body: pluginPublishedTo }> = ({ appId, body }) => {
  return post(`/tools/${appId}/published/personal`, { body })
}

// 插件发布到广场
export const pluginReleaseAudit: Fetcher<CommonResponse, { appId: string; body: pluginPublishedTo }> = ({ appId, body }) => {
  return post(`/tools/${appId}/audit/public`, { body })
}

// 插件发布到共享广场
export const sharePluginReleaseAudit: Fetcher<CommonResponse, { appId: string; body: pluginPublishedTo }> = ({ appId, body }) => {
  return post(`/tools/${appId}/audit/share_public`, { body })
}

export const getTenantMember: Fetcher<{ url: string; body: { tenant_id: string, page: number, limit: number, name: string } }> = ({ url, body }) => {
  return post<{ url: string }>(url, { body })
}

export const getAddProjectMembers: Fetcher<{ url: string; body: { tenant_id: string, accounts: { account_id: string, role: string } } }> = ({ url, body }) => {
  return post<{ url: string }>(url, { body })
}

export const getUpdateProjectMembers: Fetcher<{ url: string; body: { tenant_id: string, accounts: { account_id: string, role: string } } }> = ({ url, body }) => {
  return post<{ url: string }>(url, { body })
}

export const getAllAccountMembers: Fetcher<CommonResponse, { url: string; body?: { tenant_id?: string, name?: string } }> = ({ url, body }) => {
  return post<{ url: string }>(url, { body })
}
export const AddMembers: Fetcher<CommonResponse, { url: string; body?: { tenant_id?: string, name: string | null, description: string, accounts: any } }> = ({ url, body }) => {
  return post<{ url: string }>(url, { body })
}

export const outProjectTenant: Fetcher<any, { url: string }> = ({ url }) => {
  return get<any>(url)
}

export const verifySceneEncoding: Fetcher<any, { url: string }> = ({ url }) => {
  return get<any>(url)
}
export const editProjectName: Fetcher<CommonResponse, { url: string; body?: { id?: string, name?: string, } }> = ({ url, body }) => {
  return post<{ url: string }>(url, { body })
}
export const editProjectNameGUAN: Fetcher<CommonResponse, { url: string; body?: { id?: string, name?: string, } }> = ({ url, body }) => {
  return post<{ url: string }>(url, { body })
}
export const getTenantDetail: Fetcher<CommonResponse, { appId: string }> = ({ appId }) => {
  return get(`/getTenantDetail/${appId}`)
}

// 项目空间发布应用
export const workspacePublicAudit: Fetcher<CommonResponse, { appId: string; body: pluginPublishedTo1 }> = ({ appId, body }) => {
  return post(`/app/${appId}/public/workspace/audit`, { body })
}
// 项目空间发布工具
export const workspaceAgentPublicAudit: Fetcher<CommonResponse, { appId: string; body: pluginPublishedTo1 }> = ({ appId, body }) => {
  return post(`/tools/${appId}/public/workspace/audit`, { body })
}

// 检测当前发布的插件工具的id或名字是否重复
export const checkPluginName: Fetcher<any, { url: string; body: { tenant_id: string, name: string, app_id: string } }> = ({ url, body }) => {
  return post<any>(url, { body })
}

// 工作流-历史版本-编辑按钮获取详细信息
export const WorkflowsInfo: Fetcher<CommonResponse, { appId: string; workflow_id: string }> = ({ appId, workflow_id }) => {
  return get(`/apps/${appId}/workflows/history/info/${workflow_id}`)
}
// 工作流-历史版本列表
export const Workflows: Fetcher<CommonResponse, { appId: string; }> = ({ appId }) => {
  return post(`/apps/${appId}/workflows/history`)
}
//agent 历史版本接口
export const workspaceAgentList: Fetcher<CommonResponse, { appId: string; }> = ({ appId, }) => {
  return post(`/apps/${appId}/model-config/history`)
}

//智能体和工作流直接发布
export const publishApi: Fetcher<CommonResponse, { app_id: string; tenant_id: string; desc: string }> = ({ app_id, tenant_id, desc }) => {
  return post(`/application/app/publish_api`, { body: { app_id, tenant_id, desc } })
}

//agent-历史版本-编辑按钮获取详细信息
export const workspaceAgentListInof: Fetcher<CommonResponse, { appId: string; model_config_id: string }> = ({ appId, model_config_id }) => {
  return get(`/apps/${appId}/model-config/history/info/${model_config_id}`,)
}
// 工作流退出
export const workspaceBack: Fetcher<CommonResponse, { appId: string; }> = ({ appId }) => {
  return get(`/app/${appId}/delete_app_is_using`,)
}
// 进入工作流每30秒调用一次
export const workspaceEditing: Fetcher<CommonResponse, { appId: string; }> = ({ appId }) => {
  return get(`/app/${appId}/keep_app_is_editing`,)
}
// 进入工作流判断多人编辑
export const workspaceEdit: Fetcher<CommonResponse, { appId: string; }> = ({ appId }) => {
  return get(`/app/${appId}/check_app_is_can_edit`,)
}
// 获取发布名称
export const publishName: any = () => {
  return get(`/tenant/get/current/user/tenants`,)
}



// API管理数据
export const apiListData: Fetcher<CommonResponse, { url: string; body?: { page: number, limit: number, interface_name_zh: string, api_id: string, interface_type: string, region: string, application_scenario: string } }> = ({ url, body }) => {
  return post<{ url: string }>(url, { body })
}
// API管理删除

export const apiDel: Fetcher<CommonResponse, { url: string, body: number }> = ({ url, body }) => {
  return post(url, { body })
}
// API管理添加
export const apiAddList: Fetcher<CommonResponse, { url: string, body: apiAddType }> = ({ url, body }) => {
  return post<{ url: string }>(url, { body })
}
// API管理修改
export const apiUpdate: Fetcher<CommonResponse, { url: string, body: apiAddType }> = ({ url, body }) => {
  return post<{ url: string }>(url, { body })
}
export const apiUpload: Fetcher<CommonResponse, { url: string, body: any, headers: any }> = ({ url, headers, body }) => {
  return post(url, { body, contentType: 'multipart/form-data' }, { bodyStringify: false })
}
// API管理修改
export const exportApiList: Fetcher<CommonResponse, { url: string, body: { interface_name_zh: string, api_id: string, product_list: string, region: string, application_scenario: string, interface_type: string } }> = ({ url, body }) => {
  return post<{ url: string }>(url, { body })
}
//api 获取省份信息
export const apiProvince = () => {
  return get('/get-region-list')
}

// 用户名下知识库新增接口
export const addUserStudyBase: Fetcher<CommonResponse, { url: string, body: { kb_name: string, kb_desc: string, kb_icon: string, tenant_id?: string } }> = ({ url, body }) => {
  return post<{ url: string }>(url, { body })
}
// 用户名下知识库新增接口
export const uplateUserStudyBase: Fetcher<CommonResponse, { url: string, body: { kb_name: string, kb_desc: string, kb_icon: string, tenant_id?: string } }> = ({ url, body }) => {
  return post<{ url: string }>(url, { body })
}
// 用户名下知识库查询接口
export const getUserStudyBaseList: Fetcher<CommonResponse, { url: string, body: { tenant_id?: string } }> = ({ url, body }) => {
  return post<{ url: string }>(url, { body })
}

// 指定知识库下文档查询
export const getKbFileList: Fetcher<CommonResponse, { url: string, body: { kb_id: string, tenant_id?: string } }> = ({ url, body }) => {
  return post<{ url: string }>(url, { body })
}

// 智能体日志接口
export const getAgent_log: Fetcher<CommonResponse, { url: string, body: { app_id: string } }> = ({ url, body }) => {
  return post<{ url: string }>(url, { body })
}

// 智能体接口
export const getMonitor_log: Fetcher<CommonResponse, { url: string, body: { app_id: string, days: number } }> = ({ url, body }) => {
  return post<{ url: string }>(url, { body })
}

// 指定知识库下文档查询
export const delete_docume: Fetcher<CommonResponse, { url: string, body: { kb_id: string, file_name: string, tenant_id?: string } }> = ({ url, body }) => {
  return post<{ url: string }>(url, { body })
}


// 历史命中接口
export const getHistoryMint: Fetcher<CommonResponse, { url: string, body: { kb_id: string, tenant_id?: string } }> = ({ url, body }) => {
  return post<{ url: string }>(url, { body })
}

// 知识检索接口
export const getKnowQuery: Fetcher<CommonResponse, { url: string, body: { kb_id: string, top_k: number, query: string, area: string, tenant_id?: string } }> = ({ url, body }) => {
  return post<{ url: string }>(url, { body })
}

// AI创建智能体
export const ai4Apps: Fetcher<CommonResponse, { url: string, body: { name: string, mode: string, description: string, tenant_id: string, header_image: string, tool_list: [] } }> = ({ url, body }) => {
  return post<{ url: string }>(url, { body })
}

// AI创建智能体
export const getDataRefluxList: Fetcher<CommonResponse, { url: string, param: { page: string, page_size: string, app_name: string, start_time: string, end_time: string } }> = ({ url, param }) => {
  return get<{ url: string }>(url)
}

// AI创建智能体
export const getDataIPList: Fetcher<CommonResponse, { url: string, param: { page: string, page_size: string, client_ip: string, start_time: string, end_time: string } }> = ({ url, param }) => {
  return get<{ url: string }>(url)
  // return get("/interface/api/inter_call_info")
}
// AI创建智能体
export const getApplyStatisticsList: Fetcher<CommonResponse, { url: string, body: {} }> = ({ url, body }) => {
  return post<{ url: string }>(url, { body })
  // return get("/interface/api/inter_call_info")
}
// AI创建智能体
export const getWeeklyStatisticsList: Fetcher<CommonResponse, { url: string, body: {} }> = ({ url, body }) => {
  return post<{ url: string }>(url, { body })
  // return get("/interface/api/inter_call_info")
}
// 新智能体查询接口
export const getNewAgentPage: Fetcher<CommonResponse, { url: string }> = ({ url }) => {
  return get<{ url: string }>(url)
}


// 体验，点赞接口
export const editNewAgentData: Fetcher<CommonResponse, { url: string, param: { app_id: string, add_value: string, mode: string, tenant_id: string, count_type: string } }> = ({ url, param }) => {
  return get<{ url: string }>(url)
}


// 新智能体查询接口
export const getNewAgentDetailData: Fetcher<CommonResponse, { url: string, param: { app_id: string } }> = ({ url, param }) => {
  return get<{ url: string }>(url)
}


// 个人空间-
export const getAgentChatRecord = ({ params }) => {
  return get(`/apps/agent/alllogs`, { params })
}

export const getAgentWokflowLog = ({ params }) => {
  return get(`/apps/agent_workflow/log`, { params })
}

export const getCallStatisticsList: Fetcher<CommonResponse, { url: string; body: any }> = ({ url, body }) => {
  return post<{ url: string }>(url, { body })
}

export const getCallStatisticsDetail: Fetcher<CommonResponse, { url: string; body: any }> = ({ url, body }) => {
  return post<{ url: string }>(url, { body })
}
// 获取省份列表
export const getProvList: Fetcher<CommonResponse, { url: string, params: { flag: string } }> = ({ url, params }) => {
  return get<CommonResponse>(url, { params })
}

// 定义 fetcher
export const updateApiUrlFetcher: Fetcher<CommonResponse, { url: string; body: { businessTypeId: string; url: string, name: string, app_id: string } }> = ({ url, body }) => {
  return post<{ url: string }>(url, { body })
}

// MCP查询接口
export const queryMcpList: Fetcher<CommonResponse, { url: string, body: { pageNum: number, pageSize: number, employeeNumber: string, area: string, serverName: string } }> = ({ url, body }) => {
  return post<{ url: string }>(url, { body })
}