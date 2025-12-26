import React, { useState } from 'react'
import { Button, Divider, Radio, Table, message } from 'antd'
import type { TableProps } from 'antd'
import useSWRInfinite from 'swr/infinite'
import useSWR from 'swr'
import { addDcoosApi, fetchLlmList } from '@/service/common'
import { fetchAppList } from '@/service/apps'
import type { AppListResponse } from '@/models/app'
import Toast from '@/app/components/base/toast'
import { useAppContext } from '@/context/app-context'
import GlobalUrl from '@/GlobalUrl'
type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection']
type Props = {
  data?: AppListResponse | undefined
  mutate?: () => void
  setActiveTab?: any
}

const agentTypeName: any = {
  'metabolic': '智能体',
  'agent-chat': 'Agent',
  'workflow': '工作流',
  'chat': '聊天助手',
  'advanced-chat': '对话流'
}

const getKey = (
  pageIndex: number,
  previousPageData: AppListResponse,
  // keywords: string,
) => {
  if (!pageIndex || previousPageData.has_more) {
    const params: any = { url: '/apps', params: { page: pageIndex + 1, limit: 50, mode: 'dcoos-sign' } }

    return params
  }
  return null
}

const columns: TableProps<any>['columns'] = [
  {
    title: '应用名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '所属项目空间',
    dataIndex: 'tenant_name',
    key: 'tenant_name',
  },
  {
    title: '服务类型',
    dataIndex: 'mode',
    key: 'mode',
    render(text) {
      return (
        agentTypeName[text]
      )
    },
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    key: 'created_at',
    render(text) {
      return (
        text.split('T')[0]
      )
    },
  },
]

const columnsLlm: TableProps<any>['columns'] = [
  {
    title: '应用名称',
    dataIndex: 'modelName',
    key: 'modelName',
  },
  {
    title: '服务类型',
    dataIndex: 'mode',
    key: 'mode',
    render(text) {
      return (
        '大模型'
      )
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createDate',
    key: 'createDate',
    render(text) {
      return (
        text.split(' ')[0]
      )
    },
  },
]

const DcoosPage: React.FC<Props> = ({ setActiveTab }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [agentType, setAgentType] = useState('agent')
  const { data, mutate } = useSWRInfinite(
    (pageIndex: number, previousPageData: AppListResponse) => getKey(pageIndex, previousPageData),
    fetchAppList,
    { revalidateFirstPage: true },
  )
  const { data: llmList, mutate: llmMutate }: any = useSWR(GlobalUrl.wangyun_defaultUrlIp_no_agent_platform + '/intf-restful-service/deploy/queryAllDeployedModel', fetchLlmList)

  const { userProfile }: any = useAppContext()

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
    type: 'radio',
  }

  const addApi = () => {
    if (selectedRowKeys[0]) {
      const mode = data?.[0].data.find(item => item.id === selectedRowKeys[0])?.mode

      const getUrl = () => {
        switch (mode) {
          case 'agent-chat':
            return GlobalUrl.shufa_rongqi_ip + `/v1/chat-messages/${selectedRowKeys[0]}`;
          case 'workflow':
            return GlobalUrl.shufa_rongqi_ip + `/v1/workflows/run/${selectedRowKeys[0]}`;
          case 'advanced-chat':
            return GlobalUrl.shufa_rongqi_ip + `/v1/chat-messages/${selectedRowKeys[0]}`;
        }
      }

      if (agentType === 'agent') {
        addDcoosApi({

          url: GlobalUrl.defaultUrlIp + '/interface/api/add-api',
          body: {
            url: getUrl(),
            type: 'post',
            name: data?.[0].data.find(item => item.id === selectedRowKeys[0])?.name,
            createBy: userProfile?.employee_number,
            app_id: selectedRowKeys[0]
          },
        }).then((res: any) => {
          setActiveTab('dcoos')
          if ('msg' in res) {
            message.success(res.msg)
          }
        }
        )
      }

      else {
        addDcoosApi({
          url: GlobalUrl.wangyun_defaultUrlIp_no_agent_platform + '/intf-restful-service/deploy/modelRegisterApi',
          body: {
            deployTaskId: selectedRowKeys[0],
            status: '1',
          },
        }).then(() => setActiveTab('dcoos'))
      }
    }
    else {
      Toast.notify({
        type: 'warning',
        message: '请先选择能力模型',
      })
    }
  }

  const handleTypeChange = (type: any) => {
    setAgentType(type)
    setSelectedRowKeys([])
  }

  return (
    <>
      <div style={{ cursor: 'pointer' }} className='mt-[24px]'>
        <div onClick={() => {
          setActiveTab('dcoos')
        }} style={{ backgroundColor: 'white', padding: '16px 16px', marginBottom: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center' }} className='flex items-center mb-[16px]'>
          <div style={{ fontSize: '24px', color: 'black', marginRight: '10px', fontWeight: '700', marginTop: '-6px' }}>
            &lt;
          </div>
          <div className='text-[#1C2748] text-[16px] font-bold'>API注册</div>
        </div>
        <div className='flex flex-col bg-[#fff] rounded-[8px] px-[24px]' style={{ height: 'calc(100vh - 132px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ marginTop: '24px' }}>
              <Divider type="vertical" style={{ borderInlineStart: '3px solid #3470F8' }} />
              <span className='font-bold'>能力选择</span>
            </div>
            <div style={{ marginTop: '24px' }} className='flex justify-center mb-[24px]'>
              <Button style={{ marginRight: '24px' }} onClick={() => setSelectedRowKeys([])}>取消</Button>
              <Button type='primary' onClick={addApi}>确定</Button>
            </div>
          </div>
          <div style={{ margin: ' 0 24px 24px' }}>
            <Radio.Group onChange={e => handleTypeChange(e.target.value)} defaultValue="agent">
              <Radio.Button value="agent">智能体</Radio.Button>
              <Radio.Button value="llm">大模型</Radio.Button>
            </Radio.Group>
          </div>
          <div className='flex-1 w-[100%]'>
            {agentType === 'agent'
              ? (
                <Table columns={columns} rowKey={rd => rd.id} rowSelection={rowSelection} dataSource={data?.[0].data} pagination={{ defaultPageSize: 5 }} />
              )
              : (
                <Table columns={columnsLlm} rowKey={rd => rd.id} rowSelection={rowSelection} dataSource={llmList?.data} pagination={{ defaultPageSize: 5 }} />
              )}
          </div>
        </div>
      </div>
    </>

  )
}

export default DcoosPage
