import { Button, message, notification, Segmented, Space } from "antd";
import { useState } from "react";
import TypeCard from "./typeCard";
import { getFiveIndex } from "@/utils/var";
import TypeCardOther from "./typeCardOther";
import ToolPage from "./toolPage";
import Detail from './mcp/Apps';
import './index.scss';  // 自定义样式文件

const MpcManage: React.FC = () => {

    const [showType, setShowType] = useState('official');
    const [selectData, setSelectData] = useState({});
    const [dataSource, setDataSource] = useState(
        [
            {
                key: 'aaa',
                name: '流量消耗排行服务',
                param: 'regionOrUserGroup',
                englishName: 'trafficCheck',
                description: '支持按日、周、月统计不同地区、不同套餐用户群体的总流量消耗，帮助识别高流量区域或异常用户',
                detail: '流量消耗排行MCP服务提供多维度的流量数据分析功能，支持运营商或企业按日、周、月周期统计不同地区（如省份、城市）及不同套餐用户的流量使用情况。该服务可自动生成流量消耗排行榜，识别高流量区域（如热点商圈或高校周边）及异常用户（如突增流量或异常访问行为），帮助优化网络资源分配、制定精准营销策略或排查潜在风险。同时，该服务支持可视化报表输出，便于管理者快速掌握流量分布趋势，提升运营效率。',
                tar: '使用分析', openService: true
            },
            {
                key: 'aaab',
                englishName: 'balanceAlert',
                name: '套餐余量提醒服务',
                param: 'userId',
                description: '根据用户套餐额度和当前使用情况，在剩余流量/通话时间低于一定比例时触发短信/APP推送提醒，进行自动提示',
                detail: '套餐余量提醒服务是一种智能化的用户关怀功能，通过实时监测用户的套餐余量（流量、通话时长、短信等），在剩余资源低于预设阈值（如10%、5%）时，自动通过短信、APP推送或微信消息等方式触发提醒。该服务支持自定义提醒频率和触发条件，避免用户因流量超支或通话中断而产生额外费用。同时，可结合用户使用习惯提供优化建议（如推荐更适合的套餐），提升用户体验和运营商服务满意度。适用于个人用户和企业集团客户，帮助其合理规划通信消费。',
                tar: '提醒告警', openService: false
            },
            {
                key: 'aaac',
                englishName: 'hotspotMap',
                name: '网络热点地图服务',
                param: 'geoArea',
                description: 'Postgres等数据库的MCP服务器，可直接通过本地协议访问数据',
                detail: '网络热点地图服务：基于地理信息系统（GIS）和实时网络数据，动态生成基站覆盖范围内的用户分布密度、流量负载或连接质量的热力图。该服务通过可视化呈现高并发区域（如商圈、交通枢纽）或网络拥堵节点，帮助运营商精准识别资源需求，优化基站部署、带宽分配或临时扩容策略。同时支持历史数据分析，预测周期性高峰（如节假日、大型活动），提前调配资源以保障用户体验。适用于城市管理、应急通信及网络优化场景，提升整体服务质量和运营效率。',
                tar: '地理服务', openService: false
            },
            {
                key: 'aaad',
                englishName: 'churnAlert',
                name: '用户离网风险预警服务',
                param: 'userId',
                description: '通过分析用户近期内使用频次下降、流量减少、投诉记录等行为，预测用户流失概率并预警',
                detail: '用户离网风险预警服务：基于大数据分析技术，通过监测用户通信行为（如通话频次下降、流量骤减、套餐使用不足）、服务交互记录（如投诉频次、客服咨询）及消费习惯变化等关键指标，构建智能预测模型评估用户流失风险等级。系统自动识别高风险用户并触发预警，支持通过标签分类（如价格敏感型、服务不满型）生成针对性挽留策略（如定向优惠、专属服务），帮助运营商降低客户流失率，提升用户留存。该服务可结合可视化看板，实时监控用户维系效果，优化运营决策。',
                tar: '用户保留', openService: false
            },
            {
                key: 'aaae',
                englishName: 'netQuality',
                name: '实时网络质量监控服务',
                param: 'siteId',
                description: '提供基站层面的实时网络质量看板，包括延迟、带宽、丢包率等指标，支持异常告警',
                detail: '实时网络质量监控服务：基于电信级数据采集能力，对基站覆盖区域的网络性能进行秒级监测，动态展示延迟、带宽利用率、丢包率、连接成功率等核心指标。通过可视化仪表盘呈现全域基站健康状态，并利用智能阈值算法自动识别异常波动（如突发高延迟、流量过载），实时触发多级告警（短信/邮件/工单）。该服务支持根因定位分析，可关联历史数据预测趋势，帮助运维团队快速响应网络劣化问题，保障用户体验，适用于5G网络优化、重大活动保障等场景。',
                tar: '监控', openService: false
            },
            {
                key: 'aaae',
                englishName: 'cdrQuery',
                name: '话单数据查询服务',
                param: 'phoneNumber',
                description: '运营人员可通过手机号、时间段快速查找指定用户的话费明细、通话记录、流量使用详情',
                detail: '话单数据查询服务：为运营商提供高效的话务数据检索功能，支持通过手机号、时间范围等多维度条件，快速查询用户的通话详单（主被叫号码、时长、时间）、流量使用记录（访问时段、消耗流量、应用类型）及费用明细（基础套餐、增值业务、漫游费用）。系统采用高性能数据库架构，确保海量数据秒级响应，并具备权限分级管理功能，保障用户隐私安全。该服务可帮助客服人员快速响应用户查询需求，辅助财务对账、异常消费核查等场景，提升运营效率与服务透明度。',
                tar: '数据查询', openService: false
            },
            {
                key: 'aaae',
                englishName: 'dailyReport',
                param: 'email',
                name: '自动发送日报邮件服务',
                description: '系统自动生成前一日的网络关键指标汇总报告（如活跃用户数、故障基站数、总流量等）并发送至指定邮箱',
                detail: '自动发送日报邮件服务：是一款智能化的网络运营辅助工具，系统每日定时采集前一日关键运营数据（包括活跃用户数、基站运行状态、总流量消耗、网络故障统计等核心指标），通过预设模板自动生成可视化日报（支持图表/表格等多种形式），并在指定时间发送至管理人员邮箱。该服务支持多级收件人管理，可针对不同层级管理人员定制差异化报告内容，同时具备异常数据标红提醒功能，帮助运维团队快速掌握网络运行态势，为资源调度和故障处理提供数据支撑。',
                tar: '自动化', openService: false
            },
            {
                key: 'aaae',
                englishName: 'salesTrend',
                name: '套餐销售趋势图表服务',
                param: 'planId',
                description: '按照时间维度展示各类套餐的销量变化趋势，支持对比分析，便于优化产品策略',
                detail: '套餐销售趋势图表服务：通过可视化数据看板，动态展示不同套餐（如5G畅享套餐、家庭融合套餐等）按日/周/月/季度的销量变化曲线。系统支持多维度对比分析，包括不同区域、渠道、用户群体的销售差异，并自动标识销售高峰与异常波动。该服务可结合营销活动数据关联分析，帮助运营商精准评估套餐市场表现，识别潜力产品或滞销套餐，为产品优化、定价策略调整及精准营销提供数据支撑，有效提升套餐销售转化率。',
                tar: '趋势报表', openService: false
            },
            {
                englishName: 'complaintMap',
                key: 'aaae',
                param: 'region',
                name: '投诉热点分布服务',
                description: '将用户投诉数据与地理位置结合，显示投诉热点区域，辅助运维和客服资源调配',
                detail: '投诉热点分布服务：基于地理信息系统（GIS）和用户投诉数据，实时生成可视化投诉热力图，精准定位高频投诉区域（如信号盲区、网络拥堵地带）及主要投诉类型（如信号质量、资费争议）。该服务支持按时间维度分析投诉趋势，自动识别突发性集群投诉事件，并关联基站性能数据辅助根因分析。通过智能预警和区域分级功能，可指导运维团队优先处理高优先级区域，优化基站维护和客服资源分配，有效提升用户满意度和网络服务质量。',
                tar: '客户服务', openService: false
            },
            {
                key: 'aaae',
                englishName: 'siteAlarm',
                param: 'siteId',
                name: '基站异常告警通知服务',
                description: '当基站出现故障或性能下降时告警，实时监测基站运行状态，当出现断连、负载过高、信号弱等问题时，自动通过钉钉、企微、短信等方式通知负责人',
                detail: '基站异常告警通知服务：是基于实时监控系统的智能化运维工具，7×24小时不间断追踪基站运行状态，精准识别断连、CPU/内存过载、信号覆盖衰减、硬件故障等异常情况。当指标超过预设阈值时，系统自动通过多通道（钉钉、企业微信、短信、邮件）分级推送告警信息，并附带故障定位建议。该服务支持自定义告警规则和通知优先级，可区分紧急故障与一般预警，帮助运维团队快速响应核心问题。同时具备历史告警分析功能，助力优化基站维护策略，显著提升网络可用性和运维效率。',
                tar: '提醒告警', openService: false
            },
        ]
    )

    const [dataSourceSubscribed, setDataSourceSubscribed] = useState([
        {
            key: 'aaa',
            englishName: 'trafficCheck',
            param: 'regionOrUserGroup',
            name: '流量消耗排行服务',
            description: '支持按日、周、月统计不同地区、不同套餐用户群体的总流量消耗，帮助识别高流量区域或异常用户',
            detail: '流量消耗排行MCP服务提供多维度的流量数据分析功能，支持运营商或企业按日、周、月周期统计不同地区（如省份、城市）及不同套餐用户的流量使用情况。该服务可自动生成流量消耗排行榜，识别高流量区域（如热点商圈或高校周边）及异常用户（如突增流量或异常访问行为），帮助优化网络资源分配、制定精准营销策略或排查潜在风险。同时，该服务支持可视化报表输出，便于管理者快速掌握流量分布趋势，提升运营效率。',
            tar: '使用分析',
            serviceId: '',
            openService: true
        }, {
            key: 'aaa1',
            englishName: 'balanceAlert',
            param: 'userId',
            name: '套餐余量提醒服务',
            description: '根据用户套餐额度和当前使用情况，在剩余流量/通话时间低于一定比例时触发短信/APP推送提醒，进行自动提示',
            detail: '套餐余量提醒服务是一种智能化的用户关怀功能，通过实时监测用户的套餐余量（流量、通话时长、短信等），在剩余资源低于预设阈值（如10%、5%）时，自动通过短信、APP推送或微信消息等方式触发提醒。该服务支持自定义提醒频率和触发条件，避免用户因流量超支或通话中断而产生额外费用。同时，可结合用户使用习惯提供优化建议（如推荐更适合的套餐），提升用户体验和运营商服务满意度。适用于个人用户和企业集团客户，帮助其合理规划通信消费。',
            tar: '提醒告警',
            serviceId: '',
            openService: true
        }, {
            key: 'aaa2',
            englishName: 'hotspotMap',
            name: '网络热点地图服务',
            param: 'geoArea',
            description: 'Postgres等数据库的MCP服务器，可直接通过本地协议访问数据',
            detail: '网络热点地图服务：基于地理信息系统（GIS）和实时网络数据，动态生成基站覆盖范围内的用户分布密度、流量负载或连接质量的热力图。该服务通过可视化呈现高并发区域（如商圈、交通枢纽）或网络拥堵节点，帮助运营商精准识别资源需求，优化基站部署、带宽分配或临时扩容策略。同时支持历史数据分析，预测周期性高峰（如节假日、大型活动），提前调配资源以保障用户体验。适用于城市管理、应急通信及网络优化场景，提升整体服务质量和运营效率。',
            tar: '地理服务',
            serviceId: '',
            openService: true
        }, {
            key: 'aaa3',
            englishName: 'churnAlert',
            name: '用户离网风险预警服务',
            param: 'userId',
            description: '通过分析用户近期内使用频次下降、流量减少、投诉记录等行为，预测用户流失概率并预警',
            detail: '用户离网风险预警服务：基于大数据分析技术，通过监测用户通信行为（如通话频次下降、流量骤减、套餐使用不足）、服务交互记录（如投诉频次、客服咨询）及消费习惯变化等关键指标，构建智能预测模型评估用户流失风险等级。系统自动识别高风险用户并触发预警，支持通过标签分类（如价格敏感型、服务不满型）生成针对性挽留策略（如定向优惠、专属服务），帮助运营商降低客户流失率，提升用户留存。该服务可结合可视化看板，实时监控用户维系效果，优化运营决策。',
            tar: '用户保留',
            serviceId: '',
            openService: true
        }, {
            key: 'aaa4',
            englishName: 'netQuality',
            param: 'siteId',
            name: '实时网络质量监控服务',
            description: '提供基站层面的实时网络质量看板，包括延迟、带宽、丢包率等指标，支持异常告警',
            detail: '实时网络质量监控服务：基于电信级数据采集能力，对基站覆盖区域的网络性能进行秒级监测，动态展示延迟、带宽利用率、丢包率、连接成功率等核心指标。通过可视化仪表盘呈现全域基站健康状态，并利用智能阈值算法自动识别异常波动（如突发高延迟、流量过载），实时触发多级告警（短信/邮件/工单）。该服务支持根因定位分析，可关联历史数据预测趋势，帮助运维团队快速响应网络劣化问题，保障用户体验，适用于5G网络优化、重大活动保障等场景。',
            tar: '监控',
            serviceId: '',
            openService: true
        }, {
            key: 'aaa5',
            param: 'phoneNumber',
            englishName: 'cdrQuery',
            name: '话单数据查询服务',
            description: '运营人员可通过手机号、时间段快速查找指定用户的话费明细、通话记录、流量使用详情',
            detail: '话单数据查询服务：为运营商提供高效的话务数据检索功能，支持通过手机号、时间范围等多维度条件，快速查询用户的通话详单（主被叫号码、时长、时间）、流量使用记录（访问时段、消耗流量、应用类型）及费用明细（基础套餐、增值业务、漫游费用）。系统采用高性能数据库架构，确保海量数据秒级响应，并具备权限分级管理功能，保障用户隐私安全。该服务可帮助客服人员快速响应用户查询需求，辅助财务对账、异常消费核查等场景，提升运营效率与服务透明度。',
            tar: '数据查询',
            serviceId: '',
            openService: true
        }, {
            englishName: 'dailyReport',
            param: 'email',
            key: 'aaa6',
            name: '自动发送日报邮件服务',
            description: '系统自动生成前一日的网络关键指标汇总报告（如活跃用户数、故障基站数、总流量等）并发送至指定邮箱',
            detail: '自动发送日报邮件服务：是一款智能化的网络运营辅助工具，系统每日定时采集前一日关键运营数据（包括活跃用户数、基站运行状态、总流量消耗、网络故障统计等核心指标），通过预设模板自动生成可视化日报（支持图表/表格等多种形式），并在指定时间发送至管理人员邮箱。该服务支持多级收件人管理，可针对不同层级管理人员定制差异化报告内容，同时具备异常数据标红提醒功能，帮助运维团队快速掌握网络运行态势，为资源调度和故障处理提供数据支撑。',
            tar: '自动化',
            serviceId: '',
            openService: true
        }, {
            key: 'aaa7',
            param: 'planId',
            englishName: 'salesTrend',
            name: '套餐销售趋势图表服务',
            description: '按照时间维度展示各类套餐的销量变化趋势，支持对比分析，便于优化产品策略',
            detail: '套餐销售趋势图表服务：通过可视化数据看板，动态展示不同套餐（如5G畅享套餐、家庭融合套餐等）按日/周/月/季度的销量变化曲线。系统支持多维度对比分析，包括不同区域、渠道、用户群体的销售差异，并自动标识销售高峰与异常波动。该服务可结合营销活动数据关联分析，帮助运营商精准评估套餐市场表现，识别潜力产品或滞销套餐，为产品优化、定价策略调整及精准营销提供数据支撑，有效提升套餐销售转化率。',
            tar: '趋势报表',
            serviceId: '',
            openService: true
        }, {
            key: 'aaa8',
            param: 'region',
            englishName: 'complaintMap',
            name: '投诉热点分布服务',
            description: '将用户投诉数据与地理位置结合，显示投诉热点区域，辅助运维和客服资源调配',
            detail: '投诉热点分布服务：基于地理信息系统（GIS）和用户投诉数据，实时生成可视化投诉热力图，精准定位高频投诉区域（如信号盲区、网络拥堵地带）及主要投诉类型（如信号质量、资费争议）。该服务支持按时间维度分析投诉趋势，自动识别突发性集群投诉事件，并关联基站性能数据辅助根因分析。通过智能预警和区域分级功能，可指导运维团队优先处理高优先级区域，优化基站维护和客服资源分配，有效提升用户满意度和网络服务质量。',
            tar: '客户服务',
            serviceId: '',
            openService: true
        }, {
            key: 'aaa9',
            param: 'siteId',
            englishName: 'siteAlarm',
            name: '基站异常告警通知服务',
            description: '当基站出现故障或性能下降时告警，实时监测基站运行状态，当出现断连、负载过高、信号弱等问题时，自动通过钉钉、企微、短信等方式通知负责人',
            detail: '基站异常告警通知服务：是基于实时监控系统的智能化运维工具，7×24小时不间断追踪基站运行状态，精准识别断连、CPU/内存过载、信号覆盖衰减、硬件故障等异常情况。当指标超过预设阈值时，系统自动通过多通道（钉钉、企业微信、短信、邮件）分级推送告警信息，并附带故障定位建议。该服务支持自定义告警规则和通知优先级，可区分紧急故障与一般预警，帮助运维团队快速响应核心问题。同时具备历史告警分析功能，助力优化基站维护策略，显著提升网络可用性和运维效率。',
            tar: '提醒告警',
            serviceId: '',
            openService: true
        }
    ])

    const changeService = (record: any, bool: boolean) => {
        const { key } = record;
        let dataSourceCopy = JSON.parse(JSON.stringify(dataSource));
        dataSourceCopy.map(item => {
            if (item.key === key) {
                item.openService = bool;
            }
        });
        setDataSource(dataSourceCopy);
        if (bool) {
            message.success('开启服务');
        } else {
            message.success('关闭服务');
        }
    }

    const getContent = (type: any) => {

        switch (type) {
            case 'official':
                return <div className='mt-[24px]'>
                    <div style={{ justifyContent: 'space-between', fontWeight: '700', backgroundColor: 'white', padding: '16px 16px', marginBottom: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center' }} className='text-[#1C2748] text-[20px] mb-[16px]'>
                        MCP管理
                        <div>
                            <Segmented<string>
                                className="mpcManage-segmented"
                                shape="round"
                                options={[{
                                    label: '官方服务',
                                    value: 'official'
                                }, {
                                    label: '已订阅服务',
                                    value: 'subscribed'
                                }
                                    // , {
                                    //     label: '自定义服务',
                                    //     value: 'customize'
                                    // }
                                ]}
                                onChange={(value) => {
                                    setShowType(value); // string
                                }}
                            />
                        </div>
                        <div></div>
                    </div>
                    <div className='flex flex-col bg-[#fff] rounded-[8px] px-[24px] pt-[24px]' style={{ height: 'calc(100vh - 138px)' }}>
                        <div style={{ textAlign: 'right' }} className='pt-[33px] pb-[22px]'>
                            <Space>
                                {/* <Button type='primary' onClick={() => console.log('aaaaaaaaaaa')}>创建MCP服务</Button> */}
                            </Space>
                        </div>
                        <div className='flex flex-1 flex-wrap overflow-hidden overflow-y-auto pb-12 gap-[1.45vw]'>
                            {
                                dataSource.map((item, index) =>
                                    <div onClick={(e) => { e.stopPropagation; setShowType('detail'); setSelectData(item); }} style={{
                                        display: 'inline-block',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '100% 100%',
                                        height: '180px',
                                        position: 'relative',
                                    }}>
                                        <TypeCard key={index} data={item}
                                            indexValue={index + 1}
                                        />
                                    </div>)
                            }
                        </div>
                    </div>
                </div >;
            case 'subscribed':
                return <div className='mt-[24px]'>
                    <div style={{ justifyContent: 'space-between', fontWeight: '700', backgroundColor: 'white', padding: '16px 16px', marginBottom: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center' }} className='text-[#1C2748] text-[20px] mb-[16px]'>
                        MCP管理
                        <div>
                            <Segmented<string>
                                className="mpcManage-segmented"
                                shape="round"
                                options={[{
                                    label: '官方服务',
                                    value: 'official'
                                }, {
                                    label: '已订阅服务',
                                    value: 'subscribed'
                                }
                                    // , {
                                    //     label: '自定义服务',
                                    //     value: 'customize'
                                    // }
                                ]}
                                onChange={(value) => {
                                    setShowType(value); // string
                                }}
                            />
                        </div>
                        <div></div>
                    </div>
                    <div className='flex flex-col bg-[#fff] rounded-[8px] px-[24px] pt-[24px]' style={{ height: 'calc(100vh - 138px)' }}>
                        <div style={{ textAlign: 'right' }} className='pt-[33px] pb-[22px]'>
                            <Space>
                                {/* <Button type='primary' onClick={() => console.log('aaaaaaaaaaa')}>创建MCP服务</Button> */}
                            </Space>
                        </div>
                        <div className='flex flex-1 flex-wrap overflow-hidden overflow-y-auto pb-12 gap-[1.45vw]'>
                            {
                                dataSource.map((item, index) =>
                                    <div onClick={(e) => { e.stopPropagation; setShowType('detail'); setSelectData(item); }} style={{
                                        display: 'inline-block',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '100% 100%',
                                        height: '180px',
                                        position: 'relative',
                                    }}>
                                        <TypeCardOther changeService={changeService} key={index} data={item}
                                            indexValue={index + 1}
                                        />
                                    </div>)
                            }
                        </div>
                    </div>
                </div>;
            case 'customize':
                return <div className='mt-[24px]'>
                    <div style={{ justifyContent: 'space-between', fontWeight: '700', backgroundColor: 'white', padding: '16px 16px', marginBottom: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center' }} className='text-[#1C2748] text-[20px] mb-[16px]'>
                        MCP管理
                        <div>
                            <Segmented<string>
                                shape={'round'}
                                className="mpcManage-segmented"
                                options={[{
                                    label: '官方服务',
                                    value: 'official'
                                }, {
                                    label: '已订阅服务',
                                    value: 'subscribed'
                                }
                                    // , {
                                    //     label: '自定义服务',
                                    //     value: 'customize'
                                    // }
                                ]}
                                onChange={(value) => {
                                    setShowType(value); // string
                                }}
                            />
                        </div>
                        <div></div>
                    </div>
                    <div className='flex flex-col bg-[#fff] rounded-[8px] px-[24px] pt-[24px]' style={{ height: 'calc(100vh - 138px)' }}>
                        <div style={{ textAlign: 'right' }} className='pt-[33px] pb-[22px]'>
                            <Space>
                                {/* <Button type='primary' onClick={() => console.log('aaaaaaaaaaa')}>创建MCP服务</Button> */}
                            </Space>
                        </div>
                        <div className='flex flex-1 flex-wrap overflow-hidden overflow-y-auto pb-12 gap-[1.45vw]'>
                            {
                                dataSource.map((item, index) =>
                                    <div style={{
                                        display: 'inline-block',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '100% 100%',
                                        height: '180px',
                                        position: 'relative',
                                    }}>
                                        <TypeCardOther changeService={changeService} key={index} data={item}
                                            indexValue={index + 1}
                                        />
                                    </div>)
                            }
                        </div>
                    </div>

                </div>;
            case 'detail':
                return <Detail selectData={selectData} onClose={() => setShowType('official')} />
        }
    }

    return (
        <>
            {getContent(showType)}
        </>
    )
}
export default MpcManage;