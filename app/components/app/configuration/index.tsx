'use client'
import type { FC } from 'react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useContext } from 'use-context-selector'
import { usePathname, useRouter } from 'next/navigation'
import { getUserStudyBaseList, verifySceneEncoding, getTenantDetail } from "@/service/apps";
import produce from 'immer'
import { useBoolean, useGetState } from 'ahooks'
import { clone, isEqual } from 'lodash-es'
import { useShallow } from 'zustand/react/shallow'
import { Flex, Input, List, Modal, Pagination, Segmented, Select, message, Space } from 'antd'
import { RiArrowLeftSLine, RiEditBoxLine } from '@remixicon/react'
import Button from '../../base/button'
import Loading from '../../base/loading'
import useAdvancedPromptConfig from './hooks/use-advanced-prompt-config'
import EditHistoryModal from './config-prompt/conversation-histroy/edit-modal'
import { useTranslation } from 'react-i18next'
import {
  useDebugWithSingleOrMultipleModel,
  useFormattingChangedDispatcher,
} from './debug/hooks'
import type { ModelAndParameter } from './debug/types'
import type {
  AnnotationReplyConfig,
  DatasetConfigs,
  Inputs,
  ModelConfig,
  ModerationConfig,
  MoreLikeThisConfig,
  PromptConfig,
  PromptVariable,
  TextToSpeechConfig,
} from '@/models/debug'
import type { ExternalDataTool } from '@/models/common'
import type { DataSet } from '@/models/datasets'
import type { ModelConfig as BackendModelConfig, VisionSettings } from '@/types/app'
import ConfigContext from '@/context/debug-configuration'
import Config from '@/app/components/app/configuration/config'
import Debug from '@/app/components/app/configuration/debug'
import Confirm from '@/app/components/base/confirm'
import { ModelFeatureEnum } from '@/app/components/header/account-setting/model-provider-page/declarations'
import { ToastContext } from '@/app/components/base/toast'
import { fetchAppDetail, queryModelConfigDraft, updateAppModelConfig, editProjectNameGUAN, workspaceAgentList, workspaceAgentListInof, publishName } from '@/service/apps'
import { promptVariablesToUserInputsForm, userInputsFormToPromptVariables } from '@/utils/model-config'
import { fetchDatasets } from '@/service/datasets'
import { useProviderContext } from '@/context/provider-context'
import { AgentStrategy, AppType, ModelModeType, RETRIEVE_TYPE, Resolution, TransferMethod } from '@/types/app'
import { PromptMode } from '@/models/debug'
import { ANNOTATION_DEFAULT, DEFAULT_AGENT_SETTING, DEFAULT_CHAT_PROMPT_CONFIG, DEFAULT_COMPLETION_PROMPT_CONFIG } from '@/config'
import SelectDataSet from '@/app/components/app/configuration/dataset-config/select-dataset'
import { useModalContext } from '@/context/modal-context'
import useBreakpoints, { MediaType } from '@/hooks/use-breakpoints'
import ModelParameterModal from '@/app/components/header/account-setting/model-provider-page/model-parameter-modal'
import type { FormValue } from '@/app/components/header/account-setting/model-provider-page/declarations'
import { useTextGenerationCurrentProviderAndModelAndModelList } from '@/app/components/header/account-setting/model-provider-page/hooks'
import { fetchAllTools, fetchAllWorkflowTools, fetchCollectionList, get‌Assistant‌List } from '@/service/tools'
import { type Collection } from '@/app/components/tools/types'
import { useStore as useAppStore } from '@/app/components/app/store'
import type { ToolWithProvider } from '@/app/components/workflow/types'
import Switch from '@/app/components/base/switch'
import ReleaseModal from '@/app/(commonLayout)/apps/component/base/releaseModal/releaseModal'
import DataList from '@/app/(commonLayout)/apps/component/base/dataList'
import { getQueryParams } from '@/utils/getUrlParams'
import { statusShow } from '@/utils/constant'
import split from '../../workflow/nodes/_base/components/split'
import Cscader from '@/app/components/base/cscader/cascader'
import { Analysis } from './analysis/Analysis'
import DatasetConfig from './dataset-config'
import ReleaseModalMerge from '@/app/(commonLayout)/apps/component/base/releaseModalMerge'
import { ArrowNarrowLeft } from '../../base/icons/src/vender/line/arrows'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { useAppContext } from '@/context/app-context'

