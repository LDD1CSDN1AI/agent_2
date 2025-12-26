'use client'
import React, { FC, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Form, Input, Select, Table, Radio, Segmented, Space, Tag, Modal, message } from 'antd'
import { ArrowLeftOutlined, LeftOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { getSearchParams } from './paramsUtils'
import { getQueryParams } from '@/utils/getUrlParams'
import { createCustomCollection, fetchCustomCollection, updateCustomCollection } from '@/service/tools'
import { publishName } from '@/service/apps'
import Button from '@/app/components/base/button'
import Toast from '@/app/components/base/toast'
import ConfigVar from '@/app/components/tools/create-var'
import s from '../tool.module.css'
import ReleaseModalMerge from '../../apps/component/base/releaseModalMerge'
import RunTestPanel from './RunTestPanel'
import item from '@/app/components/base/date-and-time-picker/calendar/item'
const CreateByUrl: FC = () => {
  const router = useRouter()
  const tenant_id = getQueryParams('tenant_id') || ''
  const [release, setRelease] = useState(false)
  const [showRunTestPanel, setShowRunTestPanel] = useState(false);
  const [method, setMethod] = useState('POST')
  const [url, setUrl] = useState('')
  const [pluginName, setPluginName] = useState((getQueryParams('original_provider') ?? getQueryParams('provider')))
  const [pluginDesc, setPluginDesc] = useState((getQueryParams('desc')))
  const [isRelease, setIsRelease] = useState(false);
  const [appId, setAppId] = useState('')
  const [data, setData] = useState<any>([])
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [value, setValue] = useState(1)
  const [listData, setListName] = useState([])
  const publicName = async () => {
    const res = await publishName()
    setListName(res)
    setRelease(true)
  }

  useEffect(() => {
    (
      async () => {
        console.log(getQueryParams('app_id'), "getQueryParams('app_id')")
        if (getQueryParams('app_id')) {
          setAppId(getQueryParams('app_id'))
        }
      }
    )()
  }, [])

  const [showType, setShowType] = useState('dcoos');
  const [headerVariables, setHeaderVariables] = useState<any>([])
  const [paramsVariables, setParamsVariables] = useState<any>([])
  const [totalParams, setTotalParams] = useState<any>({
    provider: '',
    credentials: {},
    icon: {
      content: '',
      background: '',
    },
    schema_type: 'openapi',
    schema: {
      openapi: '3.1.0',
      info: {
        title: '',
        description: '',
        version: 'v1.0.0',
      },
      servers: [
        {
          url: '',
        },
      ],
      paths: {
      },
      components: {
        schemas: {},
      },
    },
    labels: [],
  })
  const searchObj = {
    original_provider: getSearchParams('original_provider'),
    provider: getSearchParams('provider'),
    desc: getSearchParams('desc'),
  }
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

  const pathRoute = (url: string) => {
    if (!url.includes('/')) {
      return url
    }
    const match = url.match(/^[a-zA-Z]+:\/\/[^/]+|^[^/]+/); // 匹配协议和域名部分
    const path = match ? url.slice(match[0].length) : '/'; // 提取路径部分
    const newPath = path.split('?')[0] || '/'
    return newPath
  }
  useEffect(() => {
    if (typeof window !== 'undefined')
      document.title = '通过URL接入插件'
    const newTotalParams = { ...totalParams }
    if (searchObj.original_provider) {
      fetchCustomCollection(searchObj.original_provider, tenant_id).then((res: any) => {
        res.schema = JSON.parse(res.schema)
        res.provider = searchObj.original_provider
        res.original_provider = searchObj.original_provider
        setValue(res?.access_type || 1)
        const inputUrl = res.schema.servers[0].url;
        setTotalParams(res)
        setUrl(inputUrl)
        setPluginName(res.provider || '');
        setPluginDesc(res.description || '');
        setParamsVariables((res.output_param && JSON.parse(res.output_param) || []).map(record => ({ key: record.name, desc: record.description, type: record?.schema?.type })))
        const methodObj: any = Object.values(res.schema.paths)[0]
        const newMethod = Object.keys(methodObj)[0];

        const params: any = [];
        const parameters = Object.values(methodObj)[0]?.parameters;
        (parameters || []).map((param: any) => {
          params.push({ ...param, key: param.name, type: param?.schema?.type, value: param?.schema?.default });
        });


        setMethod(newMethod)
        // const newHeaders = [...headerVariables]
        // const tempHeaders = []
        // for (const i in res.credentials) {
        //   if (i !== 'auth_type') {
        //     let found = false
        //     // 这个for循环是为了将返回的headers和已有的headers进行合并，避免重复添加
        //     for (let j = 0; j < newHeaders.length; j++) {
        //       if (newHeaders[j].key === i) {
        //         newHeaders[j].value = res.credentials[i]
        //         found = true
        //         break
        //       }
        //     }
        //     if (!found) {
        //       tempHeaders.push({
        //         key: i,
        //         value: res.credentials[i],
        //         max_length: 48,
        //         required: true,
        //         type: 'string',
        //       })
        //     }
        //   }
        // }

        // newHeaders.push(...tempHeaders)
        setHeaderVariables(res?.credentials?.headerVariables || [])
        let newParams: any = [...paramsVariables]
        let newObj: any = methodObj[newMethod].parameters.filter((item: any) => item.name !== 'apiData').map((item: any) => {
          return {
            key: item.name,
            type: item.schema.type,
            required: item.required,
            max_length: 48,
            value: item.schema.default || '',
          }
        })
        let newArr: any = []
        if (methodObj[newMethod].parameters.some((item: any) => item.name === 'apiData')) {
          const apiDataItem = methodObj[newMethod].parameters.find((item: any) => item.name === 'apiData')
          let keys = Object.keys(apiDataItem.schema.properties)
          keys.forEach((v: any, i: any) => {
            newArr.push({
              key: v,
              type: apiDataItem.schema.properties[v].type,
              required: apiDataItem.schema.required[i] === keys[i] ? true : false,
              max_length: 48,
              value: apiDataItem.schema.properties[v].default,
            })
          })
        }

        const combined = [...newObj, ...newParams, ...newArr].reduce((acc, current) => {
          const existing = acc.find((item: any) => item.key === current.key)
          if (existing) {
            return acc
          } else {
            return [...acc, current]
          }
        }, [])
        if (params && params[0] && params[0].showType === 'unDcoos') {
          setShowType('unDcoos')
        } else {
          setParamsVariables(combined)
        }
        setData([{
          name: searchObj.original_provider,
          desc: methodObj[method].description,
          method,
          path: getRoute(inputUrl),
        }])
      })
    }
    else {
      newTotalParams.provider = searchObj.provider
      setTotalParams(newTotalParams)
    }
  }, [])

  const handleHeaderVariablesChange = (vals: any) => {
    setHeaderVariables(vals)
  }

  const handleParamsVariablesChange = (vals: any) => {
    setParamsVariables(vals)
  }

  const getParams = () => {
    const newTotalParams = { ...totalParams }
    if (showType === 'dcoos' && headerVariables.length) {
      newTotalParams.credentials = {
        auth_type: 'none',
        headerVariables: headerVariables
      }
    }
    else {
      newTotalParams.credentials = { auth_type: 'none' }
    }
    if (tenant_id !== '') {
      newTotalParams.tenant_id = tenant_id
    }

    newTotalParams.provider = pluginName || (getQueryParams('original_provider') ?? getQueryParams('provider'))
    newTotalParams.schema.servers = [{ url: url.split('?')[0] }]
    newTotalParams.description = pluginDesc;

    const output_param = (paramsVariables).map((item: any) => {
      return {
        name: item.key,
        description: item.desc || '',
        schema: {
          type: item.type,
        },
      }
    })
    newTotalParams.schema.paths = {
      [getRoute(url)]: {
        [method]: {
          operationId: searchObj.provider ? searchObj.provider || '' : data[0]?.name || '',
          description: searchObj.provider ? '' : data[0]?.desc || '',
          deprecated: false,//
          // parameters: parameters,
        },
      },
    }
    newTotalParams.schema = JSON.stringify(newTotalParams.schema)
    newTotalParams.access_type = value === 1 ? 1 : 2
    newTotalParams.output_param = JSON.stringify(output_param)
    return newTotalParams
  }

  const [dataValue, setDataValue] = useState('');
  const [dataAnotherValue, setDataAnotherValue] = useState('');
  const [schemValue, setSchemaValue] = useState('');
  const jumpToTest = () => {
    let data: any, dataAnother: any
    let schemaString: string
    dataAnother = {
      url: url,
      methods: method,
      headers: {},
      body: {},
      query: {}
    }
    if (searchObj.original_provider) {
      data = {
        ...getParams(),
        schema: {},
      }
      schemaString = transformOpenApiToObj(getParams().schema)
    } else {
      data = {
        ...getParams(),
        schema: {},
      }
      schemaString = transformOpenApiToObj(getParams().schema)
    }
    // const dataString = encodeURIComponent(JSON.stringify(data))
    // const dataAnotherString = encodeURIComponent(JSON.stringify(dataAnother))
    setDataValue(data);
    setDataAnotherValue(dataAnother);
    setSchemaValue(getParams().schema);
    // const urls = `/tools/createByCode?method=${method}&url=${getRoute(url)}&showType=${showType}&schema=${JSON.stringify(schemaString)}&dataAnother=${dataAnotherString}&data=${dataString}&name=${getQueryParams('original_provider') || getQueryParams('provider')}&value=${value}`
    // router.push(urls)

    setShowRunTestPanel(true);
  }

  const back = () => {
    router.push('/apps?category=area')
  };

  const validateParams = (params: any[]): boolean => {
    for (let param of params) {
      if (param.type === "number") {
        if (!/^\d+$/.test(param.value)) {
          return false
        }
      }
    }
    return true
  }

  const transformOpenApiToObj = (jsons: any) => {
    let json = JSON.parse(jsons)
    // 预留需要保留在根的字段名
    const rootNames = value === 1 ? ["systemName", "API", "userId", "session_id", "areaCode", "srvCode", "apiData"] : ["systemName", "API", "apiData"]
    // 初始化 apiData 下的 schema 属性结构
    const apiDataSchema: any = {
      type: "object",
      properties: {},
      required: []
    }
    // json.paths[getRoute(url)][method].parameters = json.paths[getRoute(url)][method].parameters.reduce((acc: any, param: any) => {
    //   if (rootNames.includes(param.name) || showType === 'unDcoos') {
    //     // 保留指定字段在根
    //     acc.push(param)
    //   } else {
    //     // 其余字段放入 apiData 的 schema 属性中的 properties
    //     apiDataSchema.properties[param.name] = {
    //       type: param.schema.type,
    //       default: param.schema.default
    //     }
    //     // 若 required 为 true 则放入 required 数组
    //     if (param.required) {
    //       apiDataSchema.required.push(param.name)
    //     }
    //   }
    //   return acc
    // }, [])
    // 将 apiData 的 schema 赋值
    // const apiDataParam = json.paths[getRoute(url)][method].parameters.find((param: any) => param.name === "apiData")
    // if (apiDataParam && apiDataParam.schema) {
    //   apiDataParam.schema = apiDataSchema;
    // }

    return json
  }

  const checkData = () => {
    let bool = false;


    headerVariables.map((record) => {
      if (!record.key || !record.desc) {
        bool = true;
      }
    })

    paramsVariables.map(record => {
      if (!record.key || !record.desc) {
        bool = true;
      }
    })
    return bool;
  }

  const save = () => {
    if (validateParams(headerVariables)) {
      if (url === '') {
        Toast.notify({
          type: 'error',
          message: '请先输入url',
        })
        return
      }
      if (checkData()) {
        message.info('请校验参数完整性')
        return;
      }
      setData([
        {
          name: searchObj.provider || searchObj.original_provider,
          desc: '',
          method,
          path: pathRoute(url),
        },
      ])

      let params: any = getParams()
      let json = transformOpenApiToObj(params.schema)
      params.schema = JSON.stringify(json)
      const handleResponse = (res: any) => {
        Toast.notify({
          type: 'success',
          message: '保存成功',
        })
        setAppId(res.provider_id || '')
      }

      const handleError = (err: any) => {
        Toast.notify({
          type: 'error',
          message: '保存失败, 请检查是否名称重复',
        })
      }

      let promise: Promise<any>
      if (params.original_provider || appId !== '') {
        promise = updateCustomCollection(params)
      } else {
        promise = createCustomCollection(params)
      }

      promise
        .then(handleResponse)
        .catch(handleError)

      // back()
    } else {
      Toast.notify({
        type: 'error',
        message: '参数格式错误,请重新填写',
      })
    }
  }
  const EditableContext: any = React.createContext(null)
  const EditableRow = ({ index, ...props }: any) => {
    const [form] = Form.useForm()
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    )
  }

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }: any) => {
    const [editing, setEditing] = useState(false)//
    const inputRef: any = useRef(null)
    const form: any = useContext(EditableContext)
    useEffect(() => {
      if (editing)
        inputRef.current?.focus()
    }, [editing])
    const toggleEdit = () => {
      setEditing(!editing)
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      })
    }
    const saved = async () => {
      try {
        const values = await form.validateFields()
        toggleEdit()
        handleSave({
          ...record,
          ...values,
        })
      }
      catch (e) {
        Toast.notify({
          type: 'error',
          message: '参数格式错误,请重新填写',
        })
      }
    }
    let childNode = children
    if (editable) {
      childNode = editing
        ? (
          <Form.Item
            style={{
              margin: 0,
            }}
            name={dataIndex}
          >
            <Input ref={inputRef} onPressEnter={saved} onBlur={saved} />
          </Form.Item>
        )
        : (
          <div
            className={s.editableWrap}
            style={{
              height: 30,
              paddingInlineEnd: 24,
            }}
            onClick={toggleEdit}
          >
            {children}
          </div>
        )
    }
    return <td {...restProps}>{childNode}</td>
  }

  const handleSave = (row: any) => {
    const newData = [...data]
    const index = newData.findIndex(item => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row,
    })
    setData(newData)
    const newSchema: any = { ...totalParams }
    newSchema.schema.paths[getRoute(url)][method].description = row.desc
    setTotalParams(newSchema)
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  }

  const defaultColumns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'desc',
      key: 'desc',
      editable: true,
    },
    {
      title: '方法',
      dataIndex: 'method',
      key: 'method',
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (_: any) => (
        <Button className={s.save} onClick={jumpToTest} >测试</Button>
      ),
    },
  ]

  const columns = defaultColumns.map((col) => {
    if (!col.editable)
      return col

    return {
      ...col,
      onCell: (record: any) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    }
  })

  const { Option } = Select
  const selectBefore = (
    <Select defaultValue="POST" onChange={setMethod} value={method}>
      <Option value="POST">POST</Option>
      <Option value="GET">GET</Option>
    </Select>
  )


  return (
    <>
      <div style={{ fontFamily: 'Source Han Sans-Regular' }} className={s.create}>
        <div className={s.header}>
          <div className={s.back}>
            <div onClick={back} className={s.backIcon}><LeftOutlined /></div>
            <div style={{ fontWeight: 'bolder' }}>
              <img style={{ width: '100%', height: '100%' }} src={`/agent-platform-web/image/plugin-image.png`} />
            </div>
            <div style={{ marginLeft: '4px' }}>
              <Space direction={'vertical'} size={0}>
                <span>插件编辑</span>
                <Tag bordered={false} color={isRelease ? 'green' : 'red'}>{isRelease ? '已发布' : '未发布'}</Tag>
              </Space>
            </div>
          </div>
          <div>
            <Button className={s.save} onClick={save} >保存</Button>
            <Button className={s.save} onClick={jumpToTest} ><PlayCircleOutlined /> 试运行</Button>
            <Button disabled={!saveSuccess} variant="primary" onClick={() => publicName()}>发布</Button>
          </div>
        </div>
        <div className={s.wrapper}>
          <div className={s.body}>
            <div>
              <div style={{ fontFamily: 'Source Han Sans-Medium', fontSize: '14px' }}>
                插件名称
              </div>
              <div style={{ fontFamily: 'Source Han Sans-Regular', fontSize: '14px', fontWeight: '400', color: '#666666', width: '100%', marginTop: '4px' }}>
                <Input placeholder='请输入插件名称' value={pluginName} onChange={(e) => setPluginName(e.target.value)} />
              </div>
            </div>
            <div style={{ marginTop: '16px', fontSize: '14px' }}>
              <div style={{ fontFamily: 'Source Han Sans-Medium' }}>
                插件描述
              </div>
              <div style={{ fontFamily: 'Source Han Sans-Regular', fontSize: '14px', fontWeight: '400', color: '#666666', width: '100%', marginTop: '4px' }}>
                <Input value={pluginDesc} placeholder='请输入插件描述' onChange={(e) => setPluginDesc(e.target.value)} />
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontFamily: 'Source Han Sans-Medium', fontSize: '14px' }}>
                URL地址
              </div>
              <div style={{ fontFamily: 'Source Han Sans-Regular', fontSize: '14px', fontWeight: '400', color: '#666666', width: '100%', marginTop: '4px' }}>
                <Input addonBefore={selectBefore} value={url} onChange={e => setUrl(e.target.value)} />
              </div>
            </div>
            <div>
              {/* 原请求头 */}
              <ConfigVar
                tableType="in"
                btnTitle='增加参数'
                varTitle='配置输入参数'
                promptVariables={headerVariables}
                onPromptVariablesChange={handleHeaderVariablesChange}
              />
            </div>
            <div>
              {/* 原请求体 */}
              <ConfigVar
                tableType="out"
                btnTitle='增加参数'
                varTitle='配置输出参数'
                promptVariables={paramsVariables}
                onPromptVariablesChange={handleParamsVariablesChange}
                radioValue={value}
              />
            </div>

            {/* <div style={{ marginTop: '20px' }}>
              <Table rowClassName={() => s.editableRow} components={components} columns={columns} dataSource={data} pagination={false} bordered />
            </div> */}
          </div>
        </div>
      </div>

      <Modal
        open={showRunTestPanel}
        onCancel={() => setShowRunTestPanel(false)}
        footer={null}
        title={<span style={{ fontFamily: 'Source Han Sans-Bold', fontSize: '18px', fontWeight: '700', color: '#000000' }}>试运行</span>}
        width={'80vw'}
      >
        <RunTestPanel setSaveSuccess={setSaveSuccess} schemValue={schemValue} dataValue={dataValue} dataAnotherValue={dataAnotherValue} key={headerVariables.length} headerVariables={headerVariables} />
      </Modal>
      {
        <ReleaseModalMerge onClose={() => setRelease(false)} release={release} tabClick={'2'} appId={appId} listData={listData} ></ReleaseModalMerge>
      }
    </>
  )
}
export default React.memo(CreateByUrl)
