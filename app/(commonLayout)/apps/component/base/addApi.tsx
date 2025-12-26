import React, { useEffect, useState } from 'react'
import { Tabs, Modal, Button, Popconfirm, message, Switch } from 'antd';
import type { PopconfirmProps } from 'antd';
import TextArea from "antd/es/input/TextArea";
import type { TabsProps } from 'antd';
import ApiAdd from './apiAdd'
import ApiTextArea from './apiTextArea';
import DataList from './dataList'
type Props = {
    isOpen: boolean
    onClose: () => void
    titleModa: string
    // setListData umi: () => void
}

const addApi: React.FC<Props> = (props) => {
    const style: React.CSSProperties = { background: '#0092ff', padding: '8px 0' };
    const { isOpen, onClose, titleModa, } = props
    const [titleModal, setModal] = useState(isOpen)
    const [tab, setTab] = useState(0)
    // IP黑白名单
    const [addressBlacklist, setAddressBlacklist] = useState('')
    const [addressWhitelist, setAddressWhitelist] = useState('')
    const handleOk = () => {
        if (tab == 0) {
            console.log('000');
        } else if (tab == 1) {
            console.log('1111');
        } else if (tab == 2) {
            console.log('22222');
        } else if (tab == 3) {
            console.log('333333');
        } else if (tab == 4) {
            console.log('444444');
        } else if (tab == 5) {
            console.log('5555');
        } else if (tab == 6) {
            console.log('666');
        } else if (tab == 7) {
            console.log('777');
        }
        // setModal(!isOpen)
    }
    const handleCancel = () => {
        setModal(!isOpen)
    }
    const onChange = (key: number) => {
        setTab(key)
    };

    const columns = [
        {
            title: 'key',
            dataIndex: 'key',
            key: 'key',
            with: "20%"
        },
        {
            title: 'value',
            dataIndex: 'value',
            key: 'value',
            with: "30%"
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            with: "30%"
        },
        {
            title: '操作', with: "20%",
            render: (item: any) => {
                return <>
                    <button
                        style={{ color: "#1B66FF ", marginRight: "10px" }}
                        onClick={() => edit(item)}
                    >编辑
                    </button>
                    <Popconfirm
                        title="您确定要删除此任务吗？"
                        onConfirm={() => confirm(item.key)}
                        onCancel={cancel}
                        okText="是"
                        cancelText="否"
                    >
                        <button
                            style={{ color: "#1B66FF " }}

                        >删除</button>
                    </Popconfirm >
                </>
            }
        },
    ];
    const dataSource = [
        {
            key: '1',
            value: 'key',
            description: 32,
            address: '西湖区湖底公园1号',

        },
        {
            key: '1',
            value: 'key',
            description: 32,
            address: '西湖区湖底公园1号',

        },
        {
            key: '1',
            value: 'key',
            description: 32,
            address: '西湖区湖底公园1号',

        },
        {
            key: '1',
            value: 'key',
            description: 32,
            address: '西湖区湖底公园1号',

        },
        {
            key: '1',
            value: 'key',
            description: 32,
            address: '西湖区湖底公园1号',

        },
    ];
    const columns1 = [
        {
            title: '字段名',
            dataIndex: 'fieldName',
            key: 'fieldName',

        },
        {
            title: '变量名',
            dataIndex: 'VariableName',
            key: 'VariableName',
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: '位置',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: '是否必填',
            dataIndex: 'Required',
            key: 'Required',
            // reduce: (item: any) => {
            //     return (
            //         // <Switch defaultChecked onChange={() => onChangeSwitch(item)} />
            //     )
            // }
        },
        {
            title: '示例值',
            dataIndex: 'ExampleValues',
            key: 'ExampleValues',
        },
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',

        },
        {
            title: '操作', with: "20%",
            render: (item: any) => {
                return <>
                    <button
                        style={{ color: "#1B66FF ", marginRight: "10px" }}
                        onClick={() => edit(item)}
                    >编辑
                    </button>
                    <Popconfirm
                        title="您确定要删除此任务吗？"
                        onConfirm={() => confirm(item.key)}
                        onCancel={cancel}
                        okText="是"
                        cancelText="否"
                    >
                        <button
                            style={{ color: "#1B66FF " }}

                        >删除</button>
                    </Popconfirm >
                </>
            }
        },
    ];
    const dataSource1 = [
        {
            fieldName: '1',
            VariableName: 'key',
            type: 32,
            location: '西湖区湖底公园1号',
            Required: <Switch defaultChecked onChange={() => onChangeSwitch(true)} />,
            ExampleValues: 'key',
            description: 32,

        },

    ];
    const onChangeSwitch = (checked: boolean) => {
        console.log(`switch to ${checked}`);
    };
    const edit = (id: string) => {

    }
    const confirm: PopconfirmProps['onConfirm'] = async (e: any) => {

        message.success('删除成功');
    };
    const cancel: PopconfirmProps['onCancel'] = (e) => {
        console.log(e);
        message.error('删除失败');
    };
    const [regionApi, setRegion] = useState([{ value: 'publicPersonal', label: '发布到个人空间' }, { value: 'publicAudit', label: '发布到广场' },])
    const items: TabsProps['items'] = [
        {
            key: '0',
            label: '接口基本信息',
            children: <ApiAdd onHandleOk={() => handleOk()} titleModa={titleModa} ApiaddOpen={true} onClose={function (): void { }} />
        },
        {
            key: '1',
            label: 'Headers',
            children: <DataList dataList='API管理' dataSource={dataSource} onClose={function (): void {
                throw new Error('Function not implemented.');
            }} columns={columns} />,
        },
        {
            key: '2',
            label: '预请求脚本',
            children: <ApiTextArea ApiaddOpen={false} onClose={function (): void {
                throw new Error('Function not implemented.');
            }} />,
        },
        {
            key: '3',
            label: '输入参数',
            children: <DataList dataList='API管理' dataSource={dataSource1} onClose={function (): void {
                throw new Error('Function not implemented.');
            }} columns={columns1} />,
        },
        {
            key: '4',
            label: '请求示例',
            children: <ApiTextArea ApiaddOpen={false} onClose={function (): void {
                throw new Error('Function not implemented.');
            }} />,
        },
        {
            key: '5',
            label: '输出参数',
            children: <DataList dataList='API管理' dataSource={dataSource1} onClose={function (): void {
                throw new Error('Function not implemented.');
            }} columns={columns1} />,
        },
        {
            key: '6',
            label: '返回示例',
            children: <ApiTextArea ApiaddOpen={false} onClose={function (): void {
                throw new Error('Function not implemented.');
            }} />,
        },
    ];

    const [apiLis, setApiList] = useState(false)
    const apiList = () => {
        setApiList(false)
    }
    const handApi = () => {
        setApiList(false)
    }
    return (
        <div>
            <Modal
                // className={styles.modalGlobal}
                title='编辑'
                open={titleModal}
                onOk={handleOk}
                onCancel={handleCancel}
                width={750}
                okText='确定'
                cancelText='取消'
            >
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            </Modal>
            <Modal
                // className={styles.modalGlobal}
                title='填写IP黑白名单'
                open={apiLis}
                onOk={apiList}
                onCancel={handApi}

                okText='确定'
                cancelText='取消'

            >
                <div>
                    <p className='h-[20px] text-base font-medium mb-[20px]'>IP白名单<span style={{ color: "red" }}>*</span></p>
                    <TextArea
                        onChange={(e: any) => {
                            setAddressWhitelist(e.target.value);
                        }}
                        maxLength={200}
                        rows={3}
                        placeholder={"请输入"}
                    />

                </div>  <div>
                    <p className='h-[20px] text-base font-medium mb-[20px]'>IP黑名单<span style={{ color: "red" }}>*</span></p>
                    <TextArea
                        onChange={(e: any) => {
                            setAddressBlacklist(e.target.value);
                        }}
                        maxLength={200}
                        rows={3}
                        placeholder={"请输入"}
                    />

                </div>
            </Modal>
        </div>
    )
}

export default addApi
