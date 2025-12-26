import Image from 'next/image';
import './index.scss';  // 自定义样式文件
import header from '@/public/image/header_agent1.png';
import * as echarts from 'echarts';
import { Col, Row, Tooltip } from 'antd';
import { useEffect } from 'react';
import moment from 'moment';
import React, { useState } from 'react';
import { Table, Space } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import Item from '../../../../components/header/account-setting/api-based-extension-page/item';
import { getAccountList } from '@/service/log'
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
    const [loading, ladindata] = useState(false);

    const { setActiveTab } = props;
    useEffect(() => {
        (
            async () => {
                getAccount()
                // setProvinceEcharts()
                // setProvinceModEcharts()
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
    const getAccount = async () => {
        ladindata(true)
        const res = await getAccountList({ url: '/getAllAccount', body: {} })
        const newArr: any = []
        if (res) {
            res.forEach((item: any) => {
                newArr.push({
                    key: item.id,
                    employee_number: item.employee_number,
                    name: item.name,
                    mobile: item.mobile,
                    first_level_company: item.first_level_company,
                    second_level_company: item.second_level_company,
                    temlist: item.tenant_info.map((ele: { tenant_name: any; }) => ele.tenant_name).join(', '),
                    workflow_count: item.workflow_count,
                    agent_chat_count: item.agent_chat_count
                })
            })
            ladindata(false)
            setDataSource(newArr)
        }
    }
    const columns: TableColumnsType<DataType> = [
        {
            title: '名字',
            dataIndex: 'name',

        },
        {
            title: '员工编码',
            dataIndex: 'employee_number',
            // defaultSortOrder: 'descend',
            // sorter: (a, b) => a.age - b.age,
        },
        {
            title: '手机号',
            dataIndex: 'mobile',
        },
        {
            title: '一级单位',
            dataIndex: 'first_level_company',
        },
        {
            title: '二级单位',
            dataIndex: 'second_level_company',
        },
        {
            title: '所属团队',
            dataIndex: 'temlist',
            width: "300px",
            ellipsis: true, // 使文本超出部分显示为省略号
            render: (text) => (
                <Tooltip title={text}> {/* 鼠标悬浮时显示完整文本 */}
                    <span>{text}</span>
                </Tooltip>
            ),
        },
        {
            title: '名下工作流数',
            dataIndex: 'workflow_count',
        },
        {
            title: '名下智能体数',
            dataIndex: 'agent_chat_count',
        },
        {
            title: '成员管理',
            key: 'action',
            render: (_: any, record: any) => {
                return <a style={{ color: '#216eff' }} onClick={() => handleClick('staffmanagementuodata', { record })}>
                    编辑
                </a>
            }
        },
    ];
    const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra);
    };

    const handleUpdata = async (Item: string) => {
        // console.log('Item', Item);

    };
    const onSearch = async () => {
        // console.log("res<<<<<<<<<")
    }
    const handleClick = (tabName: any, record: any) => {
        setActiveTab(tabName);
        sessionStorage.setItem('record', JSON.stringify(record));
    };
    return (
        <div className="operation-management mt-[24px]">
            <div className='text-user text-[#1C2748] text-[20px] mb-[16px]'>Admin</div>
            <div className="operation-title">
                <div className="operation-left">
                    <div className="operation-bouutm">用户信息管理</div>
                </div>
                <div className="operation-input">
                    <Search placeholder="姓名、⼈⼒编号、⼿机号搜索" onSearch={onSearch} style={{ width: 300 }} />
                </div>
            </div>
            <div style={{ padding: '16px 16px', }}>
                <Table<DataType>
                    columns={columns}
                    loading={loading}
                    dataSource={dataSource}
                    onChange={onChange}
                    showSorterTooltip={{ target: 'sorter-icon' }}
                />
            </div>
        </div>
    )
}

export default staffmanagement;