import React from 'react'
import DatasetUpdateForm from '@/app/components/datasets/create'

export type IProps = {
  params: { datasetId: string }
}

const Create = (props: IProps) => {
  const params = props.params

  const {
    datasetId,
  } = params

  return (
    <DatasetUpdateForm datasetId={datasetId} />
  )
}

export default Create
