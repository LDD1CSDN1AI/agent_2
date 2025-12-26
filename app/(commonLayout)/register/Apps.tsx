'use client'
import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Typography, message, Select, Row, Col, Cascader } from 'antd'
import CryptoJS from 'crypto-js'
import './App.css'

const { Title, Text } = Typography
const globalUrl = globalThis.document?.body?.getAttribute('data-api-prefix')

const Apps = () => {
    useEffect(() => {
        document.title = '注册智能体'
    }, [])

    const [password, setPassword] = useState('');
    const [passwordCopy, setPasswordCopy] = useState('');

    const provinceArray = ['河北省',
        '山西省',
        '辽宁省',
        '吉林省',
        '黑龙江省',
        '江苏省',
        '浙江省',
        '安徽省',
        '福建省',
        '江西省',
        '山东省',
        '河南省',
        '湖北省',
        '湖南省',
        '广东省',
        '海南省',
        '四川省',
        '贵州省',
        '云南省',
        '陕西省',
        '甘肃省',
        '青海省',
        '台湾省',
        '内蒙古自治区',
        '广西壮族自治区',
        '西藏自治区',
        '宁夏回族自治区',
        '新疆维吾尔自治区'
    ]

    const aa = [
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

    const onFinish = async (values: any) => {
        try {
            const { password, languages = 'zh-CN', employeeNumber, email, name, username, mobile, first_level_company } = values;
            const params = {
                password,
                languages,
                user_info: {
                    employeeNumber,
                    email,
                    name,
                    username,
                    mobile,
                    first_level_company: first_level_company?.[0],
                    second_level_company: first_level_company?.[1]
                }
            };
            console.log(params, '------------params');

            // 模拟发送请求到后端
            const response: any = await fetch(`${globalUrl}/create_account_and_tenant`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            })

            const result = await response.json()
            if (result.code === "200") {
                message.success(result["result"])
                // localStorage.setItem('console_token', result.data)
                const timer = setTimeout(() => {
                    clearTimeout(timer)
                    window.location.href = '/agent-platform-web/login'
                }, 0)
            } else {
                message.error(result["result"])
                localStorage.setItem('console_token', '')
            }
        } catch (error) {
            message.error('请求失败，请检查网络或稍后重试')
            console.error('请求错误:', error)
        }
    }

    const Languages = [
        {
            label: '中文',
            value: 'zh-CN'
        }
    ]

    return (
        <div style={{ backgroundImage: 'url(/agent-platform-web/image/login_backGroud.png)', backgroundRepeat: 'cover', backgroundSize: '100% 100%' }} className="login-page">
            {/* <div className="header">
                <Title level={3} style={{ color: '#0078d7' }}>
                    智能体管理平台
                </Title>
            </div> */}
            <div style={{ color: 'black', fontSize: '30px', fontWeight: '700', top: '6vh', left: '5vw', position: 'absolute' }}>
                启明网络大模型工具链
            </div>
            <div style={{ position: 'absolute', top: '20vh', left: '52vw' }} className="content">
                <div className="login-box">
                    <Title level={4} style={{ textAlign: 'center' }}>
                        账号注册
                    </Title>
                    <Form
                        name="register"
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <Row>
                            <Col span={10}>
                                <Form.Item
                                    label="人力账号"
                                    name="employeeNumber"
                                    rules={[{ required: true, message: '请输入人力账号' }]}
                                >
                                    <Input placeholder="请输入人力账号" />
                                </Form.Item>
                            </Col>
                            <Col span={10} offset={4}>
                                <Form.Item
                                    label="真实姓名"
                                    name="name"
                                    rules={[{ required: true, message: '请输入真实姓名' }]}
                                >
                                    <Input placeholder="请输入真实姓名" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={10}>
                                <Form.Item
                                    label="用户姓名"
                                    name="username"
                                    rules={[{ required: true, message: '请输入用户姓名' }]}
                                >
                                    <Input placeholder="请输入用户姓名" />
                                </Form.Item>

                            </Col>
                            <Col span={10} offset={4}>
                                <Form.Item
                                    label="电话号码"
                                    name="mobile"
                                    rules={[{ required: true, message: '请输入电话号码' }]}
                                >
                                    <Input placeholder="请输入电话号码" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10}>
                                <Form.Item
                                    label="邮箱账号"
                                    name="email"
                                    rules={[{ required: true, message: '请输入邮箱账号' }]}
                                >
                                    <Input placeholder="请输入邮箱账号" />
                                </Form.Item>
                            </Col>
                            <Col span={10} offset={4}>
                                <Form.Item
                                    label="语言"
                                    name="languages"
                                    rules={[{ required: true, message: '请选择所用语言' }]}
                                >
                                    <Select
                                        style={{ minWidth: '180px' }}
                                        placeholder="请选择使用语言"
                                        options={Languages}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={10}>
                                <Form.Item
                                    label="密码"
                                    name="password"
                                    rules={[{
                                        required: true,
                                        validator: (rule, value, callback) => {
                                            const reg = /(?=^.{8,16}$)(?=(?:.*?\d){1})(?=.*[a-z])(?=(?:.*?[A-Z]){1})[0-9a-zA-Z`·~!@#$%^&*()_+}{|:;'",<.>/?\=\[\]\-\\]*$/;
                                            if (!value) {
                                                callback('请输入密码');
                                            } else if (!reg.test(password)) {
                                                callback('密码长度 8-16 位，包含至少一个数字，一个大写字母和一个小写字母!');
                                            }
                                            else {
                                                callback();
                                            }
                                        }
                                    }]}
                                >
                                    <Input.Password onChange={(e) => setPassword(e.target.value)} placeholder="请输入密码" />
                                </Form.Item>
                            </Col>
                            <Col span={10} offset={4}>

                                <Form.Item
                                    label="确认密码"
                                    name="passwordCopy"
                                    rules={[{
                                        required: true,
                                        validator: (rule, value, callback) => {
                                            if (!value) {
                                                callback('请输入密码');
                                            } else if (password !== passwordCopy) {
                                                callback('两次密码不一致!');
                                            }
                                            else {
                                                callback();
                                            }
                                        }
                                    }]}
                                >
                                    <Input.Password onChange={(e) => setPasswordCopy(e.target.value)} placeholder="请再次输入密码" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            {/* <Col span={10}>
                                <Form.Item
                                    label="省份"
                                    name="province"
                                    style={{ width: '100%' }}
                                    rules={[{ required: true, message: '请选择省份' }]}
                                >
                                    <Select >
                                        {
                                            provinceArray.map(record => <Select.Option key={record} value={record} >{record}</Select.Option>)
                                        }
                                    </Select>
                                </Form.Item>

                            </Col> */}
                            <Col span={24}>
                                <Form.Item
                                    label="部门"
                                    name="first_level_company"
                                    style={{ width: '100%' }}
                                    rules={[{ required: true, message: '请选择部门' }]}
                                >
                                    <Cascader options={aa} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block>
                                        注册
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
            {/* <footer>
                <Text type="secondary">中国电信版权所有</Text>
            </footer> */}
        </div>
    );
};

export default Apps;