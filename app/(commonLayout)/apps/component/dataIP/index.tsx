import GlobalUrl from '@/GlobalUrl';
import { getDataIPList } from '@/service/apps';
import { Button, Form, Input, message, Space, Table, DatePicker } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'

type Props = {
}
type LayoutType = Parameters<typeof Form>[0]['layout'];

const DataIP: React.FC<Props> = (props) => {

    const [form] = Form.useForm();

    useEffect(() => {
        (
            async () => {
                getTableList(0, 10)
            }
        )()
    }, [])

    const getTableList = async (current1?: any, pageSize1?: any) => {
        current1 ? setCurrent(current1) : '';
        pageSize1 ? setPageSize(pageSize1) : '';

        const currentValue = current1 || current
        const pageSizeValue = pageSize1 || pageSize
        const param = {
            page: currentValue,
            page_size: pageSizeValue,
            client_ip: searchName,
            start_time: startTime,
            end_time: endTime
        }
        console.log(param, '-----------------aaaa')
        const url = GlobalUrl.defaultUrlIp + `/interface/api/inter_call_info?page=${param.page}&page_size=${param.page_size}&client_ip=${param.client_ip}&start_time=${param.start_time}&end_time=${param.end_time}`
        try {
            const response: any = await getDataIPList({
                // url: '/es_query',
                url: url,
                param: {
                    ...param
                }
            })


            const result = await response
            if (result.code === 200) {
                const timer = setTimeout(() => {
                    setDataSource(result)
                }, 0)
            } else {
                message.error('查询失败')
                // localStorage.setItem('console_token', '')
            }
        } catch (error) {
            message.error('请求失败，请检查网络或稍后重试')
            console.error('请求错误:', error)

        }
    }

    const [dataSource, setDataSource] = useState();
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [searchName, setSearchName] = useState('');

    const format = 'YYYY-MM-DD HH:mm:ss';

    const columns = [{
        title: 'ID',
        dataIndex: 'id',
        width: '60px',
        key: 'id'
    }, {
        title: '调用方（IP）',
        dataIndex: 'client_ip',
        key: 'client_ip',
        width: '80px'
    }, {
        title: '时间',
        dataIndex: 'create_time', //"create_time"
        width: '100px',
        key: 'create_time'
    }
    ];

    const handleTableChang = (page: any, pageSize: any) => {
        getTableList(page, pageSize)
    }

    const clearParam = () => {
        setSearchName('');
        setStartTime('');
        setEndTime('');
    }

    return (
        <>
            <div className='mt-[24px]'>
                <div style={{ justifyContent: 'space-between', fontWeight: '700', backgroundColor: 'white', padding: '16px 16px', marginBottom: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center' }} className='text-[#1C2748] text-[20px] mb-[16px]'>IP数据</div>
                <div className='flex flex-col bg-[#fff] rounded-[8px] px-[24px] pt-[24px]' style={{ height: 'calc(100vh - 138px)' }}>
                    <div>
                        <Form
                            layout={'inline'}
                            form={form}
                            onValuesChange={() => console.log('我调用了')}
                        >
                            <Form.Item label="IP">
                                <Input value={searchName} placeholder="IP" onChange={(e) => setSearchName(e.target.value)} />
                            </Form.Item>
                            <Form.Item label="时间">
                                <DatePicker.RangePicker
                                    showTime={{ format: 'HH:mm:ss' }}
                                    format={format}
                                    value={startTime && endTime ? [dayjs(startTime), dayjs(endTime)] : undefined}
                                    onChange={(value, dateString) => {
                                        console.log('Selected Time: ', value);
                                        console.log('Formatted Selected Time: ', dateString);
                                        dateString?.[0] && setStartTime(dateString?.[0])
                                        dateString?.[1] && setEndTime(dateString?.[1])
                                    }}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Space>
                                    <Button onClick={() => clearParam()} type="primary">重置</Button>
                                    <Button onClick={() => getTableList(0, 10)} type="primary">搜索</Button>
                                </Space>
                            </Form.Item>
                        </Form>
                        <div style={{ marginTop: '16px' }}>
                            <Table
                                columns={columns}
                                dataSource={dataSource?.data}
                                scroll={{ x: 'max-content', y: 600 }}
                                rowKey={(record) => record.id}
                                pagination={{
                                    current: current, // 当前页数
                                    pageSize: pageSize, // 每页显示条数
                                    total: dataSource?.total, // 数据总数
                                    showSizeChanger: false, // 是否显示可以改变 pageSize 的选项
                                    // pageSizeOptions: ['10', '20', '30', '40', '50', '60', '70', '80', '90'], // 指定每页可以显示多少条
                                    showQuickJumper: true, // 是否显示快速跳转的选项
                                    onChange: handleTableChang,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DataIP;