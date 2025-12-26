'use client'

import { useSelectedLayoutSegment } from 'next/navigation'
import classNames from 'classnames'
import Link from 'next/link'

export type NavIcon = React.ComponentType<
  React.PropsWithoutRef<React.ComponentProps<'svg'>> & {
    title?: string | undefined
    titleId?: string | undefined
  }
>

export type NavLinkProps = {
  name: string
  href: string
  iconMap: {
    selected: NavIcon
    normal: NavIcon
  }
  mode?: string,
  isActive: boolean
}

export default function NavLink({
  name,
  href,
  iconMap,
  mode = 'expand',
  isActive
}: NavLinkProps) {
  const segment = useSelectedLayoutSegment()
  const formattedSegment = (() => {
    let res = segment?.toLowerCase()
    // logs and annotations use the same nav
    if (res === 'annotations')
      res = 'logs'

    return res
  })()
  // const isActive = href.toLowerCase().split('/')?.pop() === formattedSegment
  const NavIcon = isActive ? iconMap.selected : iconMap.normal


  const useClickArray = ['文档', '召回测试', '设置', '返回'];

  const getRouter = (name: string) => {
    switch (name) {
      case '文档':
        return { name: '文档', type: 'documents' };
      case '召回测试':
        return { name: '召回测试', type: 'hitTesting' };
      case '设置':
        return { name: '设置', type: 'settings' };
      case '返回':
        return { name: '返回', type: 'lastPage' };
      default:
        return { name: '文档', type: 'documents' };
    }
  }

  const postMessage = (dataType: string, param?: object) => {
    !isActive && window.parent.postMessage({ type: 'newDataSet', value: dataType, ...param }, '*');
  }

  return (
    <Link
      key={name}
      href={useClickArray?.includes(name) ? '' : href}
      onClick={() => useClickArray?.includes(name) ? postMessage(getRouter(name)?.type) : ''}
      className={classNames(
        isActive ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-700',
        'group flex items-center h-9 rounded-md py-2 text-sm font-normal',
        mode === 'expand' ? 'px-3' : 'px-2.5',
      )}
      title={mode === 'collapse' ? name : ''}
    >
      <NavIcon
        className={classNames(
          'h-4 w-4 flex-shrink-0',
          isActive ? 'text-primary-600' : 'text-gray-700',
          mode === 'expand' ? 'mr-2' : 'mr-0',
        )}
        aria-hidden="true"
      />
      {mode === 'expand' && name}
    </Link>
  )
}
