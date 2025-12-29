'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import useSWRInfinite from 'swr/infinite'
import zhCN from 'antd/es/locale/zh_CN'
import useSWR from 'swr'
import { useTranslation } from 'react-i18next'
import { useDebounceFn } from 'ahooks'
import Image from 'next/image'
import back from './assets/back.png'
import logout from './assets/logout.png'
import BackBtn from '@/app/components/base/back-btn'
import user from './assets/user.png'
import {
  RiHome3Line,
  RiMessage3Line,
  RiRobot2Line,
  RiRobot3Line,
  RiToolsLine,
} from '@remixicon/react'
import { Button as AntButton, Layout, Menu, ConfigProvider, Popover, message } from 'antd'
import {
  AreaChartOutlined,
  FileSearchOutlined,
  ApartmentOutlined,
  PlusOutlined,
  TeamOutlined,
  UserOutlined,
  ShareAltOutlined,
  UsbOutlined,
} from '@ant-design/icons'
import useAppsQueryState from './hooks/useAppsQueryState'
import AllPage from './component/allPage'
import AreaPage from './component/areaPage'
import AreaEdit from './component/areaPage/areaEdit'
import WorkflowPage from './component/workflowPage'
import MetabolicPage from './component/metabolicPage'
import DcoosPage from './component/dcoosPage'
import ReleaseManager from './component/releaseManagement'
import WorkSpaceSecondPage from './component/workSpaceSecondPage'
import ChatPage from './component/chatPage'
import AgentChatPage from './component/agentChatPage'
import ApplicationAuthority from './component/applicationAuthority'
import EditAuthority from './component/editAuthority'
import ManagerPage from './component/managerPage'
import ApplicationExamine from './component/applicationExamine'
import InformationManagement from './component/informationManagement/informationManagement'
import type { OpenTypes } from './component/base/createModal'
import CreateModal from './component/base/createModal'
import DcoosSignPage from './component/dcoosSignPage'
import styles from './Apps.module.scss'
import type { AppListResponse } from '@/models/app'
import { fetchAppList } from '@/service/apps'
import { fetchDcoosList, fetchInstallPlugin, fetchPluginProviders, meunClickLog } from '@/service/common'
import { NEED_REFRESH_APP_LIST_KEY } from '@/config'
import { useTabSearchParams } from '@/hooks/use-tab-searchparams'
import Button from '@/app/components/base/button'
import TopHeader from '@/layout/Header'
import { useAppContext } from '@/context/app-context'
import ProjectSpace from '@/app/(commonLayout)/apps/component/ProjectSpace'
import ProjectMember from '@/app/(commonLayout)/apps/component/ProjectSpace/member'
import { getQueryParams } from '@/utils/getUrlParams'
import StudyBase from './component/studyBase'
import OperationManagement from './component/OperationManagement'
import GlobalUrl, { setDefaultUrlIp, setPlatformType } from '@/GlobalUrl'
import Staffmanagement from './component/staffmanagement'
import StaffmanagementUodata from "./component/staffmanagementuodata"
import ShareAgentChatPage from './component/shareAgentChatPage'
import MpcManage from './component/mpcManage'
import { getChineseParamFallback } from '@/utils/var'
import DataReflux from './component/dataReflux'
import DataIP from './component/dataIP'
import NewDataset from './component/newDataset'
import NewChatPage from './component/newChatPage'
import ApplyStatistics from './component/ApplyStatistics'
import NewAgentPage from './component/newAgentPage'
import Datasets from './component/datasets'
import CallStatistics from './component/callStatistics'
import DcoosPageCloud from './component/dcoosPage/DcoosPageCloud'
import NewChatPageCloud from './component/newChatPageCloud'
import NewAgentPageCloud from './component/newAgentPageCloud'
import CallStatisticsCloud from './component/callStatistics/indexCloud'
import NewCallStatistics from './component/newCallStatistics'
import { getTenantsParam } from '@/app/components/GlobalParams'

