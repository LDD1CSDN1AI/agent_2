import * as echarts from 'echarts';
import './index.scss';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { Col, Row } from 'antd';
import Image from 'next/image';
import { getMonitor_log } from '@/service/apps';
import { message } from 'antd';
import GlobalUrl from '@/GlobalUrl';
export const EchartsAnalysis: React.FC = () => {


    useEffect(() => {
        (
            async () => {
                setTalkEcharts()
                setActionEcharts()
                getMonitorlogList()
            }
        )()
    }, [])


    interface DataType {
        img: string;
        name: string;
        num: string;
    }

    const [listData, setListData] = useState<DataType[]>([]);
    const [dailyConversations, setDailyConversations] = useState<number[]>([]);
    const [dailyActiveUsers, setDailyActiveUsers] = useState<number[]>([]);
    const getMonitorlogList = async () => {
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
            const response: any = await getMonitor_log({
                url: GlobalUrl.defaultUrlIp + '/agent_monitor',
                body: {
                    app_id: appId,
                    days: 7
                }
            })

            const result = await response
            if (result.status === "successful") {
                // console.log("response.conversation_list", response.conversation_list)
                setListData([
                    { img: '/agent-platform-web/bg/analysis1.png', name: '总对话次数', num: `${response.total_conversations} 次` },
                    { img: '/agent-platform-web/bg/analysis2.png', name: '平均对话次数', num: `${response.average_conversations.toFixed(2)} 次` },
                    { img: '/agent-platform-web/bg/analysis3.png', name: '总用户数', num: `${response.total_users} 人` },
                    { img: '/agent-platform-web/bg/analysis4.png', name: 'Token输出速度', num: `${response.token_output_speed} 秒` }
                ]);

                setDailyConversations(response.daily_conversations || []);
                setDailyActiveUsers(response.daily_active_users || []);

                setTalkEcharts(response.daily_conversations || []);
                setActionEcharts(response.daily_active_users || []);
                // const timer = setTimeout(() => {
                // setListData(response.kb_file_list)
                // }, 0)
            } else {
                message.error('查询检测数据失败')
                setListData([
                    { img: '/agent-platform-web/bg/analysis1.png', name: '总对话次数', num: `${response.total_conversations} 次` },
                    { img: '/agent-platform-web/bg/analysis2.png', name: '平均对话次数', num: `${response.average_conversations.toFixed(2)} 次` },
                    { img: '/agent-platform-web/bg/analysis3.png', name: '总用户数', num: `${response.total_users} 人` },
                    { img: '/agent-platform-web/bg/analysis4.png', name: 'Token输出速度', num: `${response.token_output_speed} 秒` }
                ]);

                // setDailyConversations(response.daily_conversations || []);
                // setDailyActiveUsers(response.daily_active_users || []);

                setTalkEcharts(response.daily_conversations || []);
                setActionEcharts(response.daily_active_users || []);
                // localStorage.setItem('console_token', '')
            }
        } catch (error) {
            message.error('请求失败，请检查网络或稍后重试')
            console.error('请求错误:', error)

        }
    }

    const setTalkEcharts = (yData: number[]) => {
        type EChartsOption = echarts.EChartsOption;

        let chartDom = document.getElementById('monitor-talk')!;
        let myChart = echarts.init(chartDom);
        let option: EChartsOption;

        const now = moment();

        // 获取最近30天的日期
        const past30Days = [];

        for (let i = 0; i < 7; i++) {
            const date = now.clone().subtract(i, 'days');
            past30Days.unshift(date.format('YYYY-MM-DD'));
        }

        // const yData = [
        //     33, 99, 88, 72, 13, 46, 88
        // ]
        option = {
            xAxis: {
                type: 'category',
                data: past30Days,
                axisLabel: {
                    // rotate: 30, // 设置 X 轴文字旋转 30 度
                    margin: 36, // 可选：调整文字与轴线的距离
                    align: 'center', // 可选：文字对齐方式

                }
            },
            yAxis: {
                type: 'value',
                name: '单日对话次数',
            },
            series: [
                {
                    data: yData,
                    type: 'line',
                    smooth: true,
                    lineStyle: {
                        color: 'blue', // 设置折线颜色
                        width: 2, // 设置折线宽度
                        type: 'solid' // 设置折线类型（solid 实线，dashed 虚线，dotted 点线）
                    },
                    itemStyle: {
                        color: 'blue', // 数据点颜色
                    },
                    areaStyle: {
                        color: {
                            type: 'linear', // 线性渐变
                            x: 0, // 起点 x
                            y: 0, // 起点 y
                            x2: 0, // 终点 x
                            y2: 1, // 终点 y
                            colorStops: [
                                { offset: 0, color: 'blue' }, // 起点颜色
                                { offset: 1, color: 'white' }  // 终点颜色
                            ]
                        },
                        opacity: 0.2 // 填充透明度
                    }
                },
            ],
            tooltip: {
                // trigger: 'axis', // 触发类型，'axis' 表示坐标轴触发
                formatter: function (params) {
                    // 自定义提示框内容
                    return `<div>
                    <span>X: ${params.name}</span>
                    <br/>
                    Y:<span>${params.data}</span>
                    <br/>
                    </div>`;
                }
            }
        };

        option && myChart.setOption(option);
    }


    const setActionEcharts = (yData: number[]) => {
        type EChartsOption = echarts.EChartsOption;

        let chartDom = document.getElementById('monitor-action')!;
        let myChart = echarts.init(chartDom);
        let option: EChartsOption;

        const now = moment();

        // 获取最近30天的日期
        const past30Days = [];

        for (let i = 0; i < 7; i++) {
            const date = now.clone().subtract(i, 'days');
            past30Days.unshift(date.format('YYYY-MM-DD'));
        }
        // const yData = [
        //     38, 23, 66, 35, 19, 86, 64
        // ]
        option = {
            xAxis: {
                type: 'category',
                data: past30Days,
                axisLabel: {
                    // rotate: 30, // 设置 X 轴文字旋转 30 度
                    margin: 36, // 可选：调整文字与轴线的距离
                    align: 'center', // 可选：文字对齐方式

                }
            },
            yAxis: {
                type: 'value',
                name: '单日活跃用户数',
            },
            series: [
                {
                    data: yData,
                    type: 'line',
                    smooth: true,
                    lineStyle: {
                        color: 'orange', // 设置折线颜色
                        width: 2, // 设置折线宽度
                        type: 'solid' // 设置折线类型（solid 实线，dashed 虚线，dotted 点线）
                    },
                    itemStyle: {
                        color: 'orange', // 数据点颜色
                    },
                    areaStyle: {
                        color: {
                            type: 'linear', // 线性渐变
                            x: 0, // 起点 x
                            y: 0, // 起点 y
                            x2: 0, // 终点 x
                            y2: 1, // 终点 y
                            colorStops: [
                                { offset: 0, color: 'orange' }, // 起点颜色
                                { offset: 1, color: 'white' }  // 终点颜色
                            ]
                        },
                        opacity: 0.2 // 填充透明度
                    }
                },
            ],
            tooltip: {
                // trigger: 'axis', // 触发类型，'axis' 表示坐标轴触发
                formatter: function (params) {
                    // 自定义提示框内容
                    return `<div>
                    <span>X: ${params.name}</span>
                    <br/>
                    Y:<span>${params.data}</span>
                    <br/>
                    </div>`;
                }
            }
        };

        option && myChart.setOption(option);
    }

    const testData = [
        { img: '/agent-platform-web/bg/analysis1.png', name: '总对话次数', num: '21次' },
        { img: '/agent-platform-web/bg/analysis2.png', name: '平均对话次数', num: '10次' },
        { img: '/agent-platform-web/bg/analysis3.png', name: '总用户数', num: '66次' },
        { img: '/agent-platform-web/bg/analysis4.png', name: 'Token输入次数', num: '10秒' },
    ]



    const HeadMod = ({ img, name, num }) => {
        return <div className='monitor-headMod' style={{
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
            backgroundImage: `url(${img})`,
        }}>
            <div className='monitor-headMod-text'>
                <div className='monitor-headMod-text-name'>
                    {name}
                </div>
                <div className='monitor-headMod-text-num'>
                    {num}
                </div>
            </div>
        </div >;
    }

    return (
        <div className='monitor'>
            <div className='monitor-echarts'>
                <div id={'monitor-talk'} key={'monitor-talk'} className='monitor-talk'></div>
                <div id={'monitor-action'} key={'monitor-action'} className='monitor-action'></div>

            </div>
            <div className='monitor-card'>
                <Row gutter={{ xs: 8, sm: 16, md: 12, lg: 32 }}>
                    {
                        listData.map(record =>
                            <Col span={6}>
                                {
                                    HeadMod(record)
                                }
                            </Col>
                        )
                    }
                </Row>
            </div>
        </div>
    )


}