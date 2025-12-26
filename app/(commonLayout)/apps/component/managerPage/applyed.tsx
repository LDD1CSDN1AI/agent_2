import React, { useRef, useState } from 'react'
import { Button, Form, Input, message, Modal, Select, Space, type TableProps, Tag } from 'antd'
import type { ProTableConfigInstance } from '@/app/components/custom/pro-table'
import ProTable from '@/app/components/custom/pro-table'
import { deleteApplyRequest, fetchProcessAllApplicaion } from '@/app/(commonLayout)/apps/component/managerPage/service'
import { AdminAppliedType, AdminApplyingType } from '@/models/log'
import ApplyDetailContainer from '@/app/(commonLayout)/apps/component/managerPage/components/detail-container'
import { applicationOption, applyOption, applyStatusMap } from '@/app/(commonLayout)/apps/component/managerPage/index'
import { formatDateString } from '@/utils'

type Props = {
  active: boolean
}

export type ApplyedRequestParams = {
  application_type?: string[]
  app_type?: string[]
  applicant?: string
  need_check: false // 必须传false
}

const { Item } = Form

const tagMap = {
  pending: <Tag className="ml-2 font-normal" bordered={false} color="processing">审核中</Tag>,
  approved: <Tag className="ml-2 font-normal" bordered={false} color="success">审核通过</Tag>,
  denied: <Tag className="ml-2 font-normal" bordered={false} color="error">未通过</Tag>,
}

const Applyed: React.FC<Props> = (props) => {
  const { } = props
  const proRef = useRef<ProTableConfigInstance>()
  const [requestParams, setRequestParams] = useState<ApplyedRequestParams>()
  const [form] = Form.useForm<ApplyedRequestParams>()
  const [record, setRecord] = useState<AdminAppliedType>()
  const [messageApi, messageContextHolder] = message.useMessage()

  const applyedColumns: TableProps<AdminAppliedType>['columns'] = [
    { title: '应用名称', dataIndex: 'app_name', key: 'app_name', className: 'text-[#1C2748]', width: 120 },
    {
      title: '应用类型',
      dataIndex: 'app_type',
      key: 'app_type',
      className: 'text-[#777D91]',
      width: 120,
      render(val: string) {
        return applicationOption.find(item => item.value === val)?.label
      },
    },
    { title: '应用描述', dataIndex: 'app_desc', key: 'app_desc', className: 'text-[#777D91]', width: 160 },
    {
      title: '申请类型',
      dataIndex: 'application_type',
      key: 'application_type',
      className: 'text-[#777D91]',
      width: 120,
      render(val: string) {
        return applyOption.find(item => item.value === val)?.label
      },
    },
    { title: '申请人', dataIndex: 'app_creator', key: 'app_creator', className: 'text-[#777D91]', width: 120 },
    { title: '审核人', dataIndex: 'reviewer', key: 'reviewer', className: 'text-[#777D91]', width: 120 },
    {
      title: '审核结果',
      dataIndex: 'status',
      key: 'status',
      className: 'text-[#777D91]',
      width: 120,
      render(val: AdminApplyingType['status']) {
        return applyStatusMap[val]
      },
    },
    {
      title: '申请时间',
      dataIndex: 'application_time',
      key: 'application_time',
      className: 'text-[#777D91]',
      width: 160,
      render: (val: string) => formatDateString(val),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space>
          <a className="text-[#216EFF]" onClick={() => setRecord(record)}>详情</a>
          <a className="text-[#216EFF]" onClick={() => deleteApply(record)}>删除</a>
        </Space>
      ),
    },
  ]

  function closeModal() {
    setRecord(undefined)
  }

  function search(values: ApplyedRequestParams) {
    setRequestParams(values)
  }

  function deleteApply(item: AdminAppliedType) {
    let text = ''
    let title = ''

    switch (item.status) {
      case 'pending':
        title = '你可以在审核完成后进行删除'
        text = '你可以在审核完成后进行删除'
        break
      case 'approved':
        title = '确定要删除该条申请吗'
        text = '删除后列表将不再展示此申请'
        break
      case 'denied':
        title = '确定要删除该条申请吗'
        text = '删除后无法撤回，你可以重新提起申请'
        break
    }

    const modal = Modal.confirm({
      title,
      width: 600,
      okText: '确认',
      cancelText: '取消',
      content: <p className="text-[#1C2748] mt-5 mb-7">{text}</p>,
      onOk: async () => {
        try {
          await deleteApplyRequest({ process_id: item.id })
          messageApi.open({ type: 'success', content: '请求成功' })
          proRef.current?.onRefresh()
          modal.destroy()
        } catch (e) {
          messageApi.open({ type: 'error', content: '不允许删除此记录，因为您不是审核人。' })
          modal.destroy()
        }
      },
    })
  }

  return (
    <>
      <article>
        {messageContextHolder}
        <Form<ApplyedRequestParams> form={form} onFinish={search} layout="inline" className="mb-2">
          <Item name="need_check" initialValue={false} hidden />

          <Item name="app_type">
            <Select
              style={{ minWidth: '180px' }}
              mode="multiple"
              placeholder="全部应用类型"
              options={applicationOption}
            />
          </Item>

          <Item name="application_type">
            <Select
              style={{ minWidth: '180px' }}
              mode="multiple"
              placeholder="全部申请类型"
              options={applyOption}
            />
          </Item>

          <Item name="app_name">
            <Input placeholder="请输入应用名或者申请人" />
          </Item>

          <Item>
            <Button htmlType="submit" type="primary">搜索</Button>
          </Item>
        </Form>

        <ProTable<AdminAppliedType, ApplyedRequestParams>
          proRef={proRef}
          columns={applyedColumns}
          request={fetchProcessAllApplicaion}
          requestParams={requestParams}
        />
      </article>

      {
        Boolean(record) && (
          <ApplyDetailContainer
            title={<h1 className="text-xl text-[#1C2748] mb-6 mx-auto">申请<span
              className="mx-1">|</span>{record?.application_type === 'delete' ? '撤销发布' : '发布应用'}{record && tagMap[record?.status]}
            </h1>}
            data={record}
            open={Boolean(record)}
            onClose={closeModal}
            closeIcon={null}
            footer={<Button className="mr-5" onClick={closeModal} type="primary">返回</Button>}
          />
        )
      }
    </>
  )
}
export default Applyed
