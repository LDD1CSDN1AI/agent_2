import React from 'react'
import ChartView from './chartView'
import CardView from './cardView'
import TracingPanel from './tracing/panel'
import ApikeyInfoPanel from '@/app/components/app/overview/apikey-info-panel'

// export type IDevelopProps = {
//   params: Promise<{ appId: string }>
// }

const Overview = (props: any) => {
  const params = props

  const {
    appId,
  } = params

  return (
    <div className="h-full bg-chatbot-bg px-4 py-6 sm:px-12">
      {/* <ApikeyInfoPanel />
      <TracingPanel /> */}
      {/* <CardView appId={appId} /> */}
      <ChartView appId={appId} />
    </div>
  )
}

export default Overview
