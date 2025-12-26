import React from 'react'
import cn from 'classnames'
import { useRouter } from 'next/navigation'
import type { MenuProps } from 'antd'
import styles from '../base/baseStyle.module.scss'
import type { App } from '@/types/app'
import { useAppContext } from '@/context/app-context'

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
          <img style={{ width: '100%', height: '100%' }} src={`/agent-platform-web/image/head_plug_new_${((indexValue || 0) % 4) + 1}.png`} />
        </div>
        <div style={{ marginLeft: '16px', marginTop: '8px', width: 'calc(100% - 152px' }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ fontWeight: '700', fontSize: '16px', color: 'rgb(22, 119, 255)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={data?.name ?? plugin?.label?.zh_Hans}>{data?.name ?? plugin?.label?.zh_Hans}</div>
          </div>
          <div style={{ padding: '8px 0', height: '70px', color: '#666666' }}>
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
                  <div onClick={(e) => {
                    e.stopPropagation()
                    window.open(`/agent-platform-web/explore/installed/${data?.id}`)
                  }}>立即体验</div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div >
    // <div
    //   style={(!data?.header_image && !headerImg) ? { height: '100%' } : {}}
    //   className={cn('pl-[2vw] pr-[2vw] w-[25.3vw] h-[20.5vh] bg-sky-80 border-[#E0E6EC] border relative rounded-[8px]', styles.hoverCss, className)}
    // >
    //   <div style={(!data?.header_image && !headerImg) ? { minHeight: '12vh', display: 'flex', alignItems: 'center', paddingTop: '48px' } : {}} className='flex pt-[21px] leading-[20px]'>
    //     {
    //       (data?.header_image || headerImg) &&
    //       <img className='w-[3.1vw] h-[5.5vh] mr-[0.93vw] align-top' src={`/agent-platform-web/image/${data?.header_image ? data?.header_image : headerImg}.png`} alt="" />
    //     }
    //     <span className='color-[#1C2748] text-[20px]' style={{ color: indexValue !== undefined ? colorArray[indexValue % 7] : '' }}>{data?.name ?? plugin?.label?.zh_Hans}</span>
    //   </div>
    //   <div style={(!data?.header_image && !headerImg) ? { marginTop: '8px' } : {}} className={cn('text-[#1C2748] text-[16px] mt-[8px]', styles.overflowText)}>
    //     {plugin?.description?.zh_Hans ?? data?.description}
    //   </div>
    //   <div className='absolute bottom-[10px] right-[20px] text-[#216EFF] text-[16px]'>
    //     {plugin
    //       ? null
    //       : (
    //         <div onClick={(e) => {
    //           e.stopPropagation()
    //           window.open(`/agent-platform-web/explore/installed/${data?.id}`)
    //         }}>立即体验</div>
    //       )}
    //   </div>
    // </div>
  )
}

export default TypeCard
