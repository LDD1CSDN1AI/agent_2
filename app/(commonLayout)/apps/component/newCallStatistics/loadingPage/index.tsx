import React, { useEffect, useState } from "react";
import { Card, FloatButton } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import "./index.scss";

const LoadingPage = () => {
    const [dots, setDots] = useState("");

    // 动态加载动画：点依次增加
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length < 3 ? prev + "." : ""));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loading-page">
            <Card className="loading-card" bordered={false}>
                <div className="loading-border">
                    <div className="loading-illustration">
                        <img
                            src="/agent-platform-web/image/loading.png"
                            alt="loading illustration"
                        />
                        <p className="loading-text">数据正在加载中，请稍等{dots}</p>
                    </div>
                </div>
            </Card>

            <FloatButton
                icon={<MessageOutlined />}
                type="primary"
                style={{ right: 30 }}
            />
        </div>
    );
};

export default LoadingPage;
