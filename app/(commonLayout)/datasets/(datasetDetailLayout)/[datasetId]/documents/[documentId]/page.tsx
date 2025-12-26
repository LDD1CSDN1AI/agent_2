import React from 'react'
import MainDetail from '@/app/components/datasets/documents/detail'

export type IDocumentDetailProps = {
  params: { datasetId: string; documentId: string }
}

const DocumentDetail = (props: IDocumentDetailProps) => {
  const params = props.params

  const {
    datasetId,
    documentId,
  } = params

  return (
    <MainDetail datasetId={datasetId} documentId={documentId} />
  )
}

export default DocumentDetail
