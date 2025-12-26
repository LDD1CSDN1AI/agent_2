import type { Viewport } from 'next'
import I18nServer from './components/i18n-server'
import BrowerInitor from './components/browser-initor'
import { TanstackQueryIniter } from '@/context/query-client'
import SentryInitor from './components/sentry-initor'
import Topbar from './components/base/topbar'
import { getLocaleOnServer } from '@/i18n/server'
import './styles/globals.css'
import './styles/markdown.scss'
import GlobalUrl from '@/GlobalUrl'

export const metadata = {
  title: '启明网络大模型工具链',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  userScalable: false,
}

const LocaleLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = getLocaleOnServer()

  return (
    <html lang={locale ?? 'en'} className="h-full">
      <head>
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className="h-full select-auto"
        data-api-prefix={process.env.NEXT_PUBLIC_API_PREFIX || GlobalUrl['data-api-prefix']}
        data-pubic-api-prefix={process.env.NEXT_PUBLIC_PUBLIC_API_PREFIX}
        data-public-edition={process.env.NEXT_PUBLIC_EDITION}
        data-public-support-mail-login={process.env.NEXT_PUBLIC_SUPPORT_MAIL_LOGIN}
        data-public-sentry-dsn={process.env.NEXT_PUBLIC_SENTRY_DSN}
        data-public-maintenance-notice={process.env.NEXT_PUBLIC_MAINTENANCE_NOTICE}
        data-public-site-about={process.env.NEXT_PUBLIC_SITE_ABOUT}
      >
        <Topbar />
        <BrowerInitor>
          <SentryInitor>
            <TanstackQueryIniter>
              <I18nServer>{children}</I18nServer>
            </TanstackQueryIniter>
          </SentryInitor>
        </BrowerInitor>
      </body>
    </html>
  )
}

export default LocaleLayout
