'use client'

import React, { useEffect } from 'react';
import { Button, Typography, message } from 'antd';
import './App.css';
import GlobalUrl, { setDefaultUrlIp } from '@/GlobalUrl';

const { Title, Text } = Typography;

const RedirectToLogin = () => {
    useEffect(() => {
        document.title = '跳转登录';
        console.log("GlobalUrl.defaultUrlIp:", GlobalUrl.defaultUrlIp)
    }, []);

    const handleRedirect = () => {

        // 跳转到指定 URL
        // console.log("window.location.href:", window.location.href);
        if (typeof window !== 'undefined') {
            // Your code that uses window
            const url = window.location.href;

            const urlObj = new URL(url);

            // 提取主机名（IP 或域名）
            const hostname = urlObj.hostname;

            // 提取端口
            const port = urlObj.port;
            // const shufa_url = "http://" + hostname + ":" + port;
            // const apiPrefix = shufa_url + '/console/api'
            // const publicApiPrefix = shufa_url + '/api'
            // console.log("apiPrefix:", apiPrefix)
            // console.log("publicApiPrefix:", publicApiPrefix)

            if (hostname !== "localhost") {
                setDefaultUrlIp("http://" + hostname + ":" + port)
            }
            console.log("GlobalUrl.defaultUrlIp:", GlobalUrl.defaultUrlIp)
        }

        window.location.href = GlobalUrl.defaultUrlIp + '/agent-platform-web/apps';
    };
    handleRedirect();
    return (
        <div className="login-page">

        </div>
    );
};

export default RedirectToLogin;