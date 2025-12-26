import React from 'react'
import cn from 'classnames'
import { useRouter } from 'next/navigation'
import type { MenuProps } from 'antd'
import { Card } from 'antd';
import Icon, { SearchOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons'
import styles from '../style.module.css'
import type { App } from '@/types/app'
import { useAppContext } from '@/context/app-context'
import Image from 'next/image'
import user from '@/app/(commonLayout)/apps/assets/user.png';
import s from './style.module.css'
import { getFiveIndex } from '@/utils/var'
import { usePathname } from 'next/navigation'

type Props = {
  data?: App | undefined
  className?: string
  styleCss?: React.CSSProperties
  indexValue?: number
}

// 智能体类型卡片
const TypeCard: React.FC<Props> = (props) => {
  const { data, className, styleCss, indexValue } = props
  const pathName = usePathname()
  const { isCurrentWorkspaceEditor } = useAppContext()
  const { push } = useRouter()

  const colorArray = [
    '#ffbf71', '#216eff', '#216eff', '#9866fd', '#56d892', '#33c9f4', '#216eff'
  ];

  const HeartSvg = () => (
    <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 1024 1024">
      <title>heart icon</title>
      <path d="M923 283.6c-13.4-31.1-32.6-58.9-56.9-82.8-24.3-23.8-52.5-42.4-84-55.5-32.5-13.5-66.9-20.3-102.4-20.3-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5-24.4 23.9-43.5 51.7-56.9 82.8-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3 0.1-35.3-7-69.6-20.9-101.9z" />
    </svg>
  )
  const HeartIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={HeartSvg} {...props} />
  );

  return (
    <Card style={{ flex: '0 0 calc(33.333% - 1vw)', cursor: 'pointer' }}>
      <div style={{ display: 'flex' }}>
        <div style={{
          backgroundImage: `url('/agent-platform-web/bg/head_agent_img_${((indexValue || 0) % 4) + 1}.png')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          padding: '32px',
          height: '120px', width: '120px',
          marginRight: '12px'
        }}>
          <img style={{ width: '100%', height: '100%' }} src={`/agent-platform-web/image/head_plug_new_${((indexValue || 0) % 4) + 1}.png`} />
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: '700',
              fontSize: '16px',
              color: 'rgb(22, 119, 255)',
              maxWidth: '160px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            title={data?.name ?? data?.label?.zh_Hans}
          >{data?.name ?? data?.label?.zh_Hans}</div>
          <div style={{ padding: '8px 0', height: '70px', color: '#666666' }}>
            {data?.description?.zh_Hans}
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', color: '#b2b2b2', fontSize: '11px' }}>
            <span>{data.author}</span>
            <span>{data.create_time}</span>
            {/* <span>{data.like_count || 0}人<LikeOutlined /></span> */}
          </div>
          <div className="mt-[12px]" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div className={s.actionBtn} onClick={() => props.changeShowTypePage({ type: 'detail', data })}><EyeOutlined className={s.actionBtnIcon} />查看详情</div>
            {/* <div className={s.actionBtn} onClick={() => props.handleSubscribe({ ...data, index: indexValue - 1 })}><HeartIcon className={s.actionBtnIcon} />{data.sub ? '取消订阅' : '立即订阅'}</div> */}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default TypeCard
