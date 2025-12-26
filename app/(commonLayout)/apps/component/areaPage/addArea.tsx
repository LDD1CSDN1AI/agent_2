import React, { useEffect, useState } from 'react'
import { Form, Input, Modal, Transfer } from 'antd'
import type { TransferProps } from 'antd'
import styles from '../base/baseStyle.module.scss'
import Toast from '@/app/components/base/toast'
import { createTenant, getAccountList } from '@/service/log'
const { TextArea } = Input
type RecordType = {
  key: string
  title: string
  description: string
  chosen: boolean
}

type Props = {
  data?: any
  modalState: boolean
  onClose: (val: boolean) => void
}

const AddArea: React.FC<Props> = (props) => {
  const { modalState, onClose } = props
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(modalState)
  const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>([])
  const [dataSource, setDataSource] = useState<any>([])
  const [inputName, setInputName] = useState<string | null>(null)
  const [textArea, setTextArea] = useState<string | null>(null)
  const [accountKeys, setAccountKeys] = useState<Array<any>>([])

  useEffect(() => {
    if (modalState) {
      setIsModalOpen(true)
      getAccount()
    }
  }, [modalState])

  const getAccount = async () => {
    const res = await getAccountList({ url: '/getAllAccount', body: {} })
    const newArr: any = []
    if (res) {
      res.forEach((item: any) => {
        newArr.push({ key: item.id, title: item.name, description: item.name })
      })
      setDataSource(newArr)
    }
  }

  const handleOk = async () => {
    if (accountKeys.length != 0) {
      try {
        await createTenant({
          url: '/createTenant',
          body: {
            name: inputName,
            description: textArea,
            accounts: accountKeys,
          },
        })
        form.resetFields()
        setInputName(null)
        setTargetKeys([])
        setAccountKeys([])
        setIsModalOpen(false)
        onClose(false)
      }
      catch (err) {
        Toast.notify({
          type: 'error',
          message: '创建失败',
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

  const handleCancel = () => {
    form.resetFields()
    setInputName(null)
    setTargetKeys([])
    setAccountKeys([])
    setIsModalOpen(false)
    onClose(false)
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

  return (
    <Modal
      className={styles.modalGlobal}
      title="项目空间创建"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={539}
      okText='确定'
      cancelText='取消'
    >
      <Form
        layout='vertical'
        form={form}
      >
        <Form.Item label="名称" name='inputName'>
          <Input placeholder="这是名称字段" maxLength={20} onChange={(e) => { setInputName(e.target.value) }} />
          <p className='text-[12px] text-[rgb(132, 134, 140)] mt-[4px]'>支持中英文、数字，不多于20个字</p>
        </Form.Item>
        <Form.Item label="简介" name='description'>
          <TextArea rows={6} placeholder="这是一段文字的介绍…" onChange={(e) => { setTextArea(e.target.value) }} />
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
      </Form>
    </Modal>

  )
}

export default AddArea
