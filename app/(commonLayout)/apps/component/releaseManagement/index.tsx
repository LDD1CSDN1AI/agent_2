'use client'
import React, { useEffect, useState } from 'react'
import { Button, ConfigProvider, Modal, Select, Table, Tabs, Tag } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import zhCN from 'antd/lib/locale/zh_CN'
import { getProcessList } from '@/service/log'
import { getQueryParams } from '@/utils/getUrlParams'
import './releasemanagement.css'

type Props = {
  setActiveTab: any
  data?: any

  mutate?: () => void
}

const ReleaseManager: React.FC<Props> = ({ setActiveTab, data, mutate, }) => {
  const [applicationType, setApplicationType] = useState(['public', 'normal', 'project'])
  const [appType, setAppType] = useState<any>(null)
  const [status, setStatus] = useState<any>(null)
  const [detailModal, setDetailModal] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [tabKey, setTabKey] = useState('1')
  const [details, setDetails] = useState<any>({})
  const tenantId = localStorage.getItem('tenantId')
  const detail = (render: any, text: any) => {
    setDetails(text)
    setDetailModal(true)
  }
  useEffect(() => {
    if (tenantId) {
      getrequest()
    }
  }, [tenantId])

  const getrequest = async () => {
    const body: any = {
      page,
      limit: pageSize,
      need_check: true,
      application_type: applicationType,
      app_type: tenantId,
      space_id: '999999999999999999999999999999',
    }
    mutate?.()
    if (appType)
      body.app_type = appType
    else
      delete body.app_type

    if (status)
      body.status = status
    else
      delete body.status

    const res = await getProcessList({
      url: '/application/tenant/apply/process/page/list',
      body,
    })
    if (res.data) {
      setDataSource(res.data)
      setTotal(res.total)
      setPage(res.page)
      setPageSize(res.limit)
    }
  }

  useEffect(() => {
    getrequest()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, applicationType, appType, status])

  const columns = [
    {
      title: '应用名称',
      key: 'app_name',
      dataIndex: 'app_name',
    },
    {
      title: '应用类型',
      key: 'app_type',
      dataIndex: 'app_type',
      render: (render: string) => (
        <>
          {
            render === 'workflow' ? <div>工作流</div> : render === 'agent-chat' ? <div>聊天助手</div> : render === 'metabolic' ? <div>智能体</div> : render === 'tool' ? <div>插件</div> : null
          }
        </>
      ),
    },
    {
      title: '应用描述',
      key: 'app_desc',
      dataIndex: 'app_desc',
    },
    {
      title: '申请权限',
      key: 'application_type',
      dataIndex: 'application_type',
      render: (render: string) => (
        <>
          {
            render === 'normal' ? <div>个人空间</div> : render === 'project' ? <div>项目空间</div> : render === 'public' ? <div>广场</div> : null
          }
        </>
      ),
    },
    {
      title: '申请时间',
      key: 'created_at',
      dataIndex: 'created_at',
      render: (render: string) => (
        <div>
          {new Date(render).toLocaleString()}
        </div >
      ),
    },
    {
      title: '流程状态',
      key: 'status',
      dataIndex: 'status',
      render: (render: any) => (
        <>
          {
            render === 'pendding' ? <Tag color='gold'>审核中</Tag> : render === 'approved' ? <Tag color='green'>已通过</Tag> : <Tag color='red'>未通过</Tag>
          }
        </>
      ),
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      render: (render: any, text: any) => (
        <div>
          <a style={{ color: '#1677ff' }} onClick={() => detail(render, text)}>详情</a>
        </div>
      ),
    },
  ]

  const options1 = [
    {
      label: 'Agent',
      value: 'agent-chat',
    },
    {
      label: '插件',
      value: 'tool',
    },
    {
      label: '工作流',
      value: 'workflow',
    },
    {
      label: '智能体',
      value: 'metabolic',
    },
  ]

  const options2 = [
    {
      label: '已通过',
      value: 'approved',
    },
    {
      label: '审核中',
      value: 'pending',
    },
    {
      label: '未通过',
      value: 'denied',
    },
  ]

  const releaseRequest = () => {
    return (
      <div className='releaseRequestContainer'>
        <div style={{ marginBottom: '10px' }}>
          <Select options={options1} allowClear value={appType} onChange={(key) => {
            if (key === undefined) {
              setAppType(null)
            }
            else {
              const arr: any = []
              arr[0] = key
              setAppType(arr)
            }
          }} style={{ width: '150px' }} placeholder='全部应用类型'></Select>
          <Select options={options2} allowClear value={status} onChange={key => setStatus(key)} style={{ width: '150px', marginLeft: '10px' }} placeholder='全部流程状态'></Select>
        </div>
        <div>
          <Table
            dataSource={dataSource}
            columns={columns}
            scroll={{ y: 350 }}
            className='releaseRequestTable'
            pagination={{
              total,
              pageSizeOptions: [10, 20, 50, 100],
              defaultPageSize: 10,
              defaultCurrent: 1,
              showQuickJumper: true,
              showSizeChanger: true,
              onChange: (page, pageSize) => {
                setPage(page)
                setPageSize(pageSize)
              },
            }}
          />
        </div>
      </div>
    )
  }

  const projectMembers = () => {
    return (
      <div className='projectMembersContainer'>
        <div style={{ marginBottom: '10px' }}>
          <Select options={options1} allowClear value={appType} onChange={(key) => {
            if (key === undefined) {
              setAppType(null)
            }
            else {
              const arr: any = []
              arr[0] = key
              setAppType(arr)
            }
          }} style={{ width: '150px' }} placeholder='全部应用类型'></Select>
          <Select options={options2} allowClear value={status} onChange={key => setStatus(key)} style={{ width: '150px', marginLeft: '10px' }} placeholder='全部流程状态'></Select>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <Table
            dataSource={dataSource}
            columns={columns}
            scroll={{ y: 350 }}
            pagination={{
              total,
              pageSizeOptions: [10, 20, 50, 100],
              defaultPageSize: 10,
              defaultCurrent: 1,
              showQuickJumper: true,
              showSizeChanger: true,
              onChange: (page, pageSize) => {
                setPage(page)
                setPageSize(pageSize)
              },
            }}
          />
        </div>
      </div>
    )
  }
  const items: any = [
    {
      key: '1',
      label: '发布应用',
      children: releaseRequest(),
    },
    {
      key: '2',
      label: '撤销发布',
      children: projectMembers(),
    },
  ]
  const back = () => {
    setActiveTab?.('area')
  }

  const tabsChange = (key: string) => {
    setTabKey(key)
    setAppType(null)
    setStatus(null)
    if (key === '1')
      setApplicationType(['public', 'normal', 'project'])
    else
      setApplicationType(['delete'])
  }

  const modalProps = {
    visible: detailModal,
    centered: true,
    width: 700,
    closable: true,
    maskClosable: true,
    footer: ([<Button key='back' type='primary' onClick={() => setDetailModal(false)}>返回</Button>]),
  }

  return <ConfigProvider locale={zhCN}>
    <div className='mt-[24px] '>
      <div className='flex text-[#1C2748] text-[20px] mb-[16px]'>
        <div onClick={back} className='backIcon'><ArrowLeftOutlined />返回</div>
        <div>发布管理</div>
      </div>
      <div className='bg-[#fff] rounded-[8px] px-[24px] relative abo' style={{ height: 'calc(100vh - 158px)' }}>
        <Tabs defaultActiveKey="1" items={items} onChange={tabsChange} defaultValue={tabKey} />
      </div>
    </div>
    <Modal
      onCancel={() => setDetailModal(false)}
      {...modalProps}
    >
      <div className='modalContainer'>
        <div className="modalHeader">
          <div className="title">{`申请 | ${tabKey === '1' ? '发布应用' : '撤销发布'}`}</div>
          <div className="tag">{details?.status === 'pendding' ? <Tag color='gold'>审核中</Tag> : details?.status === 'approved' ? <Tag color='green'>已通过</Tag> : <Tag color='red'>未通过</Tag>}</div>
        </div>
        <div className="modalBody">
          <div className="bodyTitle">
            <div className="applicationType">{`申请权限：${details.application_type === 'normal' ? '个人空间' : details.application_type === 'project' ? '项目空间' : details.application_type === 'public' ? '广场' : null}`}</div>
            <div className="applicationMan">{`申请人：${details.applicant}`}</div>
            <div className="applicationTime">{`申请时间：${new Date(details.created_at).toLocaleString()}`}</div>
          </div>
          <div className="bodyText">
            <div className="appName">{`应用名称：${details.app_name}`}</div>
            <div className="appType">{`应用类型：${details.app_type}`}</div>
            <div className="appDesc">{`应用描述：${details.app_desc}`}</div>
            <div className="appReason">{`申请原因：${details.reason}`}</div>
          </div>
        </div>
        <div className="modalFooter">
          <div className="result">{`审核结果：${details?.status === 'pendding' ? '-' : details?.status === 'approved' ? '通过' : '不通过'}`}{`(${details.reviewer})`}</div>
          <div className="driction">{`审核意见：${details.denial_reason || '-'}`}</div>
        </div>
      </div>
    </Modal>
  </ConfigProvider>
}
export default ReleaseManager
