import React, { useEffect, useState } from 'react'
import { Button, Popconfirm, Space, Table, message, Modal } from 'antd'
import type { PopconfirmProps, TableProps } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons';
import { downDcoosApi, downshuzhiApi, dcoosUpdateSecretKey } from '@/service/common'
import GlobalUrl from '@/GlobalUrl';
import ChatRecord from '@/app/(commonLayout)/app/(appDetailLayout)/[appId]/chatRecord'

type Props = {
  data?: any
  mutate?: any
  setActiveTab?: any
}

const DcoosPage: React.FC<Props> = ({ setActiveTab, data, mutate }) => {
  useEffect(() => {
    mutate()
  }, [])
  const confirm: PopconfirmProps['onConfirm'] = (rd: any) => {
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


  const handleDownloadDocument = () => {
    try {
      // 1. Create the anchor element
      const link = document.createElement('a');

      // 2. Set the download attributes
      link.href = '/agent-platform-web/file/API注册与能力调用.docx'; // Update with your actual document URL
      link.download = 'API注册与能力调用.docx';
      link.style.display = 'none'; // Hide the element

      // 3. Add to DOM
      document.body.appendChild(link);

      // 4. Trigger click
      link.click();

      // 5. Clean up - use setTimeout to ensure the click completes
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
      }, 100);

      message.success('文档下载开始');
    } catch (error) {
      message.error('文档下载失败');
      console.error('Download failed:', error);
    }
  }

  const columns: TableProps<any>['columns'] = [
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
      width: 120
    },
    {
      title: '接口ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'appId',
      dataIndex: 'appId',
      key: 'appId',
    },
    {
      title: 'secretKey',
      dataIndex: 'secretKey',
      key: 'secretKey',
      render: (_, rd) => <div>{rd.secretKey?.replace(/./g, '*')}
        {
          rd.secretKey && rd.secretKey !== ''
            ? <Popconfirm
              title="重置"
              description="确认重置?"
              onConfirm={() => secretKeyReset(rd)}
              okText="确认"
              cancelText="取消"
            >
              <Button type="link">重置</Button>
            </Popconfirm>
            : null
        }

      </div>,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120,
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
          {
            rd?.app_mode === 'agent-chat' &&
            <Button color="primary" variant="outlined" size='small' onClick={() => viewLogs(rd)}>查看日志</Button>
          }
        </Space>
      ),
    },
  ]
  const potiondata = [
    {
      label: '集团总部',
      value: "集团总部",
      children: [
        {
          label: '纪检监察组',
          value: '纪检监察组',
        }, {
          label: '办公室（党组办公室、董事会办公室、安全保卫部）',
          value: '办公室（党组办公室、董事会办公室、安全保卫部）',
        }, {
          label: '企业战略部',
          value: '企业战略部',
        }, {
          label: '市场部',
          value: '市场部',
        }, {
          label: '人力资源部（党组组织部）',
          value: '人力资源部（党组组织部）',
        }, {
          label: '财务部',
          value: '财务部',
        }, {
          label: '云网发展部（国际部）',
          value: '云网发展部（国际部）',
        }, {
          label: '云网运营部',
          value: '云网运营部',
        }, {
          label: '客户服务部',
          value: '客户服务部',
        }, {
          label: '网络和信息安全管理部',
          value: '网络和信息安全管理部',
        }, {
          label: '审计部',
          value: '审计部',
        }, {
          label: '法律部（合规管理部）',
          value: '法律部（合规管理部）',
        }, {
          label: '科技创新部',
          value: '科技创新部',
        }, {
          label: '党组巡视工作领导小组办公室',
          value: '党组巡视工作领导小组办公室',
        }, {
          label: '党群工作部',
          value: '党群工作部',
        }, {
          label: '集团工会',
          value: '集团工会'
        }, {
          label: '投资者关系部',
          value: '投资者关系部'
        }, {
          label: '5G共建共享工作组',
          value: '5G共建共享工作组'
        }, {
          label: '资本运营部（中国电信集团投资有限公司）',
          value: '资本运营部（中国电信集团投资有限公司）'
        }, {
          label: '政企信息服务事业群',
          value: '政企信息服务事业群'
        }, {
          label: '全渠道运营中心',
          value: '全渠道运营中心'
        }, {
          label: '采购供应链管理中心',
          value: '采购供应链管理中心'
        }, {
          label: '数据发展中心',
          value: '数据发展中心'
        }
      ]

    }, {
      label: '各省、自治区、直辖市公司',
      value: '各省、自治区、直辖市公司',
      children: [
        {
          label: '北京公司',
          value: '北京公司'
        }, {
          label: '天津公司',
          value: '天津公司'
        }, {
          label: '河北公司',
          value: '河北公司'
        }, {
          label: '山西公司',
          value: '山西公司'
        }, {
          label: '内蒙古公司',
          value: '内蒙古公司'
        }, {
          label: '辽宁公司',
          value: '辽宁公司'
        }, {
          label: '吉林公司',
          value: '吉林公司'
        }, {
          label: '黑龙江公司',
          value: '黑龙江公司'
        }, {
          label: '上海公司',
          value: '上海公司'
        }, {
          label: '江苏公司',
          value: '江苏公司'
        }, {
          label: '浙江公司',
          value: '浙江公司'
        }, {
          label: '安徽公司',
          value: '安徽公司'
        }, {
          label: '福建公司',
          value: '福建公司'
        }, {
          label: '江西公司',
          value: '江西公司'
        }, {
          label: '山东公司',
          value: '山东公司'
        }, {
          label: '河南公司',
          value: '河南公司'
        }, {
          label: '湖北公司',
          value: '湖北公司'
        }, {
          label: '湖南公司',
          value: '湖南公司'
        }, {
          label: '广东公司',
          value: '广东公司'
        }, {
          label: '广西公司',
          value: '广西公司'
        }, {
          label: '海南公司',
          value: '海南公司'
        }, {
          label: '重庆公司',
          value: '重庆公司'
        }, {
          label: '四川公司',
          value: '四川公司'
        }, {
          label: '贵州公司',
          value: '贵州公司'
        }, {
          label: '云南公司',
          value: '云南公司'
        }, {
          label: '西藏公司',
          value: '西藏公司'
        }, {
          label: '陕西公司',
          value: '陕西公司'
        }, {
          label: '甘肃公司',
          value: '甘肃公司'
        }, {
          label: '青海公司',
          value: '青海公司'
        }, {
          label: '宁夏公司',
          value: '宁夏公司'
        }, {
          label: '新疆公司',
          value: '新疆公司'
        },
      ]
    }, {
      label: '专业公司及运营单位',
      value: '专业公司及运营单位',
      children: [
        {
          label: '中国通信服务股份有限公司',
          value: '中国通信服务股份有限公司',
        }, {
          label: '国际公司',
          value: '国际公司',
        }, {
          label: '新国脉数字文化股份有限公司',
          value: '新国脉数字文化股份有限公司',
        }, {
          label: '号百信息服务有限公司',
          value: '号百信息服务有限公司',
        }, {
          label: '中电信数智科技有限公司',
          value: '中电信数智科技有限公司',
        }, {
          label: '天翼电信终端有限公司',
          value: '天翼电信终端有限公司',
        }, {
          label: '信元公众信息发展有限责任公司',
          value: '信元公众信息发展有限责任公司',
        }, {
          label: '卫星通信有限公司',
          value: '卫星通信有限公司',
        }, {
          label: '天翼支付科技有限公司',
          value: '天翼支付科技有限公司',
        }, {
          label: '天翼云科技有限公司',
          value: '天翼云科技有限公司',
        }, {
          label: '天翼科技创业投资有限公司',
          value: '天翼科技创业投资有限公司',
        }, {
          label: '天翼物联科技有限公司',
          value: '天翼物联科技有限公司',
        }, {
          label: '天翼数字生活科技有限公司',
          value: '天翼数字生活科技有限公司',
        }, {
          label: '财务公司',
          value: '财务公司',
        }, {
          label: '天翼融资租赁有限公司',
          value: '天翼融资租赁有限公司',
        }, {
          label: '人工智能公司',
          value: '人工智能公司',
        }, {
          label: '天翼安全科技有限公司',
          value: '天翼安全科技有限公司',
        }, {
          label: '中电信量子信息科技集团有限公司',
          value: '中电信量子信息科技集团有限公司',
        }, {
          label: '天翼视联科技有限公司',
          value: '天翼视联科技有限公司',
        }, {
          label: '中电信翼康科技有限公司',
          value: '中电信翼康科技有限公司',
        }, {
          label: '中电信翼智教育科技有限公司',
          value: '中电信翼智教育科技有限公司',
        }, {
          label: '中电信翼金科技有限公司',
          value: '中电信翼金科技有限公司',
        }, {
          label: '中电信数政科技有限公司',
          value: '中电信数政科技有限公司',
        }, {
          label: '中电信文宣科技有限公司',
          value: '中电信文宣科技有限公司',
        }, {
          label: '中电信应急通信有限公司',
          value: '中电信应急通信有限公司',
        }
      ]
    }, {
      label: '总部直属分支机构',
      value: '总部直属分支机构',
      children: [
        {
          label: '中国电信股份有限公司研究院',
          value: '中国电信股份有限公司研究院',
        }, {
          label: '中国电信云计算研究院',
          value: '中国电信云计算研究院',
        }, {
          label: '中国电信人工智能研究院',
          value: '中国电信人工智能研究院',
        }, {
          label: '中国电信人才发展中心',
          value: '中国电信人才发展中心',
        }, {
          label: '中国电信博物馆',
          value: '中国电信博物馆',
        }
      ]
    }
  ]

  const [typePage, setTypePage] = useState('main')
  const [rowInfo, setRowInfo] = useState(null)
  const viewLogs = (record) => {
    setRowInfo(record)
    setTypePage('log')
  }

  const backMain = () => {
    setRowInfo(null)
    setTypePage('main')
  }

  const [secretKey, setSecretKey] = useState('')
  const [isSecretKeyModalOpen, setIsSecretKeyModalOpen] = useState(false)
  const secretKeyReset: PopconfirmProps['onConfirm'] = (rd: any) => {
    dcoosUpdateSecretKey({
      url: `${GlobalUrl.defaultUrlIp}/interface/api/update_key`,
      body: {
        id: rd.id,
        appId: rd.appId
      }
    }).then(res => {
      if (res.code === 200) {
        setIsSecretKeyModalOpen(true)
        setSecretKey(res.data)
      } else {
        message.error(res.msg)
      }
    }).catch((e: any) => {
      message.error(e)
    })
  }

  const copySecretKey = async () => {
    try {
      await navigator.clipboard.writeText(secretKey);
      message.success("已复制");
    } catch (err) {
      console.error(err);
      message.error("复制失败，请手动复制");
    }
  }
  return (
    <>
      {
        typePage === 'main' ?
          <div className='mt-[24px]'>
            <div style={{ backgroundColor: 'white', padding: '16px 16px', marginBottom: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center' }} className='text-[#1C2748] text-[20px] mb-[16px]'>
              <span style={{ fontWeight: '700' }}>能力发布</span>
              <span className='text-[14px]'>（发布大模型前应保证模型已完成部署）</span>
            </div>
            {/* <div className='text-[#1C2748] text-[14px] mb-[16px]'></div> */}
            <div className='flex flex-col bg-[#fff] rounded-[8px] px-[24px]' style={{ height: 'calc(100vh - 175px)' }}>
              <div className='pt-[33px] pb-[22px]' style={{ display: 'flex', marginLeft: "30px" }}>
                <Space>
                  <Button type='primary' onClick={() => setActiveTab('dcoos-sign')}>API注册</Button>
                  {/* <Button type='primary' onClick={handleDownloadDocument}>下载文档</Button> */}
                </Space>
                <div className='dcoosurl' style={{ marginLeft: "30px" }} >
                  {/* <p> dcoos调用url: http://10.128.86.64:8000/serviceAgent/rest/workflow-api/ApiController/agent_service</p> */}
                  <p> 非dcoos调用url: http://10.141.249.22:30002/workflow-api/ApiController/agent_service</p>
                </div>
              </div>
              <div className='flex-1 w-[100%] overflow-hidden'>
                {data ? <Table columns={columns} dataSource={data.data} pagination={{ defaultCurrent: 1, total: data.page.totalCount, pageSize: 5 }} /> : null}
              </div>
            </div>
            <Modal
              open={isSecretKeyModalOpen}
              onCancel={() => setIsSecretKeyModalOpen(false)}
              maskClosable={false}
              closable={false}
              footer={(_, { OkBtn, CancelBtn }) => (
                <div style={{ textAlign: 'center' }}>
                  <Button type="primary" onClick={() => setIsSecretKeyModalOpen(false)}>知道了</Button>
                </div>
              )}
            >
              <div className='mb-[20px]' style={{ textAlign: 'center', fontSize: '20px' }}><CheckCircleOutlined className='mr-[6px]' style={{ color: '#7ebf50' }} />重置成功，请保存好X-APP-KEY</div>
              <p style={{ color: '#7f8184', textAlign: 'center' }}>X-APP-KEY: {secretKey} </p>
            </Modal>
          </div >
          : <div className='mt-[24px]'>
            <Button type="primary" onClick={() => backMain()} className='mb-[12px]'>返回</Button>
            <ChatRecord back={backMain} entry="dcoos" record={rowInfo} />
          </div>
      }
    </>
  )
}

export default DcoosPage
