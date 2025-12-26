'use client'
import React, { useEffect } from 'react'
import { Form, Input, Button, Typography, message, Select } from 'antd'
import CryptoJS from 'crypto-js'
import './App.css'
import GlobalUrl, { setDefaultUrlIp, setPlatformType } from '@/GlobalUrl'

const { Title, Text } = Typography
const globalUrl = globalThis.document?.body?.getAttribute('data-api-prefix')

const Apps = () => {
    useEffect(() => {
        // 
        document.title = '登录智能体'
        // console.log("window.location.href:", window.location.href);
        if (typeof window !== 'undefined') {
            // Your code that uses window
            const url = window.location.href;

            const urlObj = new URL(url);

            // 提取主机名（IP 或域名）
            const hostname = urlObj.hostname;

            // 提取端口
            const port = urlObj.port;
            // console.log("当前ip:", hostname);
            // console.log("当前端口:", port);
            // const shufa_url = "http://" + hostname + ":" + port;
            // const apiPrefix = shufa_url + '/console/api'
            // const publicApiPrefix = shufa_url + '/api'
            // console.log("apiPrefix:", apiPrefix)
            // console.log("publicApiPrefix:", publicApiPrefix)
            if (hostname !== "localhost") {
                setDefaultUrlIp("http://" + hostname + ":" + port)
            }

            // console.log("GlobalUrl.defaultUrlIp:", GlobalUrl.defaultUrlIp)
        }


    }, [])

    const SECRET_KEY = 'my-secret-key-16' // 与后端一致的密钥
    const encryptPassword = (password: string) => {
        // 生成随机 IV
        const iv = CryptoJS.lib.WordArray.random(16)
        // 使用 AES-CBC 加密
        const encrypted = CryptoJS.AES.encrypt(password, CryptoJS.enc.Utf8.parse(SECRET_KEY), {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        })
        // 拼接 IV 和密文，并进行 Base64 编码
        return CryptoJS.enc.Base64.stringify(iv.concat(encrypted.ciphertext))
    }

    const onFinish = async (values: any) => {
        try {
            const { username, password, platform } = values
            localStorage.setItem("platform", platform);
            // alert(platform)
            // setPlatformType(platform)
            // message.info(GlobalUrl.platform_type)
            // 对密码进行加密
            //const encryptedPassword = encryptPassword(password)
            const encryptedPassword = password
            // 模拟发送请求到后端
            const response: any = await fetch(GlobalUrl.defaultUrlIp + '/console/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: username,
                    password: encryptedPassword,
                }),
            })

            const result = await response.json()
            if (result.result === "success") {
                message.success('登录成功')
                localStorage.setItem('console_token', result.data)
                localStorage.setItem('showAddProjectButton', 'true')
                // localStorage.setItem('record', );
                // console.log("GlobalUrl.defaultUrlIp:", result)
                const timer = setTimeout(() => {
                    clearTimeout(timer)
                    // window.location.href = GlobalUrl.defaultUrlIp + '/agent-platform-web/apps?console_token=Bearer ' + result.data + '&showTipInfo=true'
                    window.location.href = '/agent-platform-web/apps?console_token=Bearer ' + result.data + '&showTipInfo=true' + '&platform=' + platform

                }, 0)
            } else {
                message.error('验证失败')
                // localStorage.setItem('console_token', '')
            }
        } catch (error) {
            message.error('请求失败，请检查网络或稍后重试')
            console.error('请求错误:', error)
        }
    }

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
            <div className="content">
                <div style={{ position: 'absolute', top: '32vh', left: '60vw' }} className="login-box">
                    {/* <Title level={4} style={{ textAlign: 'center' }}>
                        邮密登录
                    </Title> */}
                    <Form
                        name="login"
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <Form.Item
                            label="邮箱账号"
                            name="username"
                            rules={[{ required: true, message: '请输入邮箱账号' }]}
                        >
                            <Input placeholder="请输入邮箱账号" />
                        </Form.Item>
                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[{ required: true, message: '请输入密码' }]}
                        >
                            <Input.Password placeholder="请输入密码" />
                        </Form.Item>

                        {/* 新增选择框 */}
                        {/* <Form.Item
                            label="平台类型"
                            name="platform"
                            rules={[{ required: true, message: '请选择平台类型' }]}
                        >
                            <Select placeholder="请选择平台">
                                <Select.Option value="shufa">shufa</Select.Option>
                                <Select.Option value="wangyun">wangyun</Select.Option>
                            </Select>
                        </Form.Item> */}

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                    <Text type="secondary" style={{ display: 'block', textAlign: 'center' }}>
                        <a href="/agent-platform-web/register">注册账号</a>
                    </Text>
                </div>
            </div>
            {/* <footer>
                <Text type="secondary">中国电信版权所有</Text>
            </footer> */}
        </div>
    );
};

export default Apps;
