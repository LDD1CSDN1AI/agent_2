'use client'

// Libraries
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useBoolean, useDebounceFn } from 'ahooks'
import { useQuery } from '@tanstack/react-query'
import { Modal } from 'antd'

// Components
import ExternalAPIPanel from '../../components/datasets/external-api/external-api-panel'
import Datasets from './Datasets'
import DatasetFooter from './DatasetFooter'
import ApiServer from '../../components/develop/ApiServer'
import Doc from './Doc'
import TabSliderNew from '@/app/components/base/tab-slider-new'
import TagManagementModal from '@/app/components/base/tag-management'
import TagFilter from '@/app/components/base/tag-management/filter'
import Button from '@/app/components/base/button'
import Input from '@/app/components/base/input'
import { ApiConnectionMod } from '@/app/components/base/icons/src/vender/solid/development'
import CheckboxWithLabel from '@/app/components/datasets/create/website/base/checkbox-with-label'

// Services
import { fetchDatasetApiBaseUrl } from '@/service/datasets'

// Hooks
import { useTabSearchParams } from '@/hooks/use-tab-searchparams'
import { useStore as useTagStore } from '@/app/components/base/tag-management/store'
import { useAppContext } from '@/context/app-context'
import { useExternalApiPanel } from '@/context/external-api-panel-context'
import { useGlobalPublicStore } from '@/context/global-public-context'
import useDocumentTitle from '@/hooks/use-document-title'
import { getQueryParams } from '@/utils/getUrlParams'

const Container = () => {
  const { t } = useTranslation()
  const { systemFeatures } = useGlobalPublicStore()
  const router = useRouter()
  const { currentWorkspace, isCurrentWorkspaceOwner } = useAppContext()
  const showTagManagementModal = useTagStore(s => s.showTagManagementModal)
  // const { showExternalApiPanel, setShowExternalApiPanel } = useExternalApiPanel()
  const [includeAll, { toggle: toggleIncludeAll }] = useBoolean(false)
  useDocumentTitle(t('dataset.knowledge'))

  const options = useMemo(() => {
    return [
      { value: 'dataset', text: t('dataset.datasets') },
      // ...(currentWorkspace.role === 'dataset_operator' ? [] : [{ value: 'api', text: t('dataset.datasetsApi') }]),
    ]
  }, [currentWorkspace.role, t])

  const [activeTab, setActiveTab] = useTabSearchParams({
    defaultTab: 'dataset',
  })
  const containerRef = useRef<HTMLDivElement>(null)
  const { data } = useQuery(
    {
      queryKey: ['datasetApiBaseInfo'],
      queryFn: () => fetchDatasetApiBaseUrl('/datasets/api-base-info'),
      enabled: activeTab !== 'dataset',
    },
  )

  const [keywords, setKeywords] = useState('')
  const [searchKeywords, setSearchKeywords] = useState('')
  const { run: handleSearch } = useDebounceFn(() => {
    setSearchKeywords(keywords)
  }, { wait: 500 })
  const handleKeywordsChange = (value: string) => {
    setKeywords(value)
    handleSearch()
  }
  const [tagFilterValue, setTagFilterValue] = useState<string[]>([])
  const [tagIDs, setTagIDs] = useState<string[]>([])
  const { run: handleTagsUpdate } = useDebounceFn(() => {
    setTagIDs(tagFilterValue)
  }, { wait: 500 })
  const handleTagsChange = (value: string[]) => {
    setTagFilterValue(value)
    handleTagsUpdate()
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [headerText, setHeaderText] = useState('个人空间知识库')
  const [headerText1, setHeaderText1] = useState('确认新增个人空间知识库？')
  useEffect(() => {
    if (currentWorkspace.role === 'normal')
      return router.replace('/apps')
    const tenantId = getQueryParams('tenant_id')
    if (tenantId) {
      setHeaderText('项目空间知识库')
      setHeaderText1('确认新增项目空间知识库？')
    }

  }, [currentWorkspace, router])

  const postMessage = (dataType: string) => {
    window.parent.postMessage({ type: 'newDataSet', value: dataType }, '*');
  }

  return (
    <div ref={containerRef} style={{ height: '100%' }} className='scroll-container relative flex grow flex-col overflow-hidden bg-background-body'>
      <div className='sticky top-0 z-10 flex flex-wrap items-center justify-between gap-y-2 bg-background-body px-12 pb-2 pt-4 leading-[56px]'>
        {/* <TabSliderNew
          value={activeTab}
          onChange={newActiveTab => setActiveTab(newActiveTab)}
          options={options}
        /> */}
        <span>{headerText}</span>
        {(
          <div className='flex items-center justify-center gap-2'>
            {/* {isCurrentWorkspaceOwner && <CheckboxWithLabel
              isChecked={includeAll}
              onChange={toggleIncludeAll}
              label={t('dataset.allKnowledge')}
              labelClassName='system-md-regular text-text-secondary'
              className='mr-2'
              tooltip={t('dataset.allKnowledgeDescription') as string}
            />}
            <TagFilter type='knowledge' value={tagFilterValue} onChange={handleTagsChange} /> */}
            {/* <Input
              showLeftIcon
              showClearIcon
              wrapperClassName='w-[200px]'
              value={keywords}
              onChange={e => handleKeywordsChange(e.target.value)}
              onClear={() => handleKeywordsChange('')}
            /> */}
            {/* <div className="h-4 w-[1px] bg-divider-regular" /> */}
            <Button onClick={() => setIsModalOpen(true)} className='shadows-shadow-xs gap-0.5'>
              新增知识库
            </Button>
            {/* <Button
              className='shadows-shadow-xs gap-0.5'
              onClick={() => setShowExternalApiPanel(true)}
            >
              <ApiConnectionMod className='h-4 w-4 text-components-button-secondary-text' />
              <div className='system-sm-medium flex items-center justify-center gap-1 px-0.5 text-components-button-secondary-text'>{t('dataset.externalAPIPanelTitle')}</div>
            </Button> */}
          </div>
        )}
        {activeTab === 'api' && data && <ApiServer apiBaseUrl={data.api_base_url || ''} />}
      </div>
      {(
        <>
          <Datasets containerRef={containerRef} tags={tagIDs} keywords={searchKeywords} includeAll={includeAll} />
          {/* {!systemFeatures?.branding?.enabled && <DatasetFooter />} */}
          {showTagManagementModal && (
            <TagManagementModal type='knowledge' show={showTagManagementModal} />
          )}
        </>
      )}
      {activeTab === 'api' && data && <Doc apiBaseUrl={data.api_base_url || ''} />}

      {/* {showExternalApiPanel && <ExternalAPIPanel onClose={() => setShowExternalApiPanel(false)} />} */}

      <Modal
        closable={{ 'aria-label': 'Custom Close Button' }}
        okText="确认"
        cancelText="取消"
        open={isModalOpen}
        onOk={() => postMessage('add')}
        onCancel={() => setIsModalOpen(false)}
      >
        <p>{headerText1}</p>
      </Modal>
    </div>
  )
}

export default Container
