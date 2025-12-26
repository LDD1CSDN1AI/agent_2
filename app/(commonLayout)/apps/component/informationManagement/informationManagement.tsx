import React, { useEffect, useState, useRef } from 'react'
import { Form, Input, Pagination, Select, Space, Button, Modal, Cascader, Popconfirm, message } from 'antd'
import type { CascaderProps, PopconfirmProps } from 'antd';
import type { PaginationProps } from 'antd'
import TypeCard from '../base/typeCard'
import type { OpenType } from '../base/addModal'
import AddModal from '../base/addModal'
import type { AppListResponse } from '@/models/app'
import { getFiveIndex } from '@/utils/var'
import { getTenants } from '@/service/common'
import { Table, Tag } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { apiListData, apiDel, apiProvince, apiUpload, exportApiList } from '@/service/apps'
import { PlusSquareOutlined, SearchOutlined } from "@ant-design/icons";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ApiAdd from '../base/apiAdd'
import AddApi from '../base/addApi'
import { log } from 'console';
type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];
interface Optioncitys {
  code: string;
  name: string;
  items?: Optioncitys[];
}

interface DataType {
  key: React.Key;
  numbering?: string;
  Chinese?: string;
  English?: string;
  api?: string;
  apiType?: string;
  protocol?: string;
  address?: string;
  Agreement?: string;
  apiDescription?: string;
  Policies?: string;
  Timeout?: string;
  openRenge?: string;
  publicNetwork?: string;
  caozuo?: () => void | undefined
  minWidth?: number;
}

type Props = {
  data?: AppListResponse | undefined
  mutate?: () => void
  setCallback?: any
}

