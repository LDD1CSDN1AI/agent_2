'use client'

import React, { useState, useEffect } from "react";
import { Card, Table, Row, Col, Button, Space } from "antd";
import { DatabaseOutlined, CheckCircleOutlined } from "@ant-design/icons";
import ReactECharts from "echarts-for-react";


const chartData = {
    dates: ["9-1", "9-2", "9-3", "9-4", "9-5"],
    total: [120, 200, 180, 300, 220],
    success: [80, 160, 120, 250, 170],
};

type chartType = {
    chartData: any
}

const NewCallEcharts: React.FC<chartType> = (props) => {
    const { chartData: chartDataMap } = props;
    const [range, setRange] = useState("");
    const [key, setKey] = useState(true);
    const [currentChartData, setCurrentChartData] = useState(null);

    useEffect(() => {
        chartDataMap && setCurrentChartData(chartDataMap)
        chartDataMap && handleRangeChange('7');
    }, [chartDataMap]);

    useEffect(() => {
        const bodyStyle = window.getComputedStyle(document.body);
        console.log('body overflowY =', bodyStyle.overflowY);
        // 保证页面纵向滚动
        const timer = setInterval(() => {
            document.body.style.overflowY = 'auto'
        }, 500)
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
    return <>
        {/* 调用量趋势图 */}
        <Card
            title={<span style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#1C2748",
                lineHeight: "22px",
                fontFamily: "Source Han Sans, Source Han Sans",
                marginBottom: 16,
                paddingLeft: 0,
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
            <ReactECharts key={key ? 'a' : 'b'} option={option} style={{ height: 480, minHeight: 480, width: "100%" }} />
        </Card>
    </>
}

export default NewCallEcharts;