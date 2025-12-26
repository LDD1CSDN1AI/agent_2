import React from 'react'
import cn from 'classnames'
import Image from 'next/image'
import styles from './baseStyle.module.scss'
import iconBook from '@/public/image/circleIcon.png'
import rightGo from '@/public/image/rightGo.png'
import rightGoWhite from '@/public/image/rightGo-white.png'

type Props = {
  data?: any
  onOpen?: (val: any) => void

}

// 首页基础卡片
const baseCard: React.FC<Props> = (props) => {
  const { data, onOpen } = props
  const { styleValue, imageName } = data || {}
  let bgUrl = ''
  if (data.mode) {
    const bgName = data.mode === 'agent-chat' ? 'agent_card_bg' : (data.mode === 'chat' ? 'chat_card-bg' : 'workflow_card_bg')
    bgUrl = `url(/agent-platform-web/image/${bgName}.png)`
  } else {
    bgUrl = 'url(\'/agent-platform-web/bg/allBg.png\')'
  }
  if (data.bgName) {
    bgUrl = `url(\'/agent-platform-web/bg/${data.bgName}.png\')`;
  }

  return (
    <div className={cn('flex w-[440px] mr-[18px] mb-[18px] hoverCss', styles.hoverCss)} style={{
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 100%',
      backgroundImage: bgUrl,
      paddingBottom: '20px',
    }} onClick={() => {
      onOpen?.({
        params: {
          isOpen: true,
          title: `${data.title}`,
          mode: `${data.mode}`,
          titleName: `${data.name}`,
        },
      })
    }}>
      <div style={styleValue && styleValue.content ? { ...styleValue.content } : {}} className='mx-auto mr-[9px] ml-[32px] pt-[24px]'>
        <div className='flex mb-[10px]'>
          <Image src={iconBook} alt='img' width={16} className='mr-[10px] h-[15px] my-auto' />
          <div style={styleValue && styleValue.title ? { ...styleValue.title } : {}} className='text-[#216EFF] text-[18px] font-bold'>
            <span>{data?.title}</span>
            <Image src={imageName === 'rightGoWhite' ? rightGoWhite : rightGo}
              alt='img'
              style={{ width: '16px', height: '16px', marginTop: '6px' }}
              className=' mr-[24px] ml-[4px]'
              onClick={(e) => { e.stopPropagation() }} />
          </div>
        </div>
        <div style={styleValue && styleValue.text ? { ...styleValue.text } : {}} className='text-[16px] text-[#1C2748]'>{data?.text}</div>
      </div>
    </div>
  )
}

export default baseCard