const informationManagement: React.FC<Props> = (props) => {
  const { data, mutate, setCallback } = props
  const [listData, setListData] = useState([])
  const [nameApi, setNameApi] = useState('')
  const [api_Id, setApi] = useState('')
  const [typeApie, setTypeApi] = useState([{ value: 'POST', label: 'POST' }, { value: 'GET', label: 'GET' }, { value: 'Delete', label: ' Delete' }, { value: 'Put', label: 'Put' },])
  const [typeApi, setApiType] = useState(null)
  const [citys, setCitys] = useState('')
  const [apply, setApply] = useState([{ value: '宽带安装', label: '宽带安装' }])
  const areaPublickList = [{ value: 'publicPersonal', label: '发布到个人空间' }, { value: 'publicAudit', label: '发布到广场' },]
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isOpen, setModalOpen] = useState(false)
  const [ApiaddOpen, setApiaddOpen] = useState(false)
  const [titleModal, setModal] = useState('')
  const [application_scenario, setApplication_scenario] = useState('')
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(100)
  // 省份
  const [apiProvinceData, setApiProvinceData] = useState<any>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [file, setFile] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [urlFile, setUrlFile] = useState('')
  // 请求表格数据
  useEffect(() => {
    (
      async () => {
        getTableList()
        const apiProvinceList: any = await apiProvince()
        const list: any = Object.keys(apiProvinceList).map(item => {
          return {
            label: item,
            value: apiProvinceList[item]
          }
        })
        setApiProvinceData(list)
      }
    )()
  }, [])

  const getTableList = async (page?: number, size?: number, isReset?: boolean) => {
    const res: any = await apiListData({
      url: 'api/info/query',
      body: {
        page: page || current,
        limit: size || pageSize,
        interface_name_zh: isReset ? '' : nameApi,
        api_id: isReset ? '' : api_Id,
        interface_type: isReset ? '' : typeApi,
        region: isReset ? '' : citys,
        application_scenario: isReset ? '' : application_scenario
      }
    })
    setListData(res.data)
  }

  // 表格数据
  const columns: TableColumnsType<DataType> = [
    { title: '编号', dataIndex: 'numbering', width: '60px' },
    { title: '接口名称中文', dataIndex: 'Chinese', width: '130px' },
    { title: '接口名称英文', dataIndex: 'English', width: '130px' },
    { title: 'ApiID', dataIndex: 'ApiID', width: '100px' },
    { title: '接口类型', dataIndex: 'apiType', width: '140px' },
    { title: 'EOP协议', dataIndex: 'protocol', width: '170px' },
    { title: 'EOP调用地址', dataIndex: 'address', width: '170px' },
    {
      title: '服务协议', dataIndex: 'Agreement', width: '130px',
      render: (item) => {
        return <p style={{ width: '50px', overflow: "hidden", whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {item}
        </p>
      }
    },
    {
      title: '接口说明', dataIndex: 'apiDescription', width: '140px',
      render: (item) => {
        return <p style={{ width: '50px', overflow: "hidden", whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {item}
        </p>
      }
    },
    {
      title: '认证策略', dataIndex: 'Policies', width: '140px',
      render: (item) => {
        return <p style={{ width: '50px', overflow: "hidden", whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {item}
        </p>
      }
    },
    {
      title: '超时时长', dataIndex: 'Timeout', width: '140px',
      render: (item) => {
        return <p style={{ width: '50px', overflow: "hidden", whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {item}
        </p>
      }
    },
    { title: '开放范围', dataIndex: 'openRenge', width: '140px' },
    { title: '是否公网', dataIndex: 'publicNetwork', width: '140px' },
    { title: '所属系统', dataIndex: 'system_belonged_to', width: '140px' },
    { title: '所属区域', dataIndex: 'region', width: '140px' },
    { title: '所属场景分类', dataIndex: 'application_scenario', width: '140px' },
    {
      title: '操作', fixed: 'right',
      width: '140px',
      render: (item) => {
        return <>
          <button
            disabled
            style={{ color: "#1B66FF ", marginRight: "10px" }}
            onClick={() => edit(item, '编辑')}
          >编辑
          </button>
          <Popconfirm
            title="您确定要删除此任务吗？"
            onConfirm={() => confirm(item.key)}
            onCancel={cancel}
            okText="是"
            cancelText="否"
          >
            <button
              style={{ color: "#1B66FF " }}

            >删除</button>
          </Popconfirm >
        </>
      }
    },
  ];

  // 表格数据
  const dataSource = listData.map((item: any) => {
    return {
      key: item.id,
      numbering: item.id,
      Chinese: item.interface_name_zh,
      English: item.interface_name_en,
      ApiID: item.api_id,
      apiType: item.interface_type,
      protocol: item.eop_protocol,
      address: item.eop_call_address,
      Agreement: item.service_protocol,
      apiDescription: item.interface_description,
      Policies: item.auth_policy,
      Timeout: `${item.timeout}秒`,
      openRenge: item.open_scope,
      publicNetwork: item.is_public === true ? '是' : '否',
      system_belonged_to: item.system_belonged_to,
      region: item.region,
      application_scenario: item.application_scenario,
    }
  })


  //  表格编辑
  const edit = (val: string, title: string) => {
    setModal(title)
    setModalOpen(!isOpen)
  }
  const confirm: PopconfirmProps['onConfirm'] = async (e) => {
    delteItem([e])
  };

  const cancel: PopconfirmProps['onCancel'] = (e) => {
    console.log(e);
    message.error('删除失败');
  };

  const delteItem = async (id: any) => {
    const res = await apiDel({
      url: "/api/info/delete",
      body: id
    })
    // ﻿可以判断下﻿成功﻿和失败﻿再﻿提示
    message.success('删除成功');
    getTableList(1, 10, true)
  }

  const onChangeType = (e: any) => {
    setApiType(e)
  }
  const [selectedRows, setSelectedRows] = useState([]);


  const rowSelection = {
    onChange: (selectedRowKeys: number, selectedRows: any) => {
      const appiID = selectedRows.map((item: any) => {

        return item.ApiID
      })
      setSelectedRows(appiID);
    },
  };

  const handleTableChang = (page: any, pageSize: any) => {

    setPageSize(page)
    setCurrent(pageSize)
  }

  const showModal = (val: string) => {
    setModal(val)
    setApiaddOpen(true)
  }
  // 重置
  const resetInput = async () => {
    setNameApi('')
    setApi('')
    setApiType('')
    setCitys('')
    setApplication_scenario('')
    getTableList(1, 10, true)
  }
  // 查询
  const InquireList = async () => {
    getTableList(1, 10)
  }

  const btnList = (val: string) => {
    setModal(val)
    setIsModalOpen(true)
  }

  const [folderPath, setFolderPath] = useState('');
  // 弹框
  const handleOk = async () => {
    if (titleModal === '批量导出') {
      if (selectedRows.length == 0) {
        message.warning('请先选需要导出的项');
        return
      }
      if (selectedRows.length > 50) {
        message.warning('一次只能批量导出50条数据');
        return
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_PREFIX}/api/info/export`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            api_id_list: selectedRows
          })
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const blob = await response.blob(); // 获取二进制数据  

        // 创建一个 URL 用于下载  
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'filename'; // 设定下载文件的名称  
        document.body.appendChild(a);
        a.click(); // 自动点击链接下载文件  
        a.remove(); // 移除链接  
        window.URL.revokeObjectURL(url); // 释放 URL 对象  
      } catch (e) {
        console.log(e, 'error......................');
      }
    } else if (titleModal === '批量导入') {
      const formData: any = new FormData();
      formData.append('file', file)
      if (file) {
        let res: any = await fetch(`${process.env.NEXT_PUBLIC_API_PREFIX}/api/info/import?file`, {
          method: 'POST',
          headers: {
            'Authorization': localStorage.getItem('console_token') || '',
          },
          body: formData
        })
        setUrlFile(res.url)
        if (res.status === 200) {
          getTableList(1, 10)
          message.success('导入成功');
        } else {
          message.error('数据库中已存在部分API_ID');
        }
      }
    }
    // setFile()
    setIsModalOpen(false)
  }
  // 弹框
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const onChangeCitys: CascaderProps<Optioncitys>['onChange'] = (value: any) => {
    const list = apiProvinceData.filter((item: any) => item.value.includes(value))
    setCitys(list[0]?.label || '')
  };
  const onChangeFile = async (e: any) => {
    const files = e.target.files[0]
    setFile(files)
  }
  const downloadExcel = () => {
    // 创建工作簿  
    const wb = XLSX.utils.book_new();
    // 创建工作表  
    const ws = XLSX.utils.aoa_to_sheet([
      ['编号', '接口名称中文', '接口名称英文', 'ApiID', '接口类型', 'EOP协议', 'EOP调用地址', '服务协议', '接口说明', '认证策略', '超时时长', '开放范围', '是否公网', '所属系统', '所属区域', '所属场景分类'], // 表头  

    ]);
    // 将工作表添加到工作簿  
    XLSX.utils.book_append_sheet(wb, ws, '用户信息');
    // 生成 Excel 文件  
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    // 下载文件  
    saveAs(blob, '用户信息.xlsx');
  };

  return (
    <>
      <div className=' mt-[24px]'>
        <div style={{ justifyContent: 'space-between', fontWeight: '700', backgroundColor: 'white', padding: '16px 16px', marginBottom: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center' }} className='text-[#1C2748] text-[20px] mb-[16px]'>API信息管理</div>
        <div className='flex flex-col   rounded-[8px]  pt-[5px]' style={{ height: 'calc(100vh - 138px)' }}>
          <div className='rounded-[8px] bg-[#fff]   '>
            <div className='pt-[15px] pl-[28px] pr-[28px] pb-[10px] flex items-center justify-between' style={{ flexWrap: 'wrap' }}>
              <p className='flex w-[470px] h-[45px] mb-[5px] ' >
                <span className='w-[80px] flex items-center '>接口名称:</span><Input allowClear value={nameApi} placeholder='请输入' style={{ width: '420px' }} onChange={(e: any) => setNameApi(e.target.value)}></Input>
              </p>
              <p className='flex w-[470px] h-[45px] mb-[5px] ' >
                <span className='w-[80px] flex items-center  '>Api ID:</span><Input allowClear placeholder='请输入' style={{ width: '420px' }} value={api_Id} onChange={(e: any) => setApi(e.target.value)}></Input>
              </p>
              <p className='flex w-[470px] h-[45px] mb-[5px]' >
                <span className='w-[80px] flex items-center'>接口类型:</span> <Select value={typeApi} allowClear style={{ width: "420px", height: "45px", }} placeholder='请输入' onChange={(e: any) => onChangeType(e)} options={typeApie} />
              </p>
              <p className='flex  w-[470px] h-[45px]  mb-[5px]'>
                <span className='w-[80px] flex items-center '>区域:</span>  <Cascader
                  allowClear
                  placeholder='请选择'
                  // fieldNames={{ label: 'label', value: 'code', children: 'items' }}
                  // options={options}
                  onChange={onChangeCitys}
                  options={apiProvinceData}
                  value={citys}
                  style={{ width: "420px", height: "45px" }}
                />
                {/* <Select style={{ width: "410px", height: "45px" }} placeholder='请选择一个工作空间' onChange={(e: any) => setRegion(e.targen.current)} options={regionApi} /> */}
              </p>

              <p className='flex  w-[470px] h-[45px] mb-[5px]'>
                <span className='w-[80px] flex items-center'>应用场景:</span><Select value={application_scenario} disabled style={{ width: "420px", height: "45px" }} placeholder='请输入' onChange={(e: any) => setApplication_scenario(e)} options={apply} />
              </p>
              <p className='flex  w-[470px] h-[45px] mb-[5px]' style={{ 'justifyContent': 'flex-end' }}>
                <Button onClick={() => resetInput()} style={{ width: "100px", height: "40px" }} type="primary" htmlType="submit">
                  重置
                </Button>
                <Button onClick={() => InquireList()} style={{ width: "100px", height: "40px", marginLeft: 10 }} htmlType="button" >
                  查询
                </Button>
              </p>
            </div>
          </div>

          <div className='bg-[#fff] rounded-[8px] mt-[20px] flex-1' >
            <div className='flex mt-[14px] h-[60px] justify-between' >
              <div className='' style={{ display: "flex", alignItems: 'center' }}>
                <span className='ml-[28px]'>共{dataSource.length}条</span>
                <span className='ml-[10px] mr-[10px]'>|</span>
                <Button onClick={() => btnList('批量导出')} htmlType="button" className='ml-[10px] mr-[10px]'>
                  批量导出
                </Button>
                <Button onClick={() => btnList('批量导入')} htmlType="button" className='ml-[10px] mr-[10px]'>
                  批量导入
                </Button>
                {/* <Button onClick={() => deleteCheck('批量导入')} htmlType="button" >
                  批量删除
                </Button> */}
              </div>
              <div style={{ display: "flex", alignItems: 'center', marginRight: "20px" }}>
                <Button
                  onClick={() => showModal('创建新项目')}
                  style={{ height: 33 }}
                  htmlType="button"
                  type="primary"

                >
                  <PlusSquareOutlined />
                  添加接口
                </Button>
              </div>
            </div>
            <div className=''>
              <Table<DataType> pagination={{
                // headerBg: '#fff',

                current: current, // 当前页数
                pageSize: pageSize, // 每页显示条数
                total: dataSource.length, // 数据总数
                // showSizeChanger: true, // 是否显示可以改变 pageSize 的选项
                pageSizeOptions: ['10', '20', '30', '40', '50', '60', '70', '80', '90'], // 指定每页可以显示多少条
                // showQuickJumper: true, // 是否显示快速跳转的选项
                onChange: handleTableChang,

              }} scroll={{ x: 2290, y: 450 }} rowSelection={rowSelection} columns={columns} dataSource={dataSource} />

            </div>
          </div>
        </div>
      </div >
      {
        isOpen === true ? <AddApi titleModa='编辑' onClose={() => setModalOpen(!isOpen)} isOpen={isOpen} /> : ''
      }
      {
        ApiaddOpen === true ? <ApiAdd setListData={() => getTableList(1, 10, true)} titleModa='创建新项目' onClose={() => setApiaddOpen(!ApiaddOpen)} ApiaddOpen={ApiaddOpen} /> : ''
      }
      <Modal
        // className={styles.modalGlobal}
        title={titleModal}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={539}
        okText='确定'
        cancelText='取消'
      >
        {
          titleModal === '批量导出' ?
            <div className='mt-[20px]'>
              <p className='w-[169px] h-[22] font-medium text-base mb-[18px]'>当前导出数据{selectedRows.length}条</p>
            </div>
            :
            <div className='mt-[20px]'>
              <p className='w-[169px] h-[22] font-medium text-base mb-[18px]'>选择文件<span style={{ color: "red" }}>*</span></p>
              <input multiple accept='.xlsx .xls' onChange={onChangeFile} className='h-[45px]' type="file" />
              <p className='w-[169px] h-[22] font-medium text-base'>批量入Excel文件模版</p>
              <Button onClick={downloadExcel} style={{ width: "140px", height: "40px", color: "#fff", background: "#1B66FF", marginTop: "18px" }}>Excel模版下载</Button>
            </div>
        }
      </Modal>
    </>
  )
}

export default informationManagement
