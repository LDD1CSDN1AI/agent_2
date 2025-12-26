'use client'

import { Button } from 'antd';
import React, { useEffect, useState } from 'react'
import { PlusSquareOutlined } from '@ant-design/icons';
import './index.scss';
import './App.css';
import Image from 'next/image'
import mcp from '@/public/image/mcp@3x.png'
import ToolPage from '../toolPage';
const MyTest = (props: any) => {
    const { selectData } = props;
    const [activeTab, setActiveTab] = useState('tab1');
    const { onClose } = props;

    useEffect(() => {
        document.title = '测试';
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const { name, description, detail } = selectData || {};
    return (
        <div className="login-page" style={{
            padding: '20px',
            backgroundColor: '#fff',
            minHeight: '100vh',
            boxSizing: 'border-box'
        }}>
            {/* Header with rounded corners */}
            <header className="header-container" style={{
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#fff',
                border: '1px solid #f0f0f0',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
            }}>
                <div className="text-and-image-container">
                    <div onClick={() => onClose()} style={{ cursor: 'pointer' }} className="left-symbol">
                        &lt;
                    </div>
                    <div className="text-container">
                        MCP管理
                    </div>
                </div>

            </header>

            {/* Spacer */}
            <div style={{
                height: '1px',
                backgroundColor: '#f0f0f0',
                margin: '15px 0',
                width: '100%'
            }}></div>

            {/* Main content container */}
            <div style={{
                borderRadius: '16px',
                backgroundColor: '#fff',
                border: '1px solid #f0f0f0',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                padding: '15px 20px',
                minHeight: '300px',
                height: 'calc(100vh - 200px)',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Tab buttons */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '15px',
                    margin: '20px 0 25px 0'
                }}>
                    <Button
                        type={activeTab === 'tab1' ? 'primary' : 'default'}
                        onClick={() => handleTabChange('tab1')}
                        size="large"
                        style={{ width: 'auto', padding: '0 15px' }}
                    >
                        概览
                    </Button>
                    <Button
                        type={activeTab === 'tab2' ? 'primary' : 'default'}
                        onClick={() => handleTabChange('tab2')}
                        size="large"
                        style={{ width: 'auto', padding: '0 15px' }}
                    >
                        工具
                    </Button>
                    {
                        <Button disabled type="primary" className="add-btn" size="large">
                            <PlusSquareOutlined />
                            立即部署
                        </Button>
                    }
                </div>

                {/* Tab content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {activeTab === 'tab1' ? (
                        <>
                            {/* 第一行：文字和图片 */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                marginBottom: '20px',
                                borderBottom: '1px solid #f0f0f0',
                                paddingBottom: '15px',
                                gap: '15px'
                            }}>
                                <Image
                                    src={mcp}
                                    alt="示例图片"
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        objectFit: 'cover',
                                        borderRadius: '4px'
                                    }}
                                />
                                <div style={{
                                    flex: 1,
                                    paddingRight: '20px',
                                    textAlign: 'left',
                                    fontWeight: 'bold'
                                }}>
                                    {name}
                                </div>

                            </div>

                            {/* 第二行：填满剩余高度的文本区域 */}
                            <div style={{
                                flex: 1,
                                padding: '15px',
                                borderRadius: '8px',
                                overflowY: 'auto',
                                textAlign: 'left'  // 添加这行确保所有内容靠左
                            }}>
                                <h3 style={{ marginTop: 0 }}>{name}</h3>
                                <p>{detail}</p>
                                {/* <p>更多内容可以放在这里，区域会自动扩展。</p>
                                <p>当内容超出时会出现滚动条。</p> */}
                            </div>
                        </>
                    ) : <ToolPage selectData={selectData} dataSource={[
                        { name: '123', param1: '将一个经纬度坐标转换为行政区地址信息', param2: 'location(string)', param3: '' },
                    ]} />
                    }

                </div>
            </div>
        </div>
    );
};

export default MyTest;