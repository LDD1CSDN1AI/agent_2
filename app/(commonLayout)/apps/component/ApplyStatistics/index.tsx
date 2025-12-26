import GlobalUrl from '@/GlobalUrl';
import { getApplyStatisticsList, getWeeklyStatisticsList } from '@/service/apps';
import { Button, Form, Input, message, Space, Table, DatePicker, Flex } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'

type Props = {}
type LayoutType = Parameters<typeof Form>[0]['layout'];

const ApplyStatistics: React.FC<Props> = (props) => {
    const [form] = Form.useForm();
    const [activeTable, setActiveTable] = useState<'application' | 'weekly'>('application');
    const [appSortField, setAppSortField] = useState<string>('');
    const [appSortOrder, setAppSortOrder] = useState<string>('');
    const [weeklySortField, setWeeklySortField] = useState<string>('');
    const [weeklySortOrder, setWeeklySortOrder] = useState<string>('');

    useEffect(() => {
        (
            async () => {
                getTableList(0, 10);
                getWeeklyTableList(0, 10);
            }
        )()
    }, [])

    const getTableList = async (current1?: any, pageSize1?: any, sortField?: string, sortOrder?: string) => {
        current1 ? setCurrent(current1) : '';
        pageSize1 ? setPageSize(pageSize1) : '';

        const url = `/getApplicationsStatistics`;
        try {
            const response: any = await getApplyStatisticsList({
                url: url,
                body: {}
            });

            const result = await response;
            if (result.code === 200) {
                await setDataSource(result);
            } else {
                message.error('查询失败');
            }
        } catch (error) {
            message.error('请求失败，请检查网络或稍后重试');
            console.error('请求错误:', error);
        }
    };

    const getWeeklyTableList = async (current1?: any, pageSize1?: any, sortField?: string, sortOrder?: string) => {
        current1 ? setWeeklyCurrent(current1) : '';
        pageSize1 ? setWeeklyPageSize(pageSize1) : '';



        const url = `/getWeeklyReport`;
        try {
            const response: any = await getWeeklyStatisticsList({
                url: url,
                body: {}
            });

            const result = await response;
            if (result.code === 200) {
                setWeeklyDataSource(result);
            } else {
                message.error('每周数据查询失败');
            }
        } catch (error) {
            message.error('每周数据请求失败，请检查网络或稍后重试');
            console.error('每周数据请求错误:', error);
        }
    };

    const [dataSource, setDataSource] = useState([]);
    const [weeklyDataSource, setWeeklyDataSource] = useState([]);
    const [current, setCurrent] = useState(1);
    const [weeklyCurrent, setWeeklyCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [weeklyPageSize, setWeeklyPageSize] = useState(10);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [searchName, setSearchName] = useState('');

    const handleAppTableChange = (pagination: any, filters: any, sorter: any) => {
        if (sorter.field === 'agent_count' || sorter.field === 'workflow_count') {
            setAppSortField(sorter.field);
            setAppSortOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
            getTableList(pagination.current, pagination.pageSize, sorter.field, sorter.order === 'ascend' ? 'asc' : 'desc');
        } else {
            getTableList(pagination.current, pagination.pageSize);
        }
    };

    const handleWeeklyTableChange = (pagination: any, filters: any, sorter: any) => {
        if (sorter.field === 'weekly_logins') {
            setWeeklySortField(sorter.field);
            setWeeklySortOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
            getWeeklyTableList(pagination.current, pagination.pageSize, sorter.field, sorter.order === 'ascend' ? 'asc' : 'desc');
        } else {
            getWeeklyTableList(pagination.current, pagination.pageSize);
        }
    };

    const applicationColumns = [
        {
            title: '部门/省公司',
            dataIndex: 'department',
            key: 'department',
            width: '80px'
        },
        {
            title: '智能体数量',
            dataIndex: 'agent_count',
            width: '100px',
            key: 'agent_count',
            // sorter: true,
            // sortOrder: appSortField === 'agent_count' ? appSortOrder : null
        },
        {
            title: '工作流数量',
            dataIndex: 'workflow_count',
            width: '100px',
            key: 'workflow_count',
            // sorter: true,
            // sortOrder: appSortField === 'workflow_count' ? appSortOrder : null
        },
        {
            title: '智能体名称',
            dataIndex: 'agents',
            width: '100px',
            key: 'agents',
            render: (_, record) => record.agents?.map(item => item.name)?.join(',')
        }
    ];

    const weeklyColumns = [
        // {
        //     title: 'ID',
        //     dataIndex: 'id',
        //     width: '60px',
        //     key: 'id'
        // },
        {
            title: '租户',
            dataIndex: 'department',
            key: 'department',
            width: '120px'
        },
        {
            title: '本周登录人次',
            dataIndex: 'user_count_last_7d',
            width: '120px',
            key: 'user_count_last_7d',
            // sorter: true,
            // sortOrder: weeklySortField === 'user_count_last_7d' ? weeklySortOrder : null
        }
    ];

    const clearParam = () => {
        setSearchName('');
        setStartTime('');
        setEndTime('');
    };
    return (
        <>
            <div className='mt-[24px]'>
                <div className='flex flex-col bg-[#fff] rounded-[8px] px-[24px] pt-[24px]' style={{ height: 'calc(100vh - 138px)' }}>
                    <div className="mb-4">
                        <Flex justify={'space-between'}>
                            <Space>
                                <Button
                                    type={activeTable === 'application' ? 'primary' : 'default'}
                                    onClick={() => setActiveTable('application')}
                                >
                                    应用数量统计
                                </Button>
                                <Button
                                    type={activeTable === 'weekly' ? 'primary' : 'default'}
                                    onClick={() => setActiveTable('weekly')}
                                >
                                    每周运营管理统计
                                </Button>
                            </Space>

                            <div>
                                <Space>
                                    <span>工作流总数： {dataSource?.totals?.workflow_total}</span>
                                    <span>智能体总数： {dataSource?.totals?.agent_chat_total}</span>
                                </Space>
                            </div>
                        </Flex>
                    </div >
                    <div>
                        <Form
                            layout={'inline'}
                            form={form}
                            onValuesChange={() => console.log('我调用了')}
                        >
                        </Form>
                        <div style={{ marginTop: '16px' }}>
                            {activeTable === 'application' ? (
                                <Table
                                    columns={applicationColumns}
                                    dataSource={dataSource["stats"]}
                                    scroll={{ x: 'max-content', y: 600 }}
                                    rowKey={(record) => record?.department || ''}
                                    onChange={handleAppTableChange}
                                // pagination={{
                                //     current: current,
                                //     pageSize: pageSize,
                                //     total: (dataSource?.agent_chat_total || 0) + (dataSource?.workflow_total || 0),
                                //     showSizeChanger: false,
                                //     showQuickJumper: true,
                                // }}
                                />
                            ) : (
                                <Table
                                    columns={weeklyColumns}
                                    dataSource={weeklyDataSource?.by_department}
                                    scroll={{ x: 'max-content', y: 600 }}
                                    rowKey={(record) => record.id}
                                    onChange={handleWeeklyTableChange}
                                // pagination={{
                                //     current: weeklyCurrent,
                                //     pageSize: weeklyPageSize,
                                //     total: (weeklyDataSource?.total),
                                //     showSizeChanger: false,
                                //     showQuickJumper: true,
                                // }}
                                />
                            )}
                        </div>
                    </div>
                </div >
            </div >
        </>
    )
}

export default ApplyStatistics;
