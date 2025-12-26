// 编辑权限
import { useEffect, useState, useRef } from 'react'
import { Avatar, Breadcrumb, ConfigProvider, Input, Tag, message, Modal } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import {
  FormOutlined,
  ExclamationCircleFilled
} from '@ant-design/icons'
import { editPermissions } from '@/service/log'
import AddMemberModal from '@/app/(commonLayout)/apps/component/base/addMemberModal'
import { getQueryParams } from '@/utils/getUrlParams'
import { editProjectNameGUAN, getTenantDetail } from "@/service/apps";
import { useRouter } from 'next/navigation'
import { getRedirection } from '@/utils/app-redirection'
import { useAppContext } from '@/context/app-context'

const { confirm } = Modal

type Props = {
  datas?: any
  setActiveTab?: any
}
const EditAuthority: React.FC<Props> = (props) => {
  const { setActiveTab, datas } = props
  const [data, setData] = useState<any>({})
  const [userpermissionsList, setUserpermissionsList] = useState([])
  const [isRealName, setIsRealName] = useState<any>(false)
  const [isName, setNameIS] = useState<any>('')
  const [projectName, setProjectName] = useState<any>('')
  const ref = useRef()
  const { push } = useRouter()
  const { isCurrentWorkspaceEditor } = useAppContext()
  const role = getQueryParams('role')
  const tenantId = getQueryParams('tenant_id')

  const showConfirm = () => {
    confirm({
      title: '是否确定从该应用中修改/添加成员？',
      icon: <ExclamationCircleFilled />,
      content: '被修改/添加后的成员无法查看或体验此应用',
      onOk() {
        editConfirm()
      },
      onCancel() {
        message.info('用户取消操作')
        if (ref.current as any)
          (ref.current as any).getPermissionsList()
      },
    });
  };

  const editConfirm = async () => {
    try {
      let arr: any = [];
      if (userpermissionsList.length > 0) {
        userpermissionsList.map((item: any) => {
          arr.push({
            user_id: item.employee_number,
            can_view: item.permission === '仅体验' ? true : item.permission === '可编辑' ? true : false,
            can_edit: item.permission === '可编辑' ? true : false,
          })
        })
      } else {
        message.warning('请选择成员权限')
      }
      const res = await editPermissions({
        url: '/user/permissions/edit', body: {
          app_id: data.id,
          user_permission_list: arr
        }
      })
      if (res) {
        message.success('修改成功')
      } else {
        message.error('修改失败')
      }
    } catch (e) {
      message.error('修改失败')
    }
  }

  const editName = async () => {
    const res: any = await editProjectNameGUAN({
      url: `/app/${data.id}/update/name`,
      body: {
        name: isName,
      }
    })

    if (res.result === "success") {
      setNameIS(isName)
      message.info('修改成功！')
    } else {
      message.info('修改失败')
    }
    setIsRealName(false)
  }

  const getProjectDetail = async () => {
    const res: any = await getTenantDetail({ appId: tenantId })
    setProjectName(res.name || '')
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const encodedData = urlParams.get('params')
    if (encodedData) {
      const paramsData = new URLSearchParams(encodedData)
      const dataStr = paramsData.get('data')
      if (dataStr) {
        const newData = JSON.parse(dataStr)
        setData(newData) // 将数据更新逻辑放入useEffect中，防止重复渲染
      }
    }
  }, [])

  useEffect(() => {
    if (data) {
      setNameIS(data.name)
    }
  }, [data])

  useEffect(() => {
    if (tenantId) {
      getProjectDetail()
    }
  }, [tenantId])

  return <ConfigProvider locale={zhCN}>
    <div className='mt-[24px]'>
      <Breadcrumb
        style={{ margin: '-16px 0px 5px 0px', fontSize: '12px' }}
        items={[
          {
            title: <a onClick={() => setActiveTab?.('all')}>首页</a>,
          },
          {
            title: <a onClick={() => setActiveTab?.('projectSpace')}>项目空间</a>,
          },
          {
            title: <a onClick={() => {
              setActiveTab?.('workSpaceSecondPage')
              getRedirection(isCurrentWorkspaceEditor, {
                mode: 'workSpaceSecondPage',
                role: role,
                tenant_id: tenantId,
                name: projectName
              }, push)
            }}>{projectName}</a>,
          },
          {
            title: <div>编辑权限</div>,
          },
        ]}
      />
      <div className='flex' style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        height: '80px',
        marginBottom: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0px 20px',
      }}>
        <div className='cardDetail' style={{
          display: 'flex',
          alignItems: 'center',
        }}>
          <div className='avatar' style={{ marginRight: '20px' }}>
            <Avatar shape="square" size={50} src={'/agent-platform-web/image/header_agent1.png'} />
          </div>
          <div className='otherthing'>
            <div className="titlePart" style={{ display: 'flex', marginBottom: '6px' }}>
              <div className='title'>{isRealName === true ? <Input value={isName} type='isName' placeholder='请输入姓名' onBlur={(e) => {
                e.preventDefault();
                editName()
              }} onChange={(e) => setNameIS(e.currentTarget.value)} /> : isName}</div>
              <div className='icon' onClick={(e) => {
                e.preventDefault()
                setIsRealName(true)
              }} style={{ marginLeft: '10px', cursor: 'pointer' }}><FormOutlined /></div>
            </div>
            <div className="tags">
              <>{data.status === 'draft' ? <Tag color='purple' bordered={false}>未发布</Tag> : data.status === 'published' ? <Tag color='green' bordered={false}>已发布</Tag> : data.status === 'installed' ? <Tag color='blue' bordered={false}>上架</Tag> : data.status === 'disabled' ? <Tag color='error' bordered={false}>禁用</Tag> : <Tag color='warning' bordered={false}>无状态</Tag>}</>
              <>{data.mode === 'agent-chat' ? <Tag bordered={false} color='blue'>Agent</Tag> : data.mode === 'chat' ? <Tag bordered={false} color='blue'>插件</Tag> : data.mode === 'workflow' ? <Tag bordered={false} color='blue'>工作流</Tag> : <Tag bordered={false} color='blue'>智能体</Tag>}</>
            </div >
          </div >
        </div >
      </div >
      <div className='bg-[#fff] rounded-[8px]' style={{ height: 'calc(100vh - 218px)', overflow: 'hidden', padding: '24px' }}>
        <AddMemberModal ref={ref} onConfirm={showConfirm} data={data} tenantId={data.id} setUserpermissionsList={setUserpermissionsList} />
      </div>
    </div >
  </ConfigProvider >
}
export default EditAuthority
