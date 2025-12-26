import React, { useEffect, useState } from 'react'
import { Card, Input, Select, DatePicker, Button, Table, Empty, message, Modal } from 'antd'
import type { TableProps } from 'antd'
import { SearchOutlined } from "@ant-design/icons";
import style from './callStatistics.module.scss'
import * as API from '@/service/apps'
import dayjs from 'dayjs';
import GlobalUrl from '@/GlobalUrl'

const { RangePicker } = DatePicker;
interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}


const CallStatisticsCloud: React.FC<Props> = ({ setActiveTab }) => {

  const columns: TableProps<any>['columns'] = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: '所属项目空间',
      dataIndex: 'work_space_name',
      key: 'work_space_name',
    },
    {
      title: '接口ID',
      dataIndex: 'business_type',
      key: 'business_type',
      // width: 300
    },
    // {
    //   title: '省份',
    //   dataIndex: 'province',
    //   key: 'province',
    //   // width: 120
    // },
    {
      title: '查询范围',
      dataIndex: 'time_scope',
      key: 'time_scope',
    },
    {
      title: '调用次数',
      dataIndex: 'total_count',
      key: 'total_count',
      // width: 90
    },
    {
      title: '成功调用次数',
      dataIndex: 'success_count',
      key: 'success_count',
      // width: 120
    },
    { // agent | workflow
      title: '应用类型',
      dataIndex: 'mode',
      key: 'mode',
      // width: 120
    },
    { // t | f
      title: '是否公开',
      dataIndex: 'is_public',
      key: 'is_public',
      // width: 90
    },
    {
      title: '操作',
      key: 'action',
      // width: 110,
      render: (_, rd) => (
        <Button type="link" onClick={() => handleDetail(rd)}>查看详情</Button>
      ),
    },
  ]

  const [isReset, setIsReset] = useState<Boolean>(false)
  const [keyword, setKeyword] = useState<string>('')
  const [provinceList, setProvinceList] = useState<any>([])
  const [province, setProvince] = useState<string | null>(null)
  const [startTime, setStartTime] = useState<string>(null)
  const [endTime, setEndTime] = useState<string>(null)
  const [pageNum, setPageNum] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [dataList, setDataList] = useState<any>([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailInfo, setDetailInfo] = useState({});
  const detailObj = {
    agent_name: '智能体名称',
    workspace: '工作空间',
    mode: '所属类别',
    bussinessType: '智能体ID',
    description: '智能体描述',
    user_name: '所属用户',
    // company_name: '所属用户所在单位',
    is_public: '是否公开',
    today_count: '当日调用数',
    yesterday_count: '昨日调用次数',
    month_count: '当月调用数',
    total_count: '总调用数',
    // province: '省份',
  }

  useEffect(() => {
    getProvinceList()
  }, [])

  useEffect(() => {
    if (isReset) {
      setIsReset(false)
    }
    getDataList()
  }, [isReset, pageNum, pageSize])

  const getDataList = () => {
    API.getCallStatisticsList({
      url: `${GlobalUrl.wangyun_defaultUrlIp_agent_platform}/v1/workflow-api/queryInfo`,
      // url: `http://172.16.3.194:8088/v1/workflow-api/queryInfo`,
      body: {
        pageNum,
        pageSize,
        // province: province || '',
        startTime: startTime,
        endTime: endTime,
        businessType: keyword,
        flag: window.location.pathname.includes('agent-platform-web') ? 'sf' : 'wy'
      }
    }).then(res => {
      if (res.status === 200) {
        setTotal(res.data.total)
        setDataList(res.data.dataList)
      } else {
        message.error(res.msg)
      }
    }).catch((e: any) => {
      message.error(e)
    })
  }

  const handleDetail = (rd) => {
    API.getCallStatisticsDetail({
      url: `${GlobalUrl.wangyun_defaultUrlIp_agent_platform}/v1/workflow-api/queryDetail`,
      // url: `http://172.16.3.194:8088/v1/workflow-api/queryDetail`,
      body: {
        businessType: rd.business_type,
        appID: rd.app_id,
        // totalCount: rd.total_count,
        flag: window.location.pathname.includes('agent-platform-web') ? 'sf' : 'wy'
      }
    }).then(res => {
      if (res.status === 200) {
        setIsModalOpen(true)
        setDetailInfo(res.data)
      } else {
        message.error(res.msg)
      }
    }).catch((e: any) => {
      message.error(e)
    })
  }

  const onRangeChange = (date, dateString) => {
    setStartTime(dateString[0])
    setEndTime(dateString[1])
  }

  const resetFilter = () => {
    setIsReset(true)
    setPageNum(1)
    setPageSize(10)
    setKeyword('')
    setProvince('')
    setStartTime(null)
    setEndTime(null)
  }

  const getProvinceList = () => {
    API.getProvList({
      url: `${GlobalUrl.wangyun_defaultUrlIp_agent_platform}/v1/workflow-api/queryProvList`,
      // url: `http://117.89.254.31:32321/v1/workflow-api/queryProvList`,
      params: {
        flag: window.location.pathname.includes('agent-platform-web') ? 'sf' : 'wy'
      }
    }).then(res => {
      if (res.status === 200) {
        const result = res.data.map(item => {
          return {
            label: item,
            value: item
          }
        })
        setProvinceList(result)
      } else {
        message.error(res.msg)
      }
    }).catch((e: any) => {
      message.error(e)
    })
  }

  return (
    <>
      <Card style={{ height: 'calc(100vh - 110px)', background: 'white' }} className='call-statistics mt-[24px]'>
        <div className='search-filter mb-[24px]'>
          名称/接口ID：<Input
            placeholder="请输入名称/接口ID搜索"
            allowClear
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ width: 200, marginRight: 20 }}
          // suffix={<SearchOutlined />}
          />
          {/* 省份：<Select
            style={{ width: 200, marginRight: 30 }}
            allowClear
            options={provinceList}
            placeholder="请选择省份"
            value={province}
            onChange={(e) => setProvince(e)}
          /> */}
          时间：<RangePicker
            style={{ marginRight: 30 }}
            value={[startTime && dayjs(startTime), endTime && dayjs(endTime)]}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            onChange={onRangeChange}
          />
          <Button className='mr-[12px]' type="primary" onClick={() => getDataList()}>搜索</Button>
          <Button onClick={() => resetFilter()}>重置</Button>
        </div>
        <Table<DataType>
          columns={columns}
          dataSource={dataList}
          scroll={{ y: 560 }}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            pageSizeOptions: [10, 20, 50, 100],
            showQuickJumper: false,
            showSizeChanger: true,
            onChange: (page, pageSize) => {
              setPageNum(page)
              setPageSize(pageSize)
            },
          }}
        />
        <Modal
          closable={{ 'aria-label': 'Custom Close Button' }}
          open={isModalOpen}
          footer={null}
          onCancel={() => { setIsModalOpen(false); setDetailInfo(null) }}
        >
          <div className={style.modalBody}>
            {
              Object.keys(detailObj).map(key => {
                return <div className={style.modalRow}>
                  <div className={style.modalCol, style.modalLabel}>{detailObj[key]}</div>
                  <div className={style.modalCol, style.modalValue}>{key === 'is_public' ? detailInfo?.[key] ? '是' : '否' : detailInfo?.[key]}</div>
                </div>
              })
            }
          </div>
        </Modal>
      </Card>
    </>
  )
}

export default CallStatisticsCloud