import React, { useEffect, useState } from 'react'
import { Pagination } from 'antd'
import type { PaginationProps } from 'antd'
import useSwr from 'swr'
import TypeCard from '../base/typeCard'
import type { OpenType } from '../base/addModal'
import AddModal from '../base/addModal'
import type { AppListResponse } from '@/models/app'
import { getFiveIndex } from '@/utils/var'
import { getTenants } from '@/service/common'
import { getQueryParams } from '@/utils/getUrlParams'
type AreaNameListItem = {
  id: string
  name: string
  status: string
  created_at: string
  current: boolean
}

type Props = {
  data?: AppListResponse | undefined
  mutate?: () => void
  setCallback?: any
}
type areaNameItem = {
  key: string
  name: string
}

const WorkflowPage: React.FC<Props> = (props) => {
  const { data, mutate, setCallback } = props
  const [isAddOpen, setIsAddOpen] = useState<OpenType>({
    isOpen: false,
    title: '',
    mode: 'agent-chat',
  })
  const [activeArea, setActiveArea] = useState<any>('')
  const [areaName, setAreaName] = useState<Array<areaNameItem>>([])

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
  }

  return (
    <>
      <div className='mt-[24px]'>
        <div className='text-[#1C2748] text-[20px] mb-[16px]'>智能体</div>
        <div className='flex flex-col bg-[#fff] rounded-[8px] px-[24px] pt-[24px]' style={{ height: 'calc(100vh - 158px)' }}>
          {/* <div className='pt-[33px] pb-[22px]'>
            <Space>
              <Button type='primary' disabled>上架智能体</Button>
              <Button type='primary' onClick={() => setIsAddOpen({
                isOpen: true,
                title: '创建智能体',
                mode: 'metabolic',
              })}>创建智能体</Button>
            </Space>
          </div> */}
          <div className='flex-1 w-[100%] overflow-y-auto' style={{ height: 'calc(100vh - 268px)' }}>
            <div className='flex flex-1 flex-wrap overflow-hidden overflow-y-auto pb-12 gap-[1.45vw]'>
              {data?.data?.map((item, index) => (
                <TypeCard key={index} data={item}
                  headerImg='header_agent1'
                  styleCss={{ backgroundImage: `url('/agent-platform-web/bg/workflowBg${getFiveIndex(index + 1)}.png')` }}
                  menuItmes={[{ key: '1', label: '智能体广场' }, { key: '3', label: '插件广场' }]}
                />
              ))}
            </div>
          </div>
          <div className='pb-[24px]'>
            <Pagination align="end" showQuickJumper current={data?.page} total={data?.total} onChange={onChangePage} pageSizeOptions={[9, 18, 36, 78]} />
          </div>
        </div>
      </div>
      {isAddOpen.isOpen ? <AddModal isAddOpen={isAddOpen} onClose={(val: boolean) => setIsAddOpen({ ...isAddOpen, isOpen: val })} mutate={mutate} tenant_id={getQueryParams('tenant_id')} /> : null}
    </>

  )
}

export default WorkflowPage
