import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button, Card, Input, Modal, Space } from 'antd';
import { LikeOutlined } from '@ant-design/icons'
import styles from '../base/baseStyle.module.scss'
import { getRedirection } from '@/utils/app-redirection'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/context/app-context'
import { copyCard } from '../common';


const NewChatDetailPage: React.FC = (props) => {
  const { info: infoValue, toHanleOpeartion, onClose, radioValue, tenant_id } = props as any;
  const { isCurrentWorkspaceEditor } = useAppContext()

  const searchParams: any = useSearchParams()
  const indexValue = searchParams.get('indexValue')
  const [isModalCopyOpen, setIsModalCopyOpen] = useState(false)
  const [newName, setNewName] = useState(infoValue?.name || '');
  const [info, setInfo] = useState(infoValue)
  const { push } = useRouter()

  const cancelCopy = () => {
    setNewName('')
    setIsModalCopyOpen(false)
  }

  const workflow = async (e?: any, appId?: any) => {
    const name = newName || (info?.name)

    getRedirection(isCurrentWorkspaceEditor, {
      ...info,
      tenant_id: tenant_id,
      fromType: '个人空间',
      status: info?.status || 'published',
      tabClick: radioValue === 'workflow' ? 'workflow' : 'agent-chat',
      mode: radioValue === 'workflow' ? 'workflow' : 'agent-chat',
      category: 'area',
      name: name,
      id: appId || info?.id,
      appId: appId || (info?.id)
    }, push, tenant_id)
  }

  return (
    <div className="char-detail-page h-[100%] overflow-hidden" style={{ padding: '12px', background: '#f5f6f9' }}>
      <Card className='mb-[12px]' style={{ flex: '0 0 calc(33.333% - 1vw)' }}>
        <div className='flex flex-row '>
          <div style={{ cursor: 'pointer', height: '120px', display: 'flex', padding: '0 4px', alignItems: 'center' }} onClick={() => props.onClose()} className="left-symbol">
            &lt;
          </div>
          <div style={{
            backgroundImage: `url('/agent-platform-web/bg/head_agent_img_${((indexValue || 0) % 4) + 1}.png')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
            padding: '32px',
            height: '120px', width: '120px',
            marginRight: '12px'
          }}>
            <img style={{ width: '100%', height: '100%' }} src={`/agent-platform-web/image/head_plug_new_${((indexValue || 0) % 4) + 1}.png`} />
          </div>
          <div className='mt-[32px]'>
            <div className='mb-[12px]' style={{ fontSize: '18px' }}>{info.name}</div>
            <div style={{ color: '#b2b2b2', fontSize: '11px' }}>
              <span className='mr-[24px]'>时间：{info.time}</span>
              <span className='mr-[24px]'>来源：{info.source}</span>
              <span style={{ color: info.is_liked ? 'black' : '' }}>{<LikeOutlined onClick={() => toHanleOpeartion(info?.id, info.is_liked ? -1 : 1, 'like_count')} />} {info.num}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '16px' }}>
            <Space>
              <Button onClick={() => setIsModalCopyOpen(true)}>复制</Button>
              <Button onClick={() => toHanleOpeartion(info?.id, 1, 'experience_count')}>立即体验</Button>
            </Space>
          </div>
        </div>

      </Card>
      <Card style={{ flex: '0 0 calc(33.333% - 1vw)', cursor: 'pointer' }}>
        {info.desc}
      </Card>

      <Modal
        className={styles.modalGlobal}
        title={`Agent复制`}
        open={isModalCopyOpen}
        onOk={() => copyCard({ name: newName, icon: '', icon_background: '', mode: radioValue === 'workflow' ? 'workflow' : 'agent', app_id: info?.id, callback: (id) => { workflow(null, id); cancelCopy() } })}
        onCancel={() => cancelCopy()}
        okText='确定'
        cancelText='取消'
      >
        <div style={{ margin: '4px 0' }}>
          新命名：<Input defaultValue={info?.name} onChange={(e) => setNewName(e.target.value)} />
        </div>
      </Modal >
    </div>
  )
}

export default NewChatDetailPage