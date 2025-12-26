import Main from './layout-main'

const DatasetDetailLayout = (
  props: {
    children: React.ReactNode
    params: Promise<{ datasetId: string }>
  },
) => {
  const params = props.params

  const {
    children,
  } = props

  return <Main params={params}>{children}</Main>
}
export default DatasetDetailLayout
