import React, { useRef, useState, useEffect } from 'react'
import type { TableProps } from 'antd'
import { Breadcrumb, Button, message, Modal } from 'antd'
import Search from 'antd/es/input/Search'
import { PlusSquareOutlined } from '@ant-design/icons'
import { useAppContext } from '@/context/app-context'
import { getRedirection } from '@/utils/app-redirection'
import { useRouter } from 'next/navigation'
import type { ProTableConfigInstance } from '@/app/components/custom/pro-table'
import ProTable from '@/app/components/custom/pro-table'
import type {
  ProjectAccountType,
  UpdateMemberDto,
} from '@/app/(commonLayout)/apps/component/ProjectSpace/member/interface'
import {
  deleteMemberRequest,
  fetchMemberList,
  updateProjectMember,
  updateRole,
} from '@/app/(commonLayout)/apps/component/ProjectSpace/member/service'
import MemberSelector from '@/app/(commonLayout)/apps/component/ProjectSpace/member/member-selector'
import { useRequest } from 'ahooks'
import { getQueryParams } from '@/utils/getUrlParams'
import { getTenantDetail } from "@/service/apps";

const { warning } = Modal

type Props = {
  setActiveTab: (route: string) => void
  projId?: string
  setCallback?: any
  data?: any
}

type RequestParamsType = {
  tenant_id: string
  name?: string
}

const options = [
  { label: '普通用户', value: 'normal' },
  { label: '管理员', value: 'admin' },
  { label: '编辑人员', value: 'editor' },
  { label: '创建者', value: 'owner' },
]

const ProjectMember: React.FC<Props> = (props) => {
  const { setActiveTab } = props
  const { isCurrentWorkspaceEditor } = useAppContext()
  const { push } = useRouter()
  const tenantId = getQueryParams('tenant_id')
  const [messageApi, contextHolder] = message.useMessage()
  const proTableRef = useRef<ProTableConfigInstance>()
  const [open, setOpen] = useState<boolean>(false)
  const [projectName, setProjectName] = useState<any>('')
  const [requestParams, setRequestParams] = useState<RequestParamsType>({
    tenant_id: tenantId,
  })
  const updateList = useRef<ProjectAccountType[]>([])
  const name = getQueryParams('name')
  const roles = getQueryParams('role')
  const { run, loading } = useRequest(async (val: ProjectAccountType['role'], record: ProjectAccountType) => {
    try {
      const response = await updateRole({ tenant_id: tenantId, role: val, account_id: record.account_id })
      if (response.result === 'success') {
        messageApi.open({ type: 'success', content: '请求成功' })
      } else {
        messageApi.open({ type: 'error', content: '请求失败' })
      }
    } catch (e) {
      messageApi.open({ type: 'error', content: '没有权限' })
    }
  }, { manual: true })

  function closeModal() {
    setOpen(false)
    proTableRef.current?.onRefresh()
  }

  function onSearch(key: string) {
    if (key === requestParams.name) {
      return
    }
    setRequestParams(prev => ({ ...prev, name: key }))
  }

  function changeRole(val: ProjectAccountType['role'], record: ProjectAccountType) {
    run(val, record)
  }

  async function updateMember() {
    try {
      const params: UpdateMemberDto = {
        tenant_id: tenantId,
        accounts: updateList.current.map(item => ({ role: item.role, account_id: item.account_id })),
      }
      await updateProjectMember(params)
      closeModal()
      messageApi.open({ type: 'success', content: '成员修改成功' })
    } catch (e) {
      setOpen(false)
      messageApi.open({ type: 'error', content: '没有权限' })
    }
  }

  async function deleteMember(account_id: string) {

    const modal = Modal.confirm({
      title: '是否确定从该项目中删除成员？',
      content: <p className="text-[#1C2748] mt-5 mb-7">删除后该成员无法查看项目内应用</p>,
      onOk: async () => {
        try {
          await deleteMemberRequest(tenantId, account_id)
          messageApi.open({ type: 'success', content: '已删除' })
          proTableRef.current?.onRefresh()
          modal.destroy()
        } catch (e) {
          messageApi.open({ type: 'error', content: '请求失败' })
          modal.destroy()
        }
      },
      onCancel: () => {

      }
    })
  }

  const columns: TableProps<ProjectAccountType>['columns'] = [
    { title: '人力编码', dataIndex: 'employee_number', key: 'employee_number', width: 40, className: 'text-[#1C2748]' },
    { title: '用户名', dataIndex: 'name', key: 'name', width: 80, className: 'text-[#777D91]' },
    {
      title: '用户权限',
      dataIndex: 'role',
      key: 'role',
      width: 40,
      className: 'text-[#777D91]',
      render: (val, record: ProjectAccountType) => ( // return <Select
        //   disabled={loading}
        //   className="text-[#777D91]"
        //   defaultValue={val}
        //   options={options}
        //   onChange={(val: ProjectAccountType['role']) => changeRole(val, record)}
        // />
        <>{record.role === 'normal' ? '普通用户' : record.role === 'admin' ? '管理员' : record.role === 'editor' ? '编辑人员' : '创建者'}</>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 20,
      render(render: any, record: ProjectAccountType) {
        return <a className="text-[#216EFF]" onClick={() => {
          // if (render.role === 'owner' || render.role === 'admin') {
          deleteMember(record.account_id)
          // } else {
          //   messageApi.open({ type: 'error', content: '没有权限' })
          // }
        }}>删除</a>
      },
    },
  ]

  const getProjectDetail = async () => {
    const res: any = await getTenantDetail({ appId: tenantId })
    setProjectName(res.name || '')
  }

  useEffect(() => {
    if (tenantId) {
      getProjectDetail()
    }
  }, [tenantId])

  return (
    <>
      {contextHolder}
      <div className='mt-[24px]'>
        <Breadcrumb
          style={{ marginBottom: '24px', fontSize: '12px' }}
          items={[
            { title: <a onClick={() => setActiveTab('all')}>首页</a> },
            { title: <a onClick={() => setActiveTab('projectSpace')}>项目空间</a> },
            // { title: <a onClick={() => setActiveTab('workSpaceSecondPage')}>{localStorage.getItem('tenantNmae')}</a> },
            {
              title: <a onClick={() => {
                setActiveTab?.('workSpaceSecondPage')
                getRedirection(isCurrentWorkspaceEditor, {
                  mode: 'workSpaceSecondPage',
                  tenant_id: tenantId,
                  role: roles,
                  name: name,
                }, push)
              }}>{projectName}</a>
            },
            { title: '成员管理' },
          ]}
        />
        <div className='flex flex-col bg-[#fff] rounded-[8px] px-[24px] pt-[24px]' style={{ height: 'calc(100vh - 158px)' }}>
          <div className="flex justify-between mb-4">
            <Search placeholder="搜索人力编码或用户名" allowClear onSearch={onSearch} style={{ width: 200 }} />
            <Button type="primary" onClick={() => setOpen(true)}><PlusSquareOutlined />添加新成员</Button>
          </div>

          {tenantId ? <ProTable<ProjectAccountType, RequestParamsType>
            proRef={proTableRef}
            columns={columns}
            request={fetchMemberList}
            requestParams={requestParams}
          /> : null}
        </div>
      </div>

      <Modal
        open={open}
        width={840}
        okText="提交"
        cancelText="取消"
        onCancel={closeModal}
        onOk={updateMember}
        destroyOnClose={true}
      >
        <h1 className="">项目一 | 添加新成员</h1>
        <MemberSelector onChange={(list: ProjectAccountType[]) => updateList.current = list} />
      </Modal>
    </>
  )
}

export default ProjectMember
