import React, { useEffect, useState } from 'react'
import { Form, Input, Modal, Radio } from 'antd'
import { useRequest } from 'ahooks'
import { useRouter } from 'next/navigation'
import styles from './baseStyle.module.scss'
import { createApp, updateAppInfo } from '@/service/apps'
import { useAppContext } from '@/context/app-context'
import { getRedirection } from '@/utils/app-redirection'

const { TextArea } = Input

export type OpenType = {
  id?: string
  isOpen: boolean
  title: string
  data?: any
  mode: 'agent-chat' | 'chat' | 'workflow' | 'metabolic' | 'advanced-chat'
}

type Props = {
  isAddOpen: OpenType
  onClose: (val: boolean) => void
  mutate?: () => void
  tenant_id: any
}

const AddModal: React.FC<Props> = (props) => {
  const { isAddOpen, onClose, mutate, tenant_id } = props
  const consoleTokenFromLocalStorage = localStorage?.getItem('console_token')
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(isAddOpen.isOpen)
  const { isCurrentWorkspaceEditor } = useAppContext()
  const { push } = useRouter()

  const { run: addRun } = useRequest(
    async (param) => {
      const result = await createApp(param)
      getRedirection(isCurrentWorkspaceEditor, result, push)
      return result
    },
  )

  const { run: editRun } = useRequest(
    async (param) => {
      const result = await updateAppInfo(param)
      return result
    },
  )

  useEffect(() => {
    if (isAddOpen.isOpen) {
      setIsModalOpen(true)
      if (isAddOpen.id) {
        form.setFieldsValue
          ({
            ...isAddOpen?.data,
          })
      }
    }
  }, [form, isAddOpen?.data, isAddOpen.id, isAddOpen.isOpen])

  useEffect(() => {
    if (!isAddOpen.isOpen)
      mutate?.()
  }, [isAddOpen.isOpen, mutate])

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (isAddOpen?.id) {
        editRun({
          ...values,
          appID: isAddOpen?.id,
          mode: isAddOpen.mode,
          tenant_id,
        })
      }
      else {
        if (isAddOpen?.mode === 'chat') {
          history.pushState(null, '', `/agent-platform-web/tools/createByUrl?provider=${values.name}&desc=${values.description}&tenant_id=${tenant_id || ''}&console_token=${consoleTokenFromLocalStorage}`)
        }
        else {
          addRun({
            ...values,
            mode: isAddOpen.mode,
            tenant_id,
          })
        }
      }
      setIsModalOpen(false)
      onClose(false)
      form.resetFields()
    })
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    onClose(false)
    form.resetFields()
  }

  return (
    <Modal
      className={styles.modalGlobal}
      title={isAddOpen.title}
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
        <Form.Item label="名称" name="name"
          extra='支持中英文、数字，不多于20个字'
          rules={[{ required: true, message: '请输入名称，仅支持中英文和数字' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
        <Form.Item label="简介" name="description" rules={[{ required: true, message: '请输入简介' }]}>
          <TextArea rows={6} placeholder="请输入简介内容" />
        </Form.Item>
        {isAddOpen?.mode === 'chat' && <Form.Item label="接入选择" name="type">
          <Radio.Group defaultValue="1" disabled>
            <Radio value="1"> 通过URL接入插件 </Radio>
            <Radio value="2"> 代码创建插件 </Radio>
          </Radio.Group>
        </Form.Item>}
      </Form>
    </Modal>

  )
}

export default AddModal
