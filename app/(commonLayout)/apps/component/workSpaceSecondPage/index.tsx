'use client'
import useSwr from 'swr'
import React, { useEffect, useState } from 'react'
import { Avatar, Breadcrumb, Button, ConfigProvider, Divider, Space, Tabs, Tag, message, Modal, Input } from 'antd'
import {
  FormOutlined,
} from '@ant-design/icons'
import {
  RiAddBoxLine,
} from '@remixicon/react'
import zhCN from 'antd/es/locale/zh_CN'
import UserCard from '../base/userCard'
import { getTenants } from '@/service/common'
import type { OpenTypes } from '@/app/(commonLayout)/apps/component/base/createModal'
import CreateModal from '@/app/(commonLayout)/apps/component/base/createModal'
import { useAppContext } from '@/context/app-context'
import { getQueryParams } from '@/utils/getUrlParams'
import { outProjectTenant, editProjectName, getTenantDetail } from "@/service/apps";
import { getRedirection } from '@/utils/app-redirection'
import { useRouter } from 'next/navigation'
import StudyBase from '../studyBase'
import CreateFromDSLModal from '@/app/components/app/create-from-dsl-modal'
import NewDataset from '../newDataset'
import Datasets from '../datasets'
import GlobalUrl from '@/GlobalUrl'
const { confirm } = Modal;
type Props = {
  setActiveTab?: any
  data?: any
  mutate?: any
  setCallback?: any
  plugins?: any
  pluginsMutate?: any
}

