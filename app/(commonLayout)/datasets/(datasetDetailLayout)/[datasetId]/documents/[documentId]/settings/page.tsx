import React from 'react'
import Settings from '@/app/components/datasets/documents/detail/settings'

export type IProps = {
  params: { datasetId: string; documentId: string }
}

const DocumentSettings = (props: IProps) => {
  const params = props.params

  const {
    datasetId,
    documentId,
  } = params

  return (
    <Settings datasetId={datasetId} documentId={documentId} />
  )
}

export default DocumentSettings
