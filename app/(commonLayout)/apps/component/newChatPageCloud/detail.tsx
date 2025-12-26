import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, message } from 'antd';
import { LikeOutlined } from '@ant-design/icons'
import { getLikeCount } from '@/service/newChat'
import * as API from '@/service/newChat'

const NewChatDetailPage: React.FC = (props) => {

  const searchParams: any = useSearchParams()
  // const indexValue = searchParams.get('indexValue')

  const [info, setInfo] = useState(props.data)
  const [likeNum, setLikeNum] = useState(0)

  useEffect(() => {
    setInfo(props.data)
    setLikeNum(props.data?.like_count)
  }, [props.data]);

  const handleLike = () => {
    let url = ''
    if (info.lk) {
      url = API.likeCancel
    } else {
      url = API.like
    }
    url({
      body: {
        author: info.author,
        plugin_name: info.name,
      }
    }).then(res => {
      if (res.code === 200 && res.msg === 'success') {
        setLikeNum(info.lk ? likeNum - 1 : likeNum + 1)
        setInfo({ ...info, lk: !info.lk })
        message.success(`${info.lk ? '取消' : ''}点赞成功`)
      }
    })
  }

  return (
    <div className="char-detail-page h-[100%] overflow-hidden" style={{ padding: '12px', background: '#f5f6f9' }}>
      <Card className='mb-[12px]' style={{ flex: '0 0 calc(33.333% - 1vw)' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ cursor: 'pointer' }} onClick={() => props.changeShowTypePage({ type: 'main' })} className="left-symbol">
            &lt;
          </div>
          <div style={{
            backgroundImage: `url('/agent-platform-web/bg/head_agent_img_${((info?.index + 1 || 0) % 4) + 1}.png')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
            padding: '32px',
            height: '120px', width: '120px',
            marginRight: '12px'
          }}>
            <img style={{ width: '100%', height: '100%' }} src={`/agent-platform-web/image/head_plug_new_${((info?.index + 1 || 0) % 4) + 1}.png`} />
          </div>
          <div>
            <div className='mb-[12px]' style={{ fontSize: '18px' }}>{info?.name}</div>
            <div style={{ color: '#b2b2b2', fontSize: '11px' }}>
              <span className='mr-[24px]'>时间：{info?.create_time}</span>
              <span className='mr-[24px]'>来源：{info?.sourceName}</span>
              {/* <span style={{ cursor: 'pointer' }} onClick={() => handleLike()}><LikeOutlined /> {likeNum}</span> */}
            </div>
          </div>
        </div>
      </Card>
      <Card style={{ flex: '0 0 calc(33.333% - 1vw)', cursor: 'pointer' }}>
        {info?.description.zh_Hans}
      </Card>
    </div>
  )
}

export default NewChatDetailPage