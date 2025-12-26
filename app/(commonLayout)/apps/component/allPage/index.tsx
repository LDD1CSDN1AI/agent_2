import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import BaseCard from '../base/baseCard'
import bannerMap from '@/public/image/bannerMap.png'
import iconBook from '@/public/image/iconBook.png'
import message from '@/public/image/message.png'
import type { OpenTypes } from '@/app/(commonLayout)/apps/component/base/createModal'
import CreateModal from '@/app/(commonLayout)/apps/component/base/createModal'
import { notification } from 'antd'
import "./allPage.scss"

type Props = {
  data?: any
}

const AllPage: React.FC<Props> = () => {
  const [isAddOpen, setIsAddOpen] = useState<OpenTypes>({
    isOpen: false,
    title: '',
  })

  // useEffect(() => {
  //   (
  //     async () => {
  //       showTipInfoFun();
  //     }
  //   )()
  // }, [])

  const showTipInfoFun = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const showTipInfo = urlParams.get('showTipInfo')
    if (showTipInfo) {
      notification.warning({
        message: '提示信息',
        key: 'showTipInfoFun',
        duration: null,
        description:
          '1.维护热线：4008-011-000集团用户转1再转6。 2.平台迁移后，之前构建的智能体和工作流可能出现问题，如有问题请删除重新构建',
      });
    }
  }

  const HeaderJs = [
    {
      title: '创建智能体',
      text: '点击"创建智能体"，填写信息、选择大模型、插件等，配置完成进行调优，保存后可在个人空间查看和修改智能体',
      mode: 'agent-chat',
      name: '智能体',
      // bgName: 'head-create-agent',
      imageName: 'rightGoWhite',
      styleValue: { text: { maxWidth: '260px', color: 'black' }, title: { display: 'flex', flexDirection: 'row', color: 'black', borderBottom: '1px solid', paddingBottom: '8px' } }
    },
    {
      title: '创建插件',
      text: '点击"创建插件"，可通过url地址接入和代码创建(支持线上调试)2种方式构建插件，保存后可在个人空间查看和修改插件',
      mode: 'chat',
      name: '插件',
      imageName: 'rightGoWhite',
      // bgName: 'head-create-plug',
      styleValue: { text: { maxWidth: '260px', color: 'black' }, title: { display: 'flex', flexDirection: 'row', color: 'black', borderBottom: '1px solid', paddingBottom: '8px' } }
    },
    {
      title: '创建工作流',
      text: '点击"创建工作流"，在画布上通过拖拽和节点配置的方式构建工作流，支持线上对工作流进行测试，保存后可在个人空间查看和修改工作流',
      mode: 'workflow',
      name: '工作流',
      imageName: 'rightGoWhite',
      // bgName: 'head-create-flow',
      styleValue: { text: { maxWidth: '260px', color: 'black' }, title: { display: 'flex', flexDirection: 'row', color: 'black', borderBottom: '1px solid', paddingBottom: '8px' } }
    },
  ]
  const dataJS = [
    {
      title: '创建智能体',
      text: '点击"创建智能体"，填写信息、选择大模型、插件等，配置完成进行调优，保存后可在个人空间查看和修改智能体',
      styleValue: { text: { maxWidth: '260px' }, title: { display: 'flex', flexDirection: 'row', color: 'black' } },
      bgName: 'agent-1',
    },
    {
      title: '发布智能体',
      text: '发布智能体有三种形式：发布后仅个人使用，发布到智能体广场，从项目空间中进行发布，三种发布后的被查看范围不同',
      styleValue: { text: { maxWidth: '260px' }, title: { display: 'flex', flexDirection: 'row', color: 'black' } },
      bgName: 'agent-2',
    },
    {
      title: '智能体广场',
      text: '智能体广场包含系统提供的默认智能体，及用户发布到广场后的智能体，广场内智能体默认全部公开',
      styleValue: { text: { maxWidth: '260px' }, title: { display: 'flex', flexDirection: 'row', color: 'black' } },
      bgName: 'agent-3',
    },
    // {
    //   title: 'Prompt 模板',
    //   text: '可选择系统提供prompt模板，支持自主备份',
    // },
  ]
  const pluginsIntro = [
    {
      title: '创建插件',
      text: '点击"创建插件"，可通过url地址接入和代码创建(支持线上调试)2种方式构建插件，保存后可在个人空间查看和修改插件',
      styleValue: { content: { marginLeft: '148px' }, text: { maxWidth: '260px', color: 'black' }, title: { display: 'flex', flexDirection: 'row', color: 'black' } },
      bgName: 'plug-1',
    },
    {
      title: '发布插件',
      text: '发布插件有三种形式：发布后仅个人使用，发布到插件广场，从项目空间中进行发布，三种发布后的被查看范围不同',
      styleValue: { content: { marginLeft: '148px' }, text: { maxWidth: '260px', color: 'black' }, title: { display: 'flex', flexDirection: 'row', color: 'black' } },
      bgName: 'plug-2',
    },
    {
      title: '插件广场',
      text: '插件广场包含系统提供的默认智能体，及用户发布到广场后的插件，广场内插件默认全部公开',
      styleValue: { content: { marginLeft: '148px' }, text: { maxWidth: '260px', color: 'black' }, title: { display: 'flex', flexDirection: 'row', color: 'black' } },
      bgName: 'plug-3',
    },
    // {
    //   title: 'Prompt 模板',
    //   text: '可选择系统提供prompt模板，支持自主备份',
    // },
  ]
  const workflowIntro = [
    {
      title: '创建工作流',
      text: '点击"创建工作流"，在画布上通过拖拽和节点配置的方式构建工作流，支持线上对工作流进行测试，保存后可在个人空间查看和修改工作流',
      styleValue: { content: { marginLeft: '148px' }, text: { maxWidth: '260px', color: 'black' }, title: { display: 'flex', flexDirection: 'row', color: 'black' } },
      bgName: 'flow-1',
    },
    {
      title: '发布工作流',
      text: '发布工作流有三种形式：发布后仅个人使用，发布到工作流广场，从项目空间中进行发布，三种发布后的被查看范围不同',
      styleValue: { content: { marginLeft: '148px' }, text: { maxWidth: '260px', color: 'black' }, title: { display: 'flex', flexDirection: 'row', color: 'black' } },
      bgName: 'flow-2',
    },
    {
      title: '工作流广场',
      text: '工作流广场包含系统提供的默认工作流，及用户发布到广场后的工作流，广场内工作流默认全部公开',
      styleValue: { content: { marginLeft: '148px' }, text: { maxWidth: '260px', color: 'black' }, title: { display: 'flex', flexDirection: 'row', color: 'black' } },
      bgName: 'flow-3',
    },
    // {
    //   title: 'Prompt 模板',
    //   text: '可选择系统提供prompt模板，支持自主备份',
    // },
  ]
  return (
    <>
      <div className='flex h-[420px] w-[100%] mt-[48px]' style={{
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%',
        backgroundImage: 'url(\'/agent-platform-web/bg/allBanner.png\')',
        flexDirection: 'column',
        position: 'relative',
      }}>
        <div className='message-content'>
          <div style={{ width: '64px', height: '100%' }}>
            <Image src={message} alt='img' style={{ position: 'relative', right: '-32px', top: '2px' }} />
          </div>
          <div className="marquee">
            <div className="marquee-content">
              平台功能全新升级：1.对话流功能上线项目空间，支持成员协同操作；2.新增变量赋值新节点；3.大模型、代码、API等节点上线失败重试、异常处理功能；3.Agent编辑页面上线测试日志追踪功能；4.优化项目空间成员身份，管理员身份具备项目空间管理权限。            </div>
          </div>
          <div style={{ width: '64px', height: '100%' }}>
          </div>
        </div>

        <Image src={bannerMap} alt='img' style={{
          position: 'absolute',
          color: 'transparent',
          transformOrigin: 'top right',
          right: 0,
          top: 0,
          transform: 'scale(1.5)',
          zIndex: 1,
        }} />
        <div style={{ marginLeft: '50px' }}>
          <p className='text-[#282829] text-[36px] mt-[64px] font-bold'>智能体开发模块</p>
          <p className='text-[#27292B] text-[16px] mt-[23px] font-medium'>提供全套工具和能力，开发者可根据自己的需求快速搭建智能体</p>
        </div>
        <div className='flex' style={{ marginLeft: '50px', marginTop: '50px', zIndex: 2 }}>{HeaderJs?.map((item, index) => (<BaseCard onOpen={({ params }) => {
          setIsAddOpen({
            ...params,
          })
        }} data={item} key={index} />))}</div>
      </div>

      <div className='mt-[19px]'>
        <div className='text-[20px] mb-[24px] text-[#1C2748] font-bold'>新手引导</div>
        <div className='w-[100%] bg-[#fff] rounded-[10px] px-[33px] pt-[28px] pb-[10px] mb-[16px]'>
          <div className='flex mb-[24px]'>
            <Image src={iconBook} alt='img' width={32} className='mr-[7px] h-[32px]' />
            <div className='text-[18px] my-auto font-medium'>智能体</div>
          </div>
          <div className='flex'>{dataJS?.map((item, index) => (<BaseCard data={item} key={index} />))}</div>
        </div>
        <div className='w-[100%] bg-[#fff] rounded-[10px] px-[33px] py-[28px] mb-[16px]'>
          <div className='flex mb-[24px]'>
            <Image src={iconBook} alt='img' width={32} className='mr-[7px] h-[32px]' />
            <div className='text-[18px] my-auto font-medium'>插件</div>
          </div>
          <div className='flex'>{pluginsIntro?.map((item, index) => (<BaseCard data={item} key={index} />))}</div>
        </div>
        <div className='w-[100%] bg-[#fff] rounded-[10px] px-[33px] py-[28px] mb-[16px]'>
          <div className='flex mb-[24px]'>
            <Image src={iconBook} alt='img' width={32} className='mr-[7px] h-[32px]' />
            <div className='text-[18px] my-auto font-medium'>工作流</div>
          </div>
          <div className='flex'>{workflowIntro?.map((item, index) => (<BaseCard data={item} key={index} />))}</div>
        </div>
      </div>
      {isAddOpen.isOpen ? <CreateModal isAddOpen={isAddOpen} onClose={(val: boolean) => setIsAddOpen({ ...isAddOpen, isOpen: val })} /> : null}
    </>
  )
}

export default AllPage