const WorkSpaceSecondPage: React.FC<Props> = (props) => {
  const { setActiveTab, data, mutate, setCallback, plugins, pluginsMutate } = props
  const tenantId = getQueryParams('tenant_id')
  const role = getQueryParams('role')
  const [tabClick, setTabClick] = useState<string>('1')
  const [nameInput, setIsSHowNameInput] = useState<any>(false)
  const [projectName, setProjectName] = useState<any>('')
  const [isName, setNameIS] = useState<any>('')
  const [isRole, setIsRole] = useState<any>('')
  const [showCreateFromDSLModal, setShowCreateFromDSLModal] = useState(false)
  const { isCurrentWorkspaceEditor } = useAppContext()
  const [isAddOpen, setIsAddOpen] = useState<OpenTypes>({
    isOpen: false,
    title: '',
  })

  useEffect(() => {
    pluginsMutate();
  }, []);
  const [activeArea, setActiveArea] = useState<any>('')
  const [areaName, setAreaName] = useState<any>([])
  const { push } = useRouter()
  const { data: tenants, mutate: tenantsMutate }: any = useSwr('/getTenants', getTenants)
  const outProject = async () => {
    const path = role === 'owner' ? `/deleteTenant?tenant_id=${tenantId}` : `/outTenant?tenant_id=${tenantId}`
    confirm({
      title: `确定${role === 'owner' ? '解散' : '退出'}该空间？`,
      content: `${role === 'owner' ? '解散项目空间后，项目成员被踢出项目空间，空间中的项目会被删除，且解散操作不可撤销' : '退出项目空间后，项目成员被踢出项目空间，空间中的项目会被删除，且退出操作不可撤销'}`,
      onOk: async () => {
        const res: any = await outProjectTenant({ url: path })
        if (res.result === "success") {
          message.info(`${role === 'owner' ? '解散' : '退出'}成功！`);
          setActiveTab?.('projectSpace')
          // onOut && onOut();
        } else if (res.result === 'error') {
          message.info(`${role === 'owner' ? '解散失败' : '当前空间下存在应用，无法退出'}`);
        }
      },
      onCancel() { },
    });
  };

  const editName = async () => {

    const res: any = await editProjectName({
      url: '/updateTenant',
      body: {
        id: tenantId,
        name: projectName,
      }
    })

    if (res.result === "success") {
      setProjectName(projectName)
      message.info('修改成功！')
    } else {
      message.info('修改失败')
    }
    setIsSHowNameInput(false)
  }

  // 获取项目空间详情
  const getProjectDetail = async () => {
    const res: any = await getTenantDetail({ appId: tenantId })
    setProjectName(res.name || '')
  }

  useEffect(() => {
    if (tenants && tenantId) {
      const newArr: any = []
      // const defaultSpace = tenants?.find((item: any) => item.current === true)
      const defaultSpace = tenants?.find((item: any) => item.id === tenantId)
      setActiveArea(defaultSpace?.id)
      setCallback(defaultSpace?.id)
      tenants.forEach((item: any) => {
        newArr.push({ key: item.id, name: item.name })
      })
      setAreaName(newArr)
    }
  }, [tenants, tenantId])

  useEffect(() => {
    if (tenants)
      tenants.map((item: any) => {
        if (item.id === tenantId) {
          setNameIS(item.name)
          setIsRole(item.role)
        }
      })
  })

  useEffect(() => {
    if (tenantId) {
      getProjectDetail()
    }
  }, [tenantId])

  const getTabTitle = () => {
    switch (tabClick) {
      case '1':
        return 'Agent';
      case '2':
        return '插件';
      case '3':
        return '工作流';
      case '5':
        return '对话流';
      default:
        return '';
    }
  }

  const getTabName = () => {
    switch (tabClick) {
      case '1':
        return { name: 'Agent', mode: 'agent-chat', upload: '导入', down: '导出' };
      case '2':
        return { name: '插件', mode: 'chat' };
      case '3':
        return { name: '工作流', mode: 'workflow' };
      case '4':
        return { name: '智能体', mode: 'metabolic' };
      case '5':
        return { name: '对话流', mode: 'advanced-chat' };
      default:
        return { name: '' };
    }
  }

  const operations = () => {
    return <Space>
      {/* <Button type="primary" disabled>{`上架${tabClick === '1' ? 'Agent' : tabClick === '2' ? '插件' : tabClick === '3' ? '工作流' : '智能体'}`}</Button> */}
      <div className='flex items-center justify-center text-18 text-#216EFF cursor-pointer color-#216EFF' onClick={() => {
        const mode = getTabName().mode;
        setIsAddOpen({
          isOpen: true,
          title: `创建${getTabName().name}`,
          titleName: `${getTabName().name}`,
          mode,
        })
      }}>
        {
          tabClick !== '4' && getTabTitle() &&
          <>
            <RiAddBoxLine style={{ width: '20px', height: '20px', color: '#216EFF', marginRight: '5px' }} /><p style={{ color: '#216EFF' }}>{getTabTitle()}</p>
          </>
        }
      </div>

      {
        // getTabName().upload && <Button onClick={() => setShowCreateFromDSLModal(true)}>{getTabName().upload}</Button>
      }
    </Space>
  }

  const fromType = '项目空间';

  const items = [
    {
      label: 'Agent',
      key: '1',
      children: <div className='flex-1 w-[100%] overflow-y-auto' style={{ height: 'calc(100vh - 268px)' }}>
        <div className='flex flex-1 flex-wrap overflow-hidden overflow-y-auto pb-12 gap-[1.45vw]'>
          {/* {data?.data && data?.data?.length <= 0 ? <div style={{ width: '100%', height: '360px', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{`点击右上方,创建${getTabName().name},创建新的${getTabName().name}`}</div> : data?.data?.filter((i: any) => i.mode === 'agent-chat' && tabClick === '1').map((item: any, index: any) => ( */}
          {data?.data && data?.data?.length <= 0 ? <div style={{ width: '100%', height: '360px', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></div> : data?.data?.filter((i: any) => i.mode === 'agent-chat' && tabClick === '1').map((item: any, index: any) => (

            <UserCard
              headerImag='header_agent1'
              mutate={mutate}
              key={index}
              data={item}
              areaList={areaName}
              tabClick={tabClick}
              fromType={fromType}
              activeArea={activeArea}
              currentTab='agent'
              appId={data?.id}
            // styleCss={{ backgroundImage: 'url(\'/agent-platform-web/bg/agentBg1.png\')' }}
            />
          ))}
        </div>
      </div>,
    },
    {
      label: '插件',
      key: '2',
      children: <div className='flex-1 w-[100%] overflow-y-auto' style={{ height: 'calc(100vh - 268px)' }}>
        <div className='flex flex-1 flex-wrap overflow-hidden overflow-y-auto pb-12 gap-[1.45vw]'>
          {/* {plugins && plugins?.length <= 0 ? <div style={{ width: '100%', height: '360px', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{`点击右上方,创建${getTabName().name},创建新的${getTabName().name}`}</div> :
            plugins?.map((item: any, index: any) => ( */}
          {plugins && plugins?.length <= 0 ? <div style={{ width: '100%', height: '360px', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></div> :
            plugins?.map((item: any, index: any) => (
              <UserCard
                headerImag='header_chat1'
                mutate={pluginsMutate}
                key={index}
                plugin={item}
                areaList={areaName}
                fromType={fromType}
                tabClick={tabClick}
                activeArea={activeArea}
                currentTab='chat'
              // styleCss={{ backgroundImage: 'url(\'/agent-platform-web/bg/agentBg2.png\')' }}
              />),
            )}
        </div>
      </div>,
    },
    {
      label: '工作流',
      key: '3',
      children: <div className='flex-1 w-[100%] overflow-y-auto' style={{ height: 'calc(100vh - 268px)' }}>
        <div className='flex flex-1 flex-wrap overflow-hidden overflow-y-auto pb-12 gap-[1.45vw]'>
          {/* {data?.data && data?.data?.length <= 0 ? <div style={{ width: '100%', height: '360px', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{`点击右上方,创建${getTabName().name},创建新的${getTabName().name}`}</div> : data?.data?.filter((i: any) => i.mode === 'workflow' && tabClick === '3').map((item: any, index: any) => ( */}
          {data?.data && data?.data?.length <= 0 ? <div style={{ width: '100%', height: '360px', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></div> : data?.data?.filter((i: any) => i.mode === 'workflow' && tabClick === '3').map((item: any, index: any) => (

            <UserCard
              headerImag='header_workflow1'
              mutate={mutate}
              key={index}
              data={item}
              areaList={areaName}
              fromType={fromType}
              tabClick={tabClick}
              activeArea={activeArea}
              currentTab='workflow'
            // styleCss={{ backgroundImage: 'url(\'/agent-platform-web/bg/agentBg3.png\')' }}
            />
          ))}
        </div>
      </div>,
    },
    {
      label: '知识库',
      key: '6',
      children: <div className='flex-1 w-[100%] overflow-y-auto' style={{ height: 'calc(100vh - 268px)' }}>
        {/* <NewDataset fromSource={'workSpaceSecondPage'} tenant_id={tenantId} /> */}
        <Datasets fromSource={'workSpaceSecondPage'} tenant_id={tenantId} />
      </div>,
    },
    // {
    //   label: '智能体',
    //   key: '4',
    //   children: <div className='flex-1 w-[100%] overflow-y-auto' style={{ height: 'calc(100vh - 268px)' }}>
    //     <div className='flex flex-1 flex-wrap overflow-hidden overflow-y-auto pb-12 gap-[1.45vw]'>
    //       {data?.data && data?.data?.length <= 0 ? <div style={{ width: '100%', height: '360px', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{`点击右上方,创建${getTabName().name},创建新的${getTabName().name}`}</div> : data?.data?.filter((i: any) => i.mode === 'metabolic' && tabClick === '4').map((item: any, index: any) => (
    //         <UserCard
    //           headerImag='header_metabolic1'
    //           mutate={mutate}
    //           key={index}
    //           data={item}
    //           areaList={areaName}
    //           tabClick={tabClick}
    //           activeArea={activeArea}
    //           currentTab='metabolic'
    //         // styleCss={{ backgroundImage: 'url(\'/agent-platform-web/bg/agentBg3.png\')' }}
    //         />
    //       ))}
    //     </div>
    //   </div>,
    // },
    {
      label: '对话流',
      key: '5',
      children: <div className='flex-1 w-[100%] overflow-y-auto' style={{ height: 'calc(100vh - 268px)' }}>
        <div className='flex flex-1 flex-wrap overflow-hidden overflow-y-auto  gap-[1.45vw]'>
          {/* {data?.data && data?.data?.filter(i => i.mode === 'advanced-chat' && tabClick === '5')?.length <= 0 ? <div style={{ width: '100%', height: '360px', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{`点击右上方,创建${getTabName().name},创建新的${getTabName().name}`}</div> : data?.data?.filter(i => i.mode === 'advanced-chat' && tabClick === '5').map((item, index) => ( */}
          {data?.data && data?.data?.length <= 0 ? <div style={{ width: '100%', height: '360px', fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}></div> : data?.data?.filter((i: any) => i.mode === 'advanced-chat' && tabClick === '5').map((item: any, index: any) => (
            <UserCard
              headerImag='header_workflow1'//UI未出图，暂用agent
              mutate={mutate}
              key={index}
              data={item}

              fromType={fromType}
              areaList={areaName}
              tabClick={tabClick}
              activeArea={activeArea}
              currentTab='workflow'
            // styleCss={{ backgroundImage: 'url(\'/agent-platform-web/bg/agentBg3.png\')' }}
            />
          ))}
        </div>
      </div>,
    },
    // {
    //   label: '旧版知识库',
    //   key: '4',
    //   children: <div className='flex-1 w-[100%] overflow-y-auto' style={{ height: 'calc(100vh - 268px)' }}>
    //     <StudyBase fromSource={'workSpaceSecondPage'} tenant_id={tenantId} />
    //   </div>,
    // }
  ]

  const breadcrumbItem = [
    {
      title: <a onClick={() => setActiveTab?.('all')}>首页</a>,
    },
    {
      title: <a onClick={() => setActiveTab?.('projectSpace')}>项目空间</a>,
    },
    {
      title: <div>{projectName}</div>,
    },
  ]
  // const dian = async () => {
  //   const body: any = {
  //     page,
  //     limit: pageSize,
  //     need_check: true,
  //     application_type: '',
  //     app_type: tenantId,
  //     space_id: tenantId,
  //   }
  //   mutate?.()


  //   const res = await getProcessList({
  //     url: '/application/tenant/apply/process/page/list',
  //     body,
  //   })
  // }


  return (
    <ConfigProvider locale={zhCN}>
      <div className='mt-[24px]'>
        <Breadcrumb
          style={{ margin: '-16px 0px 5px 0px', fontSize: '12px' }}
          items={breadcrumbItem}
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
                <div className='title'>
                  {nameInput === true
                    ? <Input placeholder='请输入姓名'
                      value={projectName}
                      onBlur={(e) => editName()}
                      onChange={(e) => setProjectName(e.currentTarget.value)}></Input>
                    : projectName
                  }
                </div>
                <div className='icon' onClick={(e) => {
                  e.preventDefault()
                  setIsSHowNameInput(true)
                }} style={{ marginLeft: '10px', cursor: 'pointer' }}><FormOutlined /></div>
              </div>
              <div className="tags">
                <Tag bordered={false} color='blue'>项目空间</Tag>
                <Tag bordered={false} color='blue'>{(isRole === 'owner' || isRole === 'admin') ? '管理员' : '普通用户'}</Tag>
              </div>
            </div>
          </div>
          <div className='buttons' style={{
            minWidth: '30vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}>
            {
              role === 'owner' || role === 'admin' ? <Button onClick={() => {
                setActiveTab?.('project-member')
                getRedirection(isCurrentWorkspaceEditor, {
                  tenant_id: tenantId,
                  role: isRole,
                  mode: 'project-member'
                }, push)
              }}>成员管理</Button> : ''
            }

            <Button onClick={() => outProject()}>{role === 'owner' ? '解散' : '退出'}项目</Button>
            <Divider type='vertical' style={{ height: '30px' }} />
            {GlobalUrl.platform_type === 'wangyun' && <Button onClick={() => {
              localStorage.setItem('tenantId', tenantId)
              setActiveTab?.('appExamine')
              getRedirection(isCurrentWorkspaceEditor, {
                breadcrumb: isName,
                role: isRole,
                tenant_id: tenantId,
                mode: 'appExamine'
              }, push)
            }}>{isRole === 'owner' || isRole === 'admin' ? '应用审批' : '申请管理'}</Button>
            }
            {/* }}>{isRole === 'owner' || isRole === 'admin' ? '应用审批' : '申请管理'}</Button> */}
            {
              // role === 'owner' ? <Button disabled onClick={() => setActiveTab?.('applicationAuthority')}>应用权限</Button> : null
            }

          </div>
        </div>
        <div className='bg-[#fff] rounded-[8px] px-[24px]' style={{ height: 'calc(100vh - 218px)', overflow: 'hidden' }}>
          <Tabs
            tabBarExtraContent={operations()}
            items={items.filter(item => item.key === '6' && GlobalUrl.platform_type === 'wangyun' ? false : true)}
            onChange={(val) => {
              setTabClick(val)
            }}
          />
        </div>
      </div>

      <CreateFromDSLModal
        tenant_id={tenantId}
        fromType='项目空间'
        tabClick={tabClick}
        show={showCreateFromDSLModal}
        onClose={() => setShowCreateFromDSLModal(false)}
        onSuccess={() => mutate?.()}
      />
      {isAddOpen.isOpen
        ? <CreateModal fromType={'项目空间'} tabClick={tabClick} disabled={true} tenant_id={activeArea} isAddOpen={isAddOpen} onClose={(val: boolean) => setIsAddOpen({ ...isAddOpen, isOpen: val })} />
        : null}
    </ConfigProvider>
  )
}
export default WorkSpaceSecondPage
