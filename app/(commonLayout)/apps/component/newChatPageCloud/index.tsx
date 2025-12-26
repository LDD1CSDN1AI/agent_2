import React, { useEffect, useState } from 'react'
import { Card, Button, Pagination, message } from 'antd';
import type { PaginationProps } from 'antd'
import Icon, { SearchOutlined, EyeOutlined } from '@ant-design/icons'
import RadioButton from './radioButton'
import Input from '@/app/components/base/input/index-with-unit'
import CardItem from './cardItem'
import s from './style.module.css'
import * as API from '@/service/newChat'
import { del, get, post } from '@/service/base'
import NewChatDetailPage from './detail'

type chatItem = {}

const NewChatPageCloud: React.FC = (props) => {

  const chatSourceList = [
    { label: '全部', key: '' },
    { label: '平台插件', key: '1' },
    { label: '用户插件', key: '2' },
  ]

  const chatTypeList = [
    { label: '通用', key: '通用' },
    { label: '多模态', key: '多模态' },
    { label: '办公助手', key: '办公助手' },
    { label: '代码执行', key: '代码执行' },
  ]

  const sortByList = [
    { label: '按最新排序', key: 'create_time' },
    { label: '按最热排序', key: 'subscribe_count' }
  ]
  const [chatSource, setChatSource] = useState<string>('')
  const [chatType, setChatType] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('create_time')
  const [keyword, setKeyword] = useState<string>('')
  // 所有插件
  const [allChatList, setAllChatList] = useState<Array<chatItem>>([])
  // 平台插件
  const [systemChatList, setSystemChatList] = useState<Array<chatItem>>([])
  // 用户插件
  const [customChatList, setCustomChatList] = useState<Array<chatItem>>([])
  // 当前列表展示数据
  const [chatList, setChatList] = useState<Array<chatItem>>([])
  const [limit, setLimit] = useState(9)
  const [current, setCurrent] = useState(0);
  const [typePage, setTypePage] = useState('main')
  const [detailInfo, setDetailInfo] = useState(null)

  const onChangePage: PaginationProps['onChange'] = (pageNumber) => {
    setCurrent(pageNumber - 1)
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    handleFliter()
  }, [allChatList])

  useEffect(() => {
    handleFliter()
  }, [chatSource, chatType, keyword])

  useEffect(() => {
    let newChatList = handleSort([...chatList])
    setChatList(newChatList)
  }, [sortBy])

  const handleFliter = () => {
    let newChatList = chatSource === '' ? allChatList
      : chatSource === '1' ? systemChatList
        : chatSource === '2' ? customChatList
          : []

    newChatList = newChatList.filter(obj => {
      return (chatType === '' ? true : obj.labels.includes(chatType)) && (keyword === '' ? true : obj.name.includes(keyword))
    })
    newChatList = handleSort(newChatList)
    setChatList(newChatList)
  }

  const fetchData = async () => {
    try {
      // 并行发起两个请求
      const [res1, res2] = await Promise.all([
        get(`/workspaces/current/tools/builtin/flat`),
        get(`/workspaces/current/tools/api/flat`),
      ]);
      const systemChatData = res1.map(item => {
        return { ...item, sourceName: '平台插件' }
      })
      const customChatData = res2.map(item => {
        return { ...item, sourceName: '用户插件' }
      })
      setSystemChatList(systemChatData)
      setCustomChatList(customChatData)
      let chatListResult = handleSort([...systemChatData, ...customChatData])
      setAllChatList(chatListResult)
      setChatList(chatListResult)
    } catch (err) {
      // setError(err);
      console.log('err', err)
    } finally { }
  };

  const handleSort = (list) => {
    let newList = []
    if (sortBy === 'create_time') {
      newList = list.sort((a, b) => new Date(b.create_time) - new Date(a.create_time));
    } else if (sortBy === 'subscribe_count') {
      newList = list.sort((a, b) => b.subscribe_count - a.subscribe_count);
    }
    return newList
  }

  const handleSubscribe = (data) => {
    let url = ''
    if (data.sub) {
      url = API.subscribeCancel
    } else {
      url = API.subscribe
    }
    url({
      body: {
        author: data.author,
        plugin_name: data.name
      }
    }).then(async res => {
      if (res.code === 200 && res.msg === 'success') {
        await fetchData();
        message.success(`${data.sub ? '取消' : ''}订阅成功`)
      }
    })
  }

  const showDetail = ({ type, data }, index) => {
    setDetailInfo({ ...data, index })
    setTypePage(type)
  }

  const detailToList = async (type) => {
    setTypePage(type)
    setDetailInfo(null)
    await fetchData();
  }

  return (
    <div style={{ padding: '12px' }}>
      {
        typePage === 'main' ? <>
          <Card style={{ width: '100%' }}>
            <div>插件来源：<RadioButton
              size='small'
              list={chatSourceList}
              active={chatSource}
              setActive={(key) => setChatSource(key)}
            />
            </div>
            {/* <div className="mt-[24px]">插件分类：<RadioButton
              size='small'
              list={chatTypeList}
              active={chatType}
              setActive={(key) => setChatType(key)}
            />
            </div> */}
          </Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
            {/* <div>
              {
                sortByList.map(item => <Button
                  key={item.key}
                  size='large'
                  style={{
                    marginRight: '16px',
                    color: item.key === sortBy ? '#3470f6' : '#5b5b5b',
                    background: item.key === sortBy ? 'rgba(102, 145, 246, .3)' : '#f8f8f8',
                    border: item.key === sortBy ? '1px solid #3470f6' : '1px solid #adafb6',
                    height: '37px'
                  }}
                  onClick={() => setSortBy(item.key)}>{item.label}
                </Button>)
              }
            </div> */}
            <div style={{ width: '250px' }}>
              <Input
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                className='block h-9'
                placeholder='请输入搜索内容'
                suffix={<SearchOutlined />}
              />
            </div>
          </div>
          <div className='flex-1 w-[100%] overflow-y-auto' style={{ height: 'calc(100vh - 268px)' }}>
            <div className='flex flex-wrap overflow-hidden overflow-y-auto pb-12' style={{ gap: '1vw' }}>
              {
                chatList.map((item, index) => {
                  return <CardItem
                    key={index}
                    data={item}
                    indexValue={index + 1}
                    changeShowTypePage={(params) => showDetail(params, index)}
                    handleSubscribe={(isSub) => handleSubscribe(isSub)}
                  />
                })
              }
            </div>
          </div>
          {/* <div className='pb-[24px]'>
            <Pagination align="end" defaultCurrent={9} showQuickJumper current={current + 1} total={allChatList?.length} onChange={onChangePage} />
          </div> */}
        </> : <NewChatDetailPage
          data={detailInfo}
          changeShowTypePage={({ type }) => detailToList(type)}
        />
      }
    </div >
  )
}

export default NewChatPageCloud;