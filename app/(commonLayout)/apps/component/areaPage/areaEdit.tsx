import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Transfer } from 'antd'
import type { TransferProps } from 'antd'
import cn from 'classnames'
import Image from 'next/image'
import useSwr from 'swr'
import { usePathname } from 'next/navigation'
import back from '@/public/image/back.png'
import { getTenants } from '@/service/common'
import { getAccountList, updateTenant } from '@/service/log'
import Toast from '@/app/components/base/toast'

const { TextArea } = Input

type Props = {
  data?: any
  setActiveTab?: (newActiveTab: string) => void
  setCallback?: any
}
type RecordType = {
  key: string
  title: string
  description: string
  chosen: boolean
}

const AreaEdit: React.FC<Props> = (props) => {
  const { setActiveTab, setCallback } = props

  const pathName = usePathname()
  const [form] = Form.useForm()
  const [activeArea, setActiveArea] = useState<string>('')
  const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>([])
  const [dataSource, setDataSource] = useState<any>([])
  const [inputName, setInputName] = useState<string | null>(null)
  const [textArea, setTextArea] = useState<string | null>(null)
  const [accountKeys, setAccountKeys] = useState<Array<any>>([])

  const { data: tenants, mutate: tenantsMutate }: any = useSwr('/getTenants', getTenants)

  useEffect(() => {
    if (tenants) {
      const defaultSpace = tenants?.find((item: any) => item.current)
      setActiveArea(defaultSpace.id)
      setCallback(defaultSpace.id)
      getAccount(defaultSpace.id)
    }
  }, [tenants])

  const getAccount = async (id: any) => {
    const res = await getAccountList({
      url: '/getAllAccount',
      body: {
        tenant_id: id,
      },
    })

    const newArr: any = []
    const newArrs: any = []
    if (res) {
      res.forEach((item: any) => {
        newArr.push({ key: item.id, title: item.name, description: item.name })
        newArrs.push(item.id)
      })
      setDataSource(newArr)
      setTargetKeys(newArrs)
    }
  }

  const handleChange: TransferProps['onChange'] = (newTargetKeys) => {
    const newArr: any = []
    newTargetKeys.forEach((item) => {
      newArr.push({ id: item, role: 'normal' })
    })
    setAccountKeys(newArr)
    setTargetKeys(newTargetKeys)
  }

  const handleSearch: TransferProps['onSearch'] = (dir, value) => {

  }

  const filterOption = (inputValue: string, option: RecordType) =>
    option.description.includes(inputValue)

  const onOk = async () => {
    if (accountKeys.length != 0) {
      try {
        await updateTenant({
          url: '/updateTenant',
          body: {
            id: activeArea,
            name: inputName,
            description: textArea,
            accounts: accountKeys,
          },
        })
        const timer = setTimeout(() => {
          form.resetFields()
          setInputName(null)
          setTargetKeys([])
          setAccountKeys([])
          pushBackHistory()
          clearTimeout(timer)
        }, 1000)
      }
      catch (e) {
        Toast.notify({
          type: 'error',
          message: '更新失败',
        })
      }
    }
    else {
      Toast.notify({
        type: 'error',
        message: '请配置成员！',
      })
    }
  }

  const pushBackHistory = () => {
    history.pushState(null, '', `${pathName}?category=all`)
    setActiveTab?.('area')
  }

  return (
    <div className='mt-[24px] overflow-hidden'>
      <div className='flex mb-[22px]'>
        <div className='bg-[#fff] w-[27px] h-[27px]' onClick={() => {
          pushBackHistory()
        }}>
          <Image src={back} alt='img' width={16} height={16} className='mx-auto mt-[6px]' />
        </div>
        <div className='text-[#6B7492] text-[14px] ml-[8px] mr-[23px] my-auto'>返回</div>
        <div className='text-[#1C2748] text-[20px]'>项目空间编辑</div>
      </div>
      <div className='flex' style={{ height: 'calc(100vh - 160px)' }}>
        {/* <div className='w-[238px] h-[100%] bg-[#fff] rounded-[4px] mr-[24px] px-[16px] py-[24px]'>123</div> */}
        <div className='w-[238px] h-[100%] bg-[#fff] rounded-[4px] mr-[24px] px-[16px] py-[24px]'>
          {tenants?.map((item: any) => (
            <div key={item.id}
              className={cn('text-[14px] text-center my-auto py-[10px] mb-[16px] height-[40px] border rounded-[4px]',
                activeArea === item.id
                  ? 'border-[#216EFF] bg-[#216EFF] text-[#FFFFFF]'
                  : 'border-[#216EFF] text-[#27292B]',
              )}
              onClick={() => setActiveArea(item.id)}>
              {item.name}
            </div>
          ))}
        </div>
        <div className='flex-1 h-[100%] bg-[#fff] rounded-[4px] px-[240px] py-[24px] overflow-y-auto'>
          <Form
            layout='vertical'
            form={form}
          >
            <Form.Item label="名称">
              <Input placeholder="这是名称字段" maxLength={20} onChange={(e) => { setInputName(e.target.value) }} />
              <p className='text-[12px] text-[rgb(132, 134, 140)] mt-[4px]'>支持中英文、数字，不多于20个字</p>
            </Form.Item>
            <Form.Item label="简介">
              <TextArea rows={10} placeholder="这是一段文字的介绍…" style={{ resize: 'none' }} onChange={(e) => { setTextArea(e.target.value) }} />
            </Form.Item>
            <Form.Item label="成员配置" name='accounts'>
              <div className='w-[100%]'>
                <div className='bg-[#F7F9FC] px-[16px] py-[16px]'>
                  <div>
                    <Transfer
                      titles={['项目空间成员', '已选成员']}
                      selectAllLabels={['全部', '已选']}
                      showSelectAll={false}
                      dataSource={dataSource}
                      showSearch
                      filterOption={filterOption}
                      targetKeys={targetKeys}
                      onChange={handleChange}
                      onSearch={handleSearch}
                      render={item => item.title}
                    />
                  </div>
                </div>
              </div>
            </Form.Item>
            <Button type='primary' onClick={onOk}>确定</Button>
          </Form>
        </div>

      </div>
    </div>
  )
}

export default AreaEdit
