import React, { useRef, useState } from 'react'
import type { TableProps } from 'antd'
import { Button, Form, Input, message, Radio, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import type { ProTableConfigInstance } from '@/app/components/custom/pro-table'
import ProTable from '@/app/components/custom/pro-table'
import { applyProcess, fetchAllApplicaion } from '@/app/(commonLayout)/apps/component/managerPage/service'
import type { AdminApplyingType } from '@/models/log'
import ApplyDetailContainer from '@/app/(commonLayout)/apps/component/managerPage/components/detail-container'
import { applicationOption, applyOption } from '@/app/(commonLayout)/apps/component/managerPage/index'
import { formatDateString } from '@/utils'

type Props = {
  active: boolean
}

const { Item } = Form

export type RequestParams = {
  application_type?: string[]
  app_type?: string[]
  applicant?: string
  need_check: true // 必须传true
}

export type ApplyParams = {
  status: string
  denial_reason?: string
  process_id: string
}

const Applying: React.FC<Props> = (props) => {
  const { } = props
  const proRef = useRef<ProTableConfigInstance>()
  const [form] = Form.useForm<RequestParams>()
  const [applyForm] = Form.useForm<ApplyParams>()
  const [requestParams, setRequestParams] = useState<RequestParams>({ need_check: true })
  const [record, setRecord] = useState<AdminApplyingType>()
  const [messageApi, contextHolder] = message.useMessage()

  const columns: TableProps<AdminApplyingType>['columns'] = [
    { title: '应用名称', dataIndex: 'app_name', key: 'app_name', className: 'text-[#1C2748]' },
    {
      title: '应用类型',
      dataIndex: 'app_type',
      key: 'app_type',
      className: 'text-[#777D91]',
      render(val: string) {
        return applicationOption.find(item => item.value === val)?.label
      },
    },
    { title: '应用描述', dataIndex: 'app_desc', key: 'app_desc', className: 'text-[#777D91]' },
    {
      title: '申请类型',
      dataIndex: 'application_type',
      key: 'application_type',
      className: 'text-[#777D91]',
      render(val: string) {
        return applyOption.find(item => item.value === val)?.label
      },
    },
    { title: '申请人', dataIndex: 'app_creator', key: 'app_creator', className: 'text-[#777D91]' },
    {
      title: '申请时间',
      dataIndex: 'application_time',
      key: 'application_time',
      className: 'text-[#777D91]',
      render: (val: string) => formatDateString(val),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record: AdminApplyingType) => (
        <a className="text-[#216EFF]" onClick={() => setRecord(record)}>去审核</a>
      ),
    },
  ]

  function search(values: RequestParams) {
    setRequestParams(values)
  }

  async function apply() {
    try {
      const vals = await applyForm.validateFields()
      await applyProcess(vals)
      messageApi.open({ type: 'success', content: '请求成功' })
      setRecord(undefined)
      proRef.current?.onRefresh()
    } catch (e) {
      messageApi.open({ type: 'error', content: '请求失败，请稍后重试' })
    }
  }

  function closeModal() {
    setRecord(undefined)
    applyForm.resetFields()
  }

  return (
    <>
      {contextHolder}
      <article>
        <Form form={form} onFinish={search} layout="inline" className="mb-2">
          <Item name="need_check" initialValue={true} hidden />

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

        <ProTable<AdminApplyingType, RequestParams>
          proRef={proRef}
          columns={columns}
          request={fetchAllApplicaion}
          requestParams={requestParams}
        />
      </article>

      {
        Boolean(record) && (
          <ApplyDetailContainer
            title={<h1 className="text-xl text-[#1C2748] mb-6 mx-auto">申请
              | {record?.application_type === 'delete' ? '撤销发布' : '发布应用'}</h1>}
            data={record}
            open={Boolean(record)}
            onClose={closeModal}
            onCancel={closeModal}
            onOK={apply}
          >
            <Form<ApplyParams> form={applyForm} className="mx-[20px] mt-5">
              <Item name="process_id" initialValue={record?.id} hidden />

              <Item label="审核结果" name="status" rules={[{ required: true }]}>
                <Radio.Group>
                  <Radio value={'approved'}><span className="text-[#777D91]">通过</span></Radio>
                  <Radio value={'denied'}><span className="text-[#777D91]">不通过</span></Radio>
                </Radio.Group>
              </Item>

              <Item shouldUpdate={(pre, last) => pre.status !== last.status}>
                {
                  ({ getFieldValue }) => {
                    if (getFieldValue('status') === 'denied') {
                      return <Item name="denial_reason"><TextArea rows={4} placeholder="请填写不通过的理由" /></Item>
                    }
                  }
                }
              </Item>
            </Form>
          </ApplyDetailContainer>
        )
      }
    </>
  )
}

export default Applying
