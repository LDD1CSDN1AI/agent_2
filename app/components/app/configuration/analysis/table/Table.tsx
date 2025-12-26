'use client';

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { DatePicker, Input, Dropdown, Button, Space, Table, Flex } from 'antd';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import type { MenuProps, TableColumnsType, TableProps } from 'antd';
import { Typography } from 'antd';
import { getAgent_log } from '@/service/apps';
import { message } from 'antd';
const { RangePicker } = DatePicker;

// 下拉菜单选项
const items: MenuProps['items'] = [
    { label: '第一个', key: '1' },
    { label: '第二个', key: '2' },
    { label: '第三个', key: '3' },
];

interface DataType {
    key: React.Key;
    title: string;
    user: string;
    messageCount: string;
    updateTime: string;
    createTime: string;
}

// 表格列配置
const columns: TableColumnsType<DataType> = [
    { title: '标题', dataIndex: 'title' },
    { title: '用户/账户', dataIndex: 'user' },
    { title: '消息数', dataIndex: 'num_message', },//sorter: (a, b) => a.messageCount - b.messageCount
    { title: '更新时间', dataIndex: 'update_time' },
    { title: '创建时间', dataIndex: 'create_time' },
];

// 生成表格数据
const generateData = () => Array.from<DataType>({ length: 30 }).map<DataType>((_, i) => ({
    key: i,
    title: `消息标题 ${i + 1}`,
    user: `用户 ${i + 1}`,
    messageCount: Math.floor(Math.random() * 100),
    updateTime: `2024-03-06 12:${i % 60}`,
    createTime: `2024-03-05 10:${i % 60}`,
}));





function TableAnalysis() {
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedText, setSelectedText] = useState<string>(''); // 默认选中第一项
    const [rangeTime, setRangeTime] = useState<any>(null); // 选择的时间范围
    const [searchText, setSearchText] = useState<string>(''); // 输入框内容
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]); // 选中的表格行
    const [tableData, setTableData] = useState<DataType[]>(generateData); // 表格数据

    useEffect(() => {
        setSelectedText(items[0].label as string);
        getAgentlogList()

    }, []);

    // 处理查询按钮点击
    const handleQuery = () => {
        console.log("选择的时间范围: ", rangeTime);
        console.log("输入框内容: ", searchText);
        console.log("下拉框选中的项: ", selectedText);

        // 可以在这里调用后端 API，使用查询条件获取新数据
        setTableData(generateData()); // 这里只是重新生成数据，模拟查询
    };
    const [listData, setListData] = useState([])
    // 处理表格多选
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const getAgentlogList = async (current?: any, pageSize?: any) => {
        try {
            // 获取当前 URL 路径
            const path = window.location.pathname;

            // 使用正则表达式提取 app 和 configuration 之间的 app_id
            const match = path.match(/\/app\/([^/]+)\/configuration/);
            const appId = match ? match[1] : "";

            if (!appId) {
                message.error('未找到 app_id');
                return;
            }
            const response: any = await getAgent_log({
                url: '/agent_log',
                body: {
                    app_id: appId
                }
            })

            const result = await response
            if (result.status === "successful") {
                console.log("response.conversation_list", response.conversation_list)
                setListData(response.conversation_list)
                // const timer = setTimeout(() => {
                // setListData(response.kb_file_list)
                // }, 0)
            } else {
                message.error('查询日志数据失败')
                // localStorage.setItem('console_token', '')
            }
        } catch (error) {
            message.error('请求失败，请检查网络或稍后重试')
            console.error('请求错误:', error)

        }
    }




    // 批量操作
    const start = () => {
        setLoading(true);
        setTimeout(() => {
            setSelectedRowKeys([]);
            setLoading(false);
        }, 0);
    };

    const rowSelection: TableProps<DataType>['rowSelection'] = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const { Text, Link } = Typography;

    return (
        <div style={{ padding: '20px', height: 'calc(100vh - 220px)', overflow: 'hidden' }}>
            {/* 顶部描述 */}
            <Text>日志记录了应用的运行情况，包括用户的输入和 AI 的回复</Text>
            {/* 查询条件 */}
            <Space
                direction="horizontal"
                size={12}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'nowrap' }}
            >
                {/* 时间选择器 */}
                {/* <RangePicker
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    placeholder={['开始时间', '结束时间']}
                    onChange={(value, dateString) => setRangeTime(dateString)}
                /> */}

                {/* 输入框 */}
                <Input
                    placeholder="查询内容"
                    style={{ width: 200 }}
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />

                {/* 下拉按钮 */}
                {/* <Dropdown.Button
                    icon={<DownOutlined />}
                    menu={{ items, onClick: (e) => setSelectedText(items.find(item => item.key === e.key)?.label || '') }}
                >
                    {selectedText}
                </Dropdown.Button> */}

                {/* 🔍 查询按钮 */}
                <Button type="primary" icon={<SearchOutlined />} onClick={handleQuery}>
                    查询
                </Button>
            </Space>

            {/* 表格 */}
            <div style={{ marginTop: 20, height: 'calc(100% - 120px)' }}>
                <div>
                    {/* <Button type="primary" onClick={start} disabled={selectedRowKeys.length === 0} loading={loading}>
                        批量操作
                    </Button> */}
                    {selectedRowKeys.length > 0 ? `已选择 ${selectedRowKeys.length} 项` : null}
                </div>

                <Table<DataType>
                    rowSelection={rowSelection}
                    columns={columns}
                    scroll={{ y: 400 }}
                    dataSource={listData}
                    pagination={false}
                />
            </div>
        </div>
    );
}

export default TableAnalysis;
