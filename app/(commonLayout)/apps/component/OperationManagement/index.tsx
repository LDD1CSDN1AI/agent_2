import Image from 'next/image';
import './index.scss';  // 自定义样式文件
import header from '@/public/image/header_agent1.png';
import * as echarts from 'echarts';
import { Col, Row } from 'antd';
import { useEffect } from 'react';
import moment from 'moment';

const OperationManagement: React.FC = () => {

    useEffect(() => {
        (
            async () => {
                setUserEcharts()
                setProvinceEcharts()
                setProvinceModEcharts()
            }
        )()
    }, [])

    const HeadMod = ({ img, name, num }) => {
        return (
            <div
                className="headMod"
                style={{
                    backgroundImage: `url(${img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="headMod-text" style={{ marginLeft: "auto" }}>
                    <div className="headMod-text-name">{name}</div>
                    <div className="headMod-text-num">{num}</div>
                </div>
            </div>
        );
    };


    const setUserEcharts = () => {
        type EChartsOption = echarts.EChartsOption;

        let chartDom = document.getElementById('UserStatistics')!;
        let myChart = echarts.init(chartDom);
        let option: EChartsOption;

        const now = moment();

        // 获取最近30天的日期
        const past30Days = [];

        for (let i = 0; i < 30; i++) {
            const date = now.clone().subtract(i, 'days');
            past30Days.unshift(date.format('YYYY-MM-DD'));
        }
        const yData = [0, 0, 12, 89, 66, 44, 73, 52, 68, 22,
            33, 99, 88, 72, 13, 46, 88, 99, 68, 91,
            38, 23, 66, 35, 19, 86, 64, 55, 23, 66
        ]
        option = {
            title: {
                text: '日活用户统计（全国）', // 标题文本
                left: 'center', // 标题水平居中
                top: 10, // 标题距离顶部的位置
            },
            xAxis: {
                type: 'category',
                data: past30Days,
                axisLabel: {
                    rotate: 30, // 设置 X 轴文字旋转 30 度
                    margin: 36, // 可选：调整文字与轴线的距离
                    align: 'center', // 可选：文字对齐方式

                }
            },
            yAxis: {
                type: 'value',
                name: '平台使用活跃用户数量统计',
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

    const province = ['北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西', '海南', '重庆', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆', '台湾', '香港', '澳门'];

    const setProvinceEcharts = () => {
        type EChartsOption = echarts.EChartsOption;
        const chartDom = document.getElementById('provinceStatistics')!;
        const myChart = echarts.init(chartDom);
        let option: EChartsOption;
        option = {
            // title: {
            //     text: '省使用量',
            //     left: 'center',
            //     top: 10,
            // },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['省使用量']
            },
            grid: {
                left: '4%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: province,
                    axisLabel: {
                        rotate: 30,
                        margin: 36,
                        align: 'center',

                    },
                    axisTick: {
                        alignWithLabel: true
                    },
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '各省（包括专业公司）的活跃度',
                }
            ],
            series: [
                {
                    type: 'bar',
                    name: '省使用量',
                    barWidth: '20%',
                    data: [13499, 13082, 4510, 2711, 1621, 1502, 1027, 942, 929, 791, 770, 733, 683, 635, 575, 538, 511, 583, 496, 427, 339, 322, 243, 202, 193, 146, 116, 32, 19, 5, 0, 0],
                    itemStyle: {
                        color: 'orange' // 设置柱子的颜色
                    },
                    markLine: {
                        data: [
                            {
                                type: 'average', // 平均值线
                                name: '平均值', // 线的名称
                                label: {
                                    formatter: '平均值：{c}', // 标签内容
                                    position: 'middle' // 标签位置
                                },
                                lineStyle: {
                                    color: '#FF0000', // 线的颜色
                                    width: 1, // 线的宽度
                                    type: 'dashed' // 线的类型（dashed 虚线）
                                }
                            }
                        ]
                    }
                }
            ]
        };

        option && myChart.setOption(option);
    }

    const setProvinceModEcharts = () => {
        type EChartsOption = echarts.EChartsOption;
        const chartDom = document.getElementById('provinceModStatistics')!;
        const myChart = echarts.init(chartDom);
        let option: EChartsOption;
        option = {
            // title: {
            //     text: '省使用量',
            //     left: 'center',
            //     top: 10,
            // },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['省构建数量']
            },
            grid: {
                left: '4%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: province,
                    axisLabel: {
                        rotate: 30,
                        margin: 36,
                        align: 'center',

                    },
                    axisTick: {
                        alignWithLabel: true
                    },
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '各省构建应用数量统计',
                }
            ],
            series: [
                {
                    type: 'bar',
                    name: '省构建数量',
                    barWidth: '20%',
                    data: [1177, 411, 160, 132, 95, 83, 82, 82, 78, 65, 57, 55, 54, , 51, 51, 43, 42, 37, 37, 36, 34, 31, 26, 25, 23, 23, 18, 17, 15, 6, 0, 0],
                    itemStyle: {
                        color: 'green' // 设置柱子的颜色
                    },
                    markLine: {
                        data: [
                            {
                                type: 'average', // 平均值线
                                name: '平均值', // 线的名称
                                label: {
                                    formatter: '平均值：{c}', // 标签内容
                                    position: 'middle' // 标签位置
                                },
                                lineStyle: {
                                    color: '#FF0000', // 线的颜色
                                    width: 1, // 线的宽度
                                    type: 'dashed' // 线的类型（dashed 虚线）
                                }
                            }
                        ]
                    }
                }
            ]
        };

        option && myChart.setOption(option);

    }

    const testData = [
        { img: '/agent-platform-web/bg/yunyingguanli_1.png', name: '平台总使用量', num: 48102 },
        { img: '/agent-platform-web/bg/yunyingguanli_2.png', name: '平台总用户量', num: 7859 },
        { img: '/agent-platform-web/bg/yunyingguanli_3.png', name: '覆盖公司', num: 160 },
        {
            img: '/agent-platform-web/bg/yunyingguanli_4.png', name: '平台应用数量', num: <div>
                <div>agent:1395</div>
                <div>工作流:1390</div>
            </div>
        },
        { img: '/agent-platform-web/bg/yunyingguanli_5.png', name: '注册接口数量', num: 280 },
    ]

    const callSituation = [
        {
            appName: '天气预测 V2.1',
            company: '中国电信集团有限公司总部',
            person: '张三',
            callNum: '93868'
        }, {
            appName: '家宽装维智能体 V0.3',
            company: '中国电信集团有限公司安徽分公司',
            person: '李四',
            callNum: '30538'
        }, {
            appName: '语义识别工作流 V1.0',
            company: '中国电信集团有限公司总部',
            person: '张三',
            callNum: '20127'
        }, {
            appName: '通用知识助手 V1.4',
            company: '中国电信集团有限公司总部',
            person: '张三',
            callNum: '9805'
        }, {
            appName: '天气预测 V1.4',
            company: '中国电信集团有限公司新疆分公司',
            person: '王五',
            callNum: '5862'
        }, {
            appName: '启明网络大模型DS底座',
            company: '中国电信集团有限公司总部',
            person: '张三',
            callNum: '4640'
        }, {
            appName: '智能问数 V1.2',
            company: '中国电信集团有限公司广东分公司',
            person: '李四',
            callNum: '756'
        }, {
            appName: '用户投诉处置智能体 V4.2',
            company: '中国电信集团有限公司内蒙古分公司',
            person: '赵二',
            callNum: '644'
        }, {
            appName: '故障处置助手 V1.0',
            company: '中国电信集团有限公司浙江分公司',
            person: '孙一',
            callNum: '438'
        }, {
            appName: '故障预测智能体 V1.7',
            company: '中国电信集团有限公司浙江分公司',
            person: '孙一',
            callNum: '432'
        }
    ]

    const getFooterCard = (record, index) => {
        const classArray = [
            { indexClass: 'borderRadius backGoundOrange', appNameClass: 'orange', companyClass: 'orange' },
            { indexClass: 'borderRadius backGoundGreen', appNameClass: 'green', companyClass: 'green' },
            { indexClass: 'borderRadius backGoundBule', appNameClass: 'blue', companyClass: 'blue' }
        ]
        return <div className='footerCard'>
            <div className={`footerCard-index ${classArray[index - 1]?.indexClass}`}>{index}</div>
            <div className={`footerCard-appName ${classArray[index - 1]?.appNameClass}`}>
                {
                    record.appName
                }
            </div>
            <div className={`footerCard-company ${classArray[index - 1]?.companyClass}`}>
                {
                    record.company
                }
            </div>
            <div className={`footerCard-person`}>
                {
                    record.person
                }
            </div>
            <div className='footerCard-callNum'>
                {record.callNum}
            </div>
        </div>
    }

    return (
        <div className="operation-management mt-[24px]">
            <div style={{ justifyContent: 'space-between', fontWeight: '700', backgroundColor: 'white', padding: '16px 16px', marginBottom: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center' }} className='text-[#1C2748] text-[20px] mb-[16px]'>运营管理</div>
            <div className='flex flex-col bg-[#fff] rounded-[8px] px-[24px] pt-[24px]' style={{ height: 'calc(100vh - 138px)', overflow: 'auto', paddingBottom: '32px' }}>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col span={2}></Col>
                    {
                        testData.map(record =>
                            <Col span={4}>
                                {
                                    HeadMod(record)
                                }
                            </Col>
                        )
                    }
                </Row>
                <div className='echarts'>
                    <div className='echarts-header'>平台使用情况</div>
                    <div key={'UserStatistics'} className='echarts-userStatistics' id={'UserStatistics'}></div>
                    <div key={'provinceStatistics'} className='echarts-userStatistics' id={'provinceStatistics'}></div>
                    <div key={'provinceModStatistics'} className='echarts-userStatistics' id={'provinceModStatistics'}></div>
                </div>

                <div className='footer'>
                    <div className='footer-header'>能力调用情况</div>
                    <div className='footer-content'>
                        {/* 应用调用榜单 */}
                        {
                            callSituation.map((record, index) =>
                                getFooterCard(record, index + 1)
                            )
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}

export default OperationManagement;