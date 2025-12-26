'use client'

import { Button, Segmented, Space, Layout, Radio, Slider, Row, Col, Table, Input, InputNumber, Switch } from 'antd';
import React, { useEffect, useState } from 'react'
import { OpenType } from '../base/addModal';
import { Modal, Popconfirm, message } from 'antd';
import { DeleteOutlined, PlusSquareOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import './index.scss';  // 自定义样式文件
import { useAppContext } from '@/context/app-context';
import { getHistoryMint, getKbFileList, getKnowQuery, delete_docume } from '@/service/apps';
import AddModalStudyBase from '../base/addModalStudyBase';
import hitHit from '@/public/bg/hit_hit.png'
import hitFile from '@/public/bg/hit_file.png'
import { formatDateString } from '@/utils';
import studyBase_1 from '@/public/image/studyBase_1.png'
import studyBase_2 from '@/public/image/studyBase_2.png'
import studyBase_3 from '@/public/image/studyBase_3.png'
import studyBase_4 from '@/public/image/studyBase_4.png'
import Image from 'next/image'
import type { TableColumnsType, TableProps } from 'antd';
const { Header, Footer, Sider, Content } = Layout;

// useEffect(() => {
//     // 页面加载时调用 kb_file_list 接口
//     const fetchKbFileList = async () => {
//         try {
//             const response = await fetch('http://IP地址:端口号/kb_file_list', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     kb_id: 123456, // 你可以通过 props 或者状态动态传递这个值
//                 }),
//             })

//             const result = await response.json()

//             if (result.status === 'successful') {
//                 setListData(result.kb_file_list) // 将返回的文件列表存入 listData
//             } else {
//                 console.error('接口调用失败:', result.status)
//             }
//         } catch (error) {
//             console.error('接口请求出错:', error)
//         } finally {
//         }
//     }

//     fetchKbFileList()
// }, []) // 只在组件挂载时调用一次



const FileList: React.FC = (props) => {
    const { fromSource, tenant_id, alter_database_name } = props as any;
    console.log("alter_database_name--------------->", alter_database_name)
    const { userProfile }: any = useAppContext();
    useEffect(() => {
        (
            async () => {
                getHistoryMint()
                getTableList()
            }
        )()
    }, [])

    // 展示文件列表数据开始
    interface FileData {
        // key: React.Key;
        file_name: string;
        num_chars: string;
        hit_count: string;
        creation_time: string;
        status: string;
    }

    const initialData: FileData[] = [
        {
            // key: "1",
            file_name: "document1.txt",
            num_chars: "1200",
            hit_count: "15",
            creation_time: "2024-03-05 12:30:00",
            status: "启动中",
        },
    ];

    // const [data, setData] = useState<FileData[]>(initialData);useState([])
    //   const handleDelete = (key: React.Key) => {
    //     setData((prevData) => prevData.filter((item) => item.key !== key));
    //   };



    const columns_new: TableColumnsType<FileData> = [
        {
            title: "文件名",
            dataIndex: "file_name",
            key: "file_name",
            width: "25%",
        },
        {
            title: "字符数",
            dataIndex: "num_chars",
            key: "num_chars",
            width: "15%",
        },
        {
            title: "命中次数",
            dataIndex: "hit_count",
            key: "hit_count",
            width: "15%",
        },
        {
            title: "上传时间",
            dataIndex: "creation_time",
            key: "creation_time",
            sorter: (a, b) => new Date(a.creation_time).getTime() - new Date(b.creation_time).getTime(),
            width: "20%",
        },
        {
            title: "状态",
            dataIndex: "status",
            key: "status",
            width: "15%",
            render: (text) => text || "启动中", // 如果 text 为空，则显示 "启动中"
        },
        {
            title: "操作",
            key: "action",
            render: (_, record) => (
                <Button type="link" danger onClick={() => handleDelete(record.file_name)}>
                    删除
                </Button>
            ),
            width: "10%",
        },
    ];

    // 列表数据结束


    const getTableList = async (current?: any, pageSize?: any) => {
        const { selectedRow } = props as any;
        try {

            const param = { kb_id: selectedRow.studyBaseId } as any;
            if (fromSource === 'workSpaceSecondPage') {
                param.tenant_id = tenant_id;
            }
            const response: any = await getKbFileList({
                url: '/kb_file_list',
                body: {
                    ...param
                }
            })

            const result = await response
            if (result.status === "successful") {
                console.log("response.kb_file_list", response.kb_file_list)
                // const timer = setTimeout(() => {
                setListData(response.kb_file_list)
                // }, 0)
            } else {
                message.error('查询失败')
                // localStorage.setItem('console_token', '')
            }
        } catch (error) {
            message.error('请求失败，请检查网络或稍后重试')
            console.error('请求错误:', error)

        }
    }
    const getHistoryMint = async () => {
        const { selectedRow } = props as any;

        try {

            const param = { kb_id: selectedRow.studyBaseId } as any;
            if (fromSource === 'workSpaceSecondPage') {
                param.tenant_id = tenant_id;
            }
            const response: any = await getKbFileList({
                url: '/history_mint',
                body: {
                    ...param
                }
            })


            const result = await response
            if (result.status === "successful") {
                const timer = setTimeout(() => {
                    setDataSource(response.mint_list)

                }, 0)
            } else {
                message.error('查询失败')
                // localStorage.setItem('console_token', '')
            }
        } catch (error) {
            message.error('请求失败，请检查网络或稍后重试')
            console.error('请求错误:', error)

        }
    }

    const getHitData = async () => {
        const { selectedRow } = props as any;
        let areastr = "";
        if (showType === 'file') {
            areastr = "app"
        } else if (showType === 'test') {
            areastr = "kb"
        }
        try {

            const param = {
                area: areastr,
                kb_id: selectedRow.studyBaseId,
                top_k: maxNum,
                query: hitText
            } as any;
            if (fromSource === 'workSpaceSecondPage') {
                param.tenant_id = tenant_id;
            }
            const response: any = await getKnowQuery({
                url: '/know_query',
                body: {
                    ...param
                }
            })


            const result = await response
            if (result.status === "successful") {
                getHistoryMint();
                const timer = setTimeout(() => {
                    setHitData(response.answers)

                }, 0)
            } else {
                message.error('查询失败')
                // localStorage.setItem('console_token', '')
            }
        } catch (error) {
            message.error('请求失败，请检查网络或稍后重试')
            console.error('请求错误:', error)

        }
    }

    const columns = [
        {
            title: '检索区域',
            key: 'search_area',
            dataIndex: 'search_area',
            width: '60px',
        },
        {
            title: '检索文案',
            key: 'search_text',
            dataIndex: 'search_text',
            width: '120px',
        },
        {
            title: '命中时间',
            key: 'hit_time',
            dataIndex: 'hit_time',
            width: '60px',
            render: (val: string) => formatDateString(val),
        }
    ]

    const [showType, setShowType] = useState('file');
    const [hitText, setHitText] = useState('');
    const [dataSource, setDataSource] = useState([]);
    const [hitData, setHitData] = useState([]);
    const [maxNum, setMaxNum] = useState(20);
    const [endAdjust, setEndAdjust] = useState(false);

    const [isAddOpen, setIsAddOpen] = useState<OpenType>({
        isOpen: false,
        title: '',
        mode: 'agent-chat',
    })

    const getDataResult = () => {

        getHistoryMint();
        getHitData()
    }

    const [listData, setListData] = useState([])
    // 模拟数据
    // const listDataValue = [
    //     { id: 1, imgSrc: '/agent-platform-web/bg/wenjian@1x.png', text: '内容 1' },
    //     { id: 2, imgSrc: '/agent-platform-web/bg/wenjian@1x.png', text: '内容 2' },
    //     { id: 3, imgSrc: '/agent-platform-web/bg/wenjian@1x.png', text: '内容 3' },
    // ];

    const [modalVisible, setModalVisible] = useState(false);

    // 删除项的处理函数
    const handleDelete = async (filename: string) => {
        const { selectedRow } = props as any;
        try {
            const response: any = await delete_docume({
                url: '/delete_document',
                body: {
                    kb_id: selectedRow.studyBaseId,
                    file_name: filename,
                    tenant_id: tenant_id
                }
            })

            const result = await response
            if (result.status === "successful") {
                // message.info("删除成功")
                message.success(`已删除内容 ${filename}`);
                getTableList()
            } else {
                message.error('删除失败')
                // localStorage.setItem('console_token', '')
            }
        } catch (error) {
            message.error('请求失败，请检查网络或稍后重试')
            console.error('请求错误:', error)

        }
    };

    const getImage = (key: any) => {
        switch (key) {
            case '1':
                return <Image src={studyBase_1} alt='Left Image' className="left-image" />;
            case '2':
                return <Image src={studyBase_2} alt='Left Image' className="left-image" />;
            case '3':
                return <Image src={studyBase_3} alt='Left Image' className="left-image" />;
            case '4':
                return <Image src={studyBase_4} alt='Left Image' className="left-image" />;
        }
    }

    // 打开模态框
    const openModal = () => {
        const { changeShowTypePage } = props as any;
        changeShowTypePage();
        // setModalVisible(true);
    };

    // 关闭模态框
    const closeModal = () => {
        // setModalVisible(false);
    };


    const { editFileList, selectedRow } = props as any;

    return (
        <div className='mt-[24px]'>
            <div style={{ justifyContent: 'space-between', backgroundColor: 'white', padding: '16px 16px', marginBottom: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', fontWeight: '700' }} className='text-[#1C2748] text-[20px] mb-[16px]'>
                知识库

                <div style={{ marginRight: '50%' }}>
                    <Segmented
                        value={showType}
                        options={[{ label: '文件', value: 'file' }, { label: '命中测试', value: 'test' }, { label: '命中历史', value: 'table' }]}
                        onChange={value => setShowType(value)}
                    />
                </div>
            </div>
            <div style={{ backgroundColor: 'white', height: 'calc(100vh - 138px)' }} className="page-container ">
                <header className="header-container">
                    <div className="text-and-image-container">
                        <div style={{ cursor: 'pointer' }} onClick={() => props.changeShowTypePage('main')} className="left-symbol">
                            &lt;
                        </div>
                        {/* <img src="/agent-platform-web/bg/zhishi@1x.png" alt="Left Image" className="left-image" /> */}
                        {getImage(selectedRow?.studyBaseIcon || '2')}
                        <div className="text-container">

                            <div className="text-line1"><span style={{ marginRight: '8px' }}>{alter_database_name || selectedRow.studyBaseName}</span>
                                <img src="/agent-platform-web/bg/edit@1x.png" onClick={() => editFileList("edit")} alt="Header Image" className="header-image" />
                            </div>

                            <div className="text-line">
                                <span className="blue-text">{'600.53kb'}</span>
                                &nbsp;|&nbsp;
                                <span className="blue-text">{listData.length + '个'}</span>
                            </div>
                        </div>
                    </div>
                    {
                        showType === 'file' &&
                        <Button type="primary" onClick={openModal} className="add-btn">
                            <PlusSquareOutlined />
                            添加内容
                        </Button>
                    }

                </header>
                {/* 列表部分 */
                    showType === 'file' && <Table<FileData> columns={columns_new} dataSource={listData} />

                }
                {/*
                    showType === 'file' &&
                    <div className="list">
                        {listData.map(item => (
                            <div className="list-item" key={item}>
                                <img src={'/agent-platform-web/bg/wenjian@1x.png'} alt="item-img" className="list-item-img" />
                                <span>{item}</span>
                                <Popconfirm
                                    title="确定要删除这个内容吗?"
                                    onConfirm={() => handleDelete(item)}
                                    okText="确定"
                                    cancelText="取消"
                                >
                                    <span className="delete-text">
                                        { <DeleteOutlined style={{ color: 'red' }} />
                                    删除 }
                                    </span>
                                </Popconfirm>
                            </div>
                        ))}
                    </div>*/
                }
                {
                    showType === 'test' &&
                    <Layout style={{ width: '100%', height: 'calc(100vh - 300px)', backgroundColor: 'white', overflow: 'auto' }}>
                        <Sider width={'55%'} style={{ height: '100%', backgroundColor: 'white', color: 'black' }}>
                            <div>
                                <div style={{ marginBottom: '4px', fontSize: '15px', fontWeight: '700', paddingTop: '16px' }}>知识检索设置</div>

                                <div style={{ border: '1px solid #d9d9d9', borderRadius: '4px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', marginTop: '8px' }}>
                                        <div>
                                            <div style={{ fontWeight: '700' }}>语义检索 <span style={{ color: 'rgb(128, 128, 128)' }}>(通过匹配文本的内容相似度，检索文本分段)</span></div>
                                        </div>
                                        {/* <div>
                                            <Radio checked={false} />
                                        </div> */}
                                    </div>
                                    <div>
                                        <Row>
                                            <Col style={{ lineHeight: '34px', display: 'flex', alignItems: 'center', flexDirection: 'row', paddingLeft: '12px', marginBottom: '16px' }} span={14}>
                                                最大召回片段数
                                                {/* <QuestionCircleOutlined /> */}
                                                <Slider
                                                    min={3}
                                                    // disabled
                                                    style={{ margin: '0 4px', width: 'calc(100% - 140px)' }}
                                                    max={100}
                                                    value={maxNum}
                                                    onChange={(value) => setMaxNum(value)}
                                                    tooltip={{
                                                        formatter: (value) => (value as number)
                                                    }}
                                                // onChange={onChange}
                                                // value={typeof inputValue === 'number' ? inputValue : 0}
                                                />
                                            </Col>

                                            <Col span={3}>
                                                <InputNumber disabled value={maxNum} onChange={(value) => setMaxNum(value as number)} min={1} max={100} />
                                            </Col>
                                            <Col style={{ width: '100%', lineHeight: '34px', textAlign: 'right' }} span={5}>
                                                结束重排
                                                {/* <QuestionCircleOutlined /> */}
                                                <Switch style={{ marginLeft: '4px' }} checked={endAdjust || true} onChange={(bool) => setEndAdjust(bool)} size={'small'} />
                                            </Col>
                                        </Row>
                                        {/* <div style={{ marginBottom: '8px' }}>
                                            <Row>
                                                <Col style={{ textAlign: 'right', paddingRight: '8px' }} span={6}>
                                                </Col>
                                                <Col span={18}>
                                                </Col>
                                            </Row>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                            <div style={{ marginTop: '4px' }}>
                                {/* <Button size={'small'} type={'primary'}>
                                    编辑
                                </Button> */}

                                <div style={{ height: '100%', color: 'black', width: '100%' }}>
                                    <div style={{ marginBottom: '4px', fontSize: '15px', fontWeight: '700' }}>命中文案</div>
                                    <div style={{ marginBottom: '4px' }}>
                                        <Input.TextArea value={hitText} onChange={(e) => setHitText(e.target.value)} autoSize={{ minRows: 14, maxRows: 14 }} />
                                    </div>
                                    <Button onClick={() => getHitData()} size={'small'} type={'primary'}>
                                        确定
                                    </Button>
                                </div>
                            </div>
                        </Sider>
                        <Content style={{ height: '100%', color: 'black', marginLeft: '55%', padding: '16px' }}>
                            <div style={{ height: '100%', color: 'black', borderRadius: '4px', backgroundColor: '#E6E6FA', padding: '8px 16px', overflow: 'auto' }}>
                                <div style={{ marginBottom: '4px', fontSize: '15px', fontWeight: '700' }}>命中结果</div>
                                {
                                    hitData.map((record, index) =>
                                        <div style={{ backgroundColor: 'white', borderRadius: '4px', padding: '16px', marginBottom: '8px' }} >

                                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 4px', borderBottom: '1px solid #d9d9d9' }}>
                                                <span>
                                                    <Image src={hitFile} alt='img' width={16} height={16} className='inline mt-[-5px]' />
                                                    <span style={{ fontWeight: '700' }}>{record.doc_name}</span>
                                                </span>
                                                <span style={{ borderRadius: '4px', padding: '2px 4px', backgroundColor: '#E6E6FA' }}>
                                                    <Image src={hitHit} alt='img' width={16} height={16} className='inline mt-[-5px]' />
                                                    命中切片
                                                </span>

                                            </div>
                                            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'inline-block', height: '26px', borderRadius: '4px', color: '#1677ff', padding: '2px 4px', backgroundColor: '#E6E6FA' }}>
                                                    {`#${index + 1}`}
                                                </div>
                                                <div style={{ width: '240px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                                    <span style={{ marginRight: '4px' }}>分值:</span>
                                                    <Slider
                                                        style={{ width: 'calc(100% - 80px)' }}
                                                        min={0}
                                                        max={100}
                                                        value={record.score * 100}
                                                        tooltip={{
                                                            formatter: (value) => (value as number) / 100
                                                        }}
                                                    />
                                                    <span>{record.score}</span>
                                                </div>
                                            </div>
                                            <div style={{ marginTop: '8px' }}>
                                                {
                                                    record.text
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </Content>
                    </Layout>

                }

                {
                    showType === 'table' &&
                    <div style={{ marginTop: '16px' }}>
                        {/* <div style={{ marginBottom: '6px', fontSize: '15px', fontWeight: '700' }}>命中历史</div> */}
                        <Table
                            columns={columns}
                            dataSource={dataSource}
                            pagination={false}
                            scroll={{ y: 460 }}
                        />
                    </div>
                }
                {/* 模态框：添加内容 */}
                {/* <Modal
                    title="添加内容"
                    visible={modalVisible}
                    onOk={closeModal}
                    onCancel={closeModal}
                >
                    <div>
                        <p>这里是模态框的内容区域</p>
                    </div>
                </Modal> */}
            </div>
            {/* {isAddOpen.isOpen ? <AddModalStudyBase getTableList={() => getTableList(1, 10)} isAddOpen={isAddOpen} onClose={(val: boolean) => setIsAddOpen({ ...isAddOpen, isOpen: val })} /> : null} */}

        </div>
    )
}

export default FileList;