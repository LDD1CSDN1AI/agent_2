import React, { useEffect, useState } from 'react'
import { Avatar, Badge, Form, Input, message, Modal, Radio, Select, Space } from 'antd'
import { useRequest } from 'ahooks'
import { useRouter } from 'next/navigation'
import styles from './baseStyle.module.scss'
import { addUserStudyBase, createApp, updateAppInfo } from '@/service/apps'
import { useAppContext } from '@/context/app-context'
import { getRedirection } from '@/utils/app-redirection'
import Image from 'next/image'
import studyBase from '@/public/bg/studyBase.png'
import { CheckCircleFilled } from '@ant-design/icons'
import { getUserStudyBaseList } from '@/service/apps';

const { TextArea } = Input

export type OpenType = {
    id?: string
    isOpen: boolean
    title: string
    data?: any
    mode: 'agent-chat' | 'chat' | 'workflow' | 'metabolic' | 'studyBase',

}


type Props = {
    isAddOpen: OpenType
    onClose: (val: boolean) => void
    mutate?: () => void
    tenant_id: any,
    type: string,
    params?: object,
    defaultAvatarNumber?: string,
    rowsdata?: object,
    alter_database_name?: any,
    setAlter_database_name?: any
}

const AddModalStudyBase: React.FC<Props> = (props) => {
    const { alter_database_name, setAlter_database_name, isAddOpen, onClose, mutate, tenant_id, fromSource, defaultAvatarNumber = '1', params = {}, rowsdata } = props
    const consoleTokenFromLocalStorage = localStorage?.getItem('console_token')
    const [form] = Form.useForm()
    const [isModalOpen, setIsModalOpen] = useState(isAddOpen.isOpen)
    const { isCurrentWorkspaceEditor } = useAppContext()
    const { push } = useRouter()
    const { userProfile }: any = useAppContext();

    useEffect(() => {
        (
            async () => {
                if (params.kb_icon) {
                    setAvatarNumber(params.kb_icon);
                }
            }
        )()
    }, [])

    const { run: addRun } = useRequest(
        async (param) => {
            const result = await createApp(param)
            getRedirection(isCurrentWorkspaceEditor, result, push)
            return result
        },
    )
    const [avatarNumber, setAvatarNumber] = useState(defaultAvatarNumber)

    const { run: editRun } = useRequest(
        async (param) => {
            const result = await updateAppInfo(param)
            return result
        },
    )

    const AvatarClick = (id: string) => {
        setAvatarNumber(id)
    }

    useEffect(() => {
        if (isAddOpen.isOpen) {
            setIsModalOpen(true)
            if (isAddOpen.id) {
                form.setFieldsValue
                    ({
                        ...isAddOpen?.data,
                    })
            }
        }
    }, [form, isAddOpen?.data, isAddOpen.id, isAddOpen.isOpen])

    useEffect(() => {
        if (!isAddOpen.isOpen)
            mutate?.()
    }, [isAddOpen.isOpen, mutate])

    const handleOk = () => {
        const { getTableList, type, rowsdata } = props as any;
        console.log("type", rowsdata);

        form.validateFields().then(async (values) => {

            if (isAddOpen.title === "立即创建") {
                try {
                    const { name, description } = values;
                    // const user_id = userProfile.name;

                    const param = {
                        kb_name: name || '',
                        kb_desc: description || '',
                        kb_icon: avatarNumber
                    } as any;

                    if (fromSource === 'workSpaceSecondPage') {
                        param.tenant_id = tenant_id;
                    }
                    const response: any = await addUserStudyBase({
                        url: '/kb_create',
                        body: {
                            // user_id: user_id ? user_id : '',
                            ...param
                        }
                    })


                    const result = await response
                    if (result.status === 'true') {
                        message.success('创建成功')
                        // localStorage.setItem('console_token', result.data)
                        const timer = setTimeout(() => {
                            getTableList();
                            setIsModalOpen(false)
                            onClose(false)
                            form.resetFields();
                        }, 0)
                    } else {
                        message.error('创建失败:' + result['message'])
                        localStorage.setItem('console_token', '')
                    }
                } catch (error) {
                    message.error('请求失败，请检查网络或稍后重试')
                    console.error('请求错误:', error)
                }
            } else if (isAddOpen.title === "编辑知识库") {

                const { name, description } = values;
                const param = {
                    kb_name: name || '',
                    kb_desc: description || '',
                    kb_icon: avatarNumber,
                    kb_id: rowsdata.studyBaseId
                } as any;
                // setAlter_database_name(name)
                // console.log("rowsdata.uplateUserStudyBase:", rowsdata.studyBaseId)
                if (fromSource === 'workSpaceSecondPage') {
                    param.tenant_id = tenant_id;
                }
                const response: any = await addUserStudyBase({
                    url: '/update_kb',
                    body: {
                        // user_id: user_id ? user_id : '',
                        ...param
                    }
                })
                const result = await response


                if (result.status == "successful") {
                    message.success('修改成功')
                    setAlter_database_name(name)
                    onClose(false)
                    getTableList()
                    setIsModalOpen(false)
                    // props.onUpdateName(values.name);
                    // props.changeShowTypePage('main')
                    // let param = {} as any;
                    // if (fromSource === 'workSpaceSecondPage') {
                    //     param.tenant_id = tenant_id;
                    // }
                    // try {
                    //     const response: any = await getUserStudyBaseList({
                    //         url: '/kb_list',
                    //         body: {
                    //             //user_id: user_id ? user_id : '',
                    //             ...param
                    //         }
                    //     })


                    // } catch (error) {
                    //     message.error('请求失败，请检查网络或稍后重试')
                    //     console.error('请求错误:', error)

                    // }
                    // selectedRow.studyBaseName
                } else {
                    onClose(false)
                    message.error('修改失败')
                }
                onClose(false)
            }
        })
    }

    const handleCancel = () => {
        setIsModalOpen(false)
        onClose(false)
        form.resetFields()
    }

    const { type } = props;
    return (
        <Modal
            className={styles.modalGlobal}
            title={isAddOpen.title}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            width={539}
            okText='确定'
            cancelText='取消'
        >
            <Form
                layout='vertical'
                form={form}
            >
                <Form.Item label="知识库名称" name="name"
                    extra='支持中英文、数字，不多于30个字'
                    rules={[{ required: true, message: '请输入知识库名称' }]}
                >
                    <Input defaultValue={params.name} showCount maxLength={30} placeholder="请输入知识库名称" />
                </Form.Item>
                <Form.Item label="知识库简介" name="description" rules={[{ required: true, message: '请输入知识库内容简介' }]}>
                    <Input defaultValue={params.description} showCount maxLength={30} placeholder="请输入知识库内容简介" />
                </Form.Item>
                <Form.Item label="Embedding模型选择" name="Embedding" rules={[{ required: true, message: '请选择Embedding模型' }]}>
                    <Select defaultValue={params.modelType} options={[{ label: 'Qwen3-Embedding-8B', value: 'Qwen3-Embedding-8B' }]} />
                </Form.Item>
                {
                    type === 'edit' || isAddOpen.title === '编辑知识库' ? '' :
                        <div style={{ padding: '4px 8px 4px 8px', fontSize: '12px', backgroundColor: 'rgba(240,244,252, 0.42)' }} >
                            <p style={{ fontWeight: 'bold' }}>本地文档</p>
                            <p>上传PDF、TXT、MD、DOC、DOCX格式的本地文件</p>
                        </div>
                }
                <div>

                    <Form.Item style={{ margin: '30px 0px 20px 0px' }}>
                        <Space wrap size={16}>
                            <div onClick={() => AvatarClick('1')} style={{ cursor: 'pointer' }}>
                                <Badge count={avatarNumber === '1' ? <CheckCircleFilled style={{ color: '#1e90ff' }} /> : null}>
                                    <Avatar shape="square" size="large" src={`/agent-platform-web/image/studyBase_1.png`} />
                                </Badge>
                            </div>
                            <div onClick={() => AvatarClick('2')} style={{ cursor: 'pointer' }}>
                                <Badge count={avatarNumber === '2' ? <CheckCircleFilled style={{ color: '#1e90ff' }} /> : null}>
                                    <Avatar shape="square" size="large" src={`/agent-platform-web/image/studyBase_2.png`} />
                                </Badge>
                            </div>
                            <div onClick={() => AvatarClick('3')} style={{ cursor: 'pointer' }}>
                                <Badge count={avatarNumber === '3' ? <CheckCircleFilled style={{ color: '#1e90ff' }} /> : null}>
                                    <Avatar shape="square" size="large" src={`/agent-platform-web/image/studyBase_3.png`} />
                                </Badge>
                            </div>
                            <div onClick={() => AvatarClick('4')} style={{ cursor: 'pointer' }}>
                                <Badge count={avatarNumber === '4' ? <CheckCircleFilled style={{ color: '#1e90ff' }} /> : null}>
                                    <Avatar shape="square" size="large" src={`/agent-platform-web/image/studyBase_4.png`} />
                                </Badge>
                            </div>
                        </Space>
                    </Form.Item>
                </div>

            </Form>
        </Modal>

    )
}

export default AddModalStudyBase;
