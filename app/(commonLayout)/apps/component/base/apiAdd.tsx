import React, { useState, useEffect } from 'react'
import { Tabs, Modal, Input, Select, Button, Cascader, message } from 'antd';
import TextArea from "antd/es/input/TextArea";
import { apiAddList, apiUpdate, apiProvince } from '@/service/apps'
import type { CascaderProps } from 'antd';
import Toast from '@/app/components/base/toast'
import ssss from './baseStyle.module.scss'
type Props = {
    ApiaddOpen: boolean
    onClose: () => void
    titleModa: string
    setListData: () => any
    onHandleOk: () => any
}
interface Optioncitys {
    code: string;
    name: string;
    items?: Optioncitys[];
}

const apiAdd: React.FC<Props> = (props) => {
    const { ApiaddOpen, onClose, titleModa, setListData, onHandleOk } = props
    const [titleModal, setModal] = useState(ApiaddOpen)
    const [textArea, setTextArea] = useState<string | null>('');
    const [apiType, setApiType] = useState([{ value: 'POST', label: 'POST' }, { value: 'GET', label: 'GET' }, { value: 'DEL', label: 'DEL' }, { value: 'Upd', label: 'Upd' },])
    const [regionApi, setRegionn] = useState([{ value: 'htpp', label: 'http' }, { value: 'https', label: 'https' },])
    const [openRenge, setOpenRenge] = useState([{ value: '全国开放', label: '全国开放' }])
    const [apiRegionn, setApiRegion] = useState([{ value: '北京市', label: '北京市' }])
    const [application_scenarioSelect, setApplication_scenarioSelect] = useState([{ value: '宽带安装', label: '宽带安装' }])
    const [interface_name_zh, setInterface_name_zh] = useState('')
    const [interface_name_en, setInterface_name_en] = useState('')
    const [api_id, setApi_id] = useState('2')
    const [eop_call_address, setEop_call_address] = useState('')
    const [service_protocol, setService_protocol] = useState('')
    const [timeout, setTimeout] = useState<number>()
    // const [system_belonged_to, setSystem_belonged_to] = useState('')
    const [interface_type, setInterface_type] = useState('')
    const [eop_protocol, setEop_protocol] = useState('')
    const [open_scope, setOpen_scope] = useState('全国开放')
    const [region, setRegion] = useState('')
    const [application_scenario, setApplication_scenario] = useState('宽带安装')
    const [system_belonged_to, setSystem_belonged_to] = useState('所有系统*')
    const [publicNetwork, setPublicNetwork] = useState(false)
    const [apiDescription, setApiDescription] = useState('')
    const [apiProvinceData, setApiProvinceData] = useState<any>([])
    const [citys, setCitys] = useState('')
    const [auth_policy, setauth_policy] = useState('')
    // 请求表格数据
    useEffect(() => {
        (
            async () => {

                const apiProvinceList: any = await apiProvince()
                const list: any = Object.keys(apiProvinceList).map(item => {
                    return {
                        label: item,
                        value: apiProvinceList[item]
                    }
                })
                setApiProvinceData(list)
            }
        )()
    }, [])

    const title = [
        { id: 1, value: '否', },
        { id: 2, value: '是', }
    ]
    const rengzheng = [
        { id: 1, value: '无认证', },
        { id: 2, value: 'IP黑白名单', },
        { id: 3, value: 'APPKETY签名', }
    ]
    const [i, setI] = useState<number>(1)
    const [ii, setIi] = useState<number>(1)
    const apiShi = (val: number) => {
        setI(val)
        if (val == 1) {
            setPublicNetwork(false)
        } else if (val == 2) {
            setPublicNetwork(true)
        }
    }

    const apirenzheng = (val: number) => {


        setIi(val)
        if (val == 1) {
            setauth_policy('无认证')
        } else if (val === 2) {
            setauth_policy('白名单')
            // setApiList(true)
        } else if (val == 3) {
            setauth_policy('APPKETY签名')
        }
    }
    const onChangeCitys: CascaderProps<Optioncitys>['onChange'] = (value: any) => {
        const list = apiProvinceData.filter((item: any) => item.value.includes(value))
        setCitys(list[0].label)
    };
    const [IsRequested, setIsRequested] = useState<boolean>(false)
    const AddEmit = async (addurl: string,) => {
        const res: any = await apiAddList({
            url: titleModa === '创建新项目' ? addurl : titleModa === '编辑' ? addurl : '',
            body: {
                interface_name_zh,//中文
                interface_name_en,//英文
                api_id: api_id,//id
                interface_type,//接口类型
                eop_call_address,//EOP调用地址
                eop_protocol,//EOP协议
                service_protocol,//服务协议
                timeout: timeout,//超时时长
                open_scope: open_scope,//开放范围
                is_public: publicNetwork,//是否公网
                system_belonged_to: system_belonged_to,//所有系统
                region: citys,//所属区域
                application_scenario: application_scenario,//所有场景分类
                interface_description: apiDescription,//接口说明
                auth_policy,//认证策略
                headers: 'string',
                request_script: 'string',
                input_params: 'string',
                request_example: 'string',
                response_example: 'string',
                output_params: 'string',
            }
        })
        if (res.data === 'api_id already exists') {
            message.error('api ID不能重复');
        } else {
            setListData()
            message.success('创建成功');
        }

    }
    const handleOk = async () => {
   
        if (!interface_name_zh || !interface_name_en || !api_id || !interface_type || !eop_protocol || !service_protocol || !timeout || !open_scope || !system_belonged_to || !citys || !application_scenario || !apiDescription) {
            Toast.notify({
                type: "error",
                message: "请输入完整信息！",
            });
            return
        }
        if (IsRequested) {
            Toast.notify({
                type: "error",
                message: "创建中，请稍后......",
            });
            return
        }
        setIsRequested(true);
        if (titleModa === '创建新项目') {
            const api = "/api/info/create"
            AddEmit(api)
        } else if (titleModa === '编辑') {
            // const api = "/api/info/update"
            // AddEmit(api)
            console.log('编辑', '................................................................');

            const res: any = await apiUpdate({
                url: "/api/info/create",
                body: {
                    interface_name_zh,//中文
                    interface_name_en,//英文
                    api_id: api_id,//id
                    interface_type,//接口类型
                    eop_call_address,//EOP调用地址
                    eop_protocol,//EOP协议
                    service_protocol,//服务协议
                    timeout: timeout,//超时时长
                    open_scope: open_scope,//开放范围
                    is_public: publicNetwork,//是否公网
                    system_belonged_to: system_belonged_to,//所有系统
                    region: citys,//所属区域
                    application_scenario: application_scenario,//所有场景分类
                    interface_description: apiDescription,//接口说明
                    auth_policy,//认证策略
                    headers: 'string',
                    request_script: 'string',
                    input_params: 'string',
                    request_example: 'string',
                    response_example: 'string',
                    output_params: 'string',
                }
            })
            console.log(res, '................................................................res');
            onHandleOk()
            if (res.data === 'api_id already exists') {
                message.error('api ID不能重复');
            } else {
                setListData()
                message.success('创建成功');
            }

        }


        setIsRequested(true)
        setModal(false)
        onClose()
    }
    const handleCancel = () => {
        setModal(false)
        onClose()


    }
    const [apiLis, setApiList] = useState(false)
    const apiList = () => {
        setApiList(false)
    }
    const handApi = () => {
        setApiList(false)
    }

    return (
        <>
            {
                titleModa === '创建新项目' ? <Modal
                    // className={styles.modalGlobal}
                    title='编辑'
                    open={titleModal}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    width={750}
                    okText='确定'
                    cancelText='取消'
                >
                    <div className='h-[800px] ' >

                        <div className='flex'>
                            <div className='w-[315px] h-[688px] mr-[16px] '>
                                <div className='w-[315px] h-[93px] mb-[5px]'>
                                    <p className='h-[20px] text-base font-medium mb-[20px]'>接口名称(中文)</p>
                                    <Input value={interface_name_zh} onChange={(e: any) => setInterface_name_zh(e.target.value)} style={{ height: "40px" }} placeholder="快带是否欠费查询" />
                                </div>
                                <div className='w-[315px] h-[93px] mb-[5px]'>
                                    <p className='h-[20px] text-base font-medium mb-[20px]'>Api ID<span style={{ color: "red" }}>*</span></p>
                                    <Input value={api_id} onChange={(e: any) => setApi_id(e.target.value)} style={{ height: "40px" }} placeholder="18888888888888" />
                                </div>
                                <div className='w-[315px] h-[93px] mb-[5px]'>
                                    <p className='h-[20px] text-base font-medium mb-[20px]'>EOP调用地址<span style={{ color: "red" }}>*</span></p>
                                    <Input value={eop_call_address} onChange={(e: any) => setEop_call_address(e.target.value)} style={{ height: "40px" }} placeholder="http://10.128.64.8000/serviceAgent/rest..." />
                                </div>

                                <div className='w-[315px] h-[93px] mb-[5px]'>
                                    <p className='h-[20px] text-base font-medium mb-[20px]'>服务协议<span style={{ color: "red" }}>*</span></p>
                                    <Select options={regionApi} onChange={(e: any) => setService_protocol(e)} style={{ width: "315px", height: "40px" }} placeholder='请选择一个工作空间' />
                                </div>
                                <div className='w-[315px] h-[93px] mb-[5px]'>
                                    <p className='h-[20px] text-base font-medium mb-[20px]'>超时时长(s)<span style={{ color: "red" }}>*</span></p>
                                    <Input value={timeout} onChange={(e: any) => setTimeout(e.target.value)} style={{ height: "40px" }} placeholder="100秒" />
                                </div>
                                <div className='w-[315px] h-[93px] mb-[5px]'>
                                    <p className='h-[20px] text-base font-medium mb-[20px]'>是否公网<span style={{ color: "red" }}>*</span></p>
                                    <ul style={{ borderRadius: "5px", border: "solid 1px #D8DCE6 ", }} className='w-[240px] h-[40px] flex rounded-md border-1px'>
                                        {
                                            title.map((item) => {
                                                return <li key={item.id} style={{ width: "120px", height: "38pxpx", borderRadius: "5px", lineHeight: "38px", textAlign: 'center', fontSize: '16px' }} onClick={() => apiShi(item.id)} className={item.id == i ? ssss.on : ''}>{item.value}</li>
                                            })
                                        }
                                    </ul>
                                </div>
                                <div className='w-[315px] h-[93px] mb-[5px]'>
                                    <p className='h-[20px] text-base font-medium mb-[20px]'>所属区域<span style={{ color: "red" }}>*</span></p>
                                    <Cascader
                                        style={{ width: "315px", height: "40px" }}
                                        // fieldNames={{ label: 'label', value: 'code', children: 'items' }}
                                        // options={options}
                                        onChange={onChangeCitys}
                                        options={apiProvinceData}
                                        value={citys}
                                        placeholder='请选择'
                                    />
                                    {/* <Select style={{ width: "315px", height: "40px" }} placeholder='请选择一个工作空间' onChange={(e: any) => setRegion(e)} options={apiRegionn} /> */}
                                </div>
                            </div>
                            <div className='w-[315px] h-[688px] mr-[16px] '>

                                <div className='w-[315px] h-[93px] mb-[5px]'>
                                    <p className='h-[20px] text-base font-medium mb-[20px]'>接口名称（英文）<span style={{ color: "red" }}>*</span></p>
                                    <Input value={interface_name_en} onChange={(e: any) => setInterface_name_en(e.target.value)} style={{ height: "40px" }} placeholder="queryACo untMoney" />
                                </div>
                                <div className='w-[315px] h-[93px] mb-[5px]'>
                                    <p className='h-[20px] text-base font-medium mb-[20px]'>接口类型<span style={{ color: "red" }}>*</span></p>
                                    <Select onChange={(e: any) => setInterface_type(e)} style={{ width: "315px", height: "40px" }} placeholder='请选择' options={apiType} />
                                </div>
                                <div className='w-[315px] h-[93px] mb-[5px]'>
                                    <p className='h-[20px] text-base font-medium mb-[20px]'>EOP协议<span style={{ color: "red" }}>*</span></p>
                                    <Input value={eop_protocol} onChange={(e: any) => setEop_protocol(e.target.value)} style={{ height: "40px" }} placeholder="http" />
                                </div>
                                <div className='w-[315px] h-[93px] mb-[5px]'>
                                    <p className='h-[20px] text-base font-medium mb-[20px]'>认证策略<span style={{ color: "red" }}>*</span></p>
                                    <ul style={{ borderRadius: "5px", border: "solid 1px #D8DCE6 ", }} className='w-[315px] h-[40px] flex rounded-md border-1px'>
                                        {
                                            rengzheng.map((item) => {
                                                return <li key={item.id} style={{ width: "105px", borderRadius: "5px", height: "38pxpx", lineHeight: "38px", textAlign: 'center', fontSize: '16px' }}
                                                    onClick={() => apirenzheng(item.id)}
                                                    className={item.id == ii ? ssss.onn : ''}>{item.value}</li>


                                            })
                                        }
                                    </ul>
                                </div>
                                <div className='w-[315px] h-[93px] mb-[5px]'>
                                    <p className='h-[20px] text-base font-medium mb-[20px]'>开放范围<span style={{ color: "red" }}>*</span></p>
                                    <Select disabled options={openRenge} onChange={(e: any) => setOpen_scope(e)} style={{ width: "315px", height: "40px" }} placeholder='请选择一个工作空间' />
                                </div>
                                <div className='w-[315px] h-[93px] mb-[5px]'>
                                    <p className='h-[20px] text-base font-medium mb-[20px]'>所有系统<span style={{ color: "red" }}>*</span></p>
                                    <Input disabled value={system_belonged_to} onChange={(e: any) => setSystem_belonged_to(e.target.value)} style={{ height: "40px" }} placeholder="Basic usage" />
                                </div>
                                <div className='w-[315px] h-[93px] mb-[5px]'>
                                    <p className='h-[20px] text-base font-medium mb-[20px]'>所有场景分类<span style={{ color: "red" }}>*</span></p>
                                    <Select disabled options={application_scenarioSelect} onChange={(e: any) => setApplication_scenario(e)} style={{ width: "315px", height: "40px" }} placeholder='请选择一个工作空间' />
                                </div>

                            </div>
                        </div>
                        <div>
                            <p className='h-[20px] text-base font-medium mb-[20px]'>接口说明<span style={{ color: "red" }}>*</span></p>
                            <TextArea
                                // value={textArea}
                                onChange={(e: any) => setApiDescription(e.target.value)}
                                maxLength={200}
                                rows={3}
                                placeholder={"介绍项目的内容，目标等，将会展示会给可见的用户"}
                            />

                        </div>
                    </div>
                </Modal> : ''
            }
            {
                titleModa === '编辑' ? <div className='h-[800px] ' >

                    <div className='flex'>
                        <div className='w-[315px] h-[688px] mr-[16px] '>
                            <div className='w-[315px] h-[93px] mb-[5px]'>
                                <p className='h-[20px] text-base font-medium mb-[20px]'>接口名称(中文)</p>
                                <Input value={interface_name_zh} onChange={(e: any) => setInterface_name_zh(e.target.value)} style={{ height: "40px" }} placeholder="快带是否欠费查询" />
                            </div>
                            <div className='w-[315px] h-[93px] mb-[5px]'>
                                <p className='h-[20px] text-base font-medium mb-[20px]'>Api ID<span style={{ color: "red" }}>*</span></p>
                                <Input value={api_id} onChange={(e: any) => setApi_id(e.target.value)} style={{ height: "40px" }} placeholder="18888888888888" />
                            </div>
                            <div className='w-[315px] h-[93px] mb-[5px]'>
                                <p className='h-[20px] text-base font-medium mb-[20px]'>EOP调用地址<span style={{ color: "red" }}>*</span></p>
                                <Input value={eop_call_address} onChange={(e: any) => setEop_call_address(e.target.value)} style={{ height: "40px" }} placeholder="http://10.128.64.8000/serviceAgent/rest..." />
                            </div>

                            <div className='w-[315px] h-[93px] mb-[5px]'>
                                <p className='h-[20px] text-base font-medium mb-[20px]'>服务协议<span style={{ color: "red" }}>*</span></p>
                                <Select options={regionApi} onChange={(e: any) => setService_protocol(e)} style={{ width: "315px", height: "40px" }} placeholder='请选择一个工作空间' />
                            </div>
                            <div className='w-[315px] h-[93px] mb-[5px]'>
                                <p className='h-[20px] text-base font-medium mb-[20px]'>超时时长(s)<span style={{ color: "red" }}>*</span></p>
                                <Input value={timeout} onChange={(e: any) => setTimeout(e.target.value)} style={{ height: "40px" }} placeholder="100秒" />
                            </div>
                            <div className='w-[315px] h-[93px] mb-[5px]'>
                                <p className='h-[20px] text-base font-medium mb-[20px]'>是否公网<span style={{ color: "red" }}>*</span></p>
                                <ul style={{ borderRadius: "5px", border: "solid 1px #D8DCE6 ", }} className='w-[240px] h-[40px] flex rounded-md border-1px'>
                                    {
                                        title.map((item) => {
                                            return <li key={item.id} style={{ width: "120px", height: "38pxpx", borderRadius: "5px", lineHeight: "38px", textAlign: 'center', fontSize: '16px' }} onClick={() => apiShi(item.id)} className={item.id == i ? ssss.on : ''}>{item.value}</li>
                                        })
                                    }
                                </ul>
                            </div>
                            <div className='w-[315px] h-[93px] mb-[5px]'>
                                <p className='h-[20px] text-base font-medium mb-[20px]'>所属区域<span style={{ color: "red" }}>*</span></p>
                                <Cascader
                                    style={{ width: "315px", height: "40px" }}
                                    // fieldNames={{ label: 'label', value: 'code', children: 'items' }}
                                    // options={options}
                                    onChange={onChangeCitys}
                                    options={apiProvinceData}
                                    value={citys}
                                    placeholder='请选择'
                                />
                                {/* <Select style={{ width: "315px", height: "40px" }} placeholder='请选择一个工作空间' onChange={(e: any) => setRegion(e)} options={apiRegionn} /> */}
                            </div>
                        </div>
                        <div className='w-[315px] h-[688px] mr-[16px] '>

                            <div className='w-[315px] h-[93px] mb-[5px]'>
                                <p className='h-[20px] text-base font-medium mb-[20px]'>接口名称（英文）<span style={{ color: "red" }}>*</span></p>
                                <Input value={interface_name_en} onChange={(e: any) => setInterface_name_en(e.target.value)} style={{ height: "40px" }} placeholder="queryACo untMoney" />
                            </div>
                            <div className='w-[315px] h-[93px] mb-[5px]'>
                                <p className='h-[20px] text-base font-medium mb-[20px]'>接口类型<span style={{ color: "red" }}>*</span></p>
                                <Select onChange={(e: any) => setInterface_type(e)} style={{ width: "315px", height: "40px" }} placeholder='请选择' options={apiType} />
                            </div>
                            <div className='w-[315px] h-[93px] mb-[5px]'>
                                <p className='h-[20px] text-base font-medium mb-[20px]'>EOP协议<span style={{ color: "red" }}>*</span></p>
                                <Input value={eop_protocol} onChange={(e: any) => setEop_protocol(e.target.value)} style={{ height: "40px" }} placeholder="http" />
                            </div>
                            <div className='w-[315px] h-[93px] mb-[5px]'>
                                <p className='h-[20px] text-base font-medium mb-[20px]'>认证策略<span style={{ color: "red" }}>*</span></p>
                                <ul style={{ borderRadius: "5px", border: "solid 1px #D8DCE6 ", }} className='w-[315px] h-[40px] flex rounded-md border-1px'>
                                    {
                                        rengzheng.map((item) => {
                                            return <li key={item.id} style={{ width: "105px", borderRadius: "5px", height: "38pxpx", lineHeight: "38px", textAlign: 'center', fontSize: '16px' }}
                                                onClick={() => apirenzheng(item.id)}
                                                className={item.id == ii ? ssss.onn : ''}>{item.value}</li>


                                        })
                                    }
                                </ul>
                            </div>
                            <div className='w-[315px] h-[93px] mb-[5px]'>
                                <p className='h-[20px] text-base font-medium mb-[20px]'>开放范围<span style={{ color: "red" }}>*</span></p>
                                <Select disabled options={openRenge} onChange={(e: any) => setOpen_scope(e)} style={{ width: "315px", height: "40px" }} placeholder='请选择一个工作空间' />
                            </div>
                            <div className='w-[315px] h-[93px] mb-[5px]'>
                                <p className='h-[20px] text-base font-medium mb-[20px]'>所有系统<span style={{ color: "red" }}>*</span></p>
                                <Input disabled value={system_belonged_to} onChange={(e: any) => setSystem_belonged_to(e.target.value)} style={{ height: "40px" }} placeholder="Basic usage" />
                            </div>
                            <div className='w-[315px] h-[93px] mb-[5px]'>
                                <p className='h-[20px] text-base font-medium mb-[20px]'>所有场景分类<span style={{ color: "red" }}>*</span></p>
                                <Select disabled options={application_scenarioSelect} onChange={(e: any) => setApplication_scenario(e)} style={{ width: "315px", height: "40px" }} placeholder='请选择一个工作空间' />
                            </div>

                        </div>
                    </div>
                    <div>
                        <p className='h-[20px] text-base font-medium mb-[20px]'>接口说明<span style={{ color: "red" }}>*</span></p>
                        <TextArea
                            // value={textArea}
                            onChange={(e: any) => setApiDescription(e.target.value)}
                            maxLength={200}
                            rows={3}
                            placeholder={"介绍项目的内容，目标等，将会展示会给可见的用户"}
                        />

                    </div>
                </div> : ""
            }
            {
                apiLis === true ? <Modal
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
                                setTextArea(e.target.value);
                            }}
                            maxLength={200}
                            rows={3}
                            placeholder={"请输入"}
                        />

                    </div>  <div>
                        <p className='h-[20px] text-base font-medium mb-[20px]'>IP黑名单<span style={{ color: "red" }}>*</span></p>
                        <TextArea
                            onChange={(e: any) => {
                                setTextArea(e.target.value);
                            }}
                            maxLength={200}
                            rows={3}
                            placeholder={"请输入"}
                        />

                    </div>
                </Modal> : ""
            }
        </>

    )
}

export default apiAdd