const { Content, Sider } = Layout
const Apps = () => {
  const { userProfile }: any = useAppContext()
  const { t } = useTranslation()
  const category = getQueryParams('category')
  const tenantId = getQueryParams('tenant_id')
  const [activeTab, setActiveTab] = useTabSearchParams({
    defaultTab: 'all',
  })

  useEffect(() => {
    getTenantsParam();
  }, []);

  const [isUrlReady, setIsUrlReady] = useState(false); // 用于判断URL和参数是否准备好
  const [activeId, setActiveId] = useState('')
  const [activeArea, setActiveArea] = useState<string>('')
  const [tabClick, setTabClick] = useState('agent-chat');
  const [options, optionsdata] = useState<any['options']>([]);
  const [showSider, setShowSider] = useState(true)
  const [usersuper, eatusersuper] = useState(false)
  const getKey = (
    pageIndex: number,
    previousPageData: AppListResponse,
    activeTab: string,
    tags: string[],
    activeId: any
  ) => {
      // 从 LocalStorage 读取 tabClick
    const currentTabClick = typeof window !== 'undefined' 
    ? localStorage.getItem('areaTabType') || '1' 
    : '1';
    if (!pageIndex || previousPageData.has_more) {
      const params: any = {
        url: '/apps',
        params: {
          page: pageIndex + 1,
          limit: activeTab === 'area' || activeTab === 'workSpaceSecondPage' ? 100 : 9,
        },
      };





      if (category === 'workSpaceSecondPage') {
        params.params.tenant_id = activeId.id || tenantId;
      }

      if (activeTab !== 'area' && activeTab !== 'chat') {
        params.params.mode = activeTab === 'share-chat' ? tabClick : activeTab;
        if (activeTab === 'agent-chat' || activeTab === 'metabolic' || activeTab === 'workflow' || activeTab === 'share-chat') {
          params.params.tenant_id = '9a0ead78-3689-4bf0-8000-9ab72250cfb2';

          if (activeTab === 'share-chat') {
            if (tabClick === 'chat') {
              params.url = '/workspaces/current/tools/api/share_flat';
            } else {
              params.url = '/global-share-apps';
            }
          } else {
            params.url = '/global-apps';
          }
        }
      } else {
        delete params.params.mode;
        if (activeArea) params.params.tenant_id = activeArea;
      }

      if (tags.length) params.params.tag_ids = tags;

      if (activeTab === 'share-chat' && tabClick === 'chat') {
        delete params.params;
      }



      console.log("activeTab------------------------>",activeTab)
    
      console.log("activeArea------------------------>",activeArea)
      // params.params.mode = 'agent-chat';
      // 个人空间场景下，根据选中的应用类型筛选
      if (activeTab === 'area') {
        delete params.params.mode;
        params.params.tenant_id = activeArea; // 筛选当前空间下的应用
        console.log("tabClick------------------------>",tabClick)
        // if(tabClick==='agent-chat'){
        //   params.params.mode = 'agent-chat';
        // }
        // 根据标签页类型添加 mode 筛选
        switch (currentTabClick) {
          case '1': // Agent 标签页
            params.params.mode = 'agent-chat';
            break;
          case '3': // 工作流标签页
            params.params.mode = 'workflow';
            break;
          case '5': // 对话流标签页
            params.params.mode = 'advanced-chat';
            break;
          default:
            break;
        }
      }
      return params;
    }
    return null;
  };

  const { query: { tagIDs = [], keywords = '' }, setQuery } = useAppsQueryState()
  const [isAddOpen, setIsAddOpen] = useState<OpenTypes>({
    isOpen: false,
    title: '',
  })
  const [tagFilterValue, setTagFilterValue] = useState<string[]>(tagIDs)
  const [searchKeywords, setSearchKeywords] = useState(keywords)
  const setKeywords = useCallback((keywords: string) => {
    setQuery(prev => ({ ...prev, keywords }))
  }, [setQuery])
  const setTagIDs = useCallback((tagIDs: string[]) => {
    setQuery(prev => ({ ...prev, tagIDs }))
  }, [setQuery])

  const { data: dcoosList, mutate: dcoosListMutate } = useSWR((GlobalUrl.platform_type === 'shufa' ? GlobalUrl.defaultUrlIp : GlobalUrl.wangyun_defaultUrlIp_agent_platform) + `/interface/api/api-info?page_index=1&page_size=999&create_by=${userProfile?.employee_number}`, fetchDcoosList)
  const { data: plugins, mutate: pluginsMutate } = useSWR(
    activeArea ? `/workspaces/current/tool-providers?tenant_id=${activeArea}` : null,
    fetchPluginProviders
  );
  const { data: customPlugins, mutate: customPluginsMutate } = useSWR('/workspaces/current/tools/api/flat', fetchInstallPlugin)
  const { data: builtinPlugins, mutate: builtinPluginsMutate } = useSWR('/workspaces/current/tools/builtin/flat', fetchInstallPlugin)
  const { data, isLoading, size, setSize, mutate } = useSWRInfinite(
    (pageIndex: number, previousPageData: AppListResponse) => {
      if (!isUrlReady) return null; // 当 isUrlReady 为 false 时，返回 null
      return getKey(pageIndex, previousPageData, activeTab, tagIDs, activeId);
    },
    fetchAppList,
    { revalidateFirstPage: true }
  );

  // 其他代码保持不变

  const anchorRef = useRef<HTMLDivElement>(null)
  // const options: any = [
  //   { value: 'all', key: 'all', label: '主页', text: t('app.types.area'), icon: <RiHome3Line className='w-[14px] h-[14px] mr-1' /> },
  //   { value: 'area', key: 'area', label: '个人空间', text: t('app.types.area'), icon: <UserOutlined className='w-[14px] h-[14px] mr-1' /> },
  //   { value: 'projectSpace', key: 'projectSpace', label: '项目空间', text: t('app.types.projectSpace'), icon: <TeamOutlined className='w-[14px] h-[14px] mr-1' /> },
  //   { value: 'tansou', key: 'tansou', type: 'group', label: (<div className={styles.tansuo}> 探索</div >) },
  //   { value: 'studyBase', key: 'studyBase', label: '知识库', text: t('app.types.workflow'), icon: <FileSearchOutlined className='w-[14px] h-[14px] mr-1' /> },
  //   // { value: 'mcpManage', key: 'mcpManage', label: 'mcp管理', text: t('app.types.workflow'), icon: <UsbOutlined className='w-[14px] h-[14px] mr-1' /> },
  //   { value: 'agent-chat', key: 'agent-chat', label: '智能体广场', text: t('app.types.agent'), icon: <RiRobot3Line className='w-[14px] h-[14px] mr-1' /> },
  //   { value: 'chat', key: 'chat', label: '插件广场', text: t('app.types.chatbot'), icon: <RiMessage3Line className='w-[14px] h-[14px] mr-1' /> },
  //   { value: 'workflow', key: 'workflow', label: '工作流广场', text: t('app.types.workflow'), icon: <ApartmentOutlined className='w-[14px] h-[14px] mr-1' /> },
  //   // { value: 'share-chat', key: 'share-chat', label: '共享广场', text: t('app.types.agent'), icon: <ShareAltOutlined className='w-[14px] h-[14px] mr-1' /> },
  //   { value: 'mcpManage', key: 'mcpManage', label: 'mcp管理', text: t('app.types.workflow'), icon: <UsbOutlined className='w-[14px] h-[14px] mr-1' /> },
  //   { value: 'operationManagement', key: 'operationManagement', label: '运营管理', text: t('app.types.workflow'), icon: <AreaChartOutlined className='w-[14px] h-[14px] mr-1' /> },
  //   { value: 'staffmanagement', key: 'staffmanagement', label: 'Admin', text: t('app.types.workflow'), icon: <UserOutlined className='w-[14px] h-[14px] mr-1' /> },
  //   // { value: 'metabolic', key: 'metabolic', label: '智能体', text: t('app.types.workflow'), icon: <RiRobot2Line className='w-[14px] h-[14px] mr-1' /> },
  //   // { value: 'informationManagement', key: 'informationManagement', label: 'API信息管理', text: t('app.types.informationManagement'), icon: <RiRobot2Line className='w-[14px] h-[14px] mr-1' /> },
  //   { value: 'dcoos', key: 'dcoos', label: '能力发布', text: '能力发布', icon: <RiToolsLine className='w-[14px] h-[14px] mr-1' /> },

  // ]
  const options1: any = [
    { value: 'superManager', key: 'superManager', type: 'group', label: (<div className={styles.tansuo}> 超级管理</div >) },
    { value: 'super-manager', key: 'super-manager', label: '应用审核', text: '应用审核', icon: <RiToolsLine className='w-[14px] h-[14px] mr-1' /> },
    // { value: 'callStatistics', key: 'callStatistics', label: '调用量统计', text: '调用量统计', icon: <RiToolsLine className='w-[14px] h-[14px] mr-1' /> }
    { value: 'newCallStatistics', key: 'newCallStatistics', label: '调用量统计', text: '调用量统计', icon: <RiToolsLine className='w-[14px] h-[14px] mr-1' /> },
  ]
  // Project Space
  useEffect(() => {

    // console.log("window.location.href:", window.location.href);
    if (typeof window !== 'undefined') {
      // Your code that uses window
      const url = window.location.href;

      const urlObj = new URL(url);

      // 提取主机名（IP 或域名）
      const hostname = urlObj.hostname;
      // if(hostname==="")
      // 提取端口
      const port = urlObj.port;
      // const searchParams = new URLSearchParams(urlObj.search);
      // const platform = searchParams.get("platform");
      // const platform = localStorage.getItem("platform");
      // setPlatformType(platform)

      if (port === '20080') {
        setPlatformType("wangyun")
      } else if (port === "9100" || port === "9520") {
        setPlatformType("shufa")
      } else {
        // setPlatformType("shufa")
        setPlatformType("wangyun")
      }
      // alert(GlobalUrl.platform_type)
      // const shufa_url = "http://" + hostname + ":" + port;
      // const apiPrefix = shufa_url + '/console/api'
      // const publicApiPrefix = shufa_url + '/api'
      // console.log("apiPrefix:", apiPrefix)
      // console.log("publicApiPrefix:", publicApiPrefix)

      if (hostname !== "localhost") {
        setDefaultUrlIp("http://" + hostname + ":" + port)
      }
      console.log("GlobalUrl.defaultUrlIp:", GlobalUrl.defaultUrlIp)
    }




    document.title = `${t('common.menus.apps')}`
    if (localStorage.getItem(NEED_REFRESH_APP_LIST_KEY) === '1') {
      localStorage.removeItem(NEED_REFRESH_APP_LIST_KEY)
      mutate()
    }
    const redirectApplication = decodeURIComponent(getChineseParamFallback(window.location.href.toString(), 'redirectApplication') || '');
    if (redirectApplication === 'agent_square' || redirectApplication === 'new_agent_square' || redirectApplication === 'new_plugin_square') {
      setShowSider(false);
      const showType = () => {
        switch (redirectApplication) {
          case 'agent_square':
            return 'agent-chat';
          case 'new_agent_square':
            return 'new-agent-chat';
          case 'new_plugin_square':
            return 'newChat';
        }
      }
      setActiveTab(showType());
    }
    //当为Adminn
    if (userProfile?.employee_number === "00000000") {
      optionsdata([
        { value: 'all', key: 'all', label: '主页', text: t('app.types.area'), icon: <RiHome3Line className='w-[14px] h-[14px] mr-1' /> },
        { value: 'area', key: 'area', label: '个人空间', text: t('app.types.area'), icon: <UserOutlined className='w-[14px] h-[14px] mr-1' /> },
        { value: 'projectSpace', key: 'projectSpace', label: '项目空间', text: t('app.types.projectSpace'), icon: <TeamOutlined className='w-[14px] h-[14px] mr-1' /> },
        { value: 'tansou', key: 'tansou', type: 'group', label: (<div className={styles.tansuo}> 探索</div >) },
        { value: 'newDataset', key: 'newDataset', label: '知识库', text: t('app.types.workflow'), icon: <FileSearchOutlined className='w-[14px] h-[14px] mr-1' /> },

        // { value: 'mcpManage', key: 'mcpManage', label: 'mcp管理', text: t('app.types.workflow'), icon: <UsbOutlined className='w-[14px] h-[14px] mr-1' /> },
        // { value: 'agent-chat', key: 'agent-chat', label: '智能体广场', text: t('app.types.agent'), icon: <RiRobot3Line className='w-[14px] h-[14px] mr-1' /> },
        // { value: 'chat', key: 'chat', label: '插件广场', text: t('app.types.chatbot'), icon: <RiMessage3Line className='w-[14px] h-[14px] mr-1' /> },
        // { value: 'workflow', key: 'workflow', label: '工作流广场', text: t('app.types.workflow'), icon: <ApartmentOutlined className='w-[14px] h-[14px] mr-1' /> },
        // { value: 'share-chat', key: 'share-chat', label: '共享广场', text: t('app.types.agent'), icon: <ShareAltOutlined className='w-[14px] h-[14px] mr-1' /> },
        // { value: 'mcpManage', key: 'mcpManage', label: 'MCP管理', text: t('app.types.workflow'), icon: <UsbOutlined className='w-[14px] h-[14px] mr-1' /> },
        // { value: 'operationManagement', key: 'operationManagement', label: '运营管理', text: t('app.types.workflow'), icon: <AreaChartOutlined className='w-[14px] h-[14px] mr-1' /> },
        { value: 'staffmanagement', key: 'staffmanagement', label: 'Admin', text: t('app.types.workflow'), icon: <UserOutlined className='w-[14px] h-[14px] mr-1' /> },
        // { value: 'metabolic', key: 'metabolic', label: '智能体', text: t('app.types.workflow'), icon: <RiRobot2Line className='w-[14px] h-[14px] mr-1' /> },
        // { value: 'informationManagement', key: 'informationManagement', label: 'API信息管理', text: t('app.types.informationManagement'), icon: <RiRobot2Line className='w-[14px] h-[14px] mr-1' /> },
        { value: 'dcoos', key: 'dcoos', label: '能力发布', text: '能力发布', icon: <RiToolsLine className='w-[14px] h-[14px] mr-1' /> },
        { value: 'dataReflux', key: 'dataReflux', label: '数据回流', text: '数据回流', icon: <RiToolsLine className='w-[14px] h-[14px] mr-1' /> },
        { value: 'dataIP', key: 'dataIP', label: 'IP数据', text: 'IP数据', icon: <RiToolsLine className='w-[14px] h-[14px] mr-1' /> },
        // { value: 'ApplyStatistics', key: 'ApplyStatistics', label: '应用统计', text: '应用统计', icon: <RiToolsLine className='w-[14px] h-[14px] mr-1' /> },
        { value: 'newChat', key: 'newChat', label: '插件广场', text: t('app.types.chatbot'), icon: <RiMessage3Line className='w-[14px] h-[14px] mr-1' /> },
        { value: 'ApplyStatistics', key: 'ApplyStatistics', label: '应用统计', text: '应用统计', icon: <RiToolsLine className='w-[14px] h-[14px] mr-1' /> },
        // { value: 'newDataset', key: 'newDataset', label: '新知识库', text: t('app.types.workflow'), icon: <FileSearchOutlined className='w-[14px] h-[14px] mr-1' /> },
        { value: 'new-agent-chat', key: 'new-agent-chat', label: '智能体广场', text: t('app.types.agent'), icon: <RiRobot3Line className='w-[14px] h-[14px] mr-1' /> },
        // { value: 'studyBase', key: 'studyBase', label: '旧版知识库', text: t('app.types.workflow'), icon: <FileSearchOutlined className='w-[14px] h-[14px] mr-1' /> },
        { value: 'callStatistics', key: 'callStatistics', label: '调用量统计', text: '调用量统计', icon: <RiToolsLine className='w-[14px] h-[14px] mr-1' /> },
      ])
      eatusersuper(true)
    } else {
      optionsdata([
        { value: 'all', key: 'all', label: '主页', text: t('app.types.area'), icon: <RiHome3Line className='w-[14px] h-[14px] mr-1' /> },
        { value: 'area', key: 'area', label: '个人空间', text: t('app.types.area'), icon: <UserOutlined className='w-[14px] h-[14px] mr-1' /> },
        { value: 'projectSpace', key: 'projectSpace', label: '项目空间', text: t('app.types.projectSpace'), icon: <TeamOutlined className='w-[14px] h-[14px] mr-1' /> },
        { value: 'tansou', key: 'tansou', type: 'group', label: (<div className={styles.tansuo}> 探索</div >) },
        { value: 'newDataset', key: 'newDataset', label: '知识库', text: t('app.types.workflow'), icon: <FileSearchOutlined className='w-[14px] h-[14px] mr-1' /> },

        // { value: 'mcpManage', key: 'mcpManage', label: 'mcp管理', text: t('app.types.workflow'), icon: <UsbOutlined className='w-[14px] h-[14px] mr-1' /> },
        // { value: 'agent-chat', key: 'agent-chat', label: '智能体广场', text: t('app.types.agent'), icon: <RiRobot3Line className='w-[14px] h-[14px] mr-1' /> },
        // { value: 'chat', key: 'chat', label: '插件广场', text: t('app.types.chatbot'), icon: <RiMessage3Line className='w-[14px] h-[14px] mr-1' /> },
        // { value: 'workflow', key: 'workflow', label: '工作流广场', text: t('app.types.workflow'), icon: <ApartmentOutlined className='w-[14px] h-[14px] mr-1' /> },
        // { value: 'share-chat', key: 'share-chat', label: '共享广场', text: t('app.types.agent'), icon: <ShareAltOutlined className='w-[14px] h-[14px] mr-1' /> },
        // { value: 'mcpManage', key: 'mcpManage', label: 'MCP管理', text: t('app.types.workflow'), icon: <UsbOutlined className='w-[14px] h-[14px] mr-1' /> },
        // { value: 'operationManagement', key: 'operationManagement', label: '运营管理', text: t('app.types.workflow'), icon: <AreaChartOutlined className='w-[14px] h-[14px] mr-1' /> },
        // { value: 'metabolic', key: 'metabolic', label: '智能体', text: t('app.types.workflow'), icon: <RiRobot2Line className='w-[14px] h-[14px] mr-1' /> },
        { value: 'new-agent-chat', key: 'new-agent-chat', label: '智能体广场', text: t('app.types.agent'), icon: <RiRobot3Line className='w-[14px] h-[14px] mr-1' /> },
        { value: 'newChat', key: 'newChat', label: '插件广场', text: t('app.types.chatbot'), icon: <RiMessage3Line className='w-[14px] h-[14px] mr-1' /> },

        { value: 'informationManagement', key: 'informationManagement', label: 'API信息管理', text: t('app.types.informationManagement'), icon: <RiRobot2Line className='w-[14px] h-[14px] mr-1' /> },
        { value: 'dcoos', key: 'dcoos', label: '能力发布', text: '能力发布', icon: <RiToolsLine className='w-[14px] h-[14px] mr-1' /> },
        // { value: 'dataReflux', key: 'dataReflux', label: '数据回流', text: '数据回流', icon: <RiToolsLine className='w-[14px] h-[14px] mr-1' /> },
        // { value: 'dataIP', key: 'dataIP', label: 'IP数据', text: 'IP数据', icon: <RiToolsLine className='w-[14px] h-[14px] mr-1' /> },
        // { value: 'ApplyStatistics', key: 'ApplyStatistics', label: '应用统计', text: '应用统计', icon: <RiToolsLine className='w-[14px] h-[14px] mr-1' /> },
        // { value: 'newDataset', key: 'newDataset', label: '新知识库', text: t('app.types.workflow'), icon: <FileSearchOutlined className='w-[14px] h-[14px] mr-1' /> },
        // { value: 'studyBase', key: 'studyBase', label: '旧版知识库', text: t('app.types.workflow'), icon: <FileSearchOutlined className='w-[14px] h-[14px] mr-1' /> },
        // { value: 'data-squre', key: 'data-squre', label: '数据广场', text: t('app.types.agent'), icon: <RiRobot3Line className='w-[14px] h-[14px] mr-1' /> },
        { value: 'operationsPlatform', key: 'operationsPlatform', label: '运维平台', text: '运维平台', icon: <RiToolsLine className='w-[14px] h-[14px] mr-1' /> },
      ])
      eatusersuper(false)
    }
  }, [])

  const hasMore = data?.at(-1)?.has_more ?? true
  useEffect(() => {
    let observer: IntersectionObserver | undefined
    if (anchorRef.current) {
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isLoading && hasMore)
          setSize((size: number) => size + 1)
      }, { rootMargin: '100px' })
      observer.observe(anchorRef.current)
    }
    return () => observer?.disconnect()
  }, [isLoading, setSize, anchorRef, mutate, hasMore])

  useEffect(() => {
    // 检查URL及参数是否准备好
    if (category) {
      setIsUrlReady(true); // 设置为true，表示可以开始请求
    }
  }, [category]); // 依赖这些参数，当它们改变时检查是否准备好

  const { run: handleSearch } = useDebounceFn(() => {
    setSearchKeywords(keywords)
  }, { wait: 500 })
  const handleKeywordsChange = (value: string) => {
    setKeywords(value)
    handleSearch()
  }

  const { run: handleTagsUpdate } = useDebounceFn(() => {
    setTagIDs(tagFilterValue)
  }, { wait: 500 })
  const handleTagsChange = (value: string[]) => {
    setTagFilterValue(value)
    handleTagsUpdate()
  }

  // content展示
  const showComponents = (tab: string) => {
    switch (tab) {
      case 'all':
        return <AllPage data={data} />
      case 'area':
        return <AreaPage data={data?.[0]} plugins={plugins ?? []} mutate={mutate} pluginsMutate={pluginsMutate} setActiveTab={setActiveTab} setCallback={setActiveArea} />
      case 'workflow':
        return <WorkflowPage size={size} setSize={setSize} data={data?.[size - 1]} mutate={mutate} setCallback={setActiveArea} />
      case 'agent-chat':
        return <AgentChatPage size={size} setSize={setSize} data={data?.[size - 1]} mutate={mutate} setCallback={setActiveArea} />
      case 'share-chat':
        return <ShareAgentChatPage tabClick={tabClick} setTabClick={setTabClick} type={'share-chat'} size={size} setSize={setSize} data={data?.[size - 1]} mutate={mutate} setCallback={setActiveArea} />
      case 'projectSpace':
        return <ProjectSpace data={data?.[0]} mutate={mutate} setCallback={setActiveArea} setActiveTab={setActiveTab} setActiveId={setActiveId} />
      case 'studyBase':
        return <StudyBase />;
      case 'mcpManage':
        return <MpcManage />
      case 'chat':
        return <ChatPage data={[...(builtinPlugins || []), ...(customPlugins || [])]} mutate={customPluginsMutate} setCallback={setActiveArea} />
      case 'detail':
        return <AreaEdit setActiveTab={setActiveTab} setCallback={setActiveArea} />
      case 'metabolic':
        return <MetabolicPage data={data?.[0]} mutate={mutate} setCallback={setActiveArea} />
      case 'dcoos':
        return GlobalUrl.platform_type === 'shufa' ? <DcoosPage data={dcoosList} mutate={dcoosListMutate} setActiveTab={setActiveTab} /> : <DcoosPageCloud data={dcoosList} mutate={dcoosListMutate} setActiveTab={setActiveTab} />
      case 'dcoos-sign':
        return <DcoosSignPage data={dcoosList?.[0]} mutate={dcoosListMutate} setActiveTab={setActiveTab} />
      case 'release':
        return <ReleaseManager data={data?.[0]} mutate={mutate} setActiveTab={setActiveTab} />
      case 'workSpaceSecondPage':
        return <WorkSpaceSecondPage data={data?.[0]} plugins={plugins ?? []} setActiveTab={setActiveTab} mutate={mutate} setCallback={setActiveArea} pluginsMutate={pluginsMutate} />
      case 'super-manager':
        return <ManagerPage />
      case 'project-member':
        return <ProjectMember setActiveTab={setActiveTab} setCallback={setActiveArea} />
      case 'applicationAuthority': // 应用权限
        return <ApplicationAuthority setActiveTab={setActiveTab} />
      case 'editAuthority': // 编辑权限
        return <EditAuthority setActiveTab={setActiveTab} />
      case 'appExamine': // 应用审批
        return <ApplicationExamine setActiveTab={setActiveTab} />
      case 'informationManagement': //API信息管理
        return <InformationManagement data={data?.[0]} mutate={mutate} setCallback={setActiveArea} />
      case 'staffmanagement':
        if (userProfile?.employee_number === "00000000") {
          return <Staffmanagement setActiveTab={setActiveTab} setCallback={setActiveArea} />
        } else {
          return <AllPage data={data} />
        }
      case 'newDataset':
        return <Datasets />
      // return <NewDataset />
      case 'newChat':
        return GlobalUrl.platform_type === 'shufa' ? <NewChatPage /> : <NewChatPageCloud />
      case 'staffmanagementuodata':
        if (userProfile?.employee_number === "00000000") {
          return <StaffmanagementUodata setActiveTab={setActiveTab} setCallback={setActiveArea} />

        } else {
          return <AllPage data={data} />
        }

      case 'operationManagement':
        return <OperationManagement />
      case 'dataReflux':
        return <DataReflux />;
      case 'dataIP':
        return <DataIP />;
      case 'ApplyStatistics':
        return <ApplyStatistics />
      case 'newCallStatistics':
        return <NewCallStatistics />

      case 'new-agent-chat':
        return GlobalUrl.platform_type === 'shufa' ? <NewAgentPage tenant_id={activeArea} /> : <NewAgentPageCloud tenant_id={activeArea} />;
      case 'callStatistics': // 调用量统计
        return GlobalUrl.platform_type === 'shufa' ? <CallStatistics /> : <CallStatisticsCloud />
    }
  }
  const setCurrentMenu = (item: any) => {

    if (item.key === 'operationsPlatform') {
      const url = GlobalUrl.agent_operation_platform + `/logs?name=${userProfile.name}&console_token=${localStorage.getItem('console_token')}&employee_number=${userProfile?.employee_number}`;
      window.open(url);
      return;
    }
    const menuName = options.find((i: any) => i.key === item.keyPath[0])?.label
    if (item.keyPath[0] === 'tansou')
      return false

    setActiveTab(item.keyPath[0])
    meunClickLog({
      body: {
        menuName,
        menuUrl: location.href,
        source: 'agentplatform',
        employeeNumber: userProfile?.employee_number,
      },
    })
  }

  return (
    <ConfigProvider locale={zhCN}>
      <div className={styles.leftContainer} style={{ backgroundColor: 'white', height: '100vh' }}>
        {/* <div className='sticky top-0 flex justify-between items-center pt-4 px-12 pb-2 leading-[56px] bg-gray-100 z-10 flex-wrap gap-y-2'>
        <TabSliderNew
          value={activeTab}
          onChange={setActiveTab}
          options={options}
        />
        <div className='flex items-center gap-2'>
          <TagFilter type='app' value={tagFilterValue} onChange={handleTagsChange} />
          <SearchInput className='w-[200px]' value={keywords} onChange={handleKeywordsChange} />
        </div>
      </div>
      <nav className='grid content-start grid-cols-1 gap-4 px-12 pt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grow shrink-0'>
        {isCurrentWorkspaceEditor
          && <NewAppCard onSuccess={mutate} />}
        {data?.map(({ data: apps }: any) => apps.map((app: any) => (
          <AppCard key={app.id} app={app} onRefresh={mutate} />
        )))}
        <CheckModal />
      </nav>
      <div ref={anchorRef} className='h-0'> </div>
      {showTagManagementModal && (
        <TagManagementModal type='app' show={showTagManagementModal} />
      )} */}
        <Layout>
          {GlobalUrl.platform_type === "wangyun" && <TopHeader />}
          <Layout>
            {
              showSider &&
              <Sider width={200} className="flex flex-col" style={{ background: 'white', height: '100vh' }}>
                {GlobalUrl.platform_type === "shufa" && <div style={{ fontWeight: 800, fontSize: '17px', textAlign: 'center', height: "56px", display: "flex", justifyContent: "center", alignItems: "center" }} className="text-[14px] text-[#3570EE] my-auto font-medium">启明网络大模型工具链</div>}
                <div style={{ marginBottom: "14px" }} className="px-[9px]">

                  <Button className="btn-primary" style={{ width: '100%', height: '40px' }} onClick={() => setIsAddOpen({
                    isOpen: true,
                    title: '立即创建',
                  })}>
                    <PlusOutlined className="pr-[10px]" />立即创建
                  </Button>
                </div>
                <Menu
                  className='my-[14px]'
                  mode="inline"
                  selectedKeys={[['workSpaceSecondPage', 'project-member', 'appExamine'].includes(activeTab) ? 'projectSpace' : activeTab]}
                  onClick={item => setCurrentMenu(item)}
                  defaultSelectedKeys={['all']}
                  style={{ borderRight: 0 }}
                  items={options.filter(item => ((item.value === 'newDataset' && GlobalUrl.platform_type === 'wangyun') || (item.value === 'informationManagement' && GlobalUrl.platform_type === 'shufa') ? false : true))}
                />
                <Menu
                  className='mb-[14px]'
                  mode="inline"
                  selectedKeys={[activeTab]}
                  onClick={item => setCurrentMenu(item)}
                  defaultSelectedKeys={['all']}
                  style={{ borderRight: 0, display: userProfile.is_super_admin ? '' : 'none' }}
                  items={options1}
                />
                <section style={{ display: userProfile.is_super_admin ? '' : 'none' }} className="p-4 border-solid border-[#f2f2f2] border-t-[1px] flex">
                  {/* <AntButton
                    style={{ backgroundColor: '#e8f0ff' }}
                    className="text-[#387dff] border-none" size="large" block
                    onClick={() => setActiveTab('super-manager')}
                  >
                    超级管理员
                  </AntButton> */}
                </section>
                <div style={{ flexDirection: 'column', position: 'absolute', left: 0, bottom: '8px', width: '152px', marginLeft: '24px', backgroundColor: 'rgb(203,220,252, 0.19)' }} className='flex'>





                  {/* <span className='mx-[10px] text-[#DEE5ED] inline-block ml-[6px] mr-[6px]'>|</span> */}
                  {/* <div style={{ width: '144px', height: '1px', border: '1px solid #BDCEED', marginLeft: '4px' }}></div> */}
                  <Popover content={
                    <>
                      <div onClick={() => {
                        window.location.href = '/agent-platform-web/apps?category=all'
                      }} style={{ cursor: 'pointer', margin: '4px 16px' }} >
                        <Image src={back} alt='img' width={16} height={16} className='inline mt-[-5px]' />
                        <span style={{ marginLeft: '8px' }} className='text-[14px] ml-[5px] text-[#6B7492]'><BackBtn title='返回首页' val='?category=all'></BackBtn></span>
                      </div>
                      <div onClick={() => {
                        localStorage.removeItem('console_token');
                        localStorage.removeItem('showAddProjectButton');
                        window.location.href = '/agent-platform-web/login';
                      }} style={{ cursor: 'pointer', margin: '4px 16px' }} >
                        <Image src={logout} alt='img' width={16} height={16} className='inline mt-[-5px]' />
                        <span style={{ marginLeft: '8px' }} className='text-[14px] ml-[5px] text-[#6B7492]'><BackBtn title='登出' val='?category=all'></BackBtn></span>
                      </div>
                    </>
                  }>
                    {/* <div style={{ margin: '4px 16px' }} >
                      <Image src={user} alt='img' width={20} height={20} className='inline mt-[-5px]' />
                      <span style={{ marginLeft: '8px' }} className='text-[16px] ml-[5px] text-[#27292B]'>{userProfile?.name}</span>
                    </div> */}
                  </Popover>
                </div>
              </Sider>
            }
            <Layout style={{ overflow: 'hidden', backgroundColor: "white", height: '100vh', marginLeft: showSider ? '' : '0px' }} className='miantainer'>
              <Content style={{ padding: '0 0px 0px 0px', height: 'calc(100%)', overflowX: 'auto' }}>
                {showComponents(activeTab)}
              </Content>
            </Layout>
          </Layout>
        </Layout >
        {isAddOpen.isOpen ? <CreateModal isAddOpen={isAddOpen} onClose={(val: boolean) => setIsAddOpen({ ...isAddOpen, isOpen: val })} /> : null}
      </div >
    </ConfigProvider >
  )
}

export default Apps
