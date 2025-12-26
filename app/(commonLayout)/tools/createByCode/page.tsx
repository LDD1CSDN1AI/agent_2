'use client'
import React, { FC, useEffect, useState } from 'react'
import { Input } from 'antd'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { testAPIAvailable, testAPIAvailableUnDcoos } from '@/service/tools'
import Button from '@/app/components/base/button'
import s from '../tool.module.css'
import { getQueryParams } from '@/utils/getUrlParams'
const CreateByUrl: FC = () => {
  const router = useRouter()
  const { TextArea } = Input
  const [codeSchema, setCodeSchema] = useState<any>()
  const [query, setQuery] = useState<any>({})
  const [data, setData] = useState<any>({})
  const [showType, setShowType] = useState('')
  const [dataAnother, setDataAnother] = useState('')
  const [result, setResult] = useState<any>('')
  const [show, setShow] = useState<boolean>(false)
  const searchParams: any = useSearchParams()
  const url = searchParams.get('url')
  const value = searchParams.get('value')

  const getRoute = (url: string): string => {
    if (!url.includes('/')) {
      if (url.length > 10) {
        return url.slice(-10)
      } else {
        return url
      }
    }
    const match = url.match(/^[a-zA-Z]+:\/\/[^/]+|^[^/]+/); // 匹配协议和域名部分
    const path = match ? url.slice(match[0].length) : '/'; // 提取路径部分
    const newPath = path.split('?')[0] || '/'
    if (newPath.length > 10) {
      return newPath.slice(-10)
    } else {
      return newPath
    }
  };
  const urls = decodeURIComponent(window.location.href).split('&')[1].split('=')[1]
  const method = searchParams.get('method')

  useEffect(() => {
    if (typeof window !== 'undefined')
      document.title = '测试插件'
    if (searchParams.get('schema') && searchParams.get('url') && searchParams.get('method')) {
      const schema = searchParams.get('schema')
      const dataParams = searchParams.get('data')
      setData(JSON.parse(dataParams))
      if (searchParams.get('dataAnother') !== 'undefined') {
        setDataAnother(searchParams.get('dataAnother') ? JSON.parse(searchParams.get('dataAnother')) : '')
      }
      setShowType(searchParams.get('showType') || '')
      setQuery(JSON.parse(schema))
    }
  }, [])

  useEffect(() => {
    if (query && JSON.stringify(query) !== '{}' && url && method) {
      setShow(true)
      setCodeSchema(JSON.stringify(query))
    }
  }, [query, url, method])

  const back = () => {
    router.back()
  }

  const setQueryValue = (i: any, v: any) => {
    let newQuery = { ...query }
    newQuery.paths[urls][method].parameters.map((item: any) => {
      if (item.name === i.name) {
        item.schema.default = v
      }
    })
    setQuery(newQuery)
  }

  const test = () => {
    const testParams = {
      credentials: data.credentials,
      parameters: query,
      provider_name: data.provider_name,
      schema: codeSchema,
      schema_type: data.schema_type,
      tool_name: data.provider,
    }
    testAPIAvailable(testParams).then((res: any) => {
      setResult(res.result || res.error)
    })
  }

  const testUnDecoos = () => {
    testAPIAvailableUnDcoos(dataAnother).then((res: any) => {
      setResult(res.result || res.error)
    })
  }

  return (
    <div className={s.create}>
      <div className={s.header}>
        <div className={s.back}>
          <div onClick={back} className={s.backIcon}><ArrowLeftOutlined />返回</div>
          <div style={{ fontWeight: 'bolder' }}>测试</div>
        </div>
      </div>
      <div className={s.codeWrapper}>
        <div className={s.codeArea}>
          <TextArea
            rows={28}
            placeholder="请输入插件schema"
            value={codeSchema}
            disabled={true}
          />
        </div>
        <div className={s.codeRun}>
          <div>参数输入</div>
          {show && query.paths[urls][method].parameters.map((item: any, index: any) => (
            <div key={index} className={s.queryInput}>
              <Input
                addonBefore={item.name}
                value={item.name === 'apiData' ? JSON.stringify(item.schema.properties) : (item.schema.default)}
                disabled={item.required}
                onChange={e => setQueryValue(item, e.target.value)}
              />
            </div>
          ))}
          <div><Button variant="primary" onClick={() => showType === 'dcoos' ? test() : testUnDecoos()}>运行</Button></div>
          <div className={s.output}>
            输出结果：{result}
          </div>
        </div>
      </div>
    </div>
  )
}
export default React.memo(CreateByUrl)
