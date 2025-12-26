'use client'

import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space, Card, Tooltip, message } from "antd";
import {
    SearchOutlined,
    ReloadOutlined,
    DownloadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import './App.css'; // 引入 CSS 文件
import LoadingPage from "./loadingPage";
import { queryAllBusiness, queryBusinessDetail } from "@/service/newCallNum";
interface DataType {
    key: string;
    name: string;
    project: string;
    interfaceId: string;
    queryScope: string;
    callCount: number;
    successCount: number;
    appType: string;
    publishTime: string;
}

const renderWithTooltip = (text: string) => (
    <Tooltip
        title={text}
        placement="topLeft"
        color="#ffffff" // tooltip 背景白色
        overlayInnerStyle={{
            backgroundColor: "#ffffff",
            color: "#1a1a1a",
            fontSize: 13,
            lineHeight: "20px",
            padding: "6px 10px",
            borderRadius: 6,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            maxWidth: 400,
        }}
    >
        <span
            style={{
                maxWidth: 260,
                display: "inline-block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                verticalAlign: "middle",
            }}
        >
            {text}
        </span>
    </Tooltip>
);

const data: DataType[] = Array.from({ length: 50 }).map((_, i) => ({
    key: String(i),
    name: `指挥调度数字员工-集成-up250${i}`,
    project: "指挥调度数字员工-集团",
    interfaceId: "00825374d0f342f98a7b1cdefghijklmnopqrst",
    queryScope: "发布起至今",
    callCount: 550,
    successCount: 456 + i,
    appType: "workflow",
    publishTime: `2025-09-${15 + i} 08:00:00`,
}));

const Dashboard: React.FC = (props) => {
    const { onShow, setSelectedRow, current, setCurrent, pageSize, setPageSize, searchValue, setSearchValue, sortOrder, setSortOrder, sortField, setSortField } = props as any;
    const [search, setSearch] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [dataValue, setDataValue] = useState(null);

    const [totalValue, setTotal] = useState(0);


    const getQueryBusinessDetail = async () => {
        setShowLoading(true)

        const result: any = await queryAllBusiness(searchValue, sortOrder || 'desc', sortField || 'create_time', current, pageSize);
        if (result.status + '' === '400') {
            message.error('请求失败，' + result.msg);
            setShowLoading(false)
            return;
        }
        if (result?.data) {
            setDataValue(result?.data?.data_list);
            setTotal(result?.data?.total || 0)
            setShowLoading(false)
        }
    }

    const columns: ColumnsType<DataType> = [
        {
            title: "名称",
            dataIndex: "app_name",
            key: "app_name",
            render: (text) => renderWithTooltip(text),
        },
        {
            title: "所属项目空间",
            dataIndex: "tenant_name",
            key: "tenant_name",
            render: (text) => renderWithTooltip(text),
        },
        {
            title: "接口ID",
            dataIndex: "business_type",
            key: "business_type",
            render: (text) => renderWithTooltip(text),
        },
        // {
        //     title: "查询范围",
        //     dataIndex: "queryScope",
        //     key: "queryScope",
        // },
        {
            title: <span style={{ whiteSpace: "nowrap" }}>调用次数</span>,
            dataIndex: "call_count",
            key: "call_count",
            sorter: true,
            sortOrder: sortField === 'call_count' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
            width: 160,
        },
        {
            title: <span style={{ whiteSpace: "nowrap" }}>成功调用次数</span>,
            dataIndex: "succeed_count",
            key: "succeed_count",
            sorter: true,
            sortOrder: sortField === 'succeed_count' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
            width: 180,
        },
        {
            title: "应用类型",
            dataIndex: "app_mode",
            key: "app_mode",
        },
        {
            title: "发布时间",
            dataIndex: "create_time",
            key: "create_time",
            sorter: true,
            sortOrder: sortField === 'create_time' ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
        },
        {
            title: "操作",
            key: "action",
            fixed: 'right',
            render: (text, record, index) => <a onClick={() => { onShow(); setSelectedRow(record) }} style={{ color: "#1677ff" }}>查看详情</a>,
        },
    ];

    useEffect(() => {
        getQueryBusinessDetail();
    }, [searchValue, current, pageSize, sortField, sortOrder]);

    return (
        <Card style={{ margin: 20 }}>
            {/* 顶部搜索栏 */}
            <Space
                style={{
                    marginBottom: 16,
                    width: "100%",
                    justifyContent: "space-between",
                }}
            >
                <Space>
                    {/* ✅ 新增标签“智能体名称” */}
                    <span
                        style={{
                            width: "80px",
                            height: "23px",
                            fontFamily: "Source Han Sans, Source Han Sans",
                            fontWeight: 400,
                            fontSize: "14px",
                            color: "#666666",
                            lineHeight: "23px",
                            textAlign: "left",
                            fontStyle: "normal",
                            textTransform: "none",
                        }}
                    >
                        智能体名称
                    </span>
                    <Input
                        placeholder="请输入名称/接口ID搜索"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: 300 }}
                    />
                    <Button style={{
                        // width: '106px',
                        height: '32px',
                        background: '#F1F3F7',     // 背景颜色
                        borderRadius: '8px',
                        border: 'none',
                        fontFamily: 'Source Han Sans, sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        color: '#47506B',          // 文字颜色
                        lineHeight: '23px',
                    }} type="primary" icon={<SearchOutlined />} value={search}
                        onClick={(e) => setSearchValue(search)}>
                        搜索
                    </Button>
                    <Button style={{
                        background: '#216EFF',       // 背景颜色
                        color: '#ffffff',            // 文字颜色
                        border: 'none',              // 去掉边框
                        height: '32px',              // 高度与搜索按钮统一
                        borderRadius: '8px',         // 圆角
                        fontFamily: 'Source Han Sans, sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '23px',
                        padding: '0 16px',           // 水平内边距
                    }} icon={<ReloadOutlined />} onClick={() => { setSearch(""); setSearchValue('') }} >重置</Button>
                </Space>
                {/* <Button type="primary" >
                    下载
                </Button> */}
            </Space>
            {
                showLoading ?
                    <div style={{ height: 'calc(100vh - 300px)', width: "100%" }}>
                        <LoadingPage />
                    </div>
                    :
                    <div style={{ width: "100%", height: 'calc(100vh - 300px)' }}>
                        <Table
                            // className="custom-text"
                            columns={columns}
                            dataSource={dataValue || []}
                            bordered
                            style={{ width: "100%" }} // ✅ 表格宽度充满Card
                            scroll={{ x: "max-content", y: "calc(100vh - 400px)" }} // ✅ 横向滚动 & 保留高度
                            onChange={(pagination, filters, sorter, extra) => { console.log(sorter, '--------------ddd'); setSortField(sorter?.field || ''); setSortOrder((sorter?.order && (sorter?.order === 'ascend' ? 'asc' : 'desc')) || ''); }}
                            pagination={{
                                pageSize: pageSize,
                                current: current,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                total: totalValue,
                                onChange: (page, pageSize) => {
                                    setPageSize(pageSize)
                                    setCurrent(page)
                                },
                                showTotal: (total, range) =>
                                    `共 ${total} 条记录，当前第 ${range[0]}-${range[1]} 条`,
                            }}
                        />
                    </div>
            }
        </Card>
    );
};

export default Dashboard;
