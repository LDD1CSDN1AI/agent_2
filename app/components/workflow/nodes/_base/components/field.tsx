'use client'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import {
  RiArrowDownSLine,
  RiQuestionLine,
} from '@remixicon/react'
import produce from 'immer'

import { useBoolean } from 'ahooks'
import type { DefaultTFuncReturn } from 'i18next'
import TooltipPlus from '@/app/components/base/tooltip-plus'
import { Checkbox, Collapse, Flex, Input, message, Modal, Pagination, Select, Space, Tooltip } from 'antd'
import { queryMcpList } from '@/service/apps'
import { EnvironmentFilled } from '@ant-design/icons'
import { useAppContext } from '@/context/app-context'
import { ToolVarInputs, VarType } from '../../tool/types'
import "./field.css";
import GlobalUrl from '@/GlobalUrl'

type Props = {
  className?: string
  title: JSX.Element | string | DefaultTFuncReturn
  tooltip?: string
  isSubTitle?: boolean
  supportFold?: boolean
  children?: JSX.Element | string | null
  operations?: JSX.Element
  inline?: boolean
  required?: boolean
  value?: any
  inputKey?: any
  setInputKey?: any
  onChange?: any
}

const Filed: FC<Props> = ({
  className,
  title,
  isSubTitle,
  tooltip,
  children,
  value,
  onChange,
  operations,
  inline,
  inputKey,
  setInputKey,
  supportFold,
  required,
}) => {
  const [fold, {
    toggle: toggleFold,
  }] = useBoolean(true)
  const { userProfile }: any = useAppContext()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [area, setArea] = useState('')
  const [result, setResult] = useState('');
  const [selectRow, setSelectRow] = useState();
  const [selectRecord, setSelectRecord] = useState('');
  const [savedRecord, setSavedRecord] = useState('');
  const [serverName, setServerName] = useState('');

  const getQueryMcpList = async (pageNum = 1, pageSize = 5) => {

    setPageNum(pageNum);
    const param = {
      pageNum: pageNum,
      pageSize: pageSize,
      employeeNumber: userProfile?.employee_number,
      area: area,
      serverName: serverName
    }
    const result = await queryMcpList({ url: '/mcp-proxy/queryMcpList', body: param });
    // const result = await queryMcpList({ url: 'http://10.143.26.251:20015/mcpServer/queryMcpList', body: param });

    if (result?.code + '' === '200') {
      setResult(result)
    } else {
      message.error('mcp列表获取失败')
    }
  }
  const onChangePage = (pageNumber: number) => {
    getQueryMcpList(pageNumber)
  }

  const onOkChange = () => {
    const { apiNameEn, parameters } = selectRow || {};
    const { serverJson } = selectRecord || {};

    let isSupported = true;
    let tip = '';
    const newValue = produce(value, (draft: ToolVarInputs) => {
      const target1 = draft['tool_name']
      if (target1) {
        target1.value = apiNameEn || ''
      } else {
        draft['tool_name'] = {
          type: VarType.mixed,
          value: apiNameEn || '',
        }
      }
      const target2 = draft['arguments']
      const dataChange = (data) => {
        let obj = {};
        data?.map(item => {
          if (item.type === 'string') {
            obj[item?.name] = `${item?.required ? '必填' : '选填'},字符串类型`;
          } else if (item.type === 'integer') {
            obj[item?.name] = `${item?.required ? '必填' : '选填'},数字类型`;
          } else {
            tip = '暂时不支持除字符串和数字以外的其他类型';
            isSupported = false;
          }
        })
        return JSON.stringify(obj)
      }

      if (target2) {
        target2.value = parameters ? dataChange(parameters) : ''
      } else {
        draft['arguments'] = {
          type: VarType.mixed,
          value: parameters ? dataChange(parameters) : '',
        }
      }

      const target3 = draft['servers_config']

      const dataChange2 = (data) => {
        let obj = {};
        if (data) {
          Object.values(JSON.parse(data)).map(item => {
            if (item?.url) {
              obj['server_name'] = { url: item?.url }
            }
          })
          return JSON.stringify(obj)
        }
        return '';
      }
      if (target3) {
        target3.value = dataChange2(serverJson)
      } else {
        draft['servers_config'] = {
          type: VarType.mixed,
          value: dataChange2(serverJson),
        }
      }

    })

    if (!isSupported && tip) {
      message.info(tip);
      // setSelectData(null, null);
      return;
    }

    setSavedRecord(selectRecord);
    onChange(newValue)
    setInputKey && setInputKey(inputKey + 1);
  }

  useEffect(() => {
    getQueryMcpList()
  }, [])
  const allArea = ['集团', '云公司', '数字生活公司', '物联网公司', '数智公司', '天翼视联公司', '安全公司', '增值中心', '国际公司', '量子公司', '卫星公司',
    '北京辰安科技股份有限公司', '中电信应急通信有限公司', '新国脉数字文化股份有限公司', '北京市', '天津市', '河北省', '山西省', '内蒙古自治区',
    '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省',
    '广西壮族自治区', '海南省', '重庆市', '四川省', '贵州省', '云南省', '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区'
  ];

  const getCollapse = (data: any) => {

    const items = data?.map((record, index) => {
      const { serverName, serverIntro, area, apiInfoList } = record;

      return ({
        label: getCollapseLabel(record, index),
        key: index,
        children: getCollapseList(record, index),
      })
    })

    return <Collapse
      bordered={false}
      // expandIconPosition={'right'}
      items={items}
    />
  }

  const getCollapseLabel = (record, index) => {
    const { serverName, serverIntro, area, apiInfoList } = record;
    return <div style={{ width: '100%' }}>
      <Space>
        <div style={{ width: '20px', height: '20px' }}>
          <img style={{ width: '20px', height: '20px' }} src={`/agent-platform-web/image/mcp_${((index || 0) % 4) + 1}.png`} />
        </div>
        <Space wrap={true}>
          <Flex justify={'space-between'} style={{ width: '360px' }}>
            <span className='only-show-one-line' style={{ fontWeight: '700' }} title={serverName}>{serverName}</span>
            <Space size={'large'}>
              <Space><EnvironmentFilled /> <span>{area}</span></Space>
              <Space>工具 {apiInfoList?.length}</Space>
            </Space>
          </Flex>
          <div className='only-show-two-line'>
            <Tooltip title={serverIntro} mouseEnterDelay={1} >
              {serverIntro}
            </Tooltip>
          </div>
        </Space>
      </Space>

    </div>
  }

  const setSelectData = (selectedRecord, selectedRow) => {
    setSelectRecord(selectedRecord);
    setSelectRow(selectedRow);
  }

  const getCollapseList = (item: any, index) => {
    const { apiInfoList } = item;

    return <Space wrap={false} size={'small'}>
      {
        apiInfoList?.map(record => {
          const { apiNameCn, apiDescribe, apiNameEn } = record
          return <div style={{ width: '100%', paddingLeft: '16px' }}>
            <Space>
              <Checkbox checked={(selectRow?.apiNameEn + selectRecord?.serverName) === (record.apiNameEn + item?.serverName)} onChange={(e) => e.target.checked ? setSelectData(item, record) : setSelectData(null, null)} />
              <div style={{ width: '20px', height: '20px' }}><img style={{ width: '60px', height: '20px' }} src={`/agent-platform-web/image/mcp_${((index || 0) % 4) + 1}.png`} /></div>
              <Space wrap={true}>
                <span className='only-show-one-line' style={{ fontWeight: '700' }} title={`${apiNameEn}`}>{`${apiNameEn}`}</span>
                {/* <span className='only-show-one-line' style={{ fontWeight: '700' }} title={`${apiNameCn}(${apiNameEn})`}>{`${apiNameCn}(${apiNameEn})`}</span> */}
                <div className='only-show-two-line'>
                  <Tooltip title={apiDescribe} mouseEnterDelay={1} >
                    {apiDescribe}
                  </Tooltip>
                </div>
              </Space>
            </Space>
          </div>
        })
      }
    </Space>
  }

  return (
    <div className={cn(className, inline && 'flex justify-between items-center w-full')}>
      {
        setInputKey &&
        <span style={{ fontSize: '15px', fontWeight: 'bold' }}>选择MCP</span>
      }
      {
        setInputKey &&
        <Input.Search value={savedRecord?.serverName} onChange={(e) => console.log('e')} placeholder='请点击检索框，在弹框选择MCP' onSearch={() => setIsModalOpen(true)} onClick={() => setIsModalOpen(true)} />
      }
      <div
        onClick={() => supportFold && toggleFold()}
        className={cn('flex justify-between items-center', supportFold && 'cursor-pointer')}>
        <div className='flex items-center h-6'>
          <div className={cn(isSubTitle ? 'system-xs-medium-uppercase text-text-tertiary' : 'system-sm-semibold-uppercase text-text-secondary')}>
            {title} {required && <span className='text-text-destructive'>*</span>}
          </div>
          {tooltip && (
            <Tooltip
              popupContent={tooltip}
              popupClassName='ml-1'
              triggerClassName='w-4 h-4 ml-1'
            />
          )}
        </div>
        <div className='flex'>
          {operations && <div>{operations}</div>}
          {supportFold && (
            <RiArrowDownSLine className='w-3.5 h-3.5 text-gray-500 cursor-pointer transform transition-transform' style={{ transform: fold ? 'rotate(0deg)' : 'rotate(90deg)' }} />
          )}
        </div>
      </div>
      <Modal
        title='选择MCP'
        open={isModalOpen}
        onOk={() => { setIsModalOpen(false); onOkChange() }}
        onCancel={() => { setIsModalOpen(false); setSelectData(null, null) }}
        okText='确定'
        cancelText='取消'
        style={{ maxWidth: '900px' }}
      >
        <Flex vertical={true} >
          <div>
            <Space>
              <Input.Search placeholder='MCP名称' onChange={(e) => setServerName(e.target.value)} onSearch={() => getQueryMcpList(1)} onPressEnter={() => getQueryMcpList(1)} />
              <Select onChange={(e) => setArea(e)} style={{ minWidth: '200px' }} options={allArea.map(item => ({ label: item, value: item }))} />
            </Space>
          </div>
          <div style={{ maxHeight: '480px', overflow: 'auto' }}>
            {
              getCollapse(result?.data)
            }
          </div>
          <div>
            <Pagination pageSize={pageSize} align="end" showQuickJumper={false} current={pageNum} total={result?.total} onChange={onChangePage} />
          </div>
        </Flex>
      </Modal>
      {children && (!supportFold || (supportFold && !fold)) && <div className={cn(!inline && 'mt-1')}>{children}</div>}
    </div>
  )
}
export default React.memo(Filed)
