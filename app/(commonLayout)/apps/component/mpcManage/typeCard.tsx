import React from 'react'
import cn from 'classnames'
import { useRouter } from 'next/navigation'
import { Tag, type MenuProps } from 'antd'
import styles from '../base/baseStyle.module.scss'
import type { App } from '@/types/app'
import { useAppContext } from '@/context/app-context'

type Props = {
  headerImg?: string
  data?: any
  plugin?: any
  className?: string
  styleCss?: React.CSSProperties
  menuItmes?: MenuProps['items']
  indexValue?: number
}

// 智能体类型卡片
const TypeCard: React.FC<Props> = (props) => {
  const { data, plugin, className, styleCss, menuItmes, headerImg, indexValue } = props
  const { isCurrentWorkspaceEditor } = useAppContext()
  const { push } = useRouter()


  return (
    <div
      style={{ padding: '16px', height: '152px' }}
      className={cn(' w-[25.3vw] bg-sky-80 border-[#E0E6EC] border relative rounded-[8px]', styles.hoverCss, className)}
    >
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
        <div style={{
          backgroundImage: `url('/agent-platform-web/bg/head_agent_img_3.png')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          padding: '32px',
          height: '120px', width: '120px',
        }}>
          <img style={{ width: '100%', height: '100%' }} src={`/agent-platform-web/bg/MpcManage.png`} />
        </div>
        <div style={{ marginLeft: '16px', marginTop: '8px', width: 'calc(100% - 152px' }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ fontWeight: '700', fontSize: '16px', color: 'rgb(22, 119, 255)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              title={data?.name}>
              {data?.name}
            </div>
          </div>
          <div style={{ padding: '8px 0', height: '70px', color: '#666666' }}>
            {data?.description}
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
              <Tag style={{ color: '#7D94BF' }} color='#F5F8FF' bordered={false}>{data.tar}</Tag>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default TypeCard
