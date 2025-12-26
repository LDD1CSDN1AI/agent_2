import { get, post } from './base'
import type {
  Collection,
  CustomCollectionBackend,
  CustomParamSchema,
  Tool,
  ToolCredential,
  WorkflowToolProviderRequest,
  WorkflowToolProviderResponse,
} from '@/app/components/tools/types'
import type { ToolWithProvider } from '@/app/components/workflow/types'
import type { Label } from '@/app/components/tools/labels/constant'


export const fetchBuiltInToolList = (collectionName: string) => {
  return get<Tool[]>(`/workspaces/current/tool-provider/builtin/${collectionName}/tools`)
}

export const fetchCustomToolList = (collectionName: string) => {
  return get<Tool[]>(`/workspaces/current/tool-provider/api/tools?provider=${collectionName}`)
}

export const fetchModelToolList = (collectionName: string) => {
  return get<Tool[]>(`/workspaces/current/tool-provider/model/tools?provider=${collectionName}`)
}

export const fetchWorkflowToolList = (appID: string) => {
  return get<Tool[]>(`/workspaces/current/tool-provider/workflow/tools?workflow_tool_id=${appID}`)
}

export const fetchBuiltInToolCredentialSchema = (collectionName: string) => {
  return get<ToolCredential[]>(`/workspaces/current/tool-provider/builtin/${collectionName}/credentials_schema`)
}

export const fetchBuiltInToolCredential = (collectionName: string) => {
  return get<ToolCredential[]>(`/workspaces/current/tool-provider/builtin/${collectionName}/credentials`)
}
export const updateBuiltInToolCredential = (collectionName: string, credential: Record<string, any>) => {
  return post(`/workspaces/current/tool-provider/builtin/${collectionName}/update`, {
    body: {
      credentials: credential,
    },
  })
}

export const removeBuiltInToolCredential = (collectionName: string) => {
  return post(`/workspaces/current/tool-provider/builtin/${collectionName}/delete`, {
    body: {},
  })
}

export const get‌Assistant‌List = (ip: any, payload: KnowledgeProviderRequest) => {
  return post(ip + 'prod-api/remote/getAssistantList', {
    body: { ...payload },
  })
}

export const parseParamsSchema = (schema: string) => {
  return post<{ parameters_schema: CustomParamSchema[]; schema_type: string }>('/workspaces/current/tool-provider/api/schema', {
    body: {
      schema,
    },
  })
}

export const fetchCustomCollection = (collectionName: string, tenant_id?: string | null) => {
  return get<CustomCollectionBackend>(`/workspaces/current/tool-provider/api/get?provider=${collectionName}&tenant_id=${tenant_id || ''}`)
}

export const createCustomCollection = (collection: CustomCollectionBackend) => {
  return post('/workspaces/current/tool-provider/api/add', {
    body: {
      ...collection,
    },
  })
}

export const updateCustomCollection = (collection: CustomCollectionBackend) => {
  return post('/workspaces/current/tool-provider/api/update', {
    body: {
      ...collection,
    },
  })
}

export const removeCustomCollection = async (collectionName: any) => {
  return await post('/workspaces/current/tool-provider/api/delete', {
    body: collectionName
  })
}

export const fetchAllBuiltInTools = () => {
  return get<ToolWithProvider[]>('/workspaces/current/tools/builtin')
}

export const importSchemaFromURL = (url: string) => {
  return get('/workspaces/current/tool-provider/api/remote', {
    params: {
      url,
    },
  })
}

export const testAPIAvailable = (payload: any) => {
  return post('/workspaces/current/tool-provider/api/test/pre', {
    body: {
      ...payload,
    },
  })
}

export const testAPIAvailableUnDcoos = (payload: any) => {
  return post('/workspaces/current/tool-provider/api/test', {
    body: {
      ...payload,
    },
  })
}

export const fetchAllCustomTools = (tenant_id?: string) => {
  const path = '/workspaces/current/tools/api'
  return get<ToolWithProvider[]>(tenant_id ? `${path}/${tenant_id}` : path)
}
// 工作流的插件
export const fetchAllWorkflowTools = (tenant_id?: string) => {
  const path = '/workspaces/current/tools/workflow'
  return get<ToolWithProvider[]>(tenant_id ? `${path}/${tenant_id}` : path)
}
// 系统插件
export const fetchAllTools = (tenant_id?: string) => {
  // const path = '/workspaces/current/tools/all'
  const path = '/workspaces/current/tools/builtin'
  return get<ToolWithProvider[]>(tenant_id ? `${path}/${tenant_id}` : path)
}
// 自建插件
export const fetchCollectionList = (tenant_id?: string) => {
  // return get<Collection[]>('/workspaces/current/tool-providers')
  const path = '/workspaces/current/tools/api'
  return get<ToolWithProvider[]>(tenant_id ? `${path}/${tenant_id}` : path)
}
export const fetchLabelList = () => {
  return get<Label[]>('/workspaces/current/tool-labels')
}

export const createWorkflowToolProvider = (payload: WorkflowToolProviderRequest & { workflow_app_id: string }) => {
  return post('/workspaces/current/tool-provider/workflow/create', {
    body: { ...payload },
  })
}

export const saveWorkflowToolProvider = (payload: WorkflowToolProviderRequest & Partial<{
  workflow_app_id: string
  workflow_tool_id: string
}>) => {
  return post('/workspaces/current/tool-provider/workflow/update', {
    body: { ...payload },
  })
}

export const fetchWorkflowToolDetailByAppID = (appID: string) => {
  return get<WorkflowToolProviderResponse>(`/workspaces/current/tool-provider/workflow/get?workflow_app_id=${appID}`)
}

export const fetchWorkflowToolDetail = (toolID: string) => {
  return get<WorkflowToolProviderResponse>(`/workspaces/current/tool-provider/workflow/get?workflow_tool_id=${toolID}`)
}

export const deleteWorkflowTool = (toolID: string) => {
  return post('/workspaces/current/tool-provider/workflow/delete', {
    body: {
      workflow_tool_id: toolID,
    },
  })
}

export const copyCardApi = (param: any, app_id: string) => {
  return post(`/apps/${app_id}/copy`, {
    body: param,
  })
}

interface StudyBaseRequest {
  // user_id: string;
  kb_id: string;
  file: any;
  // rule_1: string;
  // rule_2: string;
}

interface StudyBaseResponse {
  status: string;
}

export const submitStudyBase = async (params: StudyBaseRequest): Promise<StudyBaseResponse> => {

  //真实请求（连不上vpn 无法调试）
  return post('/upload_file', {
    body: params,
  })

  // 模拟 API 请求延迟
  // await new Promise(resolve => setTimeout(resolve, 1000));

  // 模拟成功响应
  // return {
  //   status: 'true'
  // };
};


// export const get‌Assistant‌List = (ip: any, payload: KnowledgeProviderRequest) => {
//   return post(ip + 'prod-api/remote/getAssistantList', {
//     body: { ...payload },
//   })
// }