'use client'

import React from 'react';
import ReactECharts from 'echarts-for-react';

const HighEndLineChart: React.FC = () => {
    const option = {
        backgroundColor: '#fff',
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0,0,0,0.75)',
            borderWidth: 0,
            textStyle: { color: '#fff' },
            axisPointer: {
                type: 'cross',
                lineStyle: {
                    color: '#aaa',
                    width: 1,
                    type: 'dashed',
                },
            },
        },
        legend: {
            data: ['访问量', '用户数'],
            top: 10,
            right: 20,
            textStyle: {
                color: '#444',
                fontSize: 14,
            },
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '15%',
            top: '15%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
            axisLine: { lineStyle: { color: '#ccc' } },
            axisLabel: { color: '#666' },
        },
        yAxis: {
            type: 'value',
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { lineStyle: { color: '#eee' } },
            axisLabel: { color: '#666' },
        },
        dataZoom: [
            {
                type: 'inside',
                zoomOnMouseWheel: true,
                moveOnMouseMove: true,
            },
            {
                type: 'slider',
                height: 20,
                bottom: 10,
                borderColor: 'transparent',
                backgroundColor: '#f5f5f5',
                fillerColor: 'rgba(24,144,255,0.3)',
                handleStyle: { color: '#1890ff' },
            },
        ],
        series: [
            {
                name: '访问量',
                type: 'line',
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    width: 3,
                    color: '#1890ff',
                    shadowColor: 'rgba(24,144,255,0.3)',
                    shadowBlur: 10,
                    shadowOffsetY: 6,
                },
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
                emphasis: { lineStyle: { width: 4 } },
                data: Array.from({ length: 30 }, () => Math.round(Math.random() * 200 + 100)),
            },
            {
                name: '用户数',
                type: 'line',
                smooth: true,
                showSymbol: false,
                lineStyle: {
                    width: 3,
                    color: '#fa8c16',
                    shadowColor: 'rgba(250,140,22,0.3)',
                    shadowBlur: 10,
                    shadowOffsetY: 6,
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(250,140,22,0.35)' },
                            { offset: 1, color: 'rgba(250,140,22,0.05)' },
                        ],
                    },
                },
                emphasis: { lineStyle: { width: 4 } },
                data: Array.from({ length: 365 }, () => Math.round(Math.random() * 150 + 50)),
            },
        ],
        animationDuration: 1200,
        animationEasing: 'cubicOut',
    };

    return (
        <ReactECharts
            option={option}
            style={{ height: 420, borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
            opts={{ renderer: 'canvas' }} // canvas 性能更强，svg 清晰度更高
        />
    );
};

export default HighEndLineChart;


