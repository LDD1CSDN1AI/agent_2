import React, { useEffect, useState } from 'react'
import { Button, Popconfirm, Space, Table, message, Modal, Radio, Divider } from 'antd'
import type { PopconfirmProps, TableProps } from 'antd'
import { downDcoosApi, downshuzhiApi, fetchLlmList, addDcoosApi } from '@/service/common'
import { fetchAppList, updateApiUrlFetcher } from '@/service/apps'
import useSWR from 'swr'
import GlobalUrl from '@/GlobalUrl'
type Props = {
  data?: any
  mutate?: any
  setActiveTab?: any
}
const agentTypeName: any = {
  metabolic: '智能体',
  'agent-chat': 'Agent',
  workflow: '工作流',
  chat: '聊天助手',
  'advanced-chat': '对话流',
}
const DcoosPageCloud: React.FC<Props> = ({ setActiveTab, data, mutate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentRow, setCurrentRow] = useState<any>(null)
  const [agentType, setAgentType] = useState<'agent' | 'llm'>('agent')
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [modalData, setModalData] = useState<any[]>([])
  const [modalTotal, setModalTotal] = useState<number>(0)
  const [modalPage, setModalPage] = useState<number>(1)
  const [currentApiId, setCurrentApiId] = useState<string>('');

  useEffect(() => {
    queryMcpList()
    mutate()
  }, [])
  const confirm: PopconfirmProps['onConfirm'] = (rd: any) => {
    console.log(rd, 123)
    let urlId = rd.url.split('/')
    if (rd.source === "agentplatform" || rd.source === undefined) {
      downDcoosApi(GlobalUrl.defaultUrlIp + `/interface/api/delete-api?api_id=${rd.id}`).then(() => {
        message.success('下线成功')
        mutate()
      })
    } else {
      downshuzhiApi({ body: { deployTaskId: urlId[urlId.length - 1], status: "0" } }).then(() => {
        message.success('下线成功')
        mutate()
      })
    }
  }

  const cancel: PopconfirmProps['onCancel'] = (e) => {
    message.error('已取消')
  }


  async function queryMcpList() {
    // message.info("开始调用mcp列表")
    const url = "https://10.141.179.170:20071/mcpServer/queryMcpList";

    const body = {
      pageNum: 1,
      pageSize: 10,
      employeeNumber: "W8548046@UE",
      // area 可以忽略，后端会根据人力编码反查
      serverName: "xxx",
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("请求失败: " + response.status);
      }

      const data = await response.json();
      console.log("查询结果:", data);
      return data;
    } catch (error) {
      console.error("接口调用异常:", error);
    }
  }




  const handleUpdateClick = (row: any) => {
    setCurrentRow(row)
    setIsModalOpen(true)
    fetchModalData(agentType)
    setCurrentApiId(row.id); // 将原始表格的接口ID存起来

  }

  // 修改 fetchModalData 支持 page 参数
  const fetchModalData = (type: 'agent' | 'llm', page = 1, pageSize = 5) => {
    if (type === 'agent') {
      fetchAppList({
        url: '/apps',
        params: { page, limit: pageSize, mode: 'dcoos-sign' }
      }).then((res: any) => {
        // ⚠️ 确保接口返回 { data: [], page: { totalCount: number } }

        setModalData(res.data)
        setModalTotal(res.total)   // 保存总数
        setModalPage(page)                   // 保存当前页
      })
    } else {
      // fetchLlmList(
      //   GlobalUrl.wangyun_NEXT_PUBLIC_API_PREFIX +
      //   `/intf-restful-service/deploy/queryAllDeployedModel?page=${page}&limit=${pageSize}`
      // ).then((res: any) => {
      //   setModalData(res.data)
      //   setModalTotal(res.total || 0)   // 需要接口返回总数
      //   setModalPage(page)
      // })
    }
  }



  const handleOk = async () => {
    // alert("123")
    if (!selectedRowKeys || selectedRowKeys.length === 0) {
      message.info('未选中任何行，请选择一行');
      return;
    }

    const selectedRow = modalData.find(item => item.id === selectedRowKeys[0]);
    if (!selectedRow) return;
    let url = '';
    let name = selectedRow.name;
    let app_id = selectedRow.id;
    if (selectedRow.mode === 'workflow') {
      url = `http://agent-platform-backend-v1-prod:5002/agent-platform/v1/workflows/run/${selectedRow.id}`;
    } else if (selectedRow.mode === 'agent-chat' || selectedRow.mode === 'advanced-chat') {
      url = `http://agent-platform-backend-v1-prod:5002/agent-platform/v1/chat-messages/${selectedRow.id}`;
    }
    // Modal.info({
    //   title: '选中行信息',
    //   content: (
    //     <div>
    //       <p>弹窗选中ID: {selectedRow.mode}</p>
    //       <p>弹窗选中ID: {selectedRow.id}</p>
    //       <p>接口ID: {currentApiId}</p>
    //       <p>URL: <a href={url} target="_blank" rel="noreferrer">{url}</a></p>
    //     </div>
    //   ),
    // });

    // 调用更新接口
    // try {
    //   const response = await fetch(GlobalUrl.wangyun_defaultUrlIp_agent_platform + '/interface/api/update-api-url', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       businessTypeId: currentApiId, // 原始表格行的接口ID
    //       url: url,
    //     }),
    //   });

    //   const data = await response.json();
    //   if (data.code === 0) {
    //     message.success('更新成功！');
    //   } else {
    //     message.error(`更新失败：${data.msg}`);
    //   }
    // } catch (error) {
    //   console.error(error);
    //   message.error('更新接口调用出错');
    // }
    const API_URL = GlobalUrl.wangyun_defaultUrlIp_agent_platform + `/interface/api/update-api-url`;

    const res = await updateApiUrlFetcher({
      url: API_URL, body: {
        businessTypeId: currentApiId,
        url: url,
        name: name,
        app_id: app_id
      }
    })

    if (res?.code + '' === '200') {
      message.info(res?.msg);
    }

    setIsModalOpen(false)
    mutate()
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleTypeChange = (e: any) => {
    setAgentType(e.target.value)
    setSelectedRowKeys([])
    if (isModalOpen) fetchModalData(e.target.value)
  }

  const columns: TableProps<any>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'app_id',
      key: 'app_id',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: '所属项目空间',
      dataIndex: 'tenant_name',
      key: 'tenant_name',
    },
    {
      title: '接口ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '更新接口',
      key: 'update',
      render: (_, row) => (row.app_mode !== '') && (

        <span style={{ color: '#1677ff', cursor: 'pointer' }}
          onClick={() => handleUpdateClick(row)}>更新</span>


      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render(text) {
        return (
          text.split(' ')[0]
        )
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, rd) => (
        <Space size="middle">
          <Popconfirm
            title="下线"
            description="暂不支持二次上线，下线后无法通过接口调用该能力"
            onConfirm={() => confirm(rd)}
            onCancel={cancel}
            okText="确认"
            cancelText="取消"
          >
            <Button danger size='small'>下线</Button>
          </Popconfirm>

        </Space>
      ),
    },
  ]
  const columnsModal: TableProps<any>['columns'] = agentType === 'agent'
    ? [
      { title: 'id', dataIndex: 'id', key: 'id' },
      { title: '应用名称', dataIndex: 'name', key: 'name' },
      { title: '所属项目空间', dataIndex: 'tenant_name', key: 'tenant_name' },
      { title: '服务类型', dataIndex: 'mode', key: 'mode', render: (text) => agentTypeName[text] },
      { title: '创建时间', dataIndex: 'created_at', key: 'created_at', render: (text) => text.split('T')[0] },
    ]
    : [
      { title: '应用名称', dataIndex: 'modelName', key: 'modelName' },
      { title: '服务类型', dataIndex: 'mode', key: 'mode', render: () => '大模型' },
      { title: '创建时间', dataIndex: 'createDate', key: 'createDate', render: (text) => text.split(' ')[0] },
    ]
  return (
    <>
      <div className='mt-[24px]'>
        <div className='text-[#1C2748] text-[20px] mb-[16px]'>能力发布</div>
        <div className='text-[#1C2748] text-[14px] mb-[16px]'>发布大模型前应保证模型已完成部署</div>
        <div className='flex flex-col bg-[#fff] rounded-[8px] px-[24px]' style={{ height: 'calc(100vh - 158px)' }}>
          <div className='pt-[33px] pb-[22px]'>
            <Space>
              <Button type='primary' onClick={() => setActiveTab('dcoos-sign')}>API注册</Button>
            </Space>
          </div>
          <div className='flex-1 w-[100%] overflow-hidden'>
            {data ? <Table columns={columns} dataSource={data.data} pagination={{ defaultCurrent: 1, total: data.page.totalCount, pageSize: 5 }} /> : null}
          </div>
        </div>
      </div>

      {/* 更新弹窗 */}
      <Modal
        title="更新接口"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width="80%"
        okText="确认"
        cancelText="取消"
        style={{ top: 40 }}
      >
        <Divider />
        <Radio.Group onChange={handleTypeChange} value={agentType} style={{ marginBottom: 16 }}>
          <Radio.Button value="agent">智能体</Radio.Button>
          {/* <Radio.Button value="llm">大模型</Radio.Button> */}
        </Radio.Group>
        <Table
          rowKey="id"
          columns={columnsModal}
          dataSource={modalData}
          rowSelection={{
            type: 'radio',
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          pagination={{
            current: modalPage,      // 当前页
            pageSize: 5,             // 每页数量
            total: modalTotal,       // 总数（关键！）
            onChange: (page, pageSize) => fetchModalData(agentType, page, pageSize),
          }}
        />

      </Modal>

    </>

  )
}

export default DcoosPageCloud
