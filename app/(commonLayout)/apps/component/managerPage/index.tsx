import React, { useState } from 'react'
import type { AppListResponse } from '@/models/app'
import { Tabs } from 'antd'
import Applying from './applying'
import Applyed from './applyed'

type Props = {
  data?: AppListResponse | undefined
  mutate?: () => void
  setCallback?: any
}
const { TabPane } = Tabs

export const applicationOption = [
  { label: '工作流', value: 'workflow' },
  { label: '聊天助手', value: 'agent-chat' },
  { label: '智能体', value: 'metabolic' },
  { label: '插件', value: 'tool' },
]

export const applyOption = [
  { label: '广场', value: 'public' },
  { label: '个人空间', value: 'normal' },
  { label: '项目空间', value: 'project' },
  { label: '删除', value: 'delete' },
]

export const applyStatusMap = {
  pending: '审核中',
  approved: '审核通过',
  denied: '审核未通过',
}

const ManagerPage: React.FC<Props> = () => {
  const [activeTab, setActiveTab] = useState<string>('applying')

  const onChange = (key: string) => {
    setActiveTab(key)
  }

  return (
    <article className="mt-[24px]">
      <h1 className="text-[#1C2748] text-[20px] mb-[16px]">超级管理员</h1>
      <section
        className="flex flex-col bg-[#fff] rounded-[8px] px-[24px] pt-[24px]"
        style={{ minHeight: 'calc(100vh - 158px)' }}
      >
        <Tabs defaultActiveKey="1" onChange={onChange}>
          <TabPane tab="待审核申请" key="applying">
            <Applying active={activeTab === 'applying'} />
          </TabPane>
          <TabPane tab="全部申请列表" key="applied">
            <Applyed active={activeTab === 'applied'} />
          </TabPane>
        </Tabs>
      </section>
    </article>
  )
}

export default ManagerPage
