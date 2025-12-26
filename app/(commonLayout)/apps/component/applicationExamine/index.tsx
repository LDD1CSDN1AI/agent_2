import React, { useState, useEffect } from 'react';
import { Breadcrumb, ConfigProvider, Input, Select, Table, Button, Modal, Radio, message, Tag } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { getProcessList, toAudit } from '@/service/log'
import { useAppContext } from '@/context/app-context'
import { getRedirection } from '@/utils/app-redirection'
import { useRouter } from 'next/navigation'
import { getQueryParams } from '@/utils/getUrlParams'
import './releasemanagement.css'
import zhCN from 'antd/es/locale/zh_CN'
const { TextArea } = Input;
type Props = {
    setActiveTab?: any
}

const ApplicationExamine: React.FC<Props> = (props) => {
    const [applicationType, setApplicationType] = useState(['public', 'normal', 'project', 'delete'])
    const { setActiveTab } = props
    const [inputValue, setInputValue] = useState<any>(null)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)
    const [dataSource, setDataSource] = useState([])
    const [appType, setAppType] = useState<any>(null)
    const [detailModal, setDetailModal] = useState(false)
    const [details, setDetails] = useState<any>({})
    const [value, setValue] = useState('approved')
    const [areaValue, setAreaValue] = useState<any>('')
    const { push } = useRouter()
    const tenantId = getQueryParams('tenant_id')
    const name = getQueryParams('breadcrumb')
    const role = getQueryParams('role')
    const breadcrumb = getQueryParams('breadcrumb')
    const { isCurrentWorkspaceEditor } = useAppContext()
    const detail = (render: any, text: any) => {
        setDetails(text)
        setDetailModal(true)
    }

    const onChange = (e: any) => {
        setValue(e.target.value);
    };

    const getrequest = async () => {
        const body: any = {
            page,
            limit: pageSize,
            need_check: true,
            applicant: inputValue,
            app_type: appType,
            space_id: tenantId
        }
        const res = await getProcessList({
            url: '/application/tenant/published/process/page/list',
            body,
        })
        if (res.data) {
            setDataSource(res.data)
            setTotal(res.total)
            setPage(res.page)
            setPageSize(res.limit)
        }
    }

    const confirm = async () => {
        const body: any = {
            process_id: details.id,
            app_id: details.app_id,
            status: value,
            denial_reason: value === 'approved' ? '' : areaValue,
        }
        const res = await getProcessList({
            url: '/application/process/auth',
            body,
        })
        if (res.result === 'success') {
            message.success('操作成功')
            getrequest()
        } else {
            message.error('操作失败')
        }
    }


    const options1 = [
        {
            label: 'Agent',
            value: 'agent-chat',
        },
        {
            label: '插件',
            value: 'tool',
        },
        {
            label: '工作流',
            value: 'workflow',
        },
        {
            label: '智能体',
            value: 'metabolic',
        },
    ]

    let columns: any = [
        {
            title: '应用名称',
            dataIndex: 'app_name',
            key: 'app_name',
        },
        {
            title: '应用类型',
            dataIndex: 'app_type',
            key: 'app_type',
        },
        {
            title: '应用描述',
            dataIndex: 'app_desc',
            key: 'app_desc',
        },
        {
            title: '应用来源',
            dataIndex: 'application_type',
            key: 'application_type',
            render: (render: any, text: any) => (
                <>
                    {
                        render === 'normal' ? '个人空间' : render === 'project' ? '项目空间' : render === 'public' ? '广场' : null
                    }
                </>
            )
        },
        {
            title: '申请人',
            dataIndex: 'applicant',
            key: 'applicant',
        },
        {
            title: '申请时间',
            dataIndex: 'application_time',
            key: 'application_time',
        },
        {
            title: '审核结果',
            dataIndex: 'status',
            key: 'status',
            render: (render: any) => (
                render === 'pending' ? <Tag color="purple">待审核</Tag> : render === 'approved' ? <Tag color="green">已通过</Tag> : <Tag color="red">已拒绝</Tag>

            )
        },
        {
            title: '操作',
            dataIndex: '',
            key: '',
            render: (render: any, text: any) => (
                <>
                    {
                        render.status === 'pending' ?
                            <div style={{ color: '#1677ff', cursor: 'pointer' }} onClick={() => { detail(render, text) }}>去审核</div>
                            :
                            <div style={{ color: '#389e0d', cursor: 'pointer' }} >审核完成</div>
                    }



                </>
            ),
        },
    ]

    if (role !== 'owner' && role !== 'admin') {
        columns.splice(4, 0, {
            title: '审核人',
            dataIndex: 'owner_name',
            key: 'owner_name',
        });
        columns.splice(columns.length - 1, 1,
            {
                title: '操作',
                dataIndex: '',
                key: '',
                render: (render: any, text: any) => (
                    <>
                        {
                            render.status === 'pending' ?
                                <div style={{ color: 'red', cursor: 'pointer' }}>禁用</div>
                                :
                                <div style={{ color: '#389e0d', cursor: 'pointer' }} >审核完成</div>
                        }



                    </>
                ),
            }
        )
    }

    useEffect(() => {
        console.log("111111111", window.location.href); // 打印当前 URL
        const queryParams = new URLSearchParams(window.location.search);
        // 获取特定的查询参数值
        const role = queryParams.get('role');
        const tenantId = queryParams.get('tenant_id');
    }, [])

    useEffect(() => {
        if (tenantId && tenantId !== undefined) {
            getrequest()
        }
    }, [page, pageSize, appType, inputValue, tenantId])


    const onOK = () => {
        if (value === 'denied' && areaValue === '') {
            message.error('不通过理由不能为空！')
            return
        }
        confirm()
        setDetailModal(false)
        setAreaValue('')
        setValue('approved')
    }
    let timer: any;
    const modalProps = {
        visible: detailModal,
        centered: true,
        width: 700,
        closable: true,
        maskClosable: true,
        footer: ([
            <Button key='back' onClick={() => {
                setDetailModal(false)
                setAreaValue('')
                setValue('approved')
            }}>取消</Button>,
            <Button key='confirm' type='primary' onClick={() => {
                timer && clearTimeout(timer)
                timer = setTimeout(() => {
                    onOK();
                }, 1000)

            }
            }> 确认</Button >

        ]),
    }
    return (
        <ConfigProvider locale={zhCN}>
            <div className='mt-[24px]'>
                <Breadcrumb
                    style={{ marginBottom: '24px', fontSize: '12px' }}
                    items={[
                        {
                            title: <a onClick={() => setActiveTab?.('all')}>首页</a>,
                        },
                        {
                            title: <a onClick={() => setActiveTab?.('projectSpace')}>项目空间</a>,
                        },
                        {
                            title: <a onClick={() => {
                                setActiveTab?.('workSpaceSecondPage')

                                getRedirection(isCurrentWorkspaceEditor, {
                                    mode: 'workSpaceSecondPage',
                                    role: role,
                                    tenant_id: tenantId,
                                    name: name
                                }, push)
                            }}>{breadcrumb}</a>,
                        },
                        {
                            title: <div>{role === 'owner' ? '应用审批' : '申请管理'}</div>,
                        },
                    ]}
                />
                <div className='flex flex-col bg-[#fff] rounded-[8px] px-[24px] pt-[24px]' style={{ height: 'calc(100vh - 158px)' }}>
                    <div className="header" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '24px',
                    }}>
                        <div>
                            <Select options={options1} allowClear value={appType} onChange={(key) => {
                                if (key === undefined) {
                                    setAppType(null)
                                }
                                else {
                                    const arr: any = []
                                    arr[0] = key
                                    setAppType(arr)
                                }
                            }} style={{ width: '150px', marginRight: '20px' }} placeholder='全部应用类型' />
                            <Input
                                value={inputValue}
                                placeholder="搜索应用名称或申请人"
                                allowClear
                                onChange={(e: any) => { setInputValue(e.target.value || null) }}
                                style={{ width: 250 }}
                                suffix={<SearchOutlined />}
                            />
                        </div>
                    </div>
                    <div className="tabs" >
                        <Table
                            dataSource={dataSource}
                            columns={columns}
                            scroll={{ y: 350 }}
                            pagination={{
                                total,
                                pageSizeOptions: [10, 20, 50, 100],
                                defaultPageSize: 10,
                                defaultCurrent: 1,
                                showQuickJumper: true,
                                showSizeChanger: true,
                                onChange: (page, pageSize) => {
                                    setPage(page)
                                    setPageSize(pageSize)
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
            <Modal
                onCancel={() => setDetailModal(false)}
                {...modalProps}
            >
                <div className='modalContainer'>
                    <div className="modalHeader">
                        <div className="title">申请 | 发布应用</div>
                        <div className="tag"></div>
                    </div>
                    <div className="modalBody">
                        <div className="bodyTitle">
                            <div className="applicationType">{`申请权限：${details?.application_type === 'normal' ? '个人空间' : details?.application_type === 'project' ? '项目空间' : details?.application_type === 'public' ? '广场' : null}`}</div>
                            <div className="applicationMan">{`申请人：${details?.applicant || '-'}`}</div>
                            <div className="applicationTime">{`申请时间：${new Date(details?.created_at).toLocaleString()}`}</div>
                        </div>
                        <div className="bodyText">
                            <div className="appName">{`应用名称：${details?.app_name}`}</div>
                            <div className="appType">{`应用类型：${details?.app_type}`}</div>
                            <div className="appDesc">{`应用描述：${details?.app_desc}`}</div>
                            <div className="appReason">{`申请原因：${details?.reason}`}</div>
                        </div>
                    </div>
                    <div className="modalFooter">
                        <div className="result">
                            <div style={{ marginRight: '10px' }}>审核结果:</div>
                            <Radio.Group onChange={onChange} value={value}>
                                <Radio value={'approved'}>通过</Radio>
                                <Radio value={'denied'}>不通过</Radio>
                            </Radio.Group>
                        </div>
                        {
                            value === 'denied' ? <div className="driction">
                                <TextArea rows={4} placeholder="请填写不通过的原因" maxLength={100} value={areaValue} onChange={(e: any) => { setAreaValue(e.target.value) }} />
                            </div> : null
                        }

                    </div>
                </div>
            </Modal>
        </ConfigProvider >
    )
}
export default ApplicationExamine;