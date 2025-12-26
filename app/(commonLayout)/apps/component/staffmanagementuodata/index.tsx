import Image from 'next/image';
import './index.scss';  // 自定义样式文件
import header from '@/public/image/header_agent1.png';
import * as echarts from 'echarts';
import { Col, Row, Modal, Select, Cascader, message, Pagination } from 'antd';
import { useEffect, useRef } from 'react';
import moment from 'moment';
import React, { useState } from 'react';
import { Table, Space } from 'antd';
import type { TableColumnsType, TableProps, PaginationProps } from 'antd';
import Item from '../../../../components/header/account-setting/api-based-extension-page/item';
import { updateAccountCompany, getAccountDetail } from '@/service/log'
import { UserOutlined } from '@ant-design/icons';
import TypeCard from './typeCard'
import { getFiveIndex } from '@/utils/var'
import {
    deleteMemberRequest
} from '@/app/(commonLayout)/apps/component/ProjectSpace/member/service'
import type { ProTableConfigInstance } from '@/app/components/custom/pro-table'

type Props = {
    data?: any
    mutate?: any
    setActiveTab?: any
    setCallback?: any

}
import { Input, } from 'antd';
import type { GetProps } from 'antd';
type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;
const staffmanagement: React.FC<Props> = (props) => {
    const [dataSource, setDataSource] = useState<any>([])
    const [selectedRow, setSelectedRow] = useState({});
    const [idnew, idnewdata] = useState("");
    const { setActiveTab } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState<any['options']>([]);
    const [untilListone, setuntilListone] = useState<any['options']>([]);
    const [untilListtwo, setuntilListtwo] = useState<any['options']>([]);
    const [agentinfo, agentinfodata] = useState([]);
    const [agentinfoitem, agentinfodatalist] = useState([]);
    const [workpage, workdatalist] = useState([]);
    const [workflowinfoitem, workflowinfodata] = useState([]);
    const [personage, personagedata] = useState<any>({});
    const [tenant, tenantdata] = useState("");
    const [messageApi] = message.useMessage()
    const proTableRef = useRef<ProTableConfigInstance>()
    const [currentPage, setCurrentPage] = useState("展示更多...");
    const [worktPage, workntPage] = useState("展示更多...");

    useEffect(() => {
        (
            async () => {
                let newdata: any = sessionStorage.getItem('record')
                const storedRecord = JSON.parse(newdata);
                idnewdata(storedRecord.record.key)
                // uodataid
                // console.log("111", storedRecord); // 输出：{ id: 1, name: "John Doe" }
                getAccount(storedRecord.record.key)
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
    interface DataType {
        key: React.Key;
        name: string;
        age: number;
        address: string;
    }
    const getAccount = async (value) => {
        const res: any = await getAccountDetail({ url: `/getAccountDetail/${value}`, })
        const newArr: any = []
        personagedata(res)
        setDataSource(res.tenant_info)
        setuntilListone([res.first_level_company, res.second_level_company])
        agentinfodata(res.agent_info)
        workflowinfodata(res.workflow_info)
        agentinfodatalist(res.workflow_info.slice(0, 6))
        workdatalist(res.agent_info.slice(0, 6))
        // console.log("<<<<<<<", res); // 输出：{ id: 1, name: "John Doe" }
        // console.log("<<<<<<<untilListone", untilListone); // 输出：{ id: 1, name: "John Doe" }
    }
    const columns: TableColumnsType<DataType> = [
        {
            title: '公司名称',
            dataIndex: 'title',
            showSorterTooltip: { target: 'full-header' },
            filters: [
                {
                    text: 'Joe',
                    value: 'Joe',
                },
                {
                    text: 'Jim',
                    value: 'Jim',
                },
                {
                    text: 'Submenu',
                    value: 'Submenu',
                    // children: [
                    //     {
                    //         text: 'Green',
                    //         value: 'Green',
                    //     },
                    //     {
                    //         text: 'Black',
                    //         value: 'Black',
                    //     },
                    // ],
                },
            ],
            // specify the condition of filtering result
            // here is that finding the name started with `value`
            onFilter: (value, record) => record.title.indexOf(value as string) === 0,
            sorter: (a, b) => a.name.length - b.name.length,
            sortDirections: ['descend'],
        },
        {
            title: '员工邮箱',
            dataIndex: 'email',
            // defaultSortOrder: 'descend',
            // sorter: (a, b) => a.age - b.age,
        },
        {
            title: '员工工号',
            dataIndex: 'employee_number',
            // defaultSortOrder: 'descend',
            // sorter: (a, b) => a.age - b.age,
        },
        {
            title: '员工名字',
            dataIndex: 'name',
            defaultSortOrder: 'descend',
            onFilter: (value, record) => record.name.indexOf(value as string) === 0,
            sorter: (a, b) => {
                const firstLetterA = a.name.charAt(0).toLowerCase();
                const firstLetterB = b.name.charAt(0).toLowerCase();
                if (firstLetterA < firstLetterB) return -1;
                if (firstLetterA > firstLetterB) return 1;
                return 0;
            },
        },
        {
            title: '成员管理',
            key: 'action',
            render: (_: any, record: any) => {
                // console.log(_, record);
                return <a style={{ color: '#216eff' }} onClick={() => setActiveTab('dcoos-sign')}>
                    编辑
                </a>
                //    return  <Space>
                //       <Button type='primary' onClick={() => setActiveTab('dcoos-sign')}>API注册</Button>
                //    </Space>
            }
        },
    ];
    const handleUpdata = async (Item: string) => {
        console.log('Item', Item);

    };
    const onSearch = async () => {
        console.log("res<<<<<<<<<")
    }
    let list = [
        {
            label: "所属团队1"
        },
        {
            label: "所属团队2"
        },
        {
            label: "所属团队3"
        },
        {
            label: "所属团队4"
        },
        {
            label: "所属团队5"
        }
    ]
    let data = {
        data: [

            {
                created_at: "2025-04-22T15:15:24",
                description
                    :
                    "宽带智能体",
                header_image
                    :
                    "header_agent1",
                icon
                    :
                    null,
                icon_background
                    :
                    null,
                id
                    :
                    "f9c5f2ac-3dad-40a9-962d-1964e629748c",
                is_auditing
                    :
                    false,
                mode
                    :
                    "agent-chat",
                name
                    :
                    "宽带智能体_20250427163408",
                status
                    :
                    "published",
                tags
                    :
                    []
            },
            {
                created_at: "2025-04-22T15:15:24",
                description
                    :
                    "宽带智能体",
                header_image
                    :
                    "header_agent1",
                icon
                    :
                    null,
                icon_background
                    :
                    null,
                id
                    :
                    "f9c5f2ac-3dad-40a9-962d-1964e629748c",
                is_auditing
                    :
                    false,
                mode
                    :
                    "agent-chat",
                name
                    :
                    "宽带智能体_20250427163408",
                status
                    :
                    "published",
                tags
                    :
                    []
            },
            {
                created_at: "2025-04-22T15:15:24",
                description
                    :
                    "宽带智能体",
                header_image
                    :
                    "header_agent1",
                icon
                    :
                    null,
                icon_background
                    :
                    null,
                id
                    :
                    "f9c5f2ac-3dad-40a9-962d-1964e629748c",
                is_auditing
                    :
                    false,
                mode
                    :
                    "agent-chat",
                name
                    :
                    "宽带智能体_20250427163408",
                status
                    :
                    "published",
                tags
                    :
                    []
            }
        ]
    }
    const optionList = [
        {
            label: '集团总部',
            value: "集团总部",
            children: [
                {
                    label: '纪检监察组',
                    value: '纪检监察组',
                }, {
                    label: '办公室（党组办公室、董事会办公室、安全保卫部）',
                    value: '办公室（党组办公室、董事会办公室、安全保卫部）',
                }, {
                    label: '企业战略部',
                    value: '企业战略部',
                }, {
                    label: '市场部',
                    value: '市场部',
                }, {
                    label: '人力资源部（党组组织部）',
                    value: '人力资源部（党组组织部）',
                }, {
                    label: '财务部',
                    value: '财务部',
                }, {
                    label: '云网发展部（国际部）',
                    value: '云网发展部（国际部）',
                }, {
                    label: '云网运营部',
                    value: '云网运营部',
                }, {
                    label: '客户服务部',
                    value: '客户服务部',
                }, {
                    label: '网络和信息安全管理部',
                    value: '网络和信息安全管理部',
                }, {
                    label: '审计部',
                    value: '审计部',
                }, {
                    label: '法律部（合规管理部）',
                    value: '法律部（合规管理部）',
                }, {
                    label: '科技创新部',
                    value: '科技创新部',
                }, {
                    label: '党组巡视工作领导小组办公室',
                    value: '党组巡视工作领导小组办公室',
                }, {
                    label: '党群工作部',
                    value: '党群工作部',
                }, {
                    label: '集团工会',
                    value: '集团工会'
                }, {
                    label: '投资者关系部',
                    value: '投资者关系部'
                }, {
                    label: '5G共建共享工作组',
                    value: '5G共建共享工作组'
                }, {
                    label: '资本运营部（中国电信集团投资有限公司）',
                    value: '资本运营部（中国电信集团投资有限公司）'
                }, {
                    label: '政企信息服务事业群',
                    value: '政企信息服务事业群'
                }, {
                    label: '全渠道运营中心',
                    value: '全渠道运营中心'
                }, {
                    label: '采购供应链管理中心',
                    value: '采购供应链管理中心'
                }, {
                    label: '数据发展中心',
                    value: '数据发展中心'
                }
            ]

        }, {
            label: '各省、自治区、直辖市公司',
            value: '各省、自治区、直辖市公司',
            children: [
                {
                    label: '北京公司',
                    value: '北京公司'
                }, {
                    label: '天津公司',
                    value: '天津公司'
                }, {
                    label: '河北公司',
                    value: '河北公司'
                }, {
                    label: '山西公司',
                    value: '山西公司'
                }, {
                    label: '内蒙古公司',
                    value: '内蒙古公司'
                }, {
                    label: '辽宁公司',
                    value: '辽宁公司'
                }, {
                    label: '吉林公司',
                    value: '吉林公司'
                }, {
                    label: '黑龙江公司',
                    value: '黑龙江公司'
                }, {
                    label: '上海公司',
                    value: '上海公司'
                }, {
                    label: '江苏公司',
                    value: '江苏公司'
                }, {
                    label: '浙江公司',
                    value: '浙江公司'
                }, {
                    label: '安徽公司',
                    value: '安徽公司'
                }, {
                    label: '福建公司',
                    value: '福建公司'
                }, {
                    label: '江西公司',
                    value: '江西公司'
                }, {
                    label: '山东公司',
                    value: '山东公司'
                }, {
                    label: '河南公司',
                    value: '河南公司'
                }, {
                    label: '湖北公司',
                    value: '湖北公司'
                }, {
                    label: '湖南公司',
                    value: '湖南公司'
                }, {
                    label: '广东公司',
                    value: '广东公司'
                }, {
                    label: '广西公司',
                    value: '广西公司'
                }, {
                    label: '海南公司',
                    value: '海南公司'
                }, {
                    label: '重庆公司',
                    value: '重庆公司'
                }, {
                    label: '四川公司',
                    value: '四川公司'
                }, {
                    label: '贵州公司',
                    value: '贵州公司'
                }, {
                    label: '云南公司',
                    value: '云南公司'
                }, {
                    label: '西藏公司',
                    value: '西藏公司'
                }, {
                    label: '陕西公司',
                    value: '陕西公司'
                }, {
                    label: '甘肃公司',
                    value: '甘肃公司'
                }, {
                    label: '青海公司',
                    value: '青海公司'
                }, {
                    label: '宁夏公司',
                    value: '宁夏公司'
                }, {
                    label: '新疆公司',
                    value: '新疆公司'
                },
            ]
        }, {
            label: '专业公司及运营单位',
            value: '专业公司及运营单位',
            children: [
                {
                    label: '中国通信服务股份有限公司',
                    value: '中国通信服务股份有限公司',
                }, {
                    label: '国际公司',
                    value: '国际公司',
                }, {
                    label: '新国脉数字文化股份有限公司',
                    value: '新国脉数字文化股份有限公司',
                }, {
                    label: '号百信息服务有限公司',
                    value: '号百信息服务有限公司',
                }, {
                    label: '中电信数智科技有限公司',
                    value: '中电信数智科技有限公司',
                }, {
                    label: '天翼电信终端有限公司',
                    value: '天翼电信终端有限公司',
                }, {
                    label: '信元公众信息发展有限责任公司',
                    value: '信元公众信息发展有限责任公司',
                }, {
                    label: '卫星通信有限公司',
                    value: '卫星通信有限公司',
                }, {
                    label: '天翼支付科技有限公司',
                    value: '天翼支付科技有限公司',
                }, {
                    label: '天翼云科技有限公司',
                    value: '天翼云科技有限公司',
                }, {
                    label: '天翼科技创业投资有限公司',
                    value: '天翼科技创业投资有限公司',
                }, {
                    label: '天翼物联科技有限公司',
                    value: '天翼物联科技有限公司',
                }, {
                    label: '天翼数字生活科技有限公司',
                    value: '天翼数字生活科技有限公司',
                }, {
                    label: '财务公司',
                    value: '财务公司',
                }, {
                    label: '天翼融资租赁有限公司',
                    value: '天翼融资租赁有限公司',
                }, {
                    label: '人工智能公司',
                    value: '人工智能公司',
                }, {
                    label: '天翼安全科技有限公司',
                    value: '天翼安全科技有限公司',
                }, {
                    label: '中电信量子信息科技集团有限公司',
                    value: '中电信量子信息科技集团有限公司',
                }, {
                    label: '天翼视联科技有限公司',
                    value: '天翼视联科技有限公司',
                }, {
                    label: '中电信翼康科技有限公司',
                    value: '中电信翼康科技有限公司',
                }, {
                    label: '中电信翼智教育科技有限公司',
                    value: '中电信翼智教育科技有限公司',
                }, {
                    label: '中电信翼金科技有限公司',
                    value: '中电信翼金科技有限公司',
                }, {
                    label: '中电信数政科技有限公司',
                    value: '中电信数政科技有限公司',
                }, {
                    label: '中电信文宣科技有限公司',
                    value: '中电信文宣科技有限公司',
                }, {
                    label: '中电信应急通信有限公司',
                    value: '中电信应急通信有限公司',
                }
            ]
        }, {
            label: '总部直属分支机构',
            value: '总部直属分支机构',
            children: [
                {
                    label: '中国电信股份有限公司研究院',
                    value: '中国电信股份有限公司研究院',
                }, {
                    label: '中国电信云计算研究院',
                    value: '中国电信云计算研究院',
                }, {
                    label: '中国电信人工智能研究院',
                    value: '中国电信人工智能研究院',
                }, {
                    label: '中国电信人才发展中心',
                    value: '中国电信人才发展中心',
                }, {
                    label: '中国电信博物馆',
                    value: '中国电信博物馆',
                }
            ]
        }
    ]
    const handleOk = async () => {
        debugger
        const res = await deleteMemberRequest(tenant, personage.id)
        debugger
        if (res.result == "success") {
            getAccount(idnew)
            message.success('修改成功')
            setIsModalOpen(false);
            proTableRef.current?.onRefresh()
        } else {
            message.error('改成员不可删除')
            setIsModalOpen(false);
        }
    }
    const handleCancel = () => {
        setIsModalOpen(false);

    };
    const showModal = async () => {

        const res = await updateAccountCompany({
            url: '/updateAccountCompany', body: {
                account_id: personage.id,
                first_level_company: untilListone[0],
                second_level_company: untilListone[1]
            }
        })
        if (res.result == "success") {
            message.success('修改成功')
        }
    };
    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
    };
    const onChangecas = (value, selectedOptions) => {
        // console.log("1111", value); // 选中的值
        // console.log("222", selectedOptions); // 选中的选项对象
        setuntilListone(value); // 更新选中的值
    };
    const deleteMember = (account_id: string) => {
        tenantdata(account_id)
        setIsModalOpen(true)
    }
    const handlePageChange = () => {
        // setCurrentPage(page);
        // const startIndex = (currentPage - 1) * 6;
        // const endIndex = startIndex + 6;
        //  currentData = workflowinfo.slice(startIndex, endIndex);

        if (currentPage === "展示更多...") {
            agentinfodatalist(agentinfo)
            setCurrentPage("收起")
        } else {
            agentinfodatalist(agentinfo.slice(0, 6))
            setCurrentPage("展示更多...")
        }
    };
    const workPageChange = () => {
        // workntPage(page);
        // const startIndex = (worktPage - 1) * 6;
        // const endIndex = startIndex + 6;
        //  currentData = workflowinfo.slice(startIndex, endIndex);
        // workdatalist(workflowinfoitem)
        if (worktPage === "展示更多...") {
            workdatalist(workflowinfoitem)
            workntPage("收起")
        } else {
            workdatalist(workflowinfoitem.slice(0, 6))
            workntPage("展示更多...")
        }
    };
    return (
        <>

            <div className="operation-management mt-[24px]">
                <div className='text-user mt-[24px]'>
                    <div className='flex items-center mb-[16px]'>
                        <div style={{ fontSize: '24px', color: 'black', marginRight: '10px', cursor: 'pointer', fontWeight: '700', marginTop: '-6px' }} onClick={() => {
                            setActiveTab('staffmanagement')
                        }}>
                            &lt;
                        </div>
                        <div className='text-[#1C2748] text-[16px] font-bold'>编辑</div>
                    </div>
                </div>
                <div className="operation-title">
                    <div className="operation-left">
                        <div className="operation-bouutm">用户信息管理</div>
                    </div>
                    <div className="operation-input">
                        <Search placeholder="姓名、⼈⼒编号、⼿机号搜索" onSearch={onSearch} style={{ width: 300 }} />
                    </div>
                </div>
                <div className="operation-update">
                    <div className="operation-table" >
                        <div className='title'>
                            <div className='icon'><UserOutlined style={{ fontSize: '18px', color: '#fff', }} /></div>
                            <div className='name'>{personage.name ? personage.name : ""}</div>
                        </div>
                        <div className='frist-th'>
                            <div className='lable'>所属单位</div>
                            <div className='value'>
                                <div className='item'>
                                    <Cascader value={untilListone} options={optionList} onChange={onChangecas} />
                                </div>
                                <div className='update' onClick={() => showModal()}>修改</div>
                            </div>

                        </div>
                        {/* <div className='frist-th'>
                            <div className='lable'>二级单位</div>
                            <div className='value'>
                               
                                <div className='update' onClick={() => showModal(2)}>修改</div>
                            </div>
                        </div> */}
                        <div className='last-th'>
                            <div className='last-lable'>所属团队</div>
                            <div className='until'>
                                {dataSource.map((item: any, index: any) => (
                                    <div key={index} className='until-item'>
                                        {item.role === "normal" ? (
                                            <span onClick={() => deleteMember(item.tenant_id)}>
                                                {item.tenant_name}
                                                <span className='delete'>移除</span>
                                            </span>
                                        ) : (
                                            <span>{item.tenant_name}
                                                <span className='allonwe'>管理员无法移除</span>
                                            </span>
                                        )}
                                    </div>

                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='mcard'>
                        <div className='text'>名下智能体</div>
                        <div className='flex flex-col bg-[#fff] rounded-[8px] px-[24px] pt-[24px]' >
                            {/* <div className='pt-[33px] pb-[22px]'>
                                        <Space>
                                          <Button type='primary' disabled>上架Agent</Button>
                                          <Button type='primary' onClick={() => setIsAddOpen({
                                            isOpen: true,
                                            title: '创建Agent',
                                            mode: 'agent-chat',
                                          })}>创建Agent</Button>
                                        </Space>
                                      </div> */}
                            <div className='flex-1 w-[100%] overflow-y-auto' >
                                <div className='flex flex-1 flex-wrap overflow-hidden overflow-y-auto pb-12 gap-[1.45vw]'>
                                    {agentinfoitem.map((item, index) => <TypeCard key={index} data={item}
                                        headerImg='header_agent1'
                                        indexValue={index + 1}
                                        styleCss={{ backgroundImage: `url('/agent-platform-web/bg/agentChatBg${getFiveIndex(index + 1)}.png')` }}
                                        menuItmes={[{ key: '2', label: '插件广场' }, { key: '3', label: '工作流' }]}
                                    />)}
                                </div>
                            </div>

                        </div>
                        <div className='paginaton' onClick={() => handlePageChange()}>
                            {/* <Pagination
                                defaultCurrent={1}
                                total={agentinfo.length}
                                pageSize={6}
                                current={currentPage}
                                onChange={handlePageChange}
                            /> */}
                            {currentPage}
                        </div>
                    </div>
                    <div className='mcard'>
                        <div className='text'>名下工作流</div>
                        <div className='flex flex-col bg-[#fff] rounded-[8px] px-[24px] pt-[24px]' >
                            {/* <div className='pt-[33px] pb-[22px]'>
                                        <Space>
                                          <Button type='primary' disabled>上架Agent</Button>
                                          <Button type='primary' onClick={() => setIsAddOpen({
                                            isOpen: true,
                                            title: '创建Agent',
                                            mode: 'agent-chat',
                                          })}>创建Agent</Button>
                                        </Space>
                                      </div> */}
                            <div className='flex-1 w-[100%] overflow-y-auto' >
                                <div className='flex flex-1 flex-wrap overflow-hidden overflow-y-auto pb-12 gap-[1.45vw]'>
                                    {workpage.map((item, index) => (
                                        <TypeCard key={index} data={item}
                                            indexValue={index + 1}
                                            styleCss={{ backgroundImage: `url('/agent-platform-web/bg/workflowBg${getFiveIndex(index + 1)}.png')` }}
                                            menuItmes={[{ key: '1', label: '智能体广场' }, { key: '3', label: '插件广场' }]}
                                        />
                                    ))}
                                </div>
                            </div>

                        </div>
                        <div className='paginaton' onClick={() => workPageChange()}>
                            {/* <Pagination
                                defaultCurrent={1}
                                total={workflowinfoitem.length}
                                pageSize={6}
                                current={worktPage}
                                onChange={workPageChange}
                            /> */}
                            {worktPage}
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                title="确定要删除改成员吗?"
                okText="确认"
                cancelText="取消"
                open={isModalOpen}
                onOk={() => handleOk()}
                onCancel={handleCancel}
                style={{ width: 200, justifyContent: "center", alignItems: "center" }}
            >

            </Modal>

        </>

    )
}

export default staffmanagement;