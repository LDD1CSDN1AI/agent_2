import React, { useEffect, useState } from 'react'
import { Avatar, Badge, Form, Input, Modal, Select, Space, Segmented, message } from 'antd'
import { useRequest } from 'ahooks'
import { useRouter } from 'next/navigation'
import useSwr from 'swr'
import { CheckCircleFilled } from '@ant-design/icons'
import styles from './baseStyle.module.scss'
import { ai4Apps, createApp, updateAppInfo, updateRename } from '@/service/apps'
import { useAppContext } from '@/context/app-context'
import { getTenants } from '@/service/common'
import './createModal.scss'
import { getRedirection } from '@/utils/app-redirection'
import { getQueryParams } from '@/utils/getUrlParams'
import { getTenantsParam } from '@/app/components/GlobalParams'
const { TextArea } = Input

export type OpenTypes = {
  id?: string
  isOpen: boolean
  title?: string
  data?: any
  mode?: string
  titleName?: string
}

type Props = {
  categoryTenants?: boolean //是否只展示默认空间
  disabled?: boolean,
  appId?: string
  isAddOpen: OpenTypes
  onClose: (val: boolean) => void
  mutate?: () => void
  fromType?: string
  tabClick?: string
  tenant_id?: any
  status?: string
  defaultAvatarNumber?: string
}

