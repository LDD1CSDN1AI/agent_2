// 应用权限
import { useEffect, useState } from 'react'
import { Breadcrumb, ConfigProvider, Input, Select, Table } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import zhCN from 'antd/es/locale/zh_CN'
import { getTenantMember } from '@/service/log'
type Props = {
  setActiveTab?: any
}

const ApplicationAuthority: React.FC<Props> = (props) => {
  const { setActiveTab } = props
  const [inputValue, setInputValue] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [dataSource, setDataSource] = useState([])
  const [appType, setAppType] = useState<any>(null)

  const columns: any = [
    {
      title: '应用名称',
      dataIndex: 'employee_number',
      key: 'employee_number',
    },
    {
      title: '应用类型',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '应用描述',
      dataIndex: 'role',
      width: '200',
      key: 'role',
    },
    {
      title: '创建人',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      dataIndex: '',
      key: '',
      render: (render: any, text: any) => (
        <>
          <div style={{ color: '#1677ff', cursor: 'pointer' }} onClick={() => { setActiveTab?.('editAuthority') }}>编辑权限</div>
        </>
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

  const getTenantMemberFun = async () => {
    const body: any = {
      tenant_id: '3f5d423c-5a99-4b3f-bdf3-2bfd9dacc686', // 先写死看数据，后期替换为props传下来的tenant_id
      page,
      limit: pageSize,
      name: inputValue,
    }
    const res = await getTenantMember({ url: '/getTenantMember', body })
    if (res.data) {
      setDataSource(res.data)
      setTotal(res.total)
      setPage(res.page)
      setPageSize(res.limit)
    }
  }

  useEffect(() => {
    getTenantMemberFun()
  }, [page, pageSize, inputValue])

  return (
    <ConfigProvider locale={zhCN}>
      <div className='mt-[24px]'>
        <Breadcrumb
          style={{ marginBottom: '24px', fontSize: '12px' }}
          items={[
            {
              title: <a onClick={() => setActiveTab?.('all')}>首页</a>,
            },
            {
              title: <a onClick={() => setActiveTab?.('projectSpace')}>项目一</a>,
            },
            {
              title: <div>应用权限</div>,
            },
          ]}
        />
        <div className='flex flex-col bg-[#fff] rounded-[8px] px-[24px] pt-[24px]' style={{ height: 'calc(100vh - 158px)' }}>
          <div className="header" style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '24px',
          }}>
            <div>
              <Select options={options1} allowClear value={appType} style={{ width: '150px', marginRight: '10px' }} onChange={(key: any) => setAppType(key)} placeholder='全部应用类型' />
              <Input
                value={inputValue}
                placeholder="搜索应用名称或申请人"
                allowClear
                onChange={(e: any) => { setInputValue(e.target.value) }}
                style={{ width: 250 }}
                suffix={<SearchOutlined />}
              />
            </div>
          </div>
          <div className="tabs" >
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
      </div>
    </ConfigProvider>
  )
}
export default ApplicationAuthority