type PublishConfig = {
  modelConfig: ModelConfig
  completionParams: FormValue
}
// type MenuItem = Required<MenuProps>['items'][number];
const Configuration: FC = (props: any) => {
  const [release, setRelease] = useState(false)
  const { notify } = useContext(ToastContext)
  const { appDetail, setAppSiderbarExpand } = useAppStore(useShallow(state => ({
    appDetail: state.appDetail,
    setAppSiderbarExpand: state.setAppSiderbarExpand,
  })))
  const { userProfile }: any = useAppContext()
  const [enableLongTermMemory, setEnableLongTermMemory] = useState(true);
  const [formattingChanged, setFormattingChanged] = useState(false)
  const { setShowAccountSettingModal } = useModalContext()
  const [hasFetchedDetail, setHasFetchedDetail] = useState(false)
  const isLoading = !hasFetchedDetail
  const pathname = usePathname()
  const router = useRouter()
  const matched = pathname.match(/\/app\/([^/]+)/)
  const appId = (matched?.length && matched[1]) ? matched[1] : ''
  const [mode, setMode] = useState('')
  const [namespace, setNamespace] = useState('')
  const [showType, setShowType] = useState('arrange')
  const [publishedConfig, setPublishedConfig] = useState<PublishConfig | null>(null)
  const [isRole, setIsRole] = useState<any>(getQueryParams('tabClick'))
  const modalConfig = useMemo(() => appDetail?.model_config || {} as BackendModelConfig, [appDetail])
  const [conversationId, setConversationId] = useState<string | null>('')

  const media = useBreakpoints()
  const isMobile = media === MediaType.mobile
  const [isShowDebugPanel, { setTrue: showDebugPanel, setFalse: hideDebugPanel }] = useBoolean(false)

  const [introduction, setIntroduction] = useState<string>('')
  const [description, setDescription] = useState('')
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([])
  const [controlClearChatMessage, setControlClearChatMessage] = useState(0)
  const [dataList, setDataList] = useState([])
  const [info, setInfo] = useState<any>()
  const [shouldUseDraftConfig, setShouldUseDraftConfig] = useState<any>(false)
  const urlId = window.location
  const app_Id = urlId.pathname.split('/app/')[1]?.split('/configuration')[0]
  const [isHistory, setHistory] = useState(false)
  const { t } = useTranslation()
  //存放请求数据
  // 获取系统
  const [workflowOptionList, setWorkflowOptionList] = useState<any>([])
  // 获取自建插件
  const [agentOptionlist, setAgentOptionlist] = useState<any>([])
  // 工作流插件
  const [WorkflowPlugIns, setWorkflowPlugIns] = useState<any>([])
  //  存放下拉选择的值

  const [workflowValue, setWorkflowValue] = useState<any>([])
  const [agentValue, setAgentValue] = useState<any>('')
  const [listData, setListName] = useState<any>([])
  const [knowledgeValue, setKnowledgeValue] = useState<any>([])
  const [konwledgeShowTab, setKonwledgeShowTab] = useState('生产知识库')
  const [knowledgeModal, setKnowledgeModal] = useState<boolean>(false)
  const [knowledgeResult, setKnowledgeResult] = useState<any>([])
  const [limit, setLimit] = useState<number>(5)
  const [current, setCurrent] = useState<number>(1)
  const [jobTypeName, setJobTypeName] = useState<string>('')

  const changeResultRows = (code: string, is_chart: boolean) => {
    const newRows = knowledgeResult?.rows?.map(item => {
      if (item.ragName === code) {
        item.is_chart = is_chart;
      };
      return item;
    });
    // if (code === knowledgeValue?.[0]?.self_build_rag?.ragName) {
    //   setKnowledgeValue([]);
    // }
    setKnowledgeResult({ ...knowledgeResult, rows: newRows });
  }

  const onSelectKnowledge = async (values: string[], options: any) => {
    const select = [];
    select.push({
      provider_id: options.jobTypeCode,
      provider_name: options.jobTypeName,
      provider_type: "rag",
      tool_name: 'rag',
      self_build_rag: options,
      // tool_label: '',
      tool_parameters: {},
      enabled: true,
      isDeleted: false,
      notAuthor: false,
    })
    await setKnowledgeValue(select)
  }

  const getKnowledgeArray = async (current1?: any, limit1?: any, konwledgeShowTab1?: any) => {
    const currentValue = current1 || current
    const limitValue = limit1 || limit
    const konwledgeShowTabValue = konwledgeShowTab1 || konwledgeShowTab;
    current1 ? setCurrent(current1) : '';
    limit1 ? setLimit(limit1) : '';
    konwledgeShowTab1 ? setKonwledgeShowTab(konwledgeShowTab1) : '';
    const ip = konwledgeShowTabValue === '生产知识库' ? 'https://10.141.179.170:20085/' : 'https://10.141.179.170:20091/';
    const result: any = await get‌Assistant‌List(ip, { jobTypeName: jobTypeName, createBy: userProfile?.employee_number, pageNum: currentValue, pageSize: limitValue });
    if (result?.code + '' !== '200') {//|| result?.total <= 0
      return;
    }

    const newRows = result?.rows?.map(item => {
      item.is_personal = konwledgeShowTabValue === '生产知识库' ? 'false' : 'true';
      if (item.ragName === knowledgeValue?.self_build_rag?.ragName) {
        item.is_chart = knowledgeValue?.self_build_rag?.is_chart;
      };
      return item;
    });
    result.rows = newRows;
    console.log("---------------->newRows", newRows)
    setKnowledgeResult(result);
  }

  useEffect(() => {
    getKnowledgeArray()
  }, [current, limit, jobTypeName])

  let descValue = '';

  const publishOpen = async () => {
    const res: any = await publishName()
    setListName(res)
    setRelease(true)
  }
  const onSelectWWorkflow = (values: string[], options: any) => {
    const plugDataSelectList = []
    for (let k = 0; k < options.length; k++) {
      const optionItem = options[k]
      plugDataSelectList.push({
        provider_id: optionItem.id,
        provider_name: optionItem.name,
        provider_type: optionItem.type,
        tool_name: '',
        tool_label: '',
        tool_parameters: {},
        enabled: true,
        isDeleted: false,
        notAuthor: false,
      })
    }
    setWorkflowValue(plugDataSelectList)
    // autoSave()
  }

  const onSelectKnowBase = async (values: string[], options: any) => {
    const plugDataSelectList = []
    for (let k = 0; k < values.length; k++) {
      const item = values[k]
      plugDataSelectList.push({
        provider_id: item.id,
        provider_name: item.name,
        provider_type: "rag",
        tool_name: 'rag',
        // tool_label: '',
        tool_parameters: {},
        enabled: true,
        isDeleted: false,
        notAuthor: false,
      })
    }
    await setKnowBasePlugDataList(plugDataSelectList)
  }

  useEffect(() => {
    (
      async () => {
        systemPlugIns()
      }
    )()
  }, [])
  const systemPlugIns = async () => {
    // 工作流插件
    const fetchAllWorkflow: any = await fetchAllWorkflowTools(getQueryParams('tenant_id'))
    // (nameMc === '智小微' && getQueryParams('fromType') === '项目空间')
    //   ? '3864b004-b7ba-4e95-93ba-db4cb585dd52'
    //   : getQueryParams('tenant_id')



    setWorkflowPlugIns(fetchAllWorkflow)
    // 获取系统插件：
    const allToolsTem: any = await fetchAllTools(getQueryParams('tenant_id'))
    setWorkflowOptionList(allToolsTem)
    // 获取自建插件
    const collectionList: any = await fetchCollectionList(getQueryParams('tenant_id'))
    setAgentOptionlist(collectionList)
  }

  const getHistoryList = async () => {
    const result: any = await workspaceAgentList({
      appId: app_Id
    })
    const dataSource = result.map((item: any, index: number) => {
      return {
        key: index,
        time: item.history_time,
        name: item.update_man_name,
        version_name: item.version_name,
        emid: (<Button className='rounded border  mx-2' onClick={() => emit(item.model_config_id)}>编辑</Button>)
      }
    })
    setDataList(dataSource)
    setHistory(!isHistory)
  }
  const emit = async (id: any) => {
    setShouldUseDraftConfig(true)
    setInfo(id)
    const modelConfig = await workspaceAgentListInof({
      appId: app_Id,
      model_config_id: id
    })
    getNodeData(modelConfig, userAppdetails)
    setHistory(false)
  }

  const [prevPromptConfig, setPrevPromptConfig] = useState<PromptConfig>({
    prompt_template: '',
    prompt_variables: [],
  })
  const [moreLikeThisConfig, setMoreLikeThisConfig] = useState<MoreLikeThisConfig>({
    enabled: false,
  })
  const [suggestedQuestionsAfterAnswerConfig, setSuggestedQuestionsAfterAnswerConfig] = useState<MoreLikeThisConfig>({
    enabled: false,
  })
  const [speechToTextConfig, setSpeechToTextConfig] = useState<MoreLikeThisConfig>({
    enabled: false,
  })
  const [textToSpeechConfig, setTextToSpeechConfig] = useState<TextToSpeechConfig>({
    enabled: false,
    voice: '',
    language: '',
  })
  const [citationConfig, setCitationConfig] = useState<MoreLikeThisConfig>({
    enabled: false,
  })
  const [annotationConfig, doSetAnnotationConfig] = useState<AnnotationReplyConfig>({
    id: '',
    enabled: false,
    score_threshold: ANNOTATION_DEFAULT.score_threshold,
    embedding_model: {
      embedding_provider_name: '',
      embedding_model_name: '',
    },
  })
  const formattingChangedDispatcher = useFormattingChangedDispatcher()
  const setAnnotationConfig = (config: AnnotationReplyConfig, notSetFormatChanged?: boolean) => {
    doSetAnnotationConfig(config)
    if (!notSetFormatChanged)
      formattingChangedDispatcher()
  }

  const [moderationConfig, setModerationConfig] = useState<ModerationConfig>({
    enabled: false,
  })
  const [externalDataToolsConfig, setExternalDataToolsConfig] = useState<ExternalDataTool[]>([])
  const [inputs, setInputs] = useState<Inputs>({})
  const [query, setQuery] = useState('')
  const [completionParams, doSetCompletionParams] = useState<FormValue>({})
  const [_, setTempStop, getTempStop] = useGetState<string[]>([])
  const setCompletionParams = (value: FormValue) => {
    const params = { ...value }

    if ((!params.stop || params.stop.length === 0) && (modeModeTypeRef.current === ModelModeType.completion)) {
      params.stop = getTempStop()
      setTempStop([])
    }
    doSetCompletionParams(params)
    // autoSave()
  }

  const [modelConfig, doSetModelConfig] = useState<ModelConfig>({
    provider: 'openai',
    model_id: 'gpt-3.5-turbo',
    mode: ModelModeType.unset,
    configs: {
      prompt_template: '',
      prompt_variables: [] as PromptVariable[],
    },
    opening_statement: '',
    more_like_this: null,
    suggested_questions_after_answer: null,
    speech_to_text: null,
    text_to_speech: null,
    retriever_resource: null,
    sensitive_word_avoidance: null,
    dataSets: [],
    agentConfig: DEFAULT_AGENT_SETTING,
  })


  const isAgent = mode === 'agent-chat'

  const isOpenAI = modelConfig.provider === 'openai'

  const [collectionList, setCollectionList] = useState<Collection[]>([])
  useEffect(() => {

  }, [])
  const [datasetConfigs, doSetDatasetConfigs] = useState<DatasetConfigs>({
    retrieval_model: RETRIEVE_TYPE.oneWay,
    reranking_model: {
      reranking_provider_name: '',
      reranking_model_name: '',
    },
    top_k: 2,
    score_threshold_enabled: false,
    score_threshold: 0.7,
    datasets: {
      datasets: [],
    },
  })

  const datasetConfigsRef = useRef(datasetConfigs)
  const setDatasetConfigs = useCallback((newDatasetConfigs: DatasetConfigs) => {
    doSetDatasetConfigs(newDatasetConfigs)
    datasetConfigsRef.current = newDatasetConfigs
  }, [])

  const setModelConfig = (newModelConfig: ModelConfig) => {
    console.log('setModelConfig called with:', newModelConfig)
    doSetModelConfig(newModelConfig)
    // autoSave()
  }

  const modelModeType = modelConfig.mode
  const modeModeTypeRef = useRef(modelModeType)
  useEffect(() => {
    modeModeTypeRef.current = modelModeType
  }, [modelModeType])

  const [dataSets, setDataSets] = useState<DataSet[]>([])
  const contextVar = modelConfig?.configs?.prompt_variables?.find((item: any) => item.is_context_var)?.key
  const hasSetContextVar = !!contextVar
  const [isShowSelectDataSet, { setTrue: showSelectDataSet, setFalse: hideSelectDataSet }] = useBoolean(false)
  const selectedIds = dataSets.map(item => item.id)

  const [plugDataList, setPlugDataList] = useState<any>([])
  const [showDeepThink, setShowDeepThink] = useState<any>(false)
  const [knowBaseDataList, setKnowBasePlugDataList] = useState<any>([])
  const handleSelect = (data: DataSet[]) => {
    if (isEqual(data.map(item => item.id), dataSets.map(item => item.id))) {
      hideSelectDataSet()
      return
    }

    formattingChangedDispatcher()
    if (data.find(item => !item.name)) { // has not loaded selected dataset
      const newSelected = produce(data, (draft: any) => {
        data.forEach((item, index) => {
          if (!item.name) { // not fetched database
            const newItem = dataSets.find(i => i.id === item.id)
            if (newItem)
              draft[index] = newItem
          }
        })
      })
      setDataSets(newSelected)
    }
    else {
      setDataSets(data)
    }
    hideSelectDataSet()
  }

  const [isShowHistoryModal, { setTrue: showHistoryModal, setFalse: hideHistoryModal }] = useBoolean(false)

  const syncToPublishedConfig = (_publishedConfig: PublishConfig) => {
    const modelConfig = _publishedConfig.modelConfig
    setModelConfig(_publishedConfig.modelConfig)
    setCompletionParams(_publishedConfig.completionParams)
    setDataSets(modelConfig.dataSets || [])
    // feature
    setIntroduction(modelConfig.opening_statement!)
    setMoreLikeThisConfig(modelConfig.more_like_this || {
      enabled: false,
    })
    setSuggestedQuestionsAfterAnswerConfig(modelConfig.suggested_questions_after_answer || {
      enabled: false,
    })
    setSpeechToTextConfig(modelConfig.speech_to_text || {
      enabled: false,
    })
    setTextToSpeechConfig(modelConfig.text_to_speech || {
      enabled: false,
      voice: '',
      language: '',
    })
    setCitationConfig(modelConfig.retriever_resource || {
      enabled: false,
    })
  }

  const { isAPIKeySet } = useProviderContext()
  const {
    currentModel: currModel,
    textGenerationModelList,
  } = useTextGenerationCurrentProviderAndModelAndModelList(
    {
      provider: modelConfig.provider,
      model: modelConfig.model_id,
    },
  )

  const isFunctionCall = (() => {
    const features = currModel?.features
    if (!features)
      return false
    return features.includes(ModelFeatureEnum.toolCall) || features.includes(ModelFeatureEnum.multiToolCall)
  })()

  useEffect(() => {
    autoSave()
  }, [knowBaseDataList, introduction, plugDataList, agentValue, modelConfig, completionParams, workflowValue, knowledgeValue, enableLongTermMemory])

  // Fill old app data missing model mode.
  useEffect(() => {
    if (hasFetchedDetail && !modelModeType) {
      const mode = currModel?.model_properties.mode as (ModelModeType | undefined)
      if (mode) {
        const newModelConfig = produce(modelConfig, (draft: ModelConfig) => {
          draft.mode = mode
        })
        setModelConfig(newModelConfig)
      }
    }
  }, [textGenerationModelList, hasFetchedDetail, modelModeType, currModel, modelConfig])

  const [promptMode, doSetPromptMode] = useState(PromptMode.simple)
  const isAdvancedMode = promptMode === PromptMode.advanced
  const [canReturnToSimpleMode, setCanReturnToSimpleMode] = useState(true)
  const setPromptMode = async (mode: PromptMode) => {
    if (mode === PromptMode.advanced) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      await migrateToDefaultPrompt()
      setCanReturnToSimpleMode(true)
    }

    doSetPromptMode(mode)
  }
  const [visionConfig, doSetVisionConfig] = useState({
    enabled: false,
    number_limits: 2,
    detail: Resolution.low,
    transfer_methods: [TransferMethod.local_file],
  })

  const handleSetVisionConfig = (config: VisionSettings, notNoticeFormattingChanged?: boolean) => {
    doSetVisionConfig({
      enabled: config.enabled || false,
      number_limits: config.number_limits || 2,
      detail: config.detail || Resolution.low,
      transfer_methods: config.transfer_methods || [TransferMethod.local_file],
    })
    if (!notNoticeFormattingChanged)
      formattingChangedDispatcher()
  }

  const {
    chatPromptConfig,
    setChatPromptConfig,
    completionPromptConfig,
    setCompletionPromptConfig,
    currentAdvancedPrompt,
    setCurrentAdvancedPrompt,
    hasSetBlockStatus,
    setConversationHistoriesRole,
    migrateToDefaultPrompt,
  } = useAdvancedPromptConfig({
    appMode: mode,
    modelName: modelConfig.model_id,
    promptMode,
    modelModeType,
    prePrompt: modelConfig.configs.prompt_template,
    hasSetDataSet: dataSets.length > 0,
    onUserChangedPrompt: () => {
      setCanReturnToSimpleMode(false)
    },
    completionParams,
    setCompletionParams,
    setStop: setTempStop,
  })

  useEffect(() => {
    const modelId = modelConfig.model_id;
    console.log('展示深度思考 modelId为', modelId);
    console.log('支持深度思考的modelId为：DeepSeek-R1-671B、deepseek-r1-awq、QwQ-32B-AWQ');
    if (modelId === 'DeepSeek-R1-671B' || modelId === 'deepseek-r1-awq' || modelId === 'QwQ-32B-AWQ') {
      setShowDeepThink(true);
    } else {
      setShowDeepThink(false);

    }
  }, [modelConfig])

  const setModel = async ({
    modelId,
    provider,
    mode: modeMode,
    features,
  }: { modelId: string; provider: string; mode: string; features: string[] }) => {
    if (isAdvancedMode) {
      const appMode = mode

      if (modeMode === ModelModeType.completion) {
        if (appMode !== AppType.completion) {
          if (!completionPromptConfig.prompt?.text || !completionPromptConfig.conversation_histories_role.assistant_prefix || !completionPromptConfig.conversation_histories_role.user_prefix)
            await migrateToDefaultPrompt(true, ModelModeType.completion)
        }
        else {
          if (!completionPromptConfig.prompt?.text)
            await migrateToDefaultPrompt(true, ModelModeType.completion)
        }
      }
      if (modeMode === ModelModeType.chat) {
        if (chatPromptConfig.prompt.length === 0)
          await migrateToDefaultPrompt(true, ModelModeType.chat)
      }
    }
    const newModelConfig = produce(modelConfig, (draft: ModelConfig) => {
      draft.provider = provider
      draft.model_id = modelId
      draft.mode = modeMode as ModelModeType
    })

    setModelConfig(newModelConfig)
    const supportVision = features && features.includes(ModelFeatureEnum.vision)

    handleSetVisionConfig({
      ...visionConfig,
      enabled: supportVision,
    }, true)
    setCompletionParams({})

    // 只在非 gpt-3.5-turbo 模型时自动保存
    if (modelId !== 'gpt-3.5-turbo') {
      await autoSave()
    }
  }

  const isShowVisionConfig = !!currModel?.features?.includes(ModelFeatureEnum.vision)
  const [workflowTools, setWorkflowTools] = useState<ToolWithProvider[]>([])
  const [allTools, setAllTools] = useState<ToolWithProvider[]>([])
  const [selectOptionTools, setSelectOptionTools] = useState<ToolWithProvider[]>([])
  const [nameMc, setName] = useState<string>(getQueryParams('name'))
  const [imgTx, setImag] = useState('')


  const [userAppdetails, setUserAppdetails] = useState({})
  const [isEditName, setIsEditName] = useState(false)
  const getNodeData = async (modelConfig: any, res: any) => {
    const promptMode = modelConfig.prompt_type === PromptMode.advanced ? PromptMode.advanced : PromptMode.simple
    doSetPromptMode(promptMode)
    if (promptMode === PromptMode.advanced) {
      if (modelConfig.chat_prompt_config && modelConfig.chat_prompt_config.prompt.length > 0)
        setChatPromptConfig(modelConfig.chat_prompt_config)
      else
        setChatPromptConfig(clone(DEFAULT_CHAT_PROMPT_CONFIG) as any)
      setCompletionPromptConfig(modelConfig.completion_prompt_config || clone(DEFAULT_COMPLETION_PROMPT_CONFIG) as any)
      setCanReturnToSimpleMode(false)
    }

    const model = modelConfig.model

    // 插件机工作流选择，查询付初始值，单选
    const pluginsDefault = []
    const workFlowDefault = []
    const agentValueDefault = []
    const knowledgeValueDefault = []
    for (let i = 0; i < modelConfig.agent_mode?.tools.length; i++) {
      const item = modelConfig.agent_mode?.tools[i]
      // todo 装载默认插件
      if (item.provider_type == 'builtin')
        pluginsDefault.push(item)

      if (item.provider_type == 'workflow')
        workFlowDefault.push(item)
      if (item.provider_type == 'api')
        agentValueDefault.push(item)
      if (item.provider_type == 'rag')
        knowledgeValueDefault.push(item)
    }
    setPlugDataList(pluginsDefault)
    setAgentValue(agentValueDefault)
    setWorkflowValue(workFlowDefault)
    setKnowledgeValue(knowledgeValueDefault)
    let datasets: any = null
    // old dataset struct
    if (modelConfig.agent_mode?.tools?.find(({ dataset }: any) => dataset?.enabled))
      datasets = modelConfig.agent_mode?.tools.filter(({ dataset }: any) => dataset?.enabled)
    // new dataset struct
    else if (modelConfig.dataset_configs.datasets?.datasets?.length > 0)
      datasets = modelConfig.dataset_configs?.datasets?.datasets
    const fromType = getQueryParams('fromType');
    const tenant_id = getQueryParams('tenant_id');
    if (dataSets && datasets?.length && datasets?.length > 0) { //, tenant_id: fromType === '项目空间' ? tenant_id : ''
      const { data: dataSetsWithDetail } = await fetchDatasets({ url: '/datasets', params: { page: 1, ids: datasets.map(({ dataset }: any) => dataset.id), tenant_id: fromType === '项目空间' ? (tenant_id || '') : '' } })
      datasets = dataSetsWithDetail
      setDataSets(datasets)
    }

    setIntroduction(modelConfig.opening_statement)
    setSuggestedQuestions(modelConfig.suggested_questions || [])
    if (modelConfig.more_like_this)
      setMoreLikeThisConfig(modelConfig.more_like_this)

    if (modelConfig.suggested_questions_after_answer)
      setSuggestedQuestionsAfterAnswerConfig(modelConfig.suggested_questions_after_answer)

    if (modelConfig.speech_to_text)
      setSpeechToTextConfig(modelConfig.speech_to_text)

    if (modelConfig.text_to_speech)
      setTextToSpeechConfig(modelConfig.text_to_speech)

    if (modelConfig.retriever_resource)
      setCitationConfig(modelConfig.retriever_resource)

    if (modelConfig.annotation_reply)
      setAnnotationConfig(modelConfig.annotation_reply, true)

    if (modelConfig.sensitive_word_avoidance)
      setModerationConfig(modelConfig.sensitive_word_avoidance)

    if (modelConfig.external_data_tools)
      setExternalDataToolsConfig(modelConfig.external_data_tools)

    const config = {
      modelConfig: {
        provider: model.provider,
        model_id: model.name,
        mode: model.mode,
        configs: {
          prompt_template: modelConfig.pre_prompt || descValue || '',
          prompt_variables: userInputsFormToPromptVariables(
            [
              ...modelConfig.user_input_form,
              ...(modelConfig.external_data_tools?.length
                ? modelConfig.external_data_tools.map((item: any) => ({
                  external_data_tool: {
                    variable: item.variable as string,
                    label: item.label as string,
                    enabled: item.enabled,
                    type: item.type as string,
                    config: item.config,
                    required: true,
                    icon: item.icon,
                    icon_background: item.icon_background,
                  },
                }))
                : []
              ),
            ],
            modelConfig.dataset_query_variable,
          ),
        },
        opening_statement: modelConfig.opening_statement,
        more_like_this: modelConfig.more_like_this,
        suggested_questions_after_answer: modelConfig.suggested_questions_after_answer,
        speech_to_text: modelConfig.speech_to_text,
        text_to_speech: modelConfig.text_to_speech,
        retriever_resource: modelConfig.retriever_resource,
        sensitive_word_avoidance: modelConfig.sensitive_word_avoidance,
        external_data_tools: modelConfig.external_data_tools,
        dataSets: datasets || [],
        agentConfig: res.mode === 'agent-chat'
          ? {
            max_iteration: DEFAULT_AGENT_SETTING.max_iteration,
            ...modelConfig.agent_mode,
            enabled: true,
            tools: modelConfig.agent_mode?.tools
              .filter((tool: any) => !tool.dataset)
              .map((tool: any) => ({
                ...tool,
                isDeleted: res.deleted_tools?.includes(tool.tool_name),
                notAuthor: collectionList.find(c => tool.provider_id === c.id)?.is_team_authorization === false,
              })),
          }
          : DEFAULT_AGENT_SETTING,
      },
      completionParams: model.completion_params,
    }

    if (modelConfig.file_upload)
      handleSetVisionConfig(modelConfig.file_upload.image, true)

    syncToPublishedConfig(config)
    setPublishedConfig(config)
    setDatasetConfigs({
      ...datasetConfigsRef.current,
      retrieval_model: RETRIEVE_TYPE.oneWay,
      ...modelConfig.dataset_configs,
    })
    setHasFetchedDetail(true)
  }
  useEffect(() => {
    (async () => {
      const workflowToolTem = await fetchAllWorkflowTools(getQueryParams('tenant_id'))
      const allToolsTem = await fetchAllTools(getQueryParams('tenant_id'))
      setWorkflowTools(workflowToolTem)
      initSelectOptions(allToolsTem)
      setAllTools(allToolsTem)

      const collectionList = await fetchCollectionList(getQueryParams('tenant_id'))
      setCollectionList(collectionList)
      fetchAppDetail({ url: '/apps', id: appId }).then(async (res: any) => {
        setUserAppdetails(res)
        setName(res.name)
        setImag(`/agent-platform-web/image/${res.header_imag ? res.header_imag : 'header_agent1'}.png`)
        setMode(res.mode)
        setNamespace(res.tenant_name)
        const modelConfig = await queryModelConfigDraft({ id: appId })
        getNodeData(modelConfig, res)
      })
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId])

  const promptEmpty = (() => {
    if (mode !== AppType.completion)
      return false

    if (isAdvancedMode) {
      if (modelModeType === ModelModeType.chat)
        return chatPromptConfig.prompt.every(({ text }: any) => !text)

      else
        return !completionPromptConfig.prompt?.text
    }

    else { return !modelConfig.configs.prompt_template }
  })()
  const cannotPublish = (() => {
    if (mode !== AppType.completion) {
      if (!isAdvancedMode)
        return false

      if (modelModeType === ModelModeType.completion) {
        if (!hasSetBlockStatus.history || !hasSetBlockStatus.query)
          return true

        return false
      }

      return false
    }
    else { return promptEmpty }
  })()
  const contextVarEmpty = mode === AppType.completion && dataSets.length > 0 && !hasSetContextVar
  const onPublish = async (typeUrl?: string, modelAndParameter?: ModelAndParameter) => {
    const modelId = modelAndParameter?.model || modelConfig.model_id
    const promptTemplate = modelConfig.configs.prompt_template
    const promptVariables = modelConfig.configs.prompt_variables

    // todo12
    if (promptEmpty) {
      notify({ type: 'error', message: t('appDebug.otherError.promptNoBeEmpty'), duration: 3000 })
      return
    }
    if (isAdvancedMode && mode !== AppType.completion) {
      if (modelModeType === ModelModeType.completion) {
        if (!hasSetBlockStatus.history) {
          notify({ type: 'error', message: t('appDebug.otherError.historyNoBeEmpty'), duration: 3000 })
          return
        }
        if (!hasSetBlockStatus.query) {
          notify({ type: 'error', message: t('appDebug.otherError.queryNoBeEmpty'), duration: 3000 })
          return
        }
      }
    }
    if (contextVarEmpty) {
      notify({ type: 'error', message: t('appDebug.feature.dataSet.queryVariable.contextVarNotEmpty'), duration: 3000 })
      return
    }
    const postDatasets = dataSets.map(({ id }) => ({
      dataset: {
        enabled: true,
        id,
      },
    }))

    const agentConfig = modelConfig.agentConfig
    agentConfig.tools = []
    agentConfig.tools.push(...plugDataList)
    agentConfig.tools.push(...workflowValue)
    agentConfig.tools.push(...agentValue)
    agentConfig.tools.push(...knowledgeValue)
    // agentConfig.tools.push(...knowBaseDataList)

    // new model config data struct
    const data: BackendModelConfig = {
      // Simple Mode prompt
      pre_prompt: !isAdvancedMode ? promptTemplate : '',
      prompt_type: promptMode,
      chat_prompt_config: {},
      completion_prompt_config: {},
      user_input_form: promptVariablesToUserInputsForm(promptVariables),
      dataset_query_variable: contextVar || '',
      opening_statement: introduction || '',
      suggested_questions: suggestedQuestions || [],
      more_like_this: moreLikeThisConfig,
      suggested_questions_after_answer: suggestedQuestionsAfterAnswerConfig,
      speech_to_text: speechToTextConfig,
      text_to_speech: textToSpeechConfig,
      retriever_resource: citationConfig,
      sensitive_word_avoidance: moderationConfig,
      agent_mode: {
        ...agentConfig,
        'enable_long_term_memory': enableLongTermMemory,
        strategy: isFunctionCall ? AgentStrategy.functionCall : currModel?.features?.includes(ModelFeatureEnum.qimingCall) ? AgentStrategy.qimingCall : AgentStrategy.react,
      },
      model: {
        provider: modelAndParameter?.provider || modelConfig.provider,
        name: modelId,
        mode: modelConfig.mode,
        completion_params: modelAndParameter?.parameters || completionParams as any,
      },
      dataset_configs: {
        ...datasetConfigs,
        datasets: {
          datasets: [...postDatasets],
        } as any,
      },
      file_upload: {
        image: visionConfig,
      },
    }

    if (isAdvancedMode) {
      data.chat_prompt_config = chatPromptConfig
      data.completion_prompt_config = completionPromptConfig
    }

    // data.name = nameMc
    // data.header_image = nameMc

    await updateAppModelConfig({ url: `/apps/${appId}/model-config/${typeUrl}`, body: data })
    const newModelConfig = produce(modelConfig, (draft: any) => {
      draft.opening_statement = introduction
      draft.more_like_this = moreLikeThisConfig
      draft.suggested_questions_after_answer = suggestedQuestionsAfterAnswerConfig
      draft.speech_to_text = speechToTextConfig
      draft.text_to_speech = textToSpeechConfig
      draft.retriever_resource = citationConfig
      draft.dataSets = dataSets
    })
    setPublishedConfig({
      modelConfig: newModelConfig,
      completionParams,
    })
    notify({ type: 'success', message: (typeUrl === 'publish' ? '发布' : '保存') + t('common.api.success'), duration: 3000 })

    setCanReturnToSimpleMode(false)
    return true
  }

  const [restoreConfirmOpen, setRestoreConfirmOpen] = useState(false)
  const resetAppConfig = () => {
    syncToPublishedConfig(publishedConfig!)
    setRestoreConfirmOpen(false)
  }

  const [showUseGPT4Confirm, setShowUseGPT4Confirm] = useState(false)

  const {
    debugWithMultipleModel,
    multipleModelConfigs,
    handleMultipleModelConfigsChange,
  } = useDebugWithSingleOrMultipleModel(appId)

  const handleDebugWithMultipleModelChange = () => {
    handleMultipleModelConfigsChange(
      true,
      [
        { id: `${Date.now()}`, model: modelConfig.model_id, provider: modelConfig.provider, parameters: completionParams },
        { id: `${Date.now()}-no-repeat`, model: '', provider: '', parameters: {} },
      ],
    )
    setAppSiderbarExpand('collapse')
  }

  const onClearPlug = () => {
    setPlugDataList([])
  }

  const url = window.location
  const id = url.pathname.split('/app/')[1]?.split('/configuration')[0]

  const editName = async () => {

    const res: any = await editProjectNameGUAN({
      url: `/app/${id}/update/name`,
      body: {
        // app_id: getQueryParams('tenant_id'),
        name: nameMc,
      }
    })

    if (res.result === "success") {
      setName(nameMc)
      message.info('修改成功！')

    } else {
      message.info('修改失败')
    }
    // window.location.reload()
    setIsEditName(false)
  }
  const initSelectOptions = (allToolsTem: any) => {
    const selectOptions1 = []
    for (let i = 0; i < allToolsTem.length; i++) {
      const itemP = allToolsTem[i]
      if (!itemP.name)
        continue

      const option = {
        label: itemP.name,
        value: itemP.name,
        title: itemP.id,
        options: [],
      }
      for (let j = 0; j < itemP.tools.length; j++) {
        const itemC = itemP.tools[j]
        if (!itemC.name)
          continue

        const optionC = {
          label: itemC.label.zh_Hans,
          value: `${itemP.id},${itemC.name}`,
          name: itemC.name,
          id: itemP.id,
          zh_Hans: itemC.label.zh_Hans,
          parameters: itemC.parameters,
        }
        option.options.push(optionC)
      }
      selectOptions1.push(option)
    }
    setSelectOptionTools(selectOptions1)
  }
  const onSelectPlug = (values: string[], options: any) => {
    const plugDataSelectList = []
    for (let k = 0; k < options.length; k++) {
      const optionItem = options[k]
      if (!optionItem.value)
        continue
      for (let i = 0; i < allTools.length; i++) {
        const itemData = allTools[i]
        if (optionItem.id == itemData.id) {
          const plugDataSelect = {
            provider_id: itemData.id,
            provider_name: itemData.name,
            provider_type: itemData.type,
            tool_name: optionItem.name ? optionItem.name : '',
            tool_label: optionItem.zh_Hans ? optionItem.ozh_Hans : '',
            tool_parameters: {},
            enabled: true,
            isDeleted: false,
            notAuthor: false,
          }
          for (let j = 0; j < optionItem.parameters.length; j++) {
            const param = optionItem.parameters[j]
            plugDataSelect.tool_parameters[param.name] = param.name
          }
          plugDataSelectList.push(plugDataSelect)
          break
        }
      }
    }
    setPlugDataList(plugDataSelectList)
    // autoSave()
  }

  const onSelectAgentPlug = (values: string[], options: any) => {
    const plugDataSelectList = []
    for (let k = 0; k < options.length; k++) {
      const optionItem = options[k]
      plugDataSelectList.push({
        provider_id: optionItem.id,
        provider_name: optionItem.name,
        provider_type: optionItem.type,
        tool_name: optionItem?.tools[0]?.name || '',
        tool_label: optionItem.type,
        tool_parameters: {},
        enabled: true,
        isDeleted: false,
        notAuthor: false,
      })
    }
    setAgentValue(plugDataSelectList)
    // autoSave()
  }
  const onSelectWorkfolwPlug = (values: string[], options: any) => {
    setWorkflowValue(values)
  }

  const onSelectWorkflow = (values: string[], options: any) => {
    const workFlowSelectList = []
    for (let k = 0; k < options.length; k++) {
      const optionItem = options[k]
      for (let i = 0; i < workflowTools.length; i++) {
        const itemData = workflowTools[i]
        if (optionItem.name == itemData.id) {
          const workFlowSelect = {
            provider_id: itemData.id,
            provider_name: itemData.name,
            provider_type: itemData.type,
            tool_name: itemData.tools[0].name ? itemData.tools[0].name : '',
            tool_label: itemData.tools[0].label.zh_Hans ? itemData.tools[0].label.zh_Hans : '',
            tool_parameters: {},
            enabled: true,
            isDeleted: false,
            notAuthor: false,
          }
          for (let j = 0; j < itemData.tools[0].parameters.length; j++) {
            const param = itemData.tools[0].parameters[j]
            workFlowSelect.tool_parameters[param.name] = ''
          }
          workFlowSelectList.push(workFlowSelect)
          break
        }
      }
    }
    setWorkflowValue(workFlowSelectList)
  }

  // 修改 autoSave 函数
  const autoSave = async () => {
    // console.log('autoSave triggered, current modelConfig:', modelConfig)
    if (modelConfig.model_id !== 'gpt-3.5-turbo') {
      await onPublish('draft')
    }
  }

  let i: number = 0;
  useEffect(() => {
    // 添加自动保存事件监听
    if (i === 0) {
      message.info('QiMingr1_72B提供深度思考能力，QiMing25_72B_fc提供知识库、插件、工作流等工具调用能力', 10)
      i = i + 1;
    }
    const handleAutoSave = () => {
      autoSave()
    }
    window.addEventListener('auto-save', handleAutoSave)

    return () => {
      window.removeEventListener('auto-save', handleAutoSave)
    }
  }, [])


  function getChineseParamFallback(url: string, paramName: string) {
    const queryString = url.split('?')[1]; // 获取查询字符串部分
    if (!queryString) return null; // 如果没有查询字符串，返回null
    const params = queryString.split('&'); // 分割成键值对数组
    for (let param of params) {
      const [key, value] = param.split('='); // 分割键和值
      if (key === paramName) {
        return decodeURIComponent(value); // 解码并返回值
      }
    }
    return null; // 未找到参数，返回null
  }

  useEffect(() => {
    if (window.location && window.location.href) {

      const desc = decodeURIComponent(getChineseParamFallback(window.location.href.toString(), 'desc') || '');
      if (desc && desc !== 'undefined') {
        const newModelConfig = produce(modelConfig, (draft: ModelConfig) => {
          draft.configs.prompt_template = desc && desc !== 'undefined' ? desc : ''
        })
        setModelConfig(newModelConfig)
        desc && setDescription(desc);
        descValue = desc;
      }
    }
  }, []);

  useEffect(() => {
    // console.log('modelConfig updated:', modelConfig)
    getRAGTypeList()

  }, [modelConfig])

  const [RAGTypeList, setRAGTypeList] = useState([])
  const getRAGTypeList = async () => {

    // try {
    //   const response: any = await getUserStudyBaseList({
    //     url: 'kb_list',
    //     body: {
    //       tenant_id: getQueryParams('tenant_id')
    //     }
    //   })

    //   const result = await response
    //   if (result.status === "successful") {
    //     // setRAGTypeList(result.kb_list)
    //     // const timer = setTimeout(() => {
    //     setRAGTypeList((result.kb_list || []).map(record => ({ label: record.kb_name, value: record.kb_id })));
    //     // console.log("RAGTypeList:", RAGTypeList);
    //     // }, 100)
    //   } else {
    //     message.error('查询失败')
    //     localStorage.setItem('console_token', '')
    //   }
    // } catch (error) {
    //   message.error('请求失败，请检查网络或稍后重试')
    //   console.error('请求错误:', error)

    // }
  }

  if (isLoading) {
    return <div className='flex items-center justify-center h-full'>
      <Loading type='area' />
    </div>
  }

  const columns = [
    {
      title: '修改时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '修改人',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '版本名称',
      dataIndex: 'version_name',
      key: 'version_name',
    },
    {
      title: '操作',
      dataIndex: 'emid',
      key: 'emid',
    },
  ];

  const goTo = async () => {
    const consoleTokenFromLocalStorage = localStorage?.getItem('windowsToken')
    const category = getQueryParams('category');
    const tenantId = getQueryParams('tenant_id')
    const res: any = category !== 'area' && await getTenantDetail({ appId: tenantId })

    const param = {
      Authorization: consoleTokenFromLocalStorage,
      isRep: '0', //字典值：1代表查重，0代表不查重
      isPer: category === 'area' ? '1' : '0', //字典值：1代表个人空间，0代表项目空间
      createBy: category === 'area' ? '' : (res?.accounts?.map((record: any) => record.employee_number).join(';') || ''), //个人空间不需要这个字段
    }
    let url = `https://10.141.179.170:20082/knowledgebase?menu=ragClean&Authorization=${param.Authorization}&isPer=${param.isPer}&isRep=${param.isRep}`
    if (category !== 'area') {
      url = url + '&createBy=' + param.createBy
    }
    //history.pushState(null, '', url)
    window.location.href = url
  }

  return (
    <ConfigContext.Provider
      value={{
        appId,
        isAPIKeySet,
        isTrailFinished: false,
        mode,
        modelModeType,
        promptMode,
        isAdvancedMode,
        isAgent,
        isOpenAI,
        isFunctionCall,
        collectionList,
        setPromptMode,
        canReturnToSimpleMode,
        setCanReturnToSimpleMode,
        chatPromptConfig,
        completionPromptConfig,
        currentAdvancedPrompt,
        setCurrentAdvancedPrompt,
        conversationHistoriesRole: completionPromptConfig.conversation_histories_role,
        showHistoryModal,
        setConversationHistoriesRole,
        hasSetBlockStatus,
        conversationId,
        introduction,
        setIntroduction,
        suggestedQuestions,
        setSuggestedQuestions,
        setConversationId,
        controlClearChatMessage,
        setControlClearChatMessage,
        prevPromptConfig,
        setPrevPromptConfig,
        moreLikeThisConfig,
        setMoreLikeThisConfig,
        suggestedQuestionsAfterAnswerConfig,
        setSuggestedQuestionsAfterAnswerConfig,
        speechToTextConfig,
        setSpeechToTextConfig,
        textToSpeechConfig,
        setTextToSpeechConfig,
        citationConfig,
        setCitationConfig,
        annotationConfig,
        setAnnotationConfig,
        moderationConfig,
        setModerationConfig,
        externalDataToolsConfig,
        setExternalDataToolsConfig,
        formattingChanged,
        setFormattingChanged,
        inputs,
        setInputs,
        query,
        setQuery,
        completionParams,
        setCompletionParams,
        modelConfig,
        setModelConfig,
        showSelectDataSet,
        dataSets,
        setDataSets,
        datasetConfigs,
        datasetConfigsRef,
        setDatasetConfigs,
        hasSetContextVar,
        isShowVisionConfig,
        visionConfig,
        setVisionConfig: handleSetVisionConfig,
      }}
    >
      <div style={{ width: '100%', height: '100%' }} className="flex flex-col h-full">
        <div className="flex flex-col h-full">
          <div className='relative flex grow h-[100%] bg-slate-100' style={{ paddingTop: 108 }}>
            {/* Header */}

            <div className='absolute top-0 left-0 w-full h-108'>
              <div className='flex items-center justify-between px-3 h-108' style={{ margin: '24px 0' }}>
                <div className='flex items-center'>
                  <div className='flex'>
                    <div className='flex items-center h-[20px] space-x-1 text-xs' style={{ fontSize: '14px', color: 'gray', margin: '6px 14px 0 0', cursor: 'pointer' }} onClick={() => {
                      router.back()
                    }}>
                      <RiArrowLeftSLine />返回</div>
                    <div className='flex items-center text-base font-semibold leading-6 text-gray-900  '>
                      <div className='h-[60px] w-[60px] mr-[18px] border-radius: 8px;'>
                        <img src={imgTx} alt='加载失败' className='h-[60px] w-[60px] border-radius: 8px;' />
                      </div>
                      <div className=''>
                        <p className='flex items-center h-[28px] mb-[8px] text-ellipsis overflow-hidden whitespace-nowrap' style={{ color: '#1C2748', fontSize: 20 }}>
                          {
                            !isEditName
                              ? <span className='mr-2' >{nameMc}</span>
                              : <Input type='text' value={nameMc} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} onBlur={(e) => {
                                e.preventDefault();
                                editName()
                              }} />
                          }

                          <RiEditBoxLine className='w-[20px] h-[20px] cursor-pointer' onClick={() => setIsEditName(true)} />
                        </p>
                        <p>
                          <span
                            className='cursor-pointer mr-[10px]'
                            style={{ padding: '2px 8px', background: 'rgba(27, 102, 255, 0.1)', borderRadius: '4px', color: '#1B66FF' }}
                          >
                            {statusShow(getQueryParams('status'))?.statusName}
                          </span>
                          <span
                            className='cursor-pointer'
                            style={{ padding: '2px 8px', background: 'rgba(27, 102, 255, 0.1)', borderRadius: '4px', color: '#1B66FF', marginRight: '10px' }}
                          >
                            {/* {namespace} */}
                            {isRole === '1' ? 'agent' : isRole === '2' ? '插件' : isRole === '3' ? '工作流' : '智能体'}

                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center h-[14px] space-x-1 text-xs'>
                    {isAdvancedMode && (
                      <div className='ml-1 flex items-center h-5 px-1.5 border border-gray-100 rounded-md text-[11px] font-medium text-gray-500 uppercase'>{t('appDebug.promptMode.advanced')}</div>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <Segmented
                    size={'middle'}
                    shape="round"
                    value={showType}
                    onChange={(value) => setShowType(value)}
                    options={[
                      { value: 'arrange', label: '编排' },
                      { value: 'analysis', label: '分析' },
                    ]}
                  />
                </div>


                <div className='flex items-center'>
                  {/* Agent Setting */}
                  {/* {isAgent && (
                    <AgentSettingButton
                      isChatModel={modelConfig.mode === ModelModeType.chat}
                      agentConfig={modelConfig.agentConfig}

                      isFunctionCall={isFunctionCall}
                      onAgentSettingChange={(config) => {
                        const nextConfig = produce(modelConfig, (draft: ModelConfig) => {
                          draft.agentConfig = config
                        })
                        setModelConfig(nextConfig)
                      }}
                    />
                  )} */}
                  <div style={{ visibility: showType === 'arrange' ? 'visible' : 'hidden' }}>
                    <Button className='rounded border border-blue-400 text-blue-600 mx-2' onClick={() => getHistoryList()}>历史记录</Button>
                    <Button variant='primary' className='rounded' onClick={() => publishOpen()}>发布</Button>
                  </div>

                  {/* Model and Parameters */}

                  {/* {isMobile && (
                    <Button className='!h-8 !text-[13px] font-medium' onClick={showDebugPanel}>
                      <span className='mr-1'>{t('appDebug.operation.debugConfig')}</span>
                      <CodeBracketIcon className="w-4 h-4 text-gray-500" />
                    </Button>
                  )} */}
                  {/* <AppPublisher {...{
                    publishDisabled: cannotPublish,
                    publishedAt: (modalConfig.created_at || 0) * 1000,
                    debugWithMultipleModel,
                    multipleModelConfigs,
                    onPublish,
                    onRestore: () => setRestoreConfirmOpen(true),
                  }} /> */}
                </div>
              </div>
            </div>

            {/* 主题 */}


            {
              showType === 'analysis' &&
              <div style={{ width: '100%', height: 'calc(100% - 25px)', display: 'flex' }} >
                <Analysis appId={appId} />
              </div>
            }

            {
              showType === 'arrange' &&
              <div style={{ width: '100%', height: 'calc(100% - 25px)', display: 'flex' }} >
                <div className={'bg-white rounded ml-3.5 mr-3.5 w-1/3 shrink-0 flex flex-col h-full '}>
                  <Config />
                </div>

                <div className='bg-white rounded mr-3.5 w-1/3 p-6 overflow-y-auto'>
                  {!debugWithMultipleModel && (
                    <>
                      <ModelParameterModal
                        isAdvancedMode={isAdvancedMode}
                        mode={mode}
                        provider={modelConfig.provider}
                        completionParams={completionParams}
                        modelId={modelConfig.model_id}
                        setModel={async (params: any) => {
                          console.log(params, 123)
                          await setModel(params)
                          // 模型变更后触发自动保存
                          // autoSave()
                        }}
                        onCompletionParamsChange={(newParams: FormValue) => {
                          setCompletionParams(newParams)
                          // 参数变更后触发自动保存 
                          // autoSave()
                        }}
                        debugWithMultipleModel={debugWithMultipleModel}
                        onDebugWithMultipleModelChange={handleDebugWithMultipleModelChange}
                      />
                      <div className='mx-1'></div>
                    </>
                  )}

                  <div className='space-y-6'>
                    <div>
                      <div className='mb-2 text-sm font-medium text-gray-900'>技能</div>

                      <div className='space-y-4'>
                        <div>
                          <div className='mb-2 text-sm text-gray-700'>自建插件</div>
                          <Select
                            mode="multiple"
                            allowClear
                            className='w-full'
                            options={agentOptionlist}
                            value={(agentValue || []).map((itemData: any) => itemData.provider_id)}
                            onChange={onSelectAgentPlug}
                            onClear={() => setAgentValue([])}
                            placeholder="请选择插件"
                            fieldNames={{
                              label: 'name',
                              value: 'id'
                            }}
                          />
                        </div>

                        <div>
                          <div className='mb-2 text-sm text-gray-700'>系统插件</div>
                          <Select
                            mode="multiple"
                            allowClear
                            className='w-full'
                            options={selectOptionTools}
                            value={plugDataList.map((itemData: any) => `${itemData.provider_id},${itemData.tool_name}`)}
                            onChange={onSelectPlug}
                            onClear={onClearPlug}
                            placeholder="请选择插件"
                          />
                        </div>

                        <div>
                          <div className='mb-2 text-sm text-gray-700'>工作流</div>
                          <Select
                            mode="multiple"
                            allowClear
                            className='w-full'
                            options={WorkflowPlugIns}
                            value={(workflowValue || []).map((itemData: any) => itemData.provider_id)}
                            onChange={onSelectWWorkflow}
                            onClear={() => setWorkflowValue([])}
                            placeholder="请选择工作流"
                            optionRender={(option) => {
                              console.log(option)
                              // return <span>{`${option.data.name}`}</span>
                              return <span>{`${option.data.name}`}</span>

                              // return <span>{`${option.data.name} ${option.data.created_time ? option.data.created_time : ''}`}</span>
                            }}
                            fieldNames={{
                              label: 'name',
                              value: 'id'
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className='mb-2 text-sm font-medium text-gray-900'>知识</div>


                      <div className='space-y-4'>
                        {/* <div>
                          <div className='mb-2 text-sm text-gray-700'>知识库</div>
                          <Select
                            // mode="multiple"
                            onChange={onSelectKnowBase}
                            allowClear
                            // disabled
                            value={(knowBaseDataList || []).map((itemData: any) => itemData.provider_id)}
                            onClear={() => setKnowBasePlugDataList([])}
                            className='w-full'
                            options={RAGTypeList}
                            placeholder="请选择知识库"
                          />
                        </div> */}

                        {/* Dataset */}
                        {
                          localStorage.getItem("platform") === 'shufa'
                            ? <DatasetConfig onChange={onSelectKnowBase} />
                            : <div className='mt-4 text-sm font-semibold text-gray-800'>
                              <div>知识库选择
                                <a onClick={goTo} style={{ float: 'right', fontSize: '12px', fontWeight: '500', color: 'rgb(27, 102, 255)', cursor: 'pointer' }}>
                                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>去创建知识库<ArrowNarrowLeft className='w-3 h-3 rotate-180' /></div>
                                </a>
                              </div>
                              <Input placeholder='未配置知识库,请选择' allowClear onClear={() => setKnowledgeValue([])} prefix={<Space>
                                <SearchOutlined onClick={() => setKnowledgeModal(true)} />
                              </Space>
                              } value={knowledgeValue?.[0]?.provider_name || ''} />
                            </div>
                        }
                        <div style={{ width: '100 %', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>长期记忆</span>
                          <Switch onChange={(e) => setEnableLongTermMemory(e)} defaultValue={enableLongTermMemory} />
                        </div>
                        <div>
                          {/* <div className='mb-2 text-sm text-gray-700'>数据库</div>
                          <Select
                            mode="multiple"
                            allowClear
                            disabled
                            className='w-full'
                            options={[]}
                            placeholder="请选择数据库"
                          /> */}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className='flex items-center justify-between'>
                        {/* <span className='text-sm font-medium text-gray-900'>记忆</span>
                        <Switch
                          disabled
                          defaultValue={false}
                          onChange={(value: boolean) => { }}
                          size='md'
                        /> */}
                      </div>
                    </div>
                  </div>
                </div>

                {!isMobile && <div className="relative flex flex-col h-full overflow-y-auto grow w-2/3 mr-3.5" style={{ borderColor: 'rgba(0, 0, 0, 0.02)' }}>
                  <div className='flex flex-col h-0 grow rounded bg-white '>
                    <Debug
                      isAPIKeySet={isAPIKeySet}
                      onSetting={() => setShowAccountSettingModal({ payload: 'provider' })}
                      inputs={inputs}
                      showDeepThink={showDeepThink}
                      modelParameterParams={{
                        setModel: setModel as any,
                        onCompletionParamsChange: setCompletionParams,
                      }}
                      debugWithMultipleModel={debugWithMultipleModel}
                      multipleModelConfigs={multipleModelConfigs}
                      onMultipleModelConfigsChange={handleMultipleModelConfigsChange}
                    />
                  </div>
                </div>}
              </div>
            }



          </div>
          {
            showType === 'arrange' &&
            <>
              {restoreConfirmOpen && (
                <Confirm
                  title={t('appDebug.resetConfig.title')}
                  content={t('appDebug.resetConfig.message')}
                  isShow={restoreConfirmOpen}
                  onClose={() => setRestoreConfirmOpen(false)}
                  onConfirm={resetAppConfig}
                  onCancel={() => setRestoreConfirmOpen(false)}
                />
              )}
              {showUseGPT4Confirm && (
                <Confirm
                  title={t('appDebug.trailUseGPT4Info.title')}
                  content={t('appDebug.trailUseGPT4Info.description')}
                  isShow={showUseGPT4Confirm}
                  onClose={() => setShowUseGPT4Confirm(false)}
                  onConfirm={() => {
                    setShowAccountSettingModal({ payload: 'provider' })
                    setShowUseGPT4Confirm(false)
                  }}
                  onCancel={() => setShowUseGPT4Confirm(false)}
                />
              )}

              {isShowSelectDataSet && (
                <SelectDataSet
                  isShow={isShowSelectDataSet}
                  onClose={hideSelectDataSet}
                  selectedIds={selectedIds}
                  onSelect={handleSelect}
                />
              )}

              {isShowHistoryModal && (
                <EditHistoryModal
                  isShow={isShowHistoryModal}
                  saveLoading={false}
                  onClose={hideHistoryModal}
                  data={completionPromptConfig.conversation_histories_role}
                  onSave={(data) => {
                    setConversationHistoriesRole(data)
                    hideHistoryModal()
                  }}
                />
              )}
            </>
          }

          {/* {isMobile && (
        <Drawer showClose isOpen={isShowDebugPanel} onClose={hideDebugPanel} mask footer={null} panelClassname='!bg-gray-50'>
          <Debug
            isAPIKeySet={isAPIKeySet}
            onSetting={() => setShowAccountSettingModal({ payload: 'provider' })}
            inputs={inputs}
            modelParameterParams={{
              setModel: setModel as any,
              onCompletionParamsChange: setCompletionParams,
            }}
            debugWithMultipleModel={debugWithMultipleModel}
            multipleModelConfigs={multipleModelConfigs}
            onMultipleModelConfigsChange={handleMultipleModelConfigsChange}
          />
        </Drawer>
      )} */}
        </div>
        {
          showType === 'arrange' && isHistory ? <DataList
            dataList='个人空间'
            columns={columns}
            dataSource={dataList}
            onClose={() => setHistory(!isHistory)}
          /> : null
        }
        {
          showType === 'arrange' && release ?
            <ReleaseModalMerge
              listData={listData}
              release={release}
              onClose={() => setRelease(false)}
              appId={appId}

              tabClick={getQueryParams('tabClick')} />
            : null
        }
      </div>
      <Modal
        title={'选择知识库'}
        open={knowledgeModal}
        onOk={() => setKnowledgeModal(false)}
        width={'720px'}
        onCancel={() => setKnowledgeModal(false)}
        footer={null}
      >
        <div>
          <Flex justify='center' >
            <Segmented
              onChange={(e) => getKnowledgeArray(0, 5, e)}
              options={[
                {
                  label: '生产知识库',
                  value: '生产知识库'
                }, {
                  label: '个人知识库',
                  value: '个人知识库'
                }
              ]}
            />
          </Flex>
          <Input onPressEnter={(e) => setJobTypeName(e?.target?.value)} style={{ maxWidth: '360px', margin: '16px 4px 0 4px' }} size='small' placeholder='请输入知识库名称查找' />
          <List
            dataSource={knowledgeResult.rows}
            header={
              <table>
                <thead className="">
                  <tr>
                    <td width={360}>任务类型</td>
                    <td width={80}>省份</td>
                    <td width={360}>是否开启知识图谱检索</td>
                    <td width={80}>操作</td>
                  </tr>
                </thead>
              </table>
            }
            renderItem={(item) => (
              <List.Item>
                <table className={` min-w-[440px] w-full max-w-full border-collapse border-1 rounded-lg text-sm`}>
                  <thead className="border-b  border-gray-200 text-gray-500 text-xs font-medium"></thead>
                  <tbody className="text-gray-700 border-gray-200 mineTbody">
                    <tr>
                      <td width={360}>{item?.jobTypeName}</td>
                      <td width={80}>{item?.regionName}</td>
                      <td width={360}>
                        <Switch defaultValue={(item.ragName === (knowledgeValue?.[0]?.self_build_rag?.ragName) ? knowledgeValue?.[0]?.self_build_rag?.is_chart : false)} onChange={e => {
                          changeResultRows(item?.ragName, e);
                          if (item.ragName === (knowledgeValue?.[0]?.self_build_rag?.ragName)) {
                            onSelectKnowledge([''], { ...item, is_chart: e });
                          }
                        }} size={'md'}
                        />
                      </td>
                      <td width={80}>
                        {/* 调试用：显示当前对比的两个值 */}
                        {/* <div style={{ fontSize: 12, color: '#999' }}>
                          item.ragName: {item.ragName || '未定义'} <br />
                          已选 ragName: {knowledgeValue?.[0]?.self_build_rag?.ragName || '未定义'} <br />
                          条件结果：{String(item.ragName === (knowledgeValue?.[0]?.self_build_rag?.ragName))}
                        </div> */}
                        {

                          item.ragName === (knowledgeValue?.[0]?.self_build_rag?.ragName) ?
                            <a style={{ color: 'green' }} onClick={(e) => { setKnowledgeValue([]); setKnowledgeModal(false); }}><PlusOutlined />已添加</a>
                            :
                            <a onClick={(e) => { onSelectKnowledge([''], item); setKnowledgeModal(false); }}><PlusOutlined />添加</a>
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>
              </List.Item>
            )}
            footer={<Space>
              <Pagination hideOnSinglePage showQuickJumper showTotal={() => `共有${knowledgeResult.total}条`} pageSize={limit} current={current} total={knowledgeResult?.total} onChange={(page, pageSize) => { setLimit(pageSize); setCurrent(page); }} />
            </Space>
            }
          />
        </div>
      </Modal>
    </ConfigContext.Provider >
  )
}
export default React.memo(Configuration)