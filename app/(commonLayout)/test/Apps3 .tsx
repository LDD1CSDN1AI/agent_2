'use client'

import React, { useState, useMemo } from 'react';
import { Segmented } from 'antd';
import ReactECharts from 'echarts-for-react';

const TimeRangeLineChart: React.FC = () => {
    const [range, setRange] = useState<string>('week');

    // 模拟不同区间的数据
    const dataMap: Record<string, number[]> = {
        week: Array.from({ length: 7 }, () => Math.round(Math.random() * 200 + 50)),
        month: Array.from({ length: 30 }, () => Math.round(Math.random() * 200 + 50)),
        // quarter: Array.from({ length: 90 }, () => Math.round(Math.random() * 200 + 50)),
        year: Array.from({ length: 12 }, () => Math.round(Math.random() * 200 + 50)),
    };

    // 根据 range 生成横坐标
    const categories = useMemo(() => {
        if (range === 'week') return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        if (range === 'month') return Array.from({ length: 30 }, (_, i) => `${i + 1}日`);
        // if (range === 'quarter') return Array.from({ length: 90 }, (_, i) => `Day ${i + 1}`);
        if (range === 'year') return Array.from({ length: 12 }, (_, i) => `${i + 1}月`);
        return [];
    }, [range]);

    const option = {
        tooltip: {
            trigger: 'axis',
        },
        grid: {
            left: '5%',
            right: '5%',
            top: '15%',
            bottom: '10%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: categories,
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: '访问量',
                type: 'line',
                smooth: true,
                showSymbol: false,
                lineStyle: { width: 3, color: '#1890ff' },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(24,144,255,0.35)' },
                            { offset: 1, color: 'rgba(24,144,255,0.05)' },
                        ],
                    },
                },
                data: dataMap[range],
            },
        ],
    };

    return (
        <div style={{ padding: 20, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            {/* 时间范围切换 */}
            <Segmented
                options={[
                    { label: '近一周', value: 'week' },
                    { label: '近一月', value: 'month' },
                    // { label: '近三月', value: 'quarter' },
                    { label: '近一年', value: 'year' },
                ]}
                value={range}
                onChange={(val) => setRange(val as string)}
                style={{ marginBottom: 16 }}
            />

            {/* 折线图 */}
            <ReactECharts option={option} style={{ height: 400 }} />
        </div>
    );
};

export default TimeRangeLineChart;


