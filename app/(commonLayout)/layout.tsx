"use client";  // 标记为客户端组件

import React from 'react';
import type { ReactNode } from 'react';
import SwrInitor from '@/app/components/swr-initor';
import { AppContextProvider } from '@/context/app-context';
import GA, { GaType } from '@/app/components/base/ga';
import { EventEmitterContextProvider } from '@/context/event-emitter';
import { ProviderContextProvider } from '@/context/provider-context';
import { ModalContextProvider } from '@/context/modal-context';
import { usePathname } from 'next/navigation';  // 导入 usePathname

const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();  // 使用 usePathname 获取当前路径

  // 判断路径是否是 `/login`
  if (pathname === '/login') {
    return <>{children}</>; // 如果是登录页面，直接返回子组件
  }

  // 判断路径是否是 `/login`
  if (pathname === '/register') {
    return <>{children}</>; // 如果是登录页面，直接返回子组件
  }

  // 判断路径是否是 `/login`
  if (pathname === '/home') {
    return <>{children}</>; // 如果是登录页面，直接返回子组件
  }
  // 判断路径是否是 `/login`
  if (pathname === '/test') {
    return <>{children}</>; // 如果是登录页面，直接返回子组件
  }
  // 判断路径是否是 `/login`
  if (pathname === '/table_search') {
    return <>{children}</>; // 如果是登录页面，直接返回子组件
  }
  // 判断路径是否是 `/login`
  if (pathname === '/mcp') {
    return <>{children}</>; // 如果是登录页面，直接返回子组件
  }

  // 判断路径是否是 `/login`
  if (pathname === '/redirect') {
    return <>{children}</>; // 如果是登录页面，直接返回子组件
  }
  // 判断路径是否是 `/login`
  if (pathname === '/redirectTest') {
    return <>{children}</>; // 如果是登录页面，直接返回子组件
  }
  return (
    <>
      <GA gaType={GaType.admin} />
      <SwrInitor>
        <AppContextProvider>
          <EventEmitterContextProvider>
            <ProviderContextProvider>
              <ModalContextProvider>
                {/* <HeaderWrapper>
                  <Header />
                </HeaderWrapper> */}
                {children}
              </ModalContextProvider>
            </ProviderContextProvider>
          </EventEmitterContextProvider>
        </AppContextProvider>
      </SwrInitor>
    </>
  );
};

// export const metadata = {
//   title: '智能体',
// };

export default Layout;