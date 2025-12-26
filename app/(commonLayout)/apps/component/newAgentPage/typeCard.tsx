import React, { useState } from 'react'
import cn from 'classnames'
import { useRouter } from 'next/navigation'
import { Button, Flex, Input, Select, Modal, Space, Tooltip, type MenuProps } from 'antd'
import styles from '../base/baseStyle.module.scss'
import type { App } from '@/types/app'
import { useAppContext } from '@/context/app-context'
import Image from 'next/image'
import './index.scss'
import user from '@/app/(commonLayout)/apps/assets/user.png';
import { copyCard } from '../common'
import { getRedirection } from '@/utils/app-redirection'
import { CopyOutlined, EnvironmentOutlined, EyeFilled, StarOutlined } from '@ant-design/icons'
import Calendar from '@/app/components/base/date-and-time-picker/calendar'
import { RiCalendarLine } from '@remixicon/react'
import { ThumbsUp } from '@/app/components/base/icons/src/vender/line/alertsAndFeedback'


type Props = {
  headerImg?: string
  data?: App | undefined
  plugin?: any
  className?: string
  styleCss?: React.CSSProperties
  indexValue?: number
  tenant_id?: any
  toHanleOpeartion?: any
  getDetailContent?: any
  radioValue?: any
}

// 智能体类型卡片
const TypeCard: React.FC<Props> = (props) => {
  const { data, plugin, className, styleCss, headerImg, indexValue, toHanleOpeartion, getDetailContent, tenant_id, radioValue, tenants } = props
  const { isCurrentWorkspaceEditor } = useAppContext()
  const { push } = useRouter()
  const [isModalCopyOpen, setIsModalCopyOpen] = useState(false)
  const [newName, setNewName] = useState(data?.name || '');
  const [copyTenantId, setCopyTenantId] = useState(data?.tenant_id || '');

  const cancelCopy = () => {
    setNewName('')
    setIsModalCopyOpen(false)
  }

  const colorArray = [
    '#ffbf71', '#216eff', '#216eff', '#9866fd', '#56d892', '#33c9f4', '#216eff'
  ];

  const workflow = async (e?: any, appId?: any) => {
    const name = newName || (data?.name)

    getRedirection(isCurrentWorkspaceEditor, {
      ...data,
      tenant_id: tenant_id,
      fromType: '个人空间',
      status: data?.status ?? plugin?.status,
      tabClick: 'agent-chat',
      category: 'area',
      name: name,
      id: appId || data?.id,
      appId: appId || (data?.id ?? plugin?.id)
    }, push, tenant_id)
  }

  return (
    <div
      style={{ padding: '16px', height: '152px' }}
      className={cn(' w-[25.3vw] bg-sky-80 border-[#E0E6EC] border relative rounded-[8px]', styles.hoverCss, className)}
    >
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
        <div style={{
          backgroundImage: `url('/agent-platform-web/bg/head_agent_img_${((indexValue || 0) % 4) + 1}.png')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          padding: '32px',
          height: '120px', width: '120px',
        }}>
          <img style={{ width: '100%', height: '100%' }} src={`/agent-platform-web/image/head_agent_new_${((indexValue || 0) % 4) + 1}.png`} />
        </div>
        <div style={{ marginLeft: '16px', width: 'calc(100% - 152px', color: 'rgb(102, 102, 102)' }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ fontWeight: '700', fontSize: '16px', color: '#1677ff', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={data?.name}>{data?.name}</div>
          </div>
          <Tooltip title={data?.description || ''}>
            <div className='only-show-two' style={{ fontSize: '12px', maxWidth: '300px', overflow: 'hidden', height: '26px', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {data?.description}
            </div>
          </Tooltip>
          <div>
            <EnvironmentOutlined className='w-4 h-4' /> &nbsp;{data?.location || ''}
          </div>
          <Flex style={{ marginTop: '4px' }} vertical={false} justify={'space-between'}>
            <Flex vertical={false} align={'center'}><RiCalendarLine className='w-4 h-4' /> &nbsp; {data?.created_at}</Flex>
            <Flex vertical={false} align={'center'}><ThumbsUp className='w-4 h-4' /> &nbsp; {data?.like_count}</Flex>
          </Flex>
          <div style={{ marginTop: '4px', display: 'flex', width: '100%', maxWidth: '300px', flexDirection: 'row', justifyContent: 'space-between' }}>
            <div onClick={(e) => {
              e.stopPropagation()
              getDetailContent(data)
            }}><Button style={{ border: 'none', backgroundColor: 'rgb(234, 236, 240)' }} size='small'><EyeFilled /> 查看详情</Button></div>
            <div onClick={(e) => {
              e.stopPropagation()
              toHanleOpeartion(data?.id, 1, 'experience_count')
            }}><Button style={{ border: 'none', backgroundColor: 'rgb(234, 236, 240)' }} size='small'><StarOutlined />立即体验</Button></div>
            <div onClick={(e) => {
              e.stopPropagation()
              setIsModalCopyOpen(true)
            }}><Button style={{ border: 'none', backgroundColor: 'rgb(234, 236, 240)' }} size='small'><CopyOutlined />复制</Button></div>
          </div>
        </div>
      </div>

      <Modal
        className={styles.modalGlobal}
        title={`Agent复制`}
        open={isModalCopyOpen}
        onOk={() => copyCard({
          name: newName,
          tenant_id: copyTenantId,
          icon: '',
          icon_background: '',
          mode: radioValue === 'workflow' ? 'workflow' : 'agent',
          app_id: data?.id ?? plugin?.id,
          callback: (id) => { workflow(null, id); cancelCopy() }
        })}
        onCancel={() => cancelCopy()}
        okText='确定'
        cancelText='取消'
      >
        <div style={{ margin: '4px 0' }}>
          空间：<Select
            placeholder='请选择发布空间'
            allowClear
            fieldNames={{
              label: 'name',
              value: 'id'
            }}
            options={tenants}
            value={data?.tenant_id}
            style={{ width: '100%' }}
            onChange={(id: any) => setCopyTenantId(id)}
          />
        </div>
        <div style={{ margin: '4px 0' }}>
          新命名：<Input key={data?.name} defaultValue={data?.name} onChange={(e) => setNewName(e.target.value)} />
        </div>
      </Modal >
    </div >
  )
}

export default TypeCard
