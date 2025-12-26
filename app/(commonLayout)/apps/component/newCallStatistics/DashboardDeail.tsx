'use client'

import React, { useState, useEffect } from "react";
import { Card, Table, Row, Col, Button, Space, Tooltip, message } from "antd";
import { DatabaseOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import ReactECharts from "echarts-for-react";
import addArrow from '@/public/image/add_arrow.png'
import declineArrow from '@/public/image/decline_arrow.png'
import callAgent from '@/public/image/call-agent.png'
import callTalk from '@/public/image/call-talk.png'
import callNum from '@/public/image/call-num.png'
import callSuccessNum from '@/public/image/call-success-num.png'
import callWorkflow from '@/public/image/call-workflow.png'
import callNew from '@/public/bg/call_new.png'

import './DashboardDeail.scss'

import Image from 'next/image'
import { queryBusinessDetail } from "@/service/newCallNum";
import { object } from "zod";

// const interfaceDataBasic = [
//     { key: "1", label: "智能体名称", value: "指挥调度数字员工 20250721152033" },
//     { key: "2", label: "智能体描述", value: "指挥调度数字员工" },
//     { key: "3", label: "智能体ID", value: "02e4cc35c841437ea52d4856b73d52c8" },
//     { key: "4", label: "所属类别", value: "workflow" },
//     { key: "5", label: "工作空间", value: "指挥调度" },
// ];

// const interfaceDataPublish = [
//     { key: "6", label: "是否公开", value: "是" },
//     { key: "7", label: "所属用户", value: "2025-07-22 04:36" },
//     { key: "8", label: "单位", value: "中国电信河南分公司" },
//     { key: "9", label: "发布时间", value: "2025-07-22 04:36:10" },
// ];
// label列样式
const labelStyle: React.CSSProperties = {
    width: 71,
    height: 22,
    fontFamily: "Source Han Sans, Source Han Sans",
    fontWeight: 550,
    fontSize: 14,
    color: "#333333",
    lineHeight: "22px",
    textAlign: "left",
    fontStyle: "normal",
    textTransform: "none",
};

// value 列样式
const valueStyle: React.CSSProperties = {
    width: 134,
    height: 22,
    fontFamily: "Source Han Sans, Source Han Sans",
    fontWeight: 400,
    fontSize: 14,
    color: "#666666",
    lineHeight: "22px",
    textAlign: "left",
    fontStyle: "normal",
    textTransform: "none",
};

// 表格列定义 —— 左列整体背景灰色
const columns: ColumnsType<{ label: string; value: string }> = [
    {
        title: "字段",
        dataIndex: "label",
        key: "label",
        width: "40%",
        align: "center", // 水平居中
        onCell: () => ({
            style: {
                backgroundColor: "#f8f9fa",
                fontWeight: 500,
                // padding: "6px 8px",
                ...labelStyle,
            },
        }),
    },
    {
        title: "值",
        dataIndex: "value",
        key: "value",
        onCell: () => ({
            style: {
                backgroundColor: "white",
                padding: "6px 8px",
                ...valueStyle,
            },
        }),
    },
];

const chartData = {
    dates: ["9-1", "9-2", "9-3", "9-4", "9-5"],
    total: [120, 200, 180, 300, 220],
    success: [80, 160, 120, 250, 170],
};
const getButtonStyle = (range: string) => {
    const isSelected = selectedRange === range;
    return {
        backgroundColor: isSelected ? "#d7e4fc" : "#fff",
        borderColor: isSelected ? "#6da0fe" : "#d9d9d9",
        color: isSelected ? "#6da0fe" : "#1c1c1c",
        fontWeight: isSelected ? 600 : 400,
    };
};

type DashboardDeailProps = {
    onClose: () => void
    selectedRow: any
    chartData: any
}

const DashboardDeail: React.FC<DashboardDeailProps> = (DashboardDeailProps) => {
    const { onClose, selectedRow } = DashboardDeailProps;
    const [range, setRange] = useState("7");
    const [resultData, setResultData] = useState("");
    const [chartDataMap, setChartDataMap] = useState('');
    const [currentChartData, setCurrentChartData] = useState(null);
    const [interfaceDataBasic, setInterfaceDataBasic] = useState('');
    const [interfaceDataPublish, setInterfaceDataPublish] = useState('');
    const [business_count, setBusiness_count] = useState('');


    useEffect(() => {
        chartDataMap && setCurrentChartData(chartDataMap as any)
        chartDataMap && handleRangeChange('7');
    }, [chartDataMap]);

    const handleResultData = (data: any) => {
        const { business_info, business_count } = data;
        const interfaceDataBasic = [
            { key: "1", label: "智能体名称", value: business_info?.name },
            { key: "2", label: "智能体描述", value: business_info?.description },
            { key: "3", label: "智能体ID", value: business_info?.business_type },
            { key: "4", label: "所属类别", value: business_info?.type },
            { key: "5", label: "工作空间", value: business_info?.workspace },
        ];

        const interfaceDataPublish = [
            { key: "6", label: "是否公开", value: business_info?.is_open },
            { key: "7", label: "所属用户", value: business_info?.creator },
            { key: "8", label: "单位", value: business_info?.company },
            { key: "9", label: "发布时间", value: business_info?.create_time },
        ];
        setInterfaceDataBasic(interfaceDataBasic as any)
        setInterfaceDataPublish(interfaceDataPublish as any);
        setBusiness_count(business_count as any);
    }

    const getQueryBusinessDetail = async () => {
        const result = await queryBusinessDetail(selectedRow?.business_type);
        if (result.status + '' === '400') {
            message.error('请求失败，' + result.msg);
            return;
        }
        if (result?.data) {
            console.log(result?.data);
            setResultData(result?.data);
            handleResultData(result?.data);
            let dataValue = {
                '7': { dates: [], total: [], success: [] },
                '30': { dates: [], total: [], success: [] },
                '365': { dates: [], total: [], success: [] },
                'now': { dates: [], total: [], success: [] }
            }
            const { business_call_chart } = result.data;
            Object.keys(business_call_chart?.seven_days_count)?.map((key) => {
                dataValue['7'].dates.push(key);
                dataValue['7'].total.push(business_call_chart?.seven_days_count?.[key] || 0);
            })
            Object.keys(business_call_chart?.seven_days_succeed)?.map((key) => {
                dataValue['7'].success.push(business_call_chart?.seven_days_succeed?.[key] || 0);

            })

            Object.keys(business_call_chart?.thirty_days_count)?.map((key) => {
                dataValue['30'].dates.push(key);
                dataValue['30'].total.push(business_call_chart?.thirty_days_count?.[key] || 0);
            })
            Object.keys(business_call_chart?.thirty_days_succeed)?.map((key) => {
                dataValue['30'].success.push(business_call_chart?.thirty_days_succeed?.[key] || 0);

            })

            Object.keys(business_call_chart?.one_year_count)?.map((key) => {
                dataValue['365'].dates.push(key);
                dataValue['365'].total.push(business_call_chart?.one_year_count?.[key] || 0);
            })
            Object.keys(business_call_chart?.one_year_succeed)?.map((key) => {
                dataValue['365'].success.push(business_call_chart?.one_year_succeed?.[key] || 0);

            })

            Object.keys(business_call_chart?.since_release_count)?.map((key) => {
                dataValue['now'].dates.push(key);
                dataValue['now'].total.push(business_call_chart?.since_release_count?.[key] || 0);
            })
            Object.keys(business_call_chart?.since_release_succeed)?.map((key) => {
                dataValue['now'].success.push(business_call_chart?.since_release_succeed?.[key] || 0);

            })
            setChartDataMap(dataValue as any);
        }
    }
    useEffect(() => {
        const bodyStyle = window.getComputedStyle(document.body);
        console.log('body overflowY =', bodyStyle.overflowY);
        // 保证页面纵向滚动
        const timer = setInterval(() => {
            document.body.style.overflowY = 'auto'
        }, 500)
        getQueryBusinessDetail();
        return () => clearInterval(timer)
    }, []);
    // 不同时间范围的数据
    // const chartDataMap: Record<string, typeof chartData> = {
    //     "7": {
    //         dates: ["10-4", "10-5", "10-6", "10-7", "10-8", "10-9", "10-10"],
    //         total: [50, 60, 70, 65, 80, 90, 100],
    //         success: [40, 55, 60, 50, 70, 80, 90]
    //     },
    //     "30": (() => {
    //         const total = Array.from({ length: 30 }, () => Math.floor(Math.random() * 200) + 50);
    //         const success = total.map(t => Math.floor(Math.random() * t));
    //         return { dates: Array.from({ length: 30 }, (_, i) => `10-${i + 1}`), total, success };
    //     })(),
    //     "365": {
    //         dates: ["2024", "2025"],
    //         total: [4000, 5200],
    //         success: [3200, 4100]
    //     },
    //     "now": {
    //         dates: ["2025", "2026"],
    //         total: [5000, 6000],
    //         success: [4200, 5100]
    //     }
    // };

    // 点击按钮更新数据
    const handleRangeChange = (newRange: string) => {
        setRange(newRange);
        setCurrentChartData(chartDataMap[newRange]);
    };
    const option = {
        tooltip: {
            trigger: "axis",
            formatter: (params: any[]) => {
                // 按固定顺序显示：调用量 -> 成功调用量
                const order = ["调用量", "成功调用量"];
                const sorted = order.map(name => params.find(p => p.seriesName === name)).filter(Boolean);

                return sorted
                    .map(p => {
                        // 确保使用 series 颜色
                        let color = "";
                        if (p!.seriesName === "调用量") color = "#009EFF";
                        if (p!.seriesName === "成功调用量") color = "#5869F3";

                        // 手动生成 marker
                        const marker = `<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${color};"></span>`;
                        return `${marker} ${p!.seriesName}: ${p!.value}`;
                    })
                    .join("<br/>");
            },
        },

        legend: {
            top: 10,
            left: 'center',
            icon: 'rect',          // ✅ 方块图标
            itemWidth: 8,         // ✅ 方块宽度
            itemHeight: 8,        // ✅ 方块高度
            textStyle: {
                color: '#1C2748',    // 文字颜色保持不变
                fontSize: 14,
                fontFamily: 'Source Han Sans, Source Han Sans',
                fontWeight: 400,
            },
            itemGap: 30,
            data: [

                {
                    name: '调用量',
                    itemStyle: {
                        color: '#009EFF', // ✅ 方块背景颜色
                    },
                },
                {
                    name: '成功调用量',
                    itemStyle: {
                        color: '#5869F3', // ✅ 方块背景颜色
                    },
                },
            ],

        },
        grid: { left: "3%", right: "4%", bottom: "10%", containLabel: true },
        xAxis: {
            type: "category",
            boundaryGap: false,
            data: currentChartData?.dates,
            axisLine: {
                lineStyle: { color: "#ccc" }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: "rgba(0, 0, 0, 0.1)",
                    width: 2,
                    type: "solid" // 实线6px + 间隔6px
                }
            },
            axisLabel: {
                width: 22,                         // 新增
                height: 21,                        // 新增
                fontFamily: "Source Han Sans, Source Han Sans", // 新增
                fontWeight: 400,                   // 新增
                fontSize: 11,                      // 新增
                color: "#666666",                  // 新增
                lineHeight: 18,                    // 新增
                textAlign: "right",                // 新增
                fontStyle: "normal",               // 新增
                textTransform: "none"              // 新增
            },
        },
        yAxis: {
            type: "value",
            axisLine: {
                lineStyle: { color: "#ccc" }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: "rgba(0, 0, 0, 0.1)",
                    width: 2,
                    type: [6, 6]
                }
            },
            axisLabel: {
                width: 22,
                height: 21,
                fontFamily: "Source Han Sans, Source Han Sans",
                fontWeight: 400,
                fontSize: 11,
                color: "#666666",
                lineHeight: 18,
                textAlign: "right",
                fontStyle: "normal",
                textTransform: "none"
            },
        },


        series: [


            {
                name: "调用量",
                type: "line",
                smooth: true,
                symbol: "none",
                symbolSize: 8,
                lineStyle: {
                    color: "#51bcff",
                    width: 2,
                    shadowBlur: 10,               // 减小模糊，使阴影更清晰
                    shadowColor: "rgba(100,196,255,0.9)", // 提高透明度
                    shadowOffsetY: 15,            // 阴影往下移动更明显
                    shadowOffsetX: 0,
                },
                areaStyle: {
                    // color: "rgba(74,144,226,0.01)", // 保留极低透明度，避免遮挡阴影
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(100,196,255,0.1)' },
                            { offset: 1, color: 'rgba(100,196,255,0.03)' },
                        ],
                    },
                },
                data: currentChartData?.total,
            },
            {
                name: "成功调用量",
                type: "line",
                smooth: true,
                symbol: "none",
                symbolSize: 8,
                lineStyle: {
                    color: "#9ca7f8",
                    width: 2,
                    shadowBlur: 10,
                    shadowColor: "rgba(156,167,248,0.9)",
                    shadowOffsetY: 15,
                    shadowOffsetX: 0,
                },
                areaStyle: {
                    // color: "rgba(155,89,182,0.01)",
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 0.5,
                        colorStops: [
                            { offset: 0, color: 'rgba(156,167,248,0.2)' },
                            { offset: 1, color: 'rgba(156,167,248,0.05)' },
                        ],
                    },
                },
                data: currentChartData?.success,
            },
        ],
    };


    const contentNum = (obj: { name: string, type: string, allNum: any, changeData: any, showDash?: boolean }) => {
        const { name, type, allNum, changeData, showDash = true } = obj;

        const getImage = () => {
            switch (name) {
                case '智能体':
                    return callAgent;
                case '工作流':
                    return callWorkflow;
                case '对话流':
                    return callTalk;
                case '总调用量':
                    return callNum;
                case '总成功调用量':
                    return callSuccessNum;
                default:
                    return callAgent;
            }
        }

        const getTipStr = () => {
            switch (name) {
                case '总调用量':
                    return '所有应用的总调用量，本月新增指当前月1日 00:00:00 到此刻的增长量';
                case '总成功调用量':
                    return '所有应用的总成功调用量，本月新增指当前月1日 00:00:00 到此刻的增长量';
                default:
                    return '所有注册接口总数量，本月新增指当前月1日 00:00:00 到此刻的增长量';
            }
        }

        const tipNameArray = ['总调用量', '总成功调用量']
        return <div className={`contentNum ${showDash ? 'show-dashed' : ''}`}>
            {
                name === '总注册接口数' ?
                    <div style={{ visibility: name ? 'visible' : 'hidden', minWidth: '160px', maxWidth: '200px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '16px 16px 0 16px' }}>
                        <Tooltip title={<span style={{ color: 'black' }}>{getTipStr()}</span>} color={'white'}>
                            <div style={{ height: '20px', width: '60px', position: 'relative', left: '54%' }}></div>
                        </Tooltip>
                    </div>
                    :
                    <div style={{ visibility: name ? 'visible' : 'hidden', minWidth: '160px', maxWidth: '200px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: '16px 16px 0 16px' }}>
                        <span>{name}
                            {
                                tipNameArray.includes(name) &&
                                <Tooltip title={<span style={{ color: 'black' }}>{getTipStr()}</span>} color={'white'}>
                                    <ExclamationCircleOutlined />
                                </Tooltip>
                            }
                        </span>
                        <Image src={getImage()} alt='img' />
                    </div>
            }

            <div className="TotalInterfaces">
                <div style={{ height: '20px' }}><span style={{ color: '#1C2748', fontSize: '32px', fontWeight: '700', fontFamily: 'D-DIN-Bold' }}>{allNum}</span>个</div>
                <div style={{ height: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', marginTop: '32px' }}>
                        <span style={{ wordBreak: 'break-all', whiteSpace: 'nowrap' }}>本月趋势</span>
                        <div style={{ display: 'flex', flexDirection: 'row', margin: '0 0 0 16px', fontFamily: 'Source Han Sans-Bold', fontWeight: '700', color: type === 'add' ? '#14BA70' : '#FF6969 ' }}>
                            <Image src={type === 'add' ? addArrow : declineArrow} alt='img' style={{ marginTop: '2px' }} />
                            {changeData}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

    console.log(resultData, 'resultData---------------------aaa');
    return (
        <div
            className="DashboardDeail"
            style={{
                width: "100%",
                minHeight: "100vh",
                padding: "24px",            // 左右顶部底部边距
                boxSizing: "border-box",
                background: "#f5f6fa",
                overflowY: "auto",          // 强制纵向滚动
            }}
        >
            <div style={{ width: '100%', margin: "0 auto" }}>

                <div
                    style={{
                        backgroundColor: "#ffffff", // 白色背景
                        padding: 24,
                        borderRadius: 12,           // 可选圆角
                        boxSizing: "border-box",
                    }}
                >
                    {/* 上方三个纵向 label */}
                    <div style={{ display: "flex", flexDirection: "column", marginBottom: 16, gap: 4 }}>
                        {/* 返回 */}
                        <label
                            onClick={() => onClose()}
                            style={{
                                height: 22,
                                fontFamily: "Source Han Sans, Source Han Sans",
                                fontWeight: 400,
                                fontSize: 14,
                                color: "#1C2748",
                                lineHeight: "22px",
                                textAlign: "left",
                                fontStyle: "normal",
                                textTransform: "none",
                                cursor: "pointer",
                                whiteSpace: "nowrap", // 禁止换行
                                marginBottom: 16, // 与上边距一致
                            }}
                        >
                            {"<  返回"}
                        </label>

                        {/* 主标题 */}
                        <label
                            style={{
                                width: 260,
                                height: 22,
                                fontFamily: "Source Han Sans, Source Han Sans",
                                fontWeight: 550,
                                fontSize: 14,
                                color: "#1C2748",
                                lineHeight: "22px",
                                textAlign: "left",
                                fontStyle: "normal",
                                textTransform: "none",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                marginBottom: 16, // 与上边距一致
                            }}
                            title={`${resultData?.business_info?.name}(接口ID:${resultData?.business_info?.business_type})`}
                        >
                            {resultData?.business_info?.name}(接口ID:{resultData?.business_info?.business_type})
                        </label>

                        {/* 接口信息 */}
                        <label
                            style={{
                                width: 64,
                                height: 22,
                                fontFamily: "Source Han Sans, Source Han Sans",
                                fontWeight: 550,
                                fontSize: 14,
                                color: "#1C2748",
                                lineHeight: "22px",
                                textAlign: "left",
                                fontStyle: "normal",
                                textTransform: "none",
                            }}
                        >
                            接口信息
                        </label>
                    </div>

                    {/* 左右表格容器 */}
                    <Row gutter={0}>
                        {/* 左表格 */}
                        <Col xs={24} md={12} style={{ padding: 0 }}>
                            <Card
                                style={{
                                    margin: 0,
                                    borderRight: "none",
                                    borderRadius: 0,
                                }}
                                bodyStyle={{ padding: 0 }}
                            >
                                <Table
                                    columns={columns}
                                    dataSource={interfaceDataBasic}
                                    bordered={true}
                                    pagination={false}
                                    showHeader={false}
                                />
                            </Card>
                        </Col>

                        {/* 右表格 */}
                        <Col xs={24} md={12} style={{ padding: 0 }}>
                            <Card
                                style={{
                                    margin: 0,
                                    borderRadius: 0,
                                }}
                                bodyStyle={{ padding: 0 }}
                            >
                                <Table
                                    columns={columns}
                                    dataSource={interfaceDataPublish}
                                    // bordered={false}
                                    pagination={false}
                                    showHeader={false}
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>

                {/* 调用量统计 + 调用量趋势容器 */}
                <Card
                    style={{
                        borderRadius: 12,
                        marginTop: 24,       // 与上方 div 保持间距
                        backgroundColor: "#ffffff", // 白色背景

                    }}
                >
                    {/* 调用量统计标题 */}
                    <div
                        style={{
                            fontSize: 14,
                            fontWeight: 550,
                            color: "#1C2748",
                            lineHeight: "22px",
                            fontFamily: "Source Han Sans, Source Han Sans",
                            marginBottom: 16,
                            paddingLeft: 0,
                        }}
                    >
                        调用量统计
                    </div>

                    {/* 调用量统计 */}
                    <div style={{ padding: '12px' }} className="div-css info-part-two">
                        <div className="info-part-modal part-5">
                            {contentNum({ name: '总调用量', type: 'add', allNum: business_count?.total_call, changeData: business_count?.total_call_current, showDash: false })}
                        </div>
                        <div className="info-part-modal part-6">
                            {contentNum({ name: '总成功调用量', type: 'add', allNum: business_count?.total_call_succeed, changeData: business_count?.total_call_succeed_current })}
                        </div>
                    </div>

                    {/* <Row gutter={16} style={{ marginBottom: 24 }}>
                        <Col span={12}>
                            <Card style={{ borderRadius: 12 }}>
                                <Row align="middle">
                                    <Col flex="40px">
                                        <div
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: "50%",
                                                background: "#4A90E2",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <DatabaseOutlined style={{ color: "#fff", fontSize: 20 }} />
                                        </div>
                                    </Col>
                                    <Col flex="auto" style={{ paddingLeft: 16 }}>
                                        <div style={{ fontSize: 14, color: "#666" }}>总调用量</div>
                                        <div style={{ fontSize: 28, fontWeight: 600, margin: "4px 0" }}>120 次</div>
                                        <div style={{ fontSize: 14, color: "green" }}>本月新增 +26</div>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col span={12}>
                            <Card style={{ borderRadius: 12 }}>
                                <Row align="middle">
                                    <Col flex="40px">
                                        <div
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: "50%",
                                                background: "#9B59B6",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <CheckCircleOutlined style={{ color: "#fff", fontSize: 20 }} />
                                        </div>
                                    </Col>
                                    <Col flex="auto" style={{ paddingLeft: 16 }}>
                                        <div style={{ fontSize: 14, color: "#666" }}>总成功调用量</div>
                                        <div style={{ fontSize: 28, fontWeight: 600, margin: "4px 0" }}>512 次</div>
                                        <div style={{ fontSize: 14, color: "green" }}>本月新增 +32</div>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row> */}

                    {/* 调用量趋势图 */}
                    <Card
                        title={<span style={{
                            fontSize: 14,
                            fontWeight: 550,
                            color: "#1C2748",
                            padding: 0,
                            lineHeight: "22px",
                            fontFamily: "Source Han Sans, Source Han Sans",
                            marginBottom: 16,
                        }}>调用量趋势</span>}
                        style={{ border: "none", boxShadow: "none", marginBottom: 0 }} // 去掉边框和阴影
                        extra={
                            <Space>
                                <Button
                                    type={range === "7" ? "primary" : "default"}
                                    onClick={() => handleRangeChange("7")}
                                    style={{
                                        backgroundColor: range === "7" ? "#d7e4fc" : "#fff",
                                        borderColor: range === "7" ? "#216EFF" : "#d9d9d9",
                                        color: range === "7" ? "#216EFF" : "#1c1c1c",
                                        transition: "all 0.2s ease-in-out",
                                    }}
                                >
                                    近7天
                                </Button>
                                <Button
                                    type={range === "30" ? "primary" : "default"}
                                    onClick={() => handleRangeChange("30")}
                                    style={{
                                        backgroundColor: range === "30" ? "#d7e4fc" : "#fff",
                                        borderColor: range === "30" ? "#216EFF" : "#d9d9d9",
                                        color: range === "30" ? "#216EFF" : "#1c1c1c",
                                        transition: "all 0.2s ease-in-out",
                                    }}
                                >
                                    近30天
                                </Button>
                                <Button
                                    type={range === "365" ? "primary" : "default"}
                                    onClick={() => handleRangeChange("365")}
                                    style={{
                                        backgroundColor: range === "365" ? "#d7e4fc" : "#fff",
                                        borderColor: range === "365" ? "#216EFF" : "#d9d9d9",
                                        color: range === "365" ? "#216EFF" : "#1c1c1c",
                                        transition: "all 0.2s ease-in-out",
                                    }}
                                >
                                    近一年
                                </Button>
                                <Button
                                    type={range === "now" ? "primary" : "default"}
                                    onClick={() => handleRangeChange("now")}
                                    style={{
                                        backgroundColor: range === "now" ? "#d7e4fc" : "#fff",
                                        borderColor: range === "now" ? "#216EFF" : "#d9d9d9",
                                        color: range === "now" ? "#216EFF" : "#1c1c1c",
                                        transition: "all 0.2s ease-in-out",
                                    }}
                                >
                                    发布至今
                                </Button>
                            </Space>
                        }
                    >
                        <ReactECharts option={option} style={{ height: 480, minHeight: 480, width: "100%" }} />
                    </Card>
                </Card>




            </div>
        </div>
    );
};

export default DashboardDeail;
