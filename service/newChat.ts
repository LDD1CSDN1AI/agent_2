import { del, get, post } from './base'

// 获取所有的系统插件
export const getSystemPlugins = ({params}) => {
  return get(`/workspaces/current/tools/builtin/flat`, {params})
}

// 获取所有的自建插件
export const getCustomPlugins = ({params}) => {
  return get(`/workspaces/current/tools/api/flat`, {params})
}

// 订阅
export const subscribe = ({ body }) => {
  return post<any>('/subscribe', { body })
}

// 取消订阅
export const subscribeCancel = ({ body }) => {
  return del<any>('/subscribe', { body })
}

// 点赞/取消点赞/获取点赞数
export const getLikeCount = ({params}) => {
  return get(`/app/edit-count`, {params})
}

// 点赞
export const like = ({ body }) => {
  return post<any>('/like', { body })
}

// 取消点赞
export const likeCancel = ({ body }) => {
  return del<any>('/like', { body })
}