import React from 'react'
import cn from 'classnames'
import { useRouter } from 'next/navigation'
import type { MenuProps } from 'antd'
import styles from '../base/baseStyle.module.scss'
import type { App } from '@/types/app'
import { useAppContext } from '@/context/app-context'
import Image from 'next/image'
import user from '@/app/(commonLayout)/apps/assets/user.png';


type Props = {
  headerImg?: string
  data?: App | undefined
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

  const colorArray = [
    '#ffbf71', '#216eff', '#216eff', '#9866fd', '#56d892', '#33c9f4', '#216eff'
  ];

  return (
    <div
      style={{ padding: '16px', height: '152px' }}
      className={cn(' w-[25.3vw] bg-sky-80 border-[#E0E6EC] border relative rounded-[8px]', styles.hoverCss, className)}
    >
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
        <div style={{
          backgroundImage: `url('/agent-platform-web/bg/head_agent_img_${((indexValue || 0) % 4) + 1}.png')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
          padding: '32px',
          height: '120px', width: '120px',
        }}>
          <img style={{ width: '100%', height: '100%' }} src={`/agent-platform-web/image/head_agent_new_${((indexValue || 0) % 4) + 1}.png`} />
        </div>
        <div style={{ marginLeft: '16px', width: 'calc(100% - 152px' }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ fontWeight: '700', fontSize: '16px', color: '#1677ff', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={data?.name}>{data?.name}</div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: '8px', color: '#bdbd30' }}>
              <img style={{ width: '12px', height: '12px' }} src={`/agent-platform-web/image/right.png`} />
              <span>1.0.0</span>
            </div>
          </div>
          <div style={{ padding: '8px 0', height: '70px' }}>
            {plugin?.description?.zh_Hans ?? data?.description}
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
              {/* <Image src={user} alt='img' width={20} height={20} className='inline mt-[-5px]' />
              <span>{'哈哈哈'}</span> */}
            </div>
            <div>
              {plugin
                ? null
                : (
                  <div style={{ color: 'rgb(33, 110, 255)' }} onClick={(e) => {
                    e.stopPropagation()
                    window.open(`/agent-platform-web/explore/installed/${data?.id}`)
                  }}>立即体验</div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default TypeCard
