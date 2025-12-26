import type { Fetcher } from 'swr'
import { get, post } from './base'
import type { CommonResponse } from '@/models/common'
import type {
  ChatRunHistoryResponse,
  FetchWorkflowDraftResponse,
  NodesDefaultConfigsResponse,
  WorkflowRunHistoryResponse,
  ConversationVariableResponse,
} from '@/types/workflow'
import type { BlockEnum } from '@/app/components/workflow/types'

function restoreAgentGraph(processedData) {
  // 确保输入数据有效
  if (!processedData || !processedData.graph || !Array.isArray(processedData.graph.nodes)) {
    return processedData;
  }

  // 目标URL常量
  const TARGET_URL = "http://agent-authentication-backend:21017/agentauth/api/api/proxy/forward";

  // 遍历所有节点
  processedData.graph.nodes.forEach(node => {
    // 只处理类型为 http-request 的节点
    if (node.type === "custom" && node.data && node.data.type === "http-request") {
      const nodeData = node.data;

      // 如果当前URL是目标URL，则尝试还原
      if (nodeData.url === TARGET_URL) {
        // 解析params字段以获取原始URL和method
        let originalUrl = "";
        let originalMethod = "get"; // 默认值

        const paramsStr = nodeData.params || "";
        const paramLines = paramsStr.split('\n').filter(line => line.trim() !== '');

        // 解析参数
        paramLines.forEach(line => {
          const parts = line.split(':');
          if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join(':').trim();

            if (key === 'agentPlatformTargetUrl') {
              originalUrl = value;
            } else if (key === 'agentPlatformTargetMethod') {
              originalMethod = value;
            }
          }
        });

        // 如果找到了原始URL，则进行还原
        if (originalUrl) {
          // 还原URL和method
          nodeData.url = originalUrl;
          nodeData.method = originalMethod;

          // 移除params中的 agentPlatformTargetUrl 和 agentPlatformTargetMethod
          // 并清理params（移除这两个参数以及可能的空行）
          const filteredParams = paramLines.filter(line => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return false;

            const key = trimmedLine.split(':')[0].trim();
            return key !== 'agentPlatformTargetUrl' && key !== 'agentPlatformTargetMethod';
          });

          // 重新构建params字符串
          nodeData.params = filteredParams.join('\n');
        }
      }

      // 处理headers字段（无论是否还原都处理）
      // 移除 content-type:application/json（如果存在且是我们添加的）
      let headersStr = nodeData.headers || "";

      // 解析headers字符串为键值对
      const headerLines = headersStr.split('\n').filter(line => line.trim() !== '');
      const filteredHeaders = [];

      headerLines.forEach(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return;

        const parts = trimmedLine.split(':');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const value = parts.slice(1).join(':').trim();

          // 检查是否是 content-type:application/json
          // 注意：这里更保守，只移除我们可能添加的content-type
          // 如果原始headers已经有content-type，我们也应该保留
          if (key.toLowerCase() === 'content-type' && value.toLowerCase() === 'application/json') {
            // 如果是我们添加的，需要判断是否应该移除
            // 这里简化处理：如果URL被还原了，且这个content-type看起来是标准的application/json，则移除
            // 不添加这个header，相当于移除了
            return;
          }

          filteredHeaders.push(line);
        } else {
          filteredHeaders.push(line);
        }
      });

      // 重新构建headers字符串
      nodeData.headers = filteredHeaders.join('\n');
    }

  });

  return processedData;
}

export const fetchWorkflowDraft = (url: string) => {
  return (get(url, {}, { silent: true }) as Promise<FetchWorkflowDraftResponse>).then(data => { const dataValue = restoreAgentGraph(data); console.log(dataValue, '--------------dataValue'); return dataValue; })
}

