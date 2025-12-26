import React, { useState, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow'
import { Table, message } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { getAgentChatRecord } from '@/service/apps';
import { useStore as useAppStore } from '@/app/components/app/store'
import AgentLogModal from './agent-log-modal'

interface DataType {
  key: React.Key;
  title: string;
  user: string;
  messageCount: string;
  updateTime: string;
  createTime: string;
}

// 表格列配置
const columns: TableColumnsType<DataType> = [
  { title: '名称/ID', dataIndex: 'app_name' },
  { title: 'input', dataIndex: 'query' },
  { title: 'output', dataIndex: 'answer', },
  { title: 'start time', dataIndex: 'created_at' }
];

const ChatRecord: React.FC<Props> = (props) => {
  const { record } = props;
  const { currentLogItem, setCurrentLogItem, showAgentLogModal, setShowAgentLogModal } = useAppStore(useShallow(state => ({
    currentLogItem: state.currentLogItem,
    setCurrentLogItem: state.setCurrentLogItem,
    showAgentLogModal: state.showAgentLogModal,
    setShowAgentLogModal: state.setShowAgentLogModal,
  })))
  const setAppDetail = useAppStore(s => s.setAppDetail)
  record && setAppDetail(record)
  const [listData, setListData] = useState({})
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [width, setWidth] = useState(0)

  useEffect(() => {
    setWidth(document.body.clientWidth - 8)
  }, [])

  useEffect(() => {
    getTableList()
  }, [current, pageSize])

  const getTableList = async () => {
    try {
      let appId;
      if (props.entry === 'analysis') {
        // 获取当前 URL 路径
        const path = window.location.pathname;

        // 使用正则表达式提取 app 和 configuration 之间的 app_id
        const match = path.match(/\/app\/([^/]+)\/configuration/);
        appId = match ? match[1] : "";
      } else {
        appId = props.record.app_id
      }

      if (!appId) {
        message.error('未找到 app_id');
        return;
      }
      const response: any = await getAgentChatRecord({
        params: {
          app_id: appId,
          page: current,
          page_size: pageSize,
          keyword: ''
        }
      })

      if (response) {
        setListData(response)
      } else {
        message.error('查询日志数据失败')
      }
    } catch (error) {
      message.error('请求失败，请检查网络或稍后重试')
      console.error('请求错误:', error)

    }
  }

  const handleTableChange = (page: any, pageSize: any) => {
    setCurrent(page)
    setPageSize(pageSize)
  }

  const onRowClick = (record) => {
    setCurrentLogItem({
      ...record,
      conversationId: record.conversation_id
    })
    setShowAgentLogModal(true)
  }

  return (
    <div className='char-record'>
      <Table
        columns={columns}
        scroll={{ y: 600 }}
        dataSource={listData?.items || []}
        pagination={{
          current: current, // 当前页数
          pageSize: pageSize, // 每页显示条数
          total: listData?.total, // 数据总数
          showSizeChanger: false, // 是否显示可以改变 pageSize 的选项
          // pageSizeOptions: ['10', '20', '30', '40', '50', '60', '70', '80', '90'], // 指定每页可以显示多少条
          showQuickJumper: false, // 是否显示快速跳转的选项
          onChange: handleTableChange,
        }}
        onRow={(record) => {
          return {
            onClick: (event) => onRowClick(record), // 点击行
          };
        }}
      />
      {showAgentLogModal && (
        <AgentLogModal
          width={1142}
          currentLogItem={currentLogItem}
          onCancel={() => {
            setCurrentLogItem()
            setShowAgentLogModal(false)
          }}
        />
      )}
    </div>
  )
}

export default ChatRecord;