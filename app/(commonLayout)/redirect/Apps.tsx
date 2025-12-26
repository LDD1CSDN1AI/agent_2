'use client'

import React, { useEffect } from 'react';
import { Button, Typography, message } from 'antd';
import './App.css';
import GlobalUrl from '@/GlobalUrl';
import { getChineseParamFallback } from '@/utils/var';
const globalUrl = globalThis.document?.body?.getAttribute('data-api-prefix')

const { Title, Text } = Typography;

const Redirect = () => {
    useEffect(() => {
        document.title = '跳转登录';
    }, []);

    const handleRedirect = async () => {
        console.log("window.location.href.toString()", window.location.href.toString())
        const redirectApplication = decodeURIComponent(getChineseParamFallback(window.location.href.toString(), 'redirectApplication') || '');
        const urlObj = new URL(window.location.href.toString());
        const searchParams = urlObj.searchParams;
        // 3. 提取 token 和 signature
        // 获取原始的 search 字符串（未自动解码）
        const rawSearch = urlObj.search;

        // 手动提取 token（避免 + 被替换成空格）
        const tokenMatch = rawSearch.match(/token=([^&]+)/);
        const token = tokenMatch ? decodeURIComponent(tokenMatch[1].replace(/\+/g, '%2B')) : null;

        // 正常提取 signature（如果没有 + 的问题）
        const signature = searchParams.get("signature");

        console.log("Token:", token); // 正确保留 +
        console.log("Signature:", signature);
        // const token2 = searchParams.get("token");
        // const signature2 = searchParams.get("signature");

        // console.log("Token:", token2);
        // console.log("Signature:", signature2);
        // const location_href = window.location.href.toString().replace(/==/g, "*******")
        // const token = decodeURIComponent(getChineseParamFallback(location_href, 'token') || '');
        // const signature = decodeURIComponent(getChineseParamFallback(location_href, 'signature') || '');
        // const token_ = token.replace(/\*\*\*\*\*\*\*/g, "==");
        // 跳转到指定 URL
        // window.location.href = GlobalUrl.defaultUrlIp + '/agent-platform-web/apps';
        console.log("globalUrl:=============>", globalUrl)
        try {

            // 模拟发送请求到后端
            console.log("globalUrl:=============>", globalUrl)
            const response: any = await fetch(`${globalUrl}/login_sf`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    signature: signature,
                }),
            })
            // console.log("token:", token)
            // console.log("token_:", token_)
            const result = await response.json()
            if (result.result === "success") {
                message.success('访问成功')
                localStorage.setItem('console_token', result.data)
                const timer = setTimeout(() => {
                    clearTimeout(timer)
                    window.location.href = '/agent-platform-web/apps?console_token=Bearer ' + result.data + '&showTipInfo=true' + '&redirectApplication=' + redirectApplication;
                }, 0)
            } else {
                message.error('验证失败')
                // localStorage.setItem('console_token', '')
            }
        } catch (error) {
            message.error('请求失败，请检查网络或稍后重试')
            console.error('请求错误:', error)
        }
    };
    handleRedirect();
    return (
        <div className="login-page">

        </div>
    );
};

export default Redirect;