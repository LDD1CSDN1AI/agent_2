import type { ReactNode } from 'react'
import React from 'react'
import { Modal } from 'antd'
import { AdminAppliedType, AdminApplyingType } from '@/models/log'
import { applicationOption, applyOption } from '@/app/(commonLayout)/apps/component/managerPage'
import { formatDateString } from '@/utils'

type Props = {
  title?: string | ReactNode
  open: boolean
  onClose: () => void
  data?: AdminApplyingType | AdminAppliedType
  children?: ReactNode
  onOK?: (...args: any[]) => void
  onCancel?: (...args: any[]) => void
  okText?: string
  cancelText?: string
  footer?: ReactNode
  closeIcon?: React.ReactNode
}

const ApplyDetailContainer: React.FC<Props> = (props) => {
  const {
    open,
    onClose,
    title,
    data,
    children,
    onCancel,
    onOK,
    okText = '确认',
    cancelText = '取消',
    footer,
    closeIcon,
  } = props

  const detailList = [
    { label: '应用名称：', value: data?.app_name },
    { label: '应用类型：', value: applyOption.find(item => item.value === data?.application_type)?.label },
    { label: '应用描述：', value: data?.app_desc },
    { label: '申请原因：', value: data?.reason },
  ]

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      width={760}
      onOk={onOK}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      footer={footer}
      closeIcon={closeIcon}
    >
      <article className="border-solid border-[1px] mx-auto border-[#E0EFFE] rounded-lg w-[680px]">
        <header
          className="py-6 px-5 flex justify-between text-[#777D91] bg-[#F1F5F9] border-solid border-[1px] border-[#E0EFFE] rounded-t-lg">
          <p>申请权限：{applicationOption.find(item => item.value === data?.app_type)?.label}</p>
          <p>申请人：{data?.applicant}</p>
          <p>申请时间：{formatDateString(data?.application_time || '')}</p>
        </header>

        <ul className="mx-5 my-7 list-none">
          {
            detailList.map((item, index) => (
              <li key={index} className="flex mb-7">
                <h5 className="mr-3 text-[#777D91]">{item.label}</h5>
                <p className="text-[#1C2748] flex-1">{item.value}</p>
              </li>
            ))
          }
        </ul>
      </article>
      {children}
    </Modal>
  )
}

export default ApplyDetailContainer
