import type { Fetcher } from 'swr'
import { del, get, patch, post, put } from './base'
import GlobalUrl from '../GlobalUrl'

// 新调用量统计接口

// 总视图 基本信息查询
export const queryBasicInfo = (): Promise<any> => {
    return get(`${GlobalUrl.wangyun_defaultUrlIp_no_agent_platform}/v1/workflow-api/queryBasicInfo`)
}

// 总视图 调用量趋势
export const queryCallChart = (): Promise<any> => {
    return get(`${GlobalUrl.wangyun_defaultUrlIp_no_agent_platform}/v1/workflow-api/queryCallChart`)
}

//总视图 调用量TOP10
export const topTen = (): Promise<any> => {
    return get(`${GlobalUrl.wangyun_defaultUrlIp_no_agent_platform}/v1/workflow-api/top10`)
}

// 总视图 最新发布TOP10
export const topTenNew = (): Promise<any> => {
    return get(`${GlobalUrl.wangyun_defaultUrlIp_no_agent_platform}/v1/workflow-api/top10new`)
}

// 单个应用详情信息
export const queryBusinessDetail = (id: string): Promise<any> => {
    return get(`${GlobalUrl.wangyun_defaultUrlIp_no_agent_platform}/v1/workflow-api/queryBusinessDetail?business_type=${id}`)
}

// 所有应用详情列表
export const queryAllBusiness = (business_type: string, sort_order: string, sort_field: string, page_no: number, page_size: number): Promise<any> => {
    return get(`${GlobalUrl.wangyun_defaultUrlIp_no_agent_platform}/v1/workflow-api/queryAllBusiness?business_type=${business_type}&sort_order=${sort_order}&sort_field=${sort_field}&page_no=${page_no}&page_size=${page_size}`)
}
