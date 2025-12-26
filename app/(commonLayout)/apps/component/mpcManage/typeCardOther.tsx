import React from 'react'
import cn from 'classnames'
import { useRouter } from 'next/navigation'
import { Button, Popover, Tag, type MenuProps } from 'antd'
import styles from '../base/baseStyle.module.scss'
import type { App } from '@/types/app'
import { useAppContext } from '@/context/app-context'
import './index.scss';  // 自定义样式文件

type Props = {
  headerImg?: string
  data?: any
  plugin?: any
  className?: string
  styleCss?: React.CSSProperties
  menuItmes?: MenuProps['items']
  indexValue?: number,
  changeService?: any
}

// 智能体类型卡片
const TypeCardOther: React.FC<Props> = (props) => {
  const { data, plugin, className, styleCss, menuItmes, headerImg, indexValue, changeService } = props
  const { isCurrentWorkspaceEditor } = useAppContext()
  const { push } = useRouter()

  const content = (
    <div className='text-[#1C2748]'>
      <p style={{ color: 'rgba(0, 0, 0, 0.25)' }} className='h-[3.5vh] leading-[3.5vh] hover:bg-[#EEEEEE] rounded-[2px] pl-[5px] pr-[5px] cursor-pointer'
        onClick={() => console.log('click')}
      >删除此服务</p>
    </div >
  )

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
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <div style={{ fontWeight: '700', fontSize: '16px', color: 'rgb(22, 119, 255)', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              title={data?.name}>
              {data?.name}
            </div>
            {
              data.openService ?
                <div style={{ color: '#3FDFA1' }}>已部署</div>
                :
                <div style={{ color: 'red' }}>已停止</div>
            }
          </div>
          <div title={data?.description} style={{ paddingTop: '8px', height: '28px', color: '#666666', display: 'flex', flexDirection: 'row' }}>
            <div style={{ width: '60px', minWidth: '60px', textAlign: 'right', marginRight: '4px' }}>描&nbsp;&nbsp;&nbsp;&nbsp;述：</div>
            <div className='mpcManage-show-info'>
              {data?.description}
            </div>
          </div>
          <div style={{ paddingTop: '8px', height: '28px', color: '#666666', display: 'flex', flexDirection: 'row' }}>
            <div style={{ width: '60px', minWidth: '60px', textAlign: 'right', marginRight: '4px' }}>服务ID：</div>
            {data?.serviceId || '空'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingTop: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} >
              {
                !data.openService ?
                  <Button onClick={(e) => { e.stopPropagation(); changeService(data, true); }} style={{ marginRight: '16px', border: '1px solid #216EFF', backgroundColor: '#DEE9FF', color: '#216EFF' }} size='small'>开启服务</Button>
                  :
                  <Button onClick={(e) => { e.stopPropagation(); changeService(data, false); }} style={{ marginRight: '16px', border: '1px solid #216EFF', backgroundColor: '#DEE9FF', color: '#216EFF' }} size='small'>停止服务</Button>
              }
              <Button size='small' disabled>编辑服务</Button>
            </div>
            <Popover content={content} trigger="click">
              {/* <div className='text-[20px] text-center z-20' style={{ userSelect: 'none' }}>...</div> */}
            </Popover>
          </div>
        </div>
      </div>
    </div >
  )
}

export default TypeCardOther
