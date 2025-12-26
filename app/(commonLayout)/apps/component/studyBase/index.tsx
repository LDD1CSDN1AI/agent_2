'use client'

import { Button, message, Pagination, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import { OpenType } from '../base/addModal';
import TypeCard from '../base/typeCard';
import studyBase from '@/public/bg/studyBase.png'
import Image from 'next/image'
import { getUserStudyBaseList } from '@/service/apps';
import { useAppContext } from '@/context/app-context';
import Page from '@/app/studyBaseProcess/page';
import FileList from './filelist';
import AddModalStudyBase from '../base/addModalStudyBase';
import GlobalUrl from '@/GlobalUrl';
import studyBase_1 from '@/public/image/studyBase_1.png'
import studyBase_2 from '@/public/image/studyBase_2.png'
import studyBase_3 from '@/public/image/studyBase_3.png'
import studyBase_4 from '@/public/image/studyBase_4.png'

// import fileList from './fileList.tsx';
const StudyBase: React.FC = (props) => {

    const { fromSource, tenant_id } = props as any;
    useEffect(() => {
        (
            async () => {
                getTableList(0, 10)
                // setSelectedRow()
            }
        )()
    }, [])


    const [isAddOpen, setIsAddOpen] = useState<OpenType>({
        isOpen: false,
        title: '',
        mode: 'agent-chat',
    })
    const [typePage, setTypePage] = useState('')
    const { userProfile }: any = useAppContext();

    const [num, setNum] = useState(1);
    const [alter_database_name, setAlter_database_name] = useState('');
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(100);
    const [selectedRow, setSelectedRow] = useState({});

    const [listData, setListData] = useState([])

    const getImage = (key: any) => {
        switch (key) {
            case '1':
                return <Image src={studyBase_1} alt='img' />;
            case '2':
                return <Image src={studyBase_2} alt='img' />;
            case '3':
                return <Image src={studyBase_3} alt='img' />;
            case '4':
                return <Image src={studyBase_4} alt='img' />;
        }
    }

    const columns = [
        {
            title: '',
            dataIndex: 'studyBaseIcon',
            key: 'studyBaseIcon',
            width: '60px',
            render: (_: any, record: any) => <div>
                {getImage(record.studyBaseIcon || '2')}
            </div>
        }, {
            title: '知识库',
            dataIndex: 'studyBaseName',
            width: '240px',
            key: 'studyBaseName',
            render: (_: any, record: any) => {
                // console.log(_, record);
                return <div>
                    {/* <a onClick={() => { setSelectedRow(record); setTypePage('fileList'); }}>{record.studyBaseName}</a> */}
                    <span>{record.studyBaseName}</span>
                    <div>
                        {record.studyBaseDesc}
                    </div>
                </div>
            }
        }, {
            title: '知识库ID',
            dataIndex: 'studyBaseId',
            key: 'studyBaseId',
            width: '60px',
            render: (_: any, record: any) => {
                // console.log(_, record);
                return <div>
                    <h6>{record.studyBaseId}</h6>
                </div>
            }
        }, {
            title: '创建人',
            dataIndex: 'studyBasePeople',
            width: '60px',
            key: 'studyBasePeople',
            render: (_: any, record: any) => {
                // console.log(_, record);
                return <div>
                    <h6>{record.studyBasePeople}</h6>
                </div>
            }
        }, {
            title: '操作',
            width: '60px',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: any) => {
                // console.log(_, record);
                return <a style={{ color: 'red' }} onClick={(e) => { e.stopPropagation(); handleDelete(record.studyBaseId); }}>
                    删除
                </a>
            }
        }
    ];

    let param = GlobalUrl.defaultUrlIp + '/console/api';

    if (process.env.NEXT_PUBLIC_API_PREFIX) {
        param = process.env.NEXT_PUBLIC_API_PREFIX;
    }



    const handleDelete = async (kbId: string) => {
        try {

            let param = GlobalUrl.defaultUrlIp + '/console/api';

            if (process.env.NEXT_PUBLIC_API_PREFIX) {
                param = process.env.NEXT_PUBLIC_API_PREFIX;
            }


            const paramBody = {
                kb_id: kbId, // 传递知识库 ID
            } as any;

            if (fromSource === 'workSpaceSecondPage') {
                paramBody.tenant_id = tenant_id;
            }
            const response = await fetch(`${param}/delete_kb`, {
                method: 'POST',
                headers: {
                    'Authorization': localStorage.getItem('console_token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...paramBody
                }),
            });

            const result = await response.json();

            if (result.status === 'successful') {
                message.success('删除成功');
                getTableList(current, pageSize); // 刷新表格数据
            } else {
                message.error('删除失败');
            }
        } catch (error) {
            message.error('请求失败，请检查网络或稍后重试');
            console.error('删除错误:', error);
        }
    };

    const handleTableChang = (page: any, pageSize: any) => {
        // console.log(page, pageSize, '----------pageSize')
        setPageSize(pageSize)
        setCurrent(page)
    }
    const editFileList = () => {
        setIsAddOpen({
            isOpen: true,
            title: '编辑知识库',
            mode: 'studyBase',
        });
    }

    const changeShowTypePage = (value = 'page') => {
        setTypePage(value);

        if (value === 'fileList' && typePage === 'page') {
            setNum(num + 1);
        }
    }


    const getTableList = async (current?: any, pageSize?: any) => {
        current ? setCurrent(current) : '';
        pageSize ? setPageSize(pageSize) : '';
        const user_id = userProfile.name;

        // setListData([{
        //     kb_name: '知识库1',
        //     kb_id: '123',
        //     creator: '张三'
        // }, {
        //     kb_name: '知识库2',
        //     kb_id: '456',
        //     creator: '李四'
        // }] as any);

        let param = {} as any;
        if (fromSource === 'workSpaceSecondPage') {
            param.tenant_id = tenant_id;
        }
        // try {
        //     const response: any = await getUserStudyBaseList({
        //         url: '/kb_list',
        //         body: {
        //             //user_id: user_id ? user_id : '',
        //             ...param
        //         }
        //     })


        //     const result = await response
        //     if (result.status === "successful") {
        //         const timer = setTimeout(() => {
        //             setListData(response.kb_list)

        //         }, 0)
        //     } else {
        //         message.error('查询失败')
        //         localStorage.setItem('console_token', '')
        //     }
        // } catch (error) {
        //     message.error('请求失败，请检查网络或稍后重试')
        //     console.error('请求错误:', error)

        // }
    }

    // 表格数据
    const dataSource = listData.map((item: any) => {
        return {
            studyBaseIcon: item.kb_icon,
            studyBaseName: item.kb_name,
            studyBaseId: item.kb_id,
            studyBasePeople: item.creator,
            studyBaseDesc: item.kb_desc
        }
    })

    const getContent = () => {
        const type = typePage || 'main';
        switch (type) {
            case 'main':
                return <div className='mt-[24px]'>
                    <div style={{ justifyContent: 'space-between', fontWeight: '700', backgroundColor: 'white', padding: '16px 16px', marginBottom: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center' }} className='text-[#1C2748] text-[20px] mb-[16px]'>知识库</div>
                    <div className='flex flex-col bg-[#fff] rounded-[8px] px-[24px] pt-[24px]' style={{ height: 'calc(100% - 138px)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }} className='pt-[33px] pb-[22px]'>
                            <span>
                                {/* {
                                    fromSource === 'workSpaceSecondPage' ?
                                        '在此项目空间中创建的知识库可被所有项目成员查看、编辑，且只能在此项目空间中引用'
                                        :
                                        '在此构建的知识库仅支持个人空间使用。如需在项目空间调用，请通过项目空间中知识库进行创建'
                                } */}
                            </span>
                            <Space>
                                <Button type='primary' onClick={() => setIsAddOpen({
                                    isOpen: true,
                                    title: '立即创建',
                                    mode: 'studyBase',
                                })}>创建知识库</Button>
                            </Space>
                        </div>
                        <div className='flex-1 w-[100%]' style={{ height: 'calc(100vh - 100px)', width: '100%' }}>
                            <div className='flex flex-1 flex-wrap overflow-hidden gap-[1.45vw]'>
                                {/* pb-12 */}
                                <Table
                                    columns={columns}
                                    dataSource={dataSource}
                                    scroll={{ x: 'max-content', y: 440 }}
                                    onRow={
                                        (record) => {
                                            return ({
                                                onClick: (e) => { e.stopPropagation(); setSelectedRow(record); setTypePage('fileList'); setAlter_database_name('') }
                                            })
                                        }
                                    }
                                    pagination={{
                                        current: current, // 当前页数
                                        pageSize: pageSize, // 每页显示条数
                                        total: dataSource.length, // 数据总数
                                        // showSizeChanger: true, // 是否显示可以改变 pageSize 的选项
                                        pageSizeOptions: ['10', '20', '30', '40', '50', '60', '70', '80', '90'], // 指定每页可以显示多少条
                                        // showQuickJumper: true, // 是否显示快速跳转的选项
                                        onChange: handleTableChang,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>;
            case 'fileList':
                return <FileList {...props} key={num} changeShowTypePage={changeShowTypePage} alter_database_name={alter_database_name} selectedRow={selectedRow as any} editFileList={editFileList} />;
            case 'page':
                return <Page {...props} changeShowTypePage={changeShowTypePage} selectedRow={(selectedRow as any)} />;
        }
    }

    return (
        <>
            {getContent()}
            {isAddOpen.isOpen ? <AddModalStudyBase {...props} getTableList={() => getTableList(1, 10)} isAddOpen={isAddOpen} setAlter_database_name={setAlter_database_name} rowsdata={selectedRow as any} alt onClose={(val: boolean) => setIsAddOpen({ ...isAddOpen, isOpen: val })} /> : null}

        </>

    )
}

export default StudyBase;