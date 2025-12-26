import React from 'react'
import Main from '@/app/components/datasets/hit-testing'

type Props = {
  datasetId: string
}

const HitTesting = ({ datasetId }: Props) => {

  return (
    <Main datasetId={datasetId} />
  )
}

export default HitTesting
