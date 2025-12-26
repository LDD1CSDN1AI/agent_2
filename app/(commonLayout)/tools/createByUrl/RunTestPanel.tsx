// File: RunTestPanel.tsx
import React, { useEffect, useState } from "react";
import { Input, InputNumber, Button, Tabs, Tag, Empty, message, Space } from "antd";
import "./RunTestPanel.scss";
import { testAPIAvailable, testAPIAvailableUnDcoos } from "@/service/tools";

interface Param {
    key: string;
    type: "String" | "Number";
    required?: boolean;
    desc?: string;
    value?: any;
}

type Props = {
    headerVariables: any
    dataAnotherValue: any
    dataValue: any
    schemValue: any
    setSaveSuccess: any
}

const RunTestPanel: React.FC<Props> = (props) => {
    const { headerVariables, dataAnotherValue, dataValue, schemValue, setSaveSuccess } = props;
    console.log(headerVariables, '------------------aaaaaaaaaaaa');
    const [params, setParams] = useState<Param[]>(headerVariables);

    useEffect(() => {
        console.log('aaaaaaaaaaaaaaaaaaa', headerVariables);
        setParams(headerVariables)
    }, headerVariables)

    const [activeTab, setActiveTab] = useState("response");
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<any>(null);
    const [status, setStatus] = useState<"success" | "error" | null>(null);

    const handleChange = (index: number, value: any) => {
        const newParams = [...params];
        newParams[index].value = value;
        setParams(newParams);
    };

    const test = () => {

        testAPIAvailable(testParams).then((res: any) => {
            // setResult(res.result || res.error)
        })
    }

    const checkData = () => {
        let bool = false;
        params.map(record => {
            if (!record.value && record.required) {
                bool = true;
            }
        })
        return bool;
    }

    const canConvertToNumber = (value: any) => {
        return !isNaN(Number(value)) && value !== null && value !== "";
    }

    const getObjParams = () => {
        let obj = { headers: {}, body: {}, query: {} } as any;
        params.map(record => {
            let value = record?.value;
            if (record?.type === 'number' && canConvertToNumber(record.value)) {
                value = Number(record.value)
            }
            if (record?.getType === 'body') {
                obj.body[record.key] = value;
            } else if (record?.getType === 'Query') {
                obj.query[record.key] = value;
            } else {
                obj.headers[record.key] = value;
            }
        })
        return obj;
    }


    const handleRun = async () => {

        const checkResult = checkData();
        if (checkResult) {
            message.info('参数值不可为空，请检查！');
            return;
        }

        setLoading(true);
        setStatus(null);
        setResponse(null);

        const testParams = {
            credentials: dataValue.credentials,
            parameters: getObjParams(),
            provider_name: dataValue.provider_name,
            schema: schemValue,
            schema_type: dataValue.schema_type,
            tool_name: dataValue.provider,
        }

        try {
            // 模拟请求
            const res = await testAPIAvailableUnDcoos({ ...dataAnotherValue, ...getObjParams() })

            if (res?.result) {
                setResponse(res?.result);
                setStatus("success");
                setSaveSuccess(true);
                // message.success("运行通过");
            } else {
                setResponse({
                    code: res.code,
                    error: res?.error
                });
                setStatus("error");
                message.error("运行失败");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ height: '70vh', width: '100%', overflow: 'hidden' }} className="run-test-panel">
            <div className="left-panel">
                <div className="params-section">
                    <div className="params-title">
                        <span>输入参数</span>
                        <Button
                            loading={loading}
                            onClick={handleRun}
                            style={{ fontSize: '12px' }}
                            size="small"
                        >
                            运行
                        </Button>
                    </div>
                    <div style={{ height: 'calc(70vh - 53px)', fontFamily: 'Source Han Sans-Regular' }} className="param-list">
                        <div className='rounded-lg border border-gray-200 bg-white overflow-x-auto'>
                            <table className={` min-w-[440px] w-full max-w-full border-collapse border-0 rounded-lg text-sm`}>
                                <thead className="border-b  border-gray-200 text-gray-500 text-xs font-medium">
                                    <tr style={{ height: '33px', lineHeight: '33px' }}>
                                        <td style={{ paddingLeft: '8px' }}>参数名称</td>
                                        <td style={{ paddingLeft: '8px' }}>参数值</td>

                                    </tr>
                                </thead>
                                <tbody key={params.length} className="text-gray-700 mineTbody">
                                    {params.map((param, index) => (
                                        <tr style={{ height: '26px', lineHeight: '26px' }} key={index} >
                                            <td style={{ padding: '8px' }}>
                                                <Space className="parameter" direction={'vertical'} size={0}>
                                                    <span className="parameter-name" title={param.key}>
                                                        <span style={{ color: 'red', visibility: param.required ? 'visible' : 'hidden' }}>*</span>
                                                        {param.key}
                                                    </span>
                                                    <Tag bordered={false} color="blue">{param.type}</Tag>
                                                </Space>
                                            </td>
                                            <td style={{ padding: '8px' }}>
                                                <Space style={{ width: '100%' }} direction={'vertical'} size={0}>
                                                    {param.type === "Number" ? (
                                                        <InputNumber
                                                            value={param.value}
                                                            style={{ width: '100%' }}
                                                            size="small"
                                                            onChange={(v) => handleChange(i, v)}
                                                            placeholder={'请输入参数值'}
                                                            className="param-input"
                                                        />
                                                    ) : (
                                                        <Input
                                                            value={param.value}
                                                            width={'100%'}
                                                            size="small"
                                                            onChange={(e) => handleChange(index, e.target.value)}
                                                            placeholder={'请输入参数值'}
                                                            className="param-input"
                                                        />
                                                    )}
                                                    <span style={{ color: '#999999' }}>{param.desc}</span>
                                                </Space>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            <div className="right-panel">
                <div className="result-header">
                    <span className="result-title">调试结果</span>
                    {status === "success" && <Tag bordered={false} color="green">运行通过</Tag>}
                    {status === "error" && <Tag bordered={false} color="red">运行失败</Tag>}
                </div>

                <div style={{ width: '100%', backgroundColor: '#F6F7F9', padding: '0 8px' }}>
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={[
                            {
                                key: "request", label: "Request", children: <div style={{ overflow: 'auto', height: 'calc(70vh - 110px)', width: '100%' }}>
                                    <pre className=" overflow-auto">{JSON.stringify(params, null, 2)}</pre>
                                </div>
                            },
                            {
                                key: "response",
                                label: "Response",
                                children: response ? (
                                    <div style={{ overflow: 'auto', height: 'calc(70vh - 110px)', width: '100%' }}>
                                        <pre className=" overflow-auto" style={{ overflow: 'auto' }}>{JSON.stringify(JSON.parse(response), null, 2)}</pre>
                                    </div>
                                ) : (
                                    <div style={{ overflow: 'auto', height: 'calc(70vh - 110px)', width: '100%' }}>
                                        <Empty
                                            className="empty"
                                            image={'/agent-platform-web/image/emptyData.png'}
                                            description="暂无数据"
                                        />
                                    </div>
                                ),
                            },
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

export default RunTestPanel;
