import React, { useEffect, useImperativeHandle, useState } from 'react'
import { message, Table, TableProps, ConfigProvider } from 'antd'
import styles from './style.module.scss'
import { getQueryParams } from '@/utils/getUrlParams'
import zhCN from 'antd/es/locale/zh_CN'
/**
 *  泛型留后续添加其他功能使用
 * */
export type ProTableConfigInstance<T = any, K extends object = {}> = {
  onRefresh: () => void
}

type Props<T, K extends object = {}> = {
  proRef?: React.MutableRefObject<ProTableConfigInstance<T, K> | undefined>
  columns: TableProps<T>['columns']
  request: (...args: any[]) => Promise<PageResponse<T>>
  requestParams?: K
}

export type PageParams<K extends object = {}> = {
  page: number
  limit: number
} & K

export type PageResponseParams = {
  page: number
  limit: number
  total: number
  has_more: boolean
  orderBy?: string
  totalPage?: number
}

export type PageResponse<T> = PageResponseParams & { data: T[] }

const initPage: PageParams<any> = {
  page: 1,
  limit: 10,
}

/**
 *  T 为数据类型
 *  K 为参数类型 requestParams
 * */
function ProTable<T, K extends object = {}>({ proRef, columns, request, requestParams }: Props<T, K>) {
  const [dataSource, setDataSource] = useState<T[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [total, setTotal] = useState<number>(0)
  const [messageApi, contextHolder] = message.useMessage()
  const [pagination, setPagination] = useState<PageParams<K>>({
    page: 1,
    limit: 10,
    ...requestParams as K,
  })

  async function fetchData(params: PageParams<K>) {
    try {
      setLoading(true)
      const body = {
        ...params,
        need_check: false,
        tenant_id: getQueryParams('tenant_id')
      }
      const response = await request(body)
      setTotal(response.total)
      setDataSource(response.data)
      setLoading(false)
    } catch (e) {
      setDataSource([])
      setLoading(false)
      messageApi.open({ type: 'error', content: '列表请求失败' })
    }
  }

  function pageChangeHanlder(page: number, size: number) {
    setPagination(prev => ({ ...prev, limit: size, page }))
  }

  function onShowSizeChange(current: number, pageSize: number) {
    setPagination(prev => ({ ...prev, limit: pageSize, page: current }))
  }

  function onRefresh() {
    fetchData({ ...initPage, ...requestParams })
  }

  useImperativeHandle(proRef, () => ({
    onRefresh,
  }))

  useEffect(() => {
    fetchData(pagination)
  }, [pagination])

  useEffect(() => {
    fetchData({ ...initPage, ...requestParams } as PageParams<K>)
  }, [requestParams])

  return (
    <ConfigProvider locale={zhCN}>
      <article className={styles.proTable}>
        {contextHolder}
        <Table<T>
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          scroll={{ y: 350 }}
          pagination={{
            total,
            onShowSizeChange,
            current: pagination.page,
            onChange: pageChangeHanlder,
            pageSize: pagination.limit || 5,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
          }}
        />
      </article>
    </ConfigProvider>
  )
}

export default ProTable