function processAgentGraph(data) {
  // 确保输入数据有效
  if (!data || !data.graph || !Array.isArray(data.graph.nodes)) {
    return data;
  }

  // 目标URL常量
  const TARGET_URL = "http://agent-authentication-backend:21017/agentauth/api/api/proxy/forward";

  // 遍历所有节点
  data.graph.nodes.forEach(node => {
    // 只处理类型为 http-request 的节点
    if (node.type === "custom" && node.data && node.data.type === "http-request") {
      const nodeData = node.data;

      // 如果当前URL不是目标URL，则进行处理
      if (nodeData.url !== TARGET_URL) {
        // 保存原始值
        const originalUrl = nodeData.url;
        const originalMethod = nodeData.method;

        // 更新URL和method
        nodeData.url = TARGET_URL;
        nodeData.method = "post";

        // 处理params字段
        let paramsStr = nodeData.params || "";

        // 解析params字符串为键值对
        const paramLines = paramsStr.split('\n').filter(line => line.trim() !== '');
        const params = {};

        paramLines.forEach(line => {
          const parts = line.split(':');
          if (parts.length >= 2) {
            const key = parts[0].trim();
            const value = parts.slice(1).join(':').trim();
            params[key] = value;
          }
        });

        // 检查并添加 agentPlatformTargetUrl
        if (!params.hasOwnProperty('agentPlatformTargetUrl')) {
          // 移除末尾可能存在的换行符
          paramsStr = paramsStr.trim();
          // 如果params不为空，先添加换行符
          if (paramsStr) {
            paramsStr += '\n';
          }
          paramsStr += `agentPlatformTargetUrl:${originalUrl}`;
        }

        // 检查并添加 agentPlatformTargetMethod
        if (!params.hasOwnProperty('agentPlatformTargetMethod')) {
          // 移除末尾可能存在的换行符
          paramsStr = paramsStr.trim();
          // 如果params不为空，先添加换行符
          if (paramsStr) {
            paramsStr += '\n';
          }
          paramsStr += `agentPlatformTargetMethod:${originalMethod}`;
        }

        // 更新nodeData.params
        nodeData.params = paramsStr;
      }

      // 处理headers字段（无论URL是否变化都处理）
      let headersStr = nodeData.headers || "";

      // 解析headers字符串为键值对
      const headerLines = headersStr.split('\n').filter(line => line.trim() !== '');
      const headers = {};

      headerLines.forEach(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const value = parts.slice(1).join(':').trim();
          headers[key.toLowerCase()] = { key, value }; // 保存原始键名和值，键名小写用于查找
        }
      });

      // 检查是否已存在 content-type
      if (!headers.hasOwnProperty('content-type')) {
        // 移除末尾可能存在的换行符
        headersStr = headersStr.trim();
        // 如果headers不为空，先添加换行符
        if (headersStr) {
          headersStr += '\n';
        }
        headersStr += `content-type:application/json`;
      }

      // 更新nodeData.headers
      nodeData.headers = headersStr;
    }
  });

  return data;
}

export const syncWorkflowDraft = ({ url, params }: { url: string; params: Pick<FetchWorkflowDraftResponse, 'graph' | 'features' | 'environment_variables' | 'conversation_variables'> }) => {
  const paramsValue = processAgentGraph(params);
  return post<CommonResponse & { updated_at: number; hash: string }>(url, { body: paramsValue }, { silent: true })
}

export const fetchNodesDefaultConfigs: Fetcher<NodesDefaultConfigsResponse, string> = (url) => {
  return get<NodesDefaultConfigsResponse>(url)
}

export const fetchWorkflowRunHistory: Fetcher<WorkflowRunHistoryResponse, string> = (url) => {
  return get<WorkflowRunHistoryResponse>(url)
}

export const fetcChatRunHistory: Fetcher<ChatRunHistoryResponse, string> = (url) => {
  return get<ChatRunHistoryResponse>(url)
}

export const singleNodeRun = (appId: string, nodeId: string, params: object) => {
  return post(`apps/${appId}/workflows/draft/nodes/${nodeId}/run`, { body: params })
}

export const getIterationSingleNodeRunUrl = (isChatFlow: boolean, appId: string, nodeId: string) => {
  return `apps/${appId}/${isChatFlow ? 'metabolic/' : ''}workflows/draft/iteration/nodes/${nodeId}/run`
}

export const publishWorkflow = (url: string) => {
  return post<CommonResponse & { created_at: number }>(url)
}

export const fetchPublishedWorkflow: Fetcher<FetchWorkflowDraftResponse, string> = (url) => {
  return get<FetchWorkflowDraftResponse>(url)
}
export const fetchChatRunHistory: Fetcher<ChatRunHistoryResponse, string> = (url) => {
  return get<ChatRunHistoryResponse>(url)
}
export const stopWorkflowRun = (url: string) => {
  return post<CommonResponse>(url)
}

export const getLoopSingleNodeRunUrl = (isChatFlow: boolean, appId: string, nodeId: string) => {
  return `apps/${appId}/${isChatFlow ? 'advanced-chat/' : ''}workflows/draft/loop/nodes/${nodeId}/run`
}

export const fetchNodeDefault = (appId: string, blockType: BlockEnum, query = {}) => {
  return get(`apps/${appId}/workflows/default-workflow-block-configs/${blockType}`, {
    params: { q: JSON.stringify(query) },
  })
}

export const updateWorkflowDraftFromDSL = (appId: string, data: string) => {
  return post<FetchWorkflowDraftResponse>(`apps/${appId}/workflows/draft/import`, { body: { data } })
}
export const fetchCurrentValueOfConversationVariable: Fetcher<ConversationVariableResponse, {
  url: string
  params: { conversation_id: string }
}> = ({ url, params }) => {
  return get<ConversationVariableResponse>(url, { params })
}
