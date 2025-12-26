import React from 'react'
import cn from 'classnames'
import { useRouter } from 'next/navigation'
import type { MenuProps } from 'antd'
import styles from '../base/baseStyle.module.scss'
import type { App } from '@/types/app'
import { useAppContext } from '@/context/app-context'
import { formatDateString } from '@/utils'

type Props = {
  headerImg?: string
  data?: App | undefined
  plugin?: any
  className?: string
  styleCss?: React.CSSProperties
  menuItmes?: MenuProps['items']
  indexValue?: number,
  isShare?: any
}

// 智能体类型卡片
const TypeCard: React.FC<Props> = (props) => {
  const { data, plugin, className, styleCss, menuItmes, headerImg, indexValue, isShare = undefined } = props
  const { isCurrentWorkspaceEditor } = useAppContext()
  const { push } = useRouter()

  const colorArray = [
    '#ffbf71', '#216eff', '#216eff', '#9866fd', '#56d892', '#33c9f4', '#216eff'
  ];

  return (
    <div
      style={{ padding: '16px', height: '160px' }}
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
          <img style={{ width: '100%', height: '100%' }} src={`/agent-platform-web/image/head_workflow_new_${((indexValue || 0) % 4) + 1}.png`} />
        </div>
        <div style={{ marginLeft: '16px', width: 'calc(100% - 152px' }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ fontWeight: '700', fontSize: '16px', color: 'rgb(22, 119, 255)', maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={data?.name ?? plugin?.label?.zh_Hans}>{data?.name ?? plugin?.label?.zh_Hans}</div>
          </div>
          <div style={{ color: '#666666' }}>
            {data?.created_at ? formatDateString(data?.created_at as any) : ''}
          </div>
          <div style={{ padding: '8px 0', height: '70px', color: '#666666' }}>
            {plugin?.description?.zh_Hans ?? data?.description}
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
              {/* <Image src={user} alt='img' width={20} height={20} className='inline mt-[-5px]' />
                  <span>{'哈哈哈'}</span> */}
            </div>
            <div style={{ color: 'rgb(33, 110, 255)' }}>
              {plugin
                ? null
                : (
                  <div onClick={(e) => {
                    e.stopPropagation()
                    window.open(`/agent-platform-web/explore/installed/${data?.id}?isShare=${isShare}`)
                  }}>立即体验</div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div >
    // <div
    //   style={{ height: '250px', padding: '16px' }}
    //   className={cn('w-[25.3vw] h-[20.5vh] bg-sky-80 border-[#E0E6EC] border relative rounded-[8px]', styles.hoverCss, className)}
    // >
    //   <div style={{ width: '100%', height: '100%' }}>
    //     <div>
    //       <img style={{ width: '56px', height: '56px' }} src={`/agent-platform-web/image/header_workflow${((indexValue || 0) % 4) + 1}.png`} alt="" />
    //     </div>
    //     <div style={{ marginTop: '16px', fontWeight: '700', fontSize: '20px' }}>
    //       {data?.name ?? plugin?.label?.zh_Hans}
    //     </div>
    //     <div style={{ marginTop: '4px', color: 'rgb(182 196 211)' }}>
    //       {data?.created_at ? formatDateString(data?.created_at as any) : ''}
    //     </div>
    //     <div title={plugin?.description?.zh_Hans ?? data?.description} className={styles['typeCard_desc_2']} style={{ marginTop: '16px', height: '46px', width: '100%' }}>
    //       {plugin?.description?.zh_Hans ?? data?.description}
    //     </div>
    //     <div style={{ marginTop: '8px', paddingTop: '8px', textAlign: 'right', color: '#1677ff', borderTop: '1px solid rgb(224 230 236 / var(--tw-border-opacity, 1))' }}>
    //       {plugin
    //         ? null
    //         : (
    //           <div onClick={(e) => {
    //             e.stopPropagation()
    //             window.open(`/agent-platform-web/explore/installed/${data?.id}`)
    //           }}>立即体验</div>
    //         )}

    //     </div>
    //   </div>
    // </div>
  )
}

export default TypeCard
