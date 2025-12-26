'use client'
import type { FC } from 'react'
import React from 'react'
import { usePathname } from 'next/navigation'
import { useContext } from 'use-context-selector'
import ExploreContext from '@/context/explore-context'
import TextGenerationApp from '@/app/components/share/text-generation'
import Loading from '@/app/components/base/loading'
import ChatWithHistory from '@/app/components/base/chat/chat-with-history'

export type IInstalledAppProps = {
  id: string
}

const InstalledApp: FC<IInstalledAppProps> = ({
  id,
}) => {
  const { installedApps } = useContext(ExploreContext)
  const installedApp = installedApps.find(item => item.id === id)

  if (!installedApp) {
    return (
      <div className='flex h-full items-center'>
        <Loading type='area' />
      </div>
    )
  }
  const pathName = usePathname()

  const pushBackHistory = () => {
    history.pushState(null, '', `${pathName}?category=all`)
  }

  return (
    <div className='h-full py-2 pl-0 pr-2 sm:p-2'>
      {/* <div className='flex mb-[22px]'>
        <div className='bg-[#fff] w-[27px] h-[27px]' onClick={() => {
          pushBackHistory()
        }}>
          <Image src={back} alt='img' width={16} height={16} className='mx-auto mt-[6px]' />
        </div>
        <div className='text-[#6B7492] text-[14px] ml-[8px] mr-[23px] my-auto'>返回</div>
      </div> */}
      {installedApp.app.mode !== 'completion' && installedApp.app.mode !== 'workflow' && (
        <ChatWithHistory installedAppInfo={installedApp} className='rounded-2xl shadow-md overflow-hidden' />
      )}
      {installedApp.app.mode === 'completion' && (
        <TextGenerationApp isInstalledApp installedAppInfo={installedApp} />
      )}
      {installedApp.app.mode === 'workflow' && (
        <TextGenerationApp isWorkflow isInstalledApp installedAppInfo={installedApp} />
      )}
    </div>
  )
}
export default React.memo(InstalledApp)
