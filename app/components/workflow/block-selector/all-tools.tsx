import {
  useMemo,
  useState,
  useEffect
} from 'react'
import cn from 'classnames'
import type {
  OnSelectBlock,
  ToolWithProvider,
} from '../types'
import { useStore } from '../store'
import { ToolTypeEnum } from './types'
import Tools from './tools'
import { useToolTabs } from './hooks'
import { useGetLanguage } from '@/context/i18n'
import { fetchAllTools, fetchCollectionList, fetchAllWorkflowTools } from '@/service/tools'
import { getQueryParams } from '@/utils/getUrlParams'

type AllToolsProps = {
  searchText: string
  onSelect: OnSelectBlock
}
const AllTools = ({
  searchText,
  onSelect,
}: AllToolsProps) => {
  const language = useGetLanguage()
  const tabs = useToolTabs()
  const [activeTab, setActiveTab] = useState(ToolTypeEnum.All)
  const [newBuildInTools, setActiveBuildInTools] = useState<any>([])
  const [newApiTools, setNewActiveApiTools] = useState<any[]>([])
  const [newWorkflowTools, setNewActiveWorkflowTools] = useState<any[]>([])
  const buildInTools = useStore(s => s.buildInTools)
  const customTools = useStore(s => s.customTools)
  const workflowTools = useStore(s => s.workflowTools)

  const getBuildInTools = async () => {
    const data = await fetchAllTools(getQueryParams('tenant_id'))
    setActiveBuildInTools(data)
  }

  const getApiTools = async () => {
    const data = await fetchCollectionList(getQueryParams('tenant_id'))
    setNewActiveApiTools(data)
  }

  const getWorkflowTools = async () => {
    const data = await fetchAllWorkflowTools(getQueryParams('tenant_id'))
    setNewActiveWorkflowTools(data)
  }

  const tools = useMemo(() => {
    let mergedTools: ToolWithProvider[] = []
    if (activeTab === ToolTypeEnum.All)
      mergedTools = [...(buildInTools.length > 0 ? buildInTools : newBuildInTools), ...(customTools.length > 0 ? customTools : newApiTools), ...(workflowTools.length > 0 ? workflowTools : newWorkflowTools)]
    if (activeTab === ToolTypeEnum.BuiltIn)
      mergedTools = buildInTools.length > 0 ? buildInTools : newBuildInTools
    if (activeTab === ToolTypeEnum.Custom)
      mergedTools = customTools.length > 0 ? customTools : newApiTools
    if (activeTab === ToolTypeEnum.Workflow)
      mergedTools = workflowTools.length > 0 ? workflowTools : newWorkflowTools

    return mergedTools.filter((toolWithProvider) => {
      return toolWithProvider.tools.some((tool) => {
        return tool.label[language].toLowerCase().includes(searchText.toLowerCase())
      })
    })
  }, [activeTab, buildInTools, customTools, workflowTools, searchText, language, newBuildInTools])

  useEffect(() => {
    getBuildInTools()
    getApiTools()
    getWorkflowTools()
  }, [])

  return (
    <div>
      <div className='flex items-center px-3 h-8 space-x-1 bg-gray-25 border-b-[0.5px] border-black/[0.08] shadow-xs'>
        {
          tabs.map(tab => (
            <div
              className={cn(
                'flex items-center px-2 h-6 rounded-md hover:bg-gray-100 cursor-pointer',
                'text-xs font-medium text-gray-700',
                activeTab === tab.key && 'bg-gray-200',
              )}
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.name}
            </div>
          ))
        }
      </div>
      <Tools
        showWorkflowEmpty={activeTab === ToolTypeEnum.Workflow}
        tools={tools}
        onSelect={onSelect}
      />
    </div>
  )
}

export default AllTools