const CreateModal: React.FC<Props> = (props) => {
  const { isAddOpen, onClose, tabClick, fromType, mutate, tenant_id, appId, disabled = false, categoryTenants = false, defaultAvatarNumber = '1' } = props
  const consoleTokenFromLocalStorage = localStorage?.getItem('console_token')
  const [form] = Form.useForm()
  const [name, setName] = useState('智能体')
  const [agentType, setAgentType] = useState('')
  const [choise, setChoise] = useState('agent-chat')
  const [selectItem, setSelectItem] = useState([])
  const [showLoading, setShowLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(isAddOpen.isOpen)
  const [tenantId, setTenantId] = useState(tenant_id)
  const [avatarNumber, setAvatarNumber] = useState(defaultAvatarNumber)
  const [avatarName, setAvatarName] = useState('agent')
  const { isCurrentWorkspaceEditor } = useAppContext()
  const { push } = useRouter()
  const { data: tenants, mutate: tenantsMutate }: any = useSwr('/getTenants', getTenants)

  const handleSelect = (value: string, name: string, avatarName: string) => {
    setChoise(value)
    setName(name)
    setAvatarName(avatarName)
  }
  const onSelectChange = (e: any) => {
    setTenantId(e)
  }
  const { run: addRun } = useRequest(
    async (param) => {
      let result;
      const promise = [];

      if (agentType === 'ai' && name === '智能体') {
        promise.push(
          result = await ai4Apps({
            url: '/ai4apps',
            body: {
              tool_list: [],
              ...param
            }
          }));
      } else {
        promise.push(result = await createApp(param))
      }

      await Promise.all(promise).then(
        async () => {
          const desc = encodeURIComponent(result.agent_prompt || '')
          getRedirection(isCurrentWorkspaceEditor, {
            tenant_id: tenantId,
            tabClick: tabClick || getTabClick(),
            ...result,
            app_id: result.id,
            fromType: fromType || await getFromType(),
            status: result.status,
            name1: result.name,
            desc: desc || result.agent_prompt || ''
          }, push)
          setIsModalOpen(false)
          onClose(false)

          form.resetFields()
          setShowLoading(false)
        }
      )

      return result
    },
  )
  const { run: editRun } = useRequest(
    async (param) => {
      const paramNew = {
        id: param.appId,
        description: param.desc,
        provider: param.name,
        tenant_id: param.tenant_id
      }
      const result = tabClick === '2' ? await updateRename(paramNew) : await updateAppInfo(param)
      setIsModalOpen(false)
      onClose(false)

      form.resetFields()
      return result
    },
  )

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      // if (agentType === 'ai' && name === '智能体') {
      //   message.error('模型尚不支持');
      //   return;
      // }

      if (isAddOpen?.id) {
        editRun({
          ...values,
          appId,
          appID: isAddOpen?.id,
          mode: isAddOpen?.mode || choise,
          tenant_id: tenantId,
          header_image: `${isAddOpen?.mode === 'agent-chat' ? 'header_agent' : 'header_' + isAddOpen?.mode}${avatarNumber}` || `header_${avatarName + avatarNumber}`,
        })
        mutate?.()
      }
      else {
        setShowLoading(true)
        if (isAddOpen?.mode === 'chat') {
          history.pushState(null, '', `/agent-platform-web/tools/createByUrl?provider=${values.name}&tabClick=${tabClick}&fromType=${fromType}&desc=${values.description || values.desc}&tenant_id=${tenantId}&console_token=${consoleTokenFromLocalStorage}`)
        }
        else {
          addRun({
            ...values,
            appId,
            mode: isAddOpen?.mode || choise,
            tenant_id: tenantId,
            header_image: `header_${avatarName + avatarNumber}`,
          })
        }
      }

      // window.location.reload()
    })
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    onClose(false)
    form.resetFields()
  }

  const AvatarClick = (id: string) => {
    setAvatarNumber(id)
  }

  const getTabClick = () => {
    switch (name) {
      case '智能体':
        return '1';
      case '插件':
        return '2';
      case '工作流':
        return '3';
      case '对话流':
        return '5';
      default:
        return '';
    }

  }

  const getFromType = async () => {
    const param = await getTenantsParam(tenantId);
    if (param?.[0].name === '默认空间') {
      return '个人空间';
    }
    return '项目空间';
  }

  useEffect(() => {
    if (isAddOpen.isOpen) {
      setIsModalOpen(true)
      if (isAddOpen.id) {
        form.setFieldsValue({
          ...isAddOpen?.data,
        })
      }
      if (isAddOpen.mode)
        setAvatarName(isAddOpen?.mode === 'agent-chat' ? 'agent' : isAddOpen?.mode)
    }
    if (tenantId) {
      form.setFieldsValue({
        workSpace: tenantId,
      })
    }
  }, [form, tenantId, isAddOpen?.data, isAddOpen.id, isAddOpen.isOpen, isAddOpen?.mode])

  useEffect(() => {
    if (!isAddOpen.isOpen)
      mutate?.()
  }, [isAddOpen.isOpen, mutate])

  useEffect(() => {
    const newarr: any = []
    if (tenants) {
      tenants.forEach((item: any) => {
        // if (categoryTenants) {
        //   if (item.name === '默认空间') {
        //   newarr.push({ label: item.name, value: item.id })
        //   }
        // } else {
        newarr.push({ label: item.name, value: item.id })
        // }
      })
      setSelectItem(newarr)
    }
  }, [tenants])

  const agentTypes = [
    { label: '标准创建', value: 'standard' },
    { label: 'AI创建', value: 'ai' },
  ]

  const getDescribeInfo = () => {
    if (name === '智能体' && agentType === 'ai') {
      return {
        label: 'AI创建描述',
        desc: '请具体描述你想创建一个什么样的智能体，该智能体用于什么场景，可满足什么需求。'
      }
    }
    return {
      label: `${isAddOpen?.titleName || name}简介`,
      desc: '请输入简介内容'
    }
  }

  return (
    <React.Fragment>
      <Modal
        className={styles.modalGlobal}
        title={isAddOpen.title ? isAddOpen.title : '立即创建'}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={649}
        okText='确定'
        cancelText='取消'
      >
        <Form layout='vertical' form={form}>
          {
            !isAddOpen?.mode
              ? <Form.Item>
                <div className="radio-button-group">
                  <div
                    className={`radio-button ${name === '智能体' ? 'selected' : ''} agent-chat`}
                    onClick={() => handleSelect('agent-chat', '智能体', 'agent')}
                  >
                    智能体
                  </div>
                  <div
                    className={`radio-button ${name === '插件' ? 'selected' : ''} chat`}
                    onClick={() => handleSelect('chat', '插件', 'chat')}
                  >
                    插件
                  </div>
                  <div
                    className={`radio-button ${name === '工作流' ? 'selected' : ''} workflow`}
                    onClick={() => handleSelect('workflow', '工作流', 'workflow')}
                  >
                    工作流
                  </div>
                  <div
                    className={`radio-button ${name === '对话流' ? 'selected' : ''} workflow`}
                    onClick={() => handleSelect('advanced-chat', '对话流', 'advanced-chat')}
                  >
                    对话流
                  </div>
                </div>
              </Form.Item>
              : null
          }
          <Form.Item label='工作空间' name='workSpace' rules={[{ required: true, message: '请选择一个工作空间' }]}>
            <Select disabled={disabled} onChange={onSelectChange} options={selectItem} defaultValue={tenantId || null}></Select>
          </Form.Item>
          {
            (name === '智能体' && agentType !== 'ai') || name !== '智能体' ?
              <Form.Item
                label={`${isAddOpen?.titleName || name}名称`} name='name'
                rules={[
                  {
                    required: true,
                    validator: (_, value) => {
                      if (!value) {
                        return Promise.reject(`请输入${isAddOpen?.titleName || name}名称，仅支持中英文和数字`);
                      }
                      if (value.length > 0 && value[0] === ' ') {
                        return Promise.reject('输入内容的第一个字符不能是空格');
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input maxLength={20} placeholder={`给${isAddOpen?.titleName || name}起个名字,支持中英文、数字`} />
              </Form.Item>
              : ''
          }

          <Form.Item label={getDescribeInfo().label} name={tabClick + '' === '2' ? 'desc' : 'description'} rules={[{ required: true, message: '请输入简介' }]}>
            <TextArea rows={6} placeholder={getDescribeInfo().desc}></TextArea>
          </Form.Item>
          {/* {(isAddOpen?.mode ? isAddOpen?.mode : choise) === 'chat' && <Form.Item label="接入选择" name="type" rules={[{ required: true, message: '请选择接入方式' }]}>
            <Radio.Group defaultValue="1" disabled>
              <Radio value="1"> 通过URL接入插件 </Radio>
              <Radio value="2"> 代码创建插件 </Radio>
            </Radio.Group>
          </Form.Item>} */}
          {
            showLoading &&
            <div style={{ textAlign: 'right' }}>
              加载中,请稍等
            </div>
          }
          <Form.Item style={{ margin: '30px 0px 20px 0px' }}>
            <Space wrap size={16}>
              <div onClick={() => AvatarClick('1')} style={{ cursor: 'pointer' }}>
                <Badge count={avatarNumber === '1' ? <CheckCircleFilled style={{ color: '#1e90ff' }} /> : null}>
                  <Avatar shape="square" size="large" src={`/agent-platform-web/image/header_${avatarName}1.png`} />
                </Badge>
              </div>
              <div onClick={() => AvatarClick('2')} style={{ cursor: 'pointer' }}>
                <Badge count={avatarNumber === '2' ? <CheckCircleFilled style={{ color: '#1e90ff' }} /> : null}>
                  <Avatar shape="square" size="large" src={`/agent-platform-web/image/header_${avatarName}2.png`} />
                </Badge>
              </div>
              <div onClick={() => AvatarClick('3')} style={{ cursor: 'pointer' }}>
                <Badge count={avatarNumber === '3' ? <CheckCircleFilled style={{ color: '#1e90ff' }} /> : null}>
                  <Avatar shape="square" size="large" src={`/agent-platform-web/image/header_${avatarName}3.png`} />
                </Badge>
              </div>
              <div onClick={() => AvatarClick('4')} style={{ cursor: 'pointer' }}>
                <Badge count={avatarNumber === '4' ? <CheckCircleFilled style={{ color: '#1e90ff' }} /> : null}>
                  <Avatar shape="square" size="large" src={`/agent-platform-web/image/header_${avatarName}4.png`} />
                </Badge>
              </div>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </React.Fragment>
  )
}

export default CreateModal
