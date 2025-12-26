'use client'

import React, { useEffect } from 'react';
import { Button, Typography, message } from 'antd';
import './App.css';

const globalUrl = globalThis.document?.body?.getAttribute('data-api-prefix')



const Redirect = () => {
    useEffect(() => {
        document.title = '测试环境';
    }, []);

    const handleRedirect = async () => {

        // console.log("window.location.href.toString()", window.location.href.toString())
        // const urlObj = new URL(window.location.href.toString());
        // const searchParams = urlObj.searchParams;
        // // 3. 提取 token 和 signature
        // // 获取原始的 search 字符串（未自动解码）
        // const rawSearch = urlObj.search;

        // // 手动提取 token（避免 + 被替换成空格）
        // const tokenMatch = rawSearch.match(/token=([^&]+)/);
        // const token = tokenMatch ? decodeURIComponent(tokenMatch[1].replace(/\+/g, '%2B')) : null;

        // // 正常提取 signature（如果没有 + 的问题）
        // const signature = searchParams.get("signature");

        // // 3. 在 URL 路径末尾添加 "Test"
        // const newPath = urlObj.pathname + "Test";  // 例如：/original/path → /original/pathTest
        // urlObj.pathname = newPath;

        // console.log("Token:", token); // 正确保留 +
        // console.log("Signature:", signature);

        // console.log("window.location.href.toString()", window.location.href.toString())
        // window.location.href = window.location.href.toString().replace("redirect", "redirectTest");
        const urlObj = new URL(window.location.href.toString());

        // 2. 提取 token 和 signature（处理 + 变成空格的问题）
        const rawSearch = urlObj.search;
        const tokenMatch = rawSearch.match(/token=([^&]+)/);
        const token = tokenMatch ? decodeURIComponent(tokenMatch[1].replace(/\+/g, '%2B')) : null;
        const signature = urlObj.searchParams.get("signature");
        const redirectApplication = urlObj.searchParams.get("redirectApplication");
        console.log("Token:", token); // 正确保留 +
        console.log("Signature:", signature);

        // 3. 在 URL 路径末尾添加 "Test"
        // const newPath = urlObj.pathname + "Test";  // 例如：/original/path → /original/pathTest
        const originalPath = urlObj.pathname.replace(/Test\/?$/, '');
        const originalUrl = new URL(urlObj.origin + originalPath + urlObj.search);

        console.log("originalPath", originalPath)
        // const originalUrl = new URL(originalPath);
        // originalUrl.pathname = originalPath;

        // 4. 重新添加参数
        if (token) originalUrl.searchParams.set('token', token);
        if (signature) originalUrl.searchParams.set('signature', signature);
        if (redirectApplication) originalUrl.searchParams.set('redirectApplication', redirectApplication);

        console.log('恢复后的URL:', originalUrl.toString());
        window.location.href = originalUrl.toString()


    };
    handleRedirect();
    return (
        <div className="login-page">

        </div>
    );
};

export default Redirect;