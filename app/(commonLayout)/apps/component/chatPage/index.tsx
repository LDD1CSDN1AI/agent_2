import React, { useEffect, useState } from 'react'
import { Pagination } from 'antd'
import useSwr from 'swr'
import type { PaginationProps } from 'antd'
import type { OpenType } from '../base/addModal'
import AddModal from '../base/addModal'
import type { PluginProvider } from '@/models/common'
import { getFiveIndex } from '@/utils/var'
import { getTenants } from '@/service/common'
import TypeCard from './typeCard'

type Props = {
  data?: PluginProvider[] | undefined
  mutate?: () => void
  setCallback?: any
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

const ChatPage: React.FC<Props> = (props) => {
  const { data, mutate, setCallback } = props
  const [activeArea, setActiveArea] = useState<any>('')
  const [limit, setLimit] = useState(9)
  const [current, setCurrent] = useState(0);
  const [areaName, setAreaName] = useState<Array<areaNameItem>>([])

  const [isAddOpen, setIsAddOpen] = useState<OpenType>({
    isOpen: false,
    title: '',
    mode: 'agent-chat',
  })

  const { data: tenants, mutate: tenantsMutate }: any = useSwr('/getTenants', getTenants)
  useEffect(() => {
    mutate?.();
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
    setCurrent(pageNumber - 1)
  }

  return (
    <>
      <div className='mt-[24px]'>
        <div style={{ justifyContent: 'space-between', fontWeight: '700', backgroundColor: 'white', padding: '16px 16px', marginBottom: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center' }} className='text-[#1C2748] text-[20px] mb-[16px]'>插件广场</div>
        <div className='flex flex-col bg-[#fff] rounded-[8px] px-[24px] pt-[24px]' style={{ height: 'calc(100vh - 138px)' }}>
          <div className='pb-[22px]'>
            {/* <Space>
              <Button type='primary' disabled>上架插件</Button>
              <Button type='primary' onClick={() => setIsAddOpen({
                isOpen: true,
                title: '创建插件',
                mode: 'chat',
              })}>创建插件</Button>
            </Space> */}
          </div>
          <div className='flex-1 w-[100%] overflow-y-auto' style={{ height: 'calc(100vh - 268px)' }}>
            <div className='flex flex-1 flex-wrap overflow-hidden overflow-y-auto pb-12 gap-[1.45vw]'>
              {data?.filter((record, index) => (current * limit <= index) && (index < (current + 1) * limit))?.map((item, index) => (
                <div style={{
                  display: 'inline-block',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '100% 100%',
                  height: '180px',
                  // backgroundImage: `url(\'/agent-platform-web/bg/plug_square_${(index % 7) + 1}.png\')`,
                  position: 'relative',
                }}>
                  <TypeCard key={index} plugin={item}
                    headerImg='header_chat1'
                    indexValue={index + 1}
                    menuItmes={[{ key: '1', label: '智能体广场' }, { key: '3', label: '工作流' }]}
                    styleCss={{ backgroundImage: `url('/agent-platform-web/bg/chatBg${getFiveIndex(index + 1)}.png')` }} />
                </div>
              ))}
            </div>
          </div>
          <div className='pb-[24px]'>
            <Pagination align="end" defaultCurrent={9} showQuickJumper current={current + 1} total={data?.length} onChange={onChangePage} />
          </div>
        </div>
      </div>
      {isAddOpen.isOpen ? <AddModal isAddOpen={isAddOpen} onClose={(val: boolean) => setIsAddOpen({ ...isAddOpen, isOpen: val })} mutate={mutate} /> : null}
    </>
  )
}

export default ChatPage
