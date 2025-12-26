import React from 'react'
import Main from '@/app/components/datasets/documents'

export type IProps = {
  params: { datasetId: string }
}

const Documents = (props: IProps) => {
  const params = props.params

  const {
    datasetId,
  } = params

  return (
    <Main datasetId={datasetId} />
  )
}

export default Documents
