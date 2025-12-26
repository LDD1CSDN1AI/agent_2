import { message, Space, Table, Tooltip } from "antd";
import './index.scss';
import { useEffect, useState } from "react";
import * as echarts from 'echarts';
import addArrow from '@/public/image/add_arrow.png'
import declineArrow from '@/public/image/decline_arrow.png'
import callAgent from '@/public/image/call-agent.png'
import callTalk from '@/public/image/call-talk.png'
import callNum from '@/public/image/call-num.png'
import callSuccessNum from '@/public/image/call-success-num.png'
import callWorkflow from '@/public/image/call-workflow.png'
import callNew from '@/public/bg/call_new.png'

import Image from 'next/image'
import NewCallEcharts from "./echarts";
import { queryBasicInfo, queryCallChart, topTen, topTenNew } from "@/service/newCallNum";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const OverallView = () => {
    const [registerDetail, setRegisterDetail] = useState('');
    const [topTenData, setTopTenData] = useState('');
    const [chartData, setChartData] = useState(null);
    const [topTenNewData, setTopTenNewData] = useState('');

    const getQueryBasicInfo = async () => {
        const result = await queryBasicInfo();
        if (result.status + '' === '400') {
            message.error('请求失败，' + result.msg);
            return;
        }
        if (result?.data) {
            setRegisterDetail(result?.data);
        }
    }

    const getTopTen = async () => {
        const result = await topTen();
        if (result.status + '' === '400') {
            message.error('请求失败，' + result.msg);
            return;
        }
        if (result?.data) {
            setTopTenData(result?.data);
        }
    }

    const getTopTenNew = async () => {
        const result = await topTenNew();
        if (result.status + '' === '400') {
            message.error('请求失败，' + result.msg);
            return;
        }
        if (result?.data) {
            setTopTenNewData(result?.data);
        }
    }

    const getQueryCallChart = async () => {
        const result = await queryCallChart();
        if (result.status + '' === '400') {
            message.error('请求失败，' + result.msg);
            return;
        }
        if (result?.data) {
            let dataValue = {
                '7': { dates: [], total: [], success: [] },
                '30': { dates: [], total: [], success: [] },
                '365': { dates: [], total: [], success: [] },
                'now': { dates: [], total: [], success: [] }
            }
            Object.keys(result?.data?.seven_days_count)?.map((key) => {
                dataValue['7'].dates.push(key);
                dataValue['7'].total.push(result?.data?.seven_days_count?.[key] || 0);
            })
            Object.keys(result?.data?.seven_days_succeed)?.map((key) => {
                dataValue['7'].success.push(result?.data?.seven_days_succeed?.[key] || 0);

            })

            Object.keys(result?.data?.thirty_days_count)?.map((key) => {
                dataValue['30'].dates.push(key);
                dataValue['30'].total.push(result?.data?.thirty_days_count?.[key] || 0);
            })
            Object.keys(result?.data?.thirty_days_succeed)?.map((key) => {
                dataValue['30'].success.push(result?.data?.thirty_days_succeed?.[key] || 0);

            })

            Object.keys(result?.data?.one_year_count)?.map((key) => {
                dataValue['365'].dates.push(key);
                dataValue['365'].total.push(result?.data?.one_year_count?.[key] || 0);
            })
            Object.keys(result?.data?.one_year_succeed)?.map((key) => {
                dataValue['365'].success.push(result?.data?.one_year_succeed?.[key] || 0);

            })

            Object.keys(result?.data?.since_release_count)?.map((key) => {
                dataValue['now'].dates.push(key);
                dataValue['now'].total.push(result?.data?.since_release_count?.[key] || 0);
            })
            Object.keys(result?.data?.since_release_succeed)?.map((key) => {
                dataValue['now'].success.push(result?.data?.since_release_succeed?.[key] || 0);

            })
            setChartData(dataValue);
        }
    }


    const [dataSource, setDataSource] = useState([
        { name: 'aaa', company: 'cc', creator: 'creator', type: 'type', count: 'eee' }
        , { name: 'aaa', company: 'cc', creator: 'creator', type: 'type', count: 'eee' }
        , { name: 'aaa', company: 'cc', creator: 'creator', type: 'type', count: 'eee' }
        , { name: 'aaa', company: 'cc', creator: 'creator', type: 'type', count: 'eee' }
        , { name: 'aaa', company: 'cc', creator: 'creator', type: 'type', count: 'eee' }
        , { name: 'aaa', company: 'cc', creator: 'creator', type: 'type', count: 'eee' }
        , { name: 'aaa', company: 'cc', creator: 'creator', type: 'type', count: 'eee' }
        , { name: 'aaa', company: 'cc', creator: 'creator', type: 'type', count: 'eee' }
        , { name: 'aaa', company: 'cc', creator: 'creator', type: 'type', count: 'eee' }
        , { name: 'aaa', company: 'cc', creator: 'creator', type: 'type', count: 'eee' }
    ]);
    const [maxWidth, setMaxWidth] = useState(600);

    let myRef = null;

    useEffect(() => {
        const element = document.getElementById('tableOne');
        if (element && element.offsetWidth) {
            setMaxWidth(element && element.offsetWidth);
        }

        getQueryBasicInfo();
        getTopTen();
        getTopTenNew();
        getQueryCallChart();
    }, []);

    const getIndexImage = (index: number) => {
        switch (index) {
            case 1:
                return 'call_top_1';
            case 2:
                return 'call_top_2';
            case 3:
                return 'call_top_3';
            default:
                return 'call_top';
        }

    }

    const columns = [
        {
            title: '',
            dataIndex: '',
            key: '',
            width: 40,
            className: 'text-center',
            render: (value: any, record: Object, index: number) => <div
                style={{
                    width: '20px',
                    height: '20px',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100% 100%',
                    backgroundImage: `url(\'/agent-platform-web/bg/${getIndexImage(index + 1)}.png\')`,
                    position: 'relative',
                    color: index + 1 <= 3 ? 'white' : 'black',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                {index + 1}
            </div>
        }, {
            title: '接口名称',
            dataIndex: 'name',
            key: 'name',
            width: (maxWidth - 340) / 2,
            render: (value: any, record: Object, index: number) => <div title={value} style={{ width: (maxWidth - 340) / 2 }} className="only-show-one">{value}</div>
        }, {
            title: '单位',
            dataIndex: 'company',
            key: 'company',
            width: (maxWidth - 340) / 2,
            render: (value: any, record: Object, index: number) => <div title={value} style={{ width: (maxWidth - 340) / 2 }} className="only-show-one">{value}</div>
        }, {
            title: '所需类别',
            dataIndex: 'type',
            width: 100,
            key: 'type',
            className: 'text-center',
        }, {
            title: '发布人',
            dataIndex: 'creator',
            width: 100,
            key: 'creator',
            className: 'text-center',
        }, {
            title: '调用量',
            width: 100,
            dataIndex: 'count',
            key: 'count',
            className: 'text-center',
        },
    ]

    const columns2 = [
        {
            title: '',
            dataIndex: '',
            key: '',
            className: 'text-center',
            width: 40,
            render: (value: any, record: Object, index: number) => <Image style={{ width: '20px', height: '20px' }} src={callNew} alt='img' />
        }, {
            title: '接口名称',
            dataIndex: 'name',
            key: 'name',
            width: (maxWidth - 460) / 2,
            render: (value: any, record: Object, index: number) => <div title={value} style={{ width: (maxWidth - 460) / 2 }} className="only-show-one">{value}</div>
        }, {
            title: '单位',
            dataIndex: 'company',
            key: 'company',
            width: (maxWidth - 460) / 2,
            render: (value: any, record: Object, index: number) => <div title={value} style={{ width: (maxWidth - 460) / 2 }} className="only-show-one">{value}</div>
        }, {
            title: '所需类别',
            dataIndex: 'type',
            width: 100,
            key: 'type',
            className: 'text-center',
        }, {
            title: '发布人',
            dataIndex: 'creator',
            width: 100,
            key: 'creator',
            className: 'text-center',
        }, {
            title: '最新发布',
            width: 160,
            dataIndex: 'create_time',
            key: 'create_time',
            className: 'text-center',
        },
    ]

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

        const formatNumberToTenThousand = (value: any) => {
            // 转换为数字类型
            const num = Number(value);

            // 检查是否为有效数字
            if (isNaN(num)) {
                return value; // 如果不是数字，返回原值
            }

            // 大于等于10000的数据转换为万单位
            if (num >= 10000) {
                return (num / 10000).toFixed(2) + 'w';
            }

            // 小于10000的数据不做处理
            return num.toString();
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

            <div style={{ marginTop: name === '总注册接口数' ? '18px' : '' }} className="TotalInterfaces">
                <div style={{ height: '20px' }}><span style={{ color: '#1C2748', fontSize: '32px', fontWeight: '700', fontFamily: 'D-DIN-Bold' }}>{formatNumberToTenThousand(allNum)}</span>{tipNameArray.includes(name) ? '次' : '个'}</div>
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

    return <div style={{ width: '100%', height: '100%' }}>
        <Space direction="vertical" >
            <div className="newCallStatistics-OverallView-allInfo">
                <div className="div-css info-part-one">
                    <div style={{
                        width: '100%',
                        height: '100%',
                        padding: '12px 12px 4px 4px',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '100% 100%',
                        backgroundImage: 'url(\'/agent-platform-web/bg/overallview.png\')',
                        flexDirection: 'column',
                        backgroundClip: 'content-box',
                        position: 'relative',
                    }}>
                        {/* <div className="TotalInterfaces">
                            <div style={{ height: '20px', paddingLeft: '8px' }}><span style={{ color: '#1C2748', fontSize: '32px', fontWeight: '700' }}>495</span>个</div>
                            <div style={{ height: '20px' }}>
                                <Space size={'large'} direction={'horizontal'}>
                                    <span>本月趋势</span>
                                    <Space size={'small'} direction={'horizontal'}><Image src={addArrow} alt='img' style={{ marginTop: '6px' }} /> 34</Space>
                                </Space>
                            </div>
                        </div> */}
                        <div className="info-part-modal part-1">
                            {contentNum({ name: '总注册接口数', type: 'add', allNum: registerDetail?.total_register, changeData: registerDetail?.total_register_current, showDash: false })}
                        </div>

                        <div className="info-part-modal part-2">
                            {contentNum({ name: '智能体', type: 'add', allNum: registerDetail?.agent_register, changeData: registerDetail?.agent_register_current })}
                        </div>
                        <div className="info-part-modal part-3">
                            {contentNum({ name: '工作流', type: 'add', allNum: registerDetail?.workflow_register, changeData: registerDetail?.workflow_register_current })}
                        </div>
                        <div className="info-part-modal part-4">
                            {contentNum({ name: '对话流', type: 'add', allNum: registerDetail?.conversation_register, changeData: registerDetail?.conversation_register_current })}
                        </div>
                    </div>
                </div>
                <div style={{ padding: '12px' }} className="div-css info-part-two">
                    <div className="info-part-modal part-5">
                        {contentNum({ name: '总调用量', type: 'add', allNum: registerDetail?.total_call, changeData: registerDetail?.total_call_current, showDash: false })}
                    </div>
                    <div className="info-part-modal part-6">
                        {contentNum({ name: '总成功调用量', type: 'add', allNum: registerDetail?.total_call_succeed, changeData: registerDetail?.total_call_succeed_current })}
                    </div>
                </div>
            </div>


            <div className="two-part div-css">
                <NewCallEcharts chartData={chartData} />
            </div>
            <div className="third-part div-css">
                <div id={'tableOne'} style={{ width: 'calc(50% - 8px)' }} className=" div-css">
                    <div className="third-part-title">调用量 Top 10</div>
                    <div>
                        <Table
                            columns={columns}
                            dataSource={topTenData as any}
                            pagination={false}
                            size="small"
                        />
                    </div>
                </div>
                <div style={{ width: 'calc(50% - 8px)' }} className=" div-css">
                    <div className="third-part-title">最新发布</div>
                    <div>
                        <Table
                            size="small"
                            columns={columns2}
                            dataSource={topTenNewData as any}
                            pagination={false}
                        />
                    </div>
                </div>
            </div>
        </Space >
    </div >
}

export default OverallView;