import React, { useEffect, useState } from 'react'
import useSwr from 'swr'
import type { OpenType } from '../base/addModal'
import AddModal from '../base/addModal'
import type { AppListResponse } from '@/models/app'
import { getTenants } from '@/service/common'
import { getFiveIndex } from '@/utils/var'
import TypeCard from './typeCard'
import { Pagination, PaginationProps } from 'antd'

type Props = {
  data?: AppListResponse | undefined
  mutate?: () => void
  setCallback?: any,
  setSize?: (pageSize: number) => void,
  size?: number
}

type AreaNameListItem = {
  id: string
  name: string
  status: string
  created_at: string
  current: boolean
}

type areaNameItem = {
  key: string
  name: string
}

const AgentChatPage: React.FC<Props> = (props) => {
  const { data, mutate, setCallback, size, setSize } = props
  const [activeArea, setActiveArea] = useState<any>('')

  const [areaName, setAreaName] = useState<Array<areaNameItem>>([])
  const [isAddOpen, setIsAddOpen] = useState<OpenType>({
    isOpen: false,
    title: '',
    mode: 'agent-chat',
  })
  const { data: tenants, mutate: tenantsMutate }: any = useSwr('/getTenants', getTenants)
  useEffect(() => {
    if (tenants) {
      const newArr: any = []
      const defaultSpace = tenants?.find((item: any) => item.current === true)
      setActiveArea(defaultSpace.id)
      setCallback(defaultSpace.id)
      tenants.forEach((item: AreaNameListItem, index: any) => {
        newArr.push({ key: item.id, name: item.name })
      })
      setAreaName(newArr)
    }
  }, [tenants])


  const onChangePage: PaginationProps['onChange'] = (pageNumber) => {
    setSize?.(pageNumber)
  }

  return (
    <>
      <div className='mt-[24px]'>
        <div style={{ justifyContent: 'space-between', fontWeight: '700', backgroundColor: 'white', padding: '16px 16px', marginBottom: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center' }} className='text-[#1C2748] text-[20px] mb-[16px]'>
          智能体广场
        </div>
        <div className='flex flex-col bg-[#fff] rounded-[8px] px-[24px] pt-[24px]' style={{ height: 'calc(100vh - 138px)' }}>
          {/* <div className='pt-[33px] pb-[22px]'>
            <Space>
              <Button type='primary' disabled>上架Agent</Button>
              <Button type='primary' onClick={() => setIsAddOpen({
                isOpen: true,
                title: '创建Agent',
                mode: 'agent-chat',
              })}>创建Agent</Button>
            </Space>
          </div> */}
          <div className='flex-1 w-[100%] overflow-y-auto' style={{ height: 'calc(100vh - 268px)' }}>
            <div className='flex flex-1 flex-wrap overflow-hidden overflow-y-auto pb-12 gap-[1.45vw]'>
              {data?.data?.map((item, index) => <TypeCard key={index} data={item}
                headerImg='header_agent1'
                indexValue={index + 1}
                styleCss={{ backgroundImage: `url('/agent-platform-web/bg/agentChatBg${getFiveIndex(index + 1)}.png')` }}
                menuItmes={[{ key: '2', label: '插件广场' }, { key: '3', label: '工作流' }]}
              />)}
            </div>
          </div>
          <div className='pb-[24px]'>
            <Pagination align="end" defaultPageSize={data?.limit || 9} showQuickJumper current={data?.page} total={data?.total} onChange={onChangePage} />
          </div>
        </div>
      </div>
      {isAddOpen.isOpen ? <AddModal isAddOpen={isAddOpen} onClose={(val: boolean) => setIsAddOpen({ ...isAddOpen, isOpen: val })} mutate={mutate} /> : null}
    </>
  )
}

export default AgentChatPage
