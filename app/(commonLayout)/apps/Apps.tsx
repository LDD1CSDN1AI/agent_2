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
  const [currentManualPage, setCurrentManualPage] = useState(1);
  useEffect(() => {
    getTenantsParam();
  }, []);
  const [currentTabClick, setTcurrentTabClick] = useState<string>('1'); // 默认值设为'1'
  const [isUrlReady, setIsUrlReady] = useState(false); // 用于判断URL和参数是否准备好
  const [activeId, setActiveId] = useState('')
  const [activeArea, setActiveArea] = useState<string>('')
  const [tabClick, setTabClick] = useState('agent-chat');
  const [options, optionsdata] = useState<any['options']>([]);
  const [showSider, setShowSider] = useState(true)
  const [usersuper, eatusersuper] = useState(false)
  // 1. 定义与子组件一致的每页条数（可硬编码/引用全局常量）
const AREA_PAGE_SIZE = 20; // 与子组件目标 PAGE_SIZE 一致
  const getKey = (
    pageIndex: number,
    previousPageData: AppListResponse,
    activeTab: string,
    tags: string[],
    activeId: any,
    
  ) => {
      // 从 LocalStorage 读取 tabClick
    // const currentTabClick = typeof window !== 'undefined' 
    // ? localStorage.getItem('areaTabType') || '1' 
    // : '1';
    if (!pageIndex || previousPageData.has_more) {
      const params: any = {
        url: '/apps',
        params: {
          page: pageIndex + 1,
          limit: activeTab === 'area' || activeTab === 'workSpaceSecondPage' ? AREA_PAGE_SIZE : 9,
        },
      };







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

      if (activeTab === 'workSpaceSecondPage') {
        console.log("22222222222222222222222222activeTab",activeTab,"currentTabClick",currentTabClick);
        params.params.tenant_id = activeId.id || tenantId;
        
        switch (currentTabClick) {
          case '1': // Agent 标签页
            params.params.app_mode = 'agent-chat';
            break;
          case '3': // 工作流标签页
            params.params.app_mode = 'workflow';
            break;
          case '5': // 对话流标签页
            params.params.app_mode = 'advanced-chat';
            break;
          default:
            break;
        }
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
            params.params.app_mode = 'agent-chat';
            break;
          case '3': // 工作流标签页
            params.params.app_mode = 'workflow';
            break;
          case '5': // 对话流标签页
            params.params.app_mode = 'advanced-chat';
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
  
  // ===================== 核心改造：新增插件专属SWR请求（适配新接口） =====================
  // 1. 插件新接口参数构造（参考Agent/工作流逻辑，复用fetchAppList）
  const getPluginAppKey = (
    pageIndex: number,
    previousPageData: any,
    activeArea: string,
  ) => {
    if (!activeArea) return null; // 无活跃空间时不发起请求
  
    // 初始化params变量（提升作用域）
    let params: any = null;
  
    // 对应新接口：http://localhost:5003/console/api/plugin_apps?page=1&limit=100&tenant_id=xxx&mode=workSpaceSecondPage&app_mode=api
    if (!pageIndex || previousPageData?.has_more) {
      params = {
        url: '/plugin_apps', // 新插件接口
        params: {
          page: pageIndex + 1, // 动态页码（pageIndex 从 0 开始，接口通常从 1 开始）
          limit: AREA_PAGE_SIZE, // 可改为动态变量（如从配置或状态中获取）
          // mode: 'workSpaceSecondPage',
          app_mode: 'api',
        },
      };
  
      // 在if块内部添加tenant_id，确保params已定义
      if (activeArea) {
        params.params.tenant_id = activeArea;
      }
    }
  
    return params; // 此时params要么是if块中定义的对象，要么是初始值null
  };

  // 2. 插件数据请求（复用fetchAppList，与Agent/工作流保持一致）
// 插件数据请求（确保使用正确的 fetch 函数）
// 2. 插件数据请求（保持原有逻辑，无需额外配置）
const {
  data: pluginAppsData,
  mutate: pluginAppsMutate,
  // isLoading: isPluginAppsLoading,
  setSize: setPluginAppsSize, // 仅用于确保加载对应页码数据
} = useSWRInfinite(
  (pageIndex: number, previousPageData: any) => 
    getPluginAppKey(pageIndex, previousPageData, activeArea),
  fetchAppList,
  { 
    revalidateFirstPage: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  }
);

  // 3. 兼容原有插件请求（可保留，也可直接替换为新插件数据）
  // const { data: plugins, mutate: oldPluginsMutate } = useSWR(
  //   activeArea ? `/workspaces/current/tool-providers?tenant_id=${activeArea}` : null,
  //   fetchPluginProviders
  // );
  // =====================================================================================


  const { data: plugins, mutate: pluginsMutate } = useSWR(
    activeArea ? `/workspaces/current/tool-providers?tenant_id=${activeArea}` : null,
    fetchPluginProviders
  );
  const { data: customPlugins, mutate: customPluginsMutate } = useSWR('/workspaces/current/tools/api/flat', fetchInstallPlugin)
  const { data: builtinPlugins, mutate: builtinPluginsMutate } = useSWR('/workspaces/current/tools/builtin/flat', fetchInstallPlugin)
  const { data, isLoading, size, setSize, mutate } = useSWRInfinite(
    (pageIndex: number, previousPageData: AppListResponse) => {
      console.log("isUrlReady",isUrlReady);
      if (!isUrlReady)// 当 isUrlReady 为 false 时，返回 null
      {
        return null;
      } else {
        console.log("pageIndex",pageIndex);
        return getKey(pageIndex, previousPageData, activeTab, tagIDs, activeId);
        
    }
    },
    fetchAppList,
    { 
      revalidateFirstPage: false, // 关闭第一页自动重验证，核心优化
      revalidateOnFocus: false, // 失去焦点返回时，不自动重验证
      revalidateOnReconnect: false, // 网络重连时，不自动重验证
      dedupingInterval: 3000, // 3秒内相同请求去重，避免重复调用
    }
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

  // const hasMore = data?.at(-1)?.has_more ?? true
  
// 判断是否还有更多数据
console.log("data?.[0]?.has_more:",data?.[0]?.has_more)
const hasMore = data?.[0]?.has_more;
  // useEffect(() => {
  //   let observer: IntersectionObserver | undefined
  //   if (anchorRef.current) {
  //     observer = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting && !isLoading && hasMore)
  //         setSize((size: number) => size + 1)
  //     }, { rootMargin: '100px' })
  //     observer.observe(anchorRef.current)
  //   }
  //   return () => observer?.disconnect()
  // }, [isLoading, setSize, anchorRef, mutate, hasMore])

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
        // return <AreaPage data={data?.[0]} plugins={plugins ?? []} mutate={mutate} pluginsMutate={pluginsMutate} setActiveTab={setActiveTab} setCallback={setActiveArea} setSize={setSize}/> plugins={plugins ?? []}
        return <AreaPage appData={data} currentManualPage={currentManualPage} setCurrentManualPage={setCurrentManualPage} totalItems={data?.[currentManualPage - 1]?.total || 0} currentPage={size} plugins={pluginAppsData || []}  mutate={mutate} pluginsMutate={pluginAppsMutate} setPluginAppsSize={setPluginAppsSize}
        setActiveTab={setActiveTab} setCallback={setActiveArea} setSize={setSize} pageSize={AREA_PAGE_SIZE} currentTabClick={currentTabClick}
        setTcurrentTabClick={setTcurrentTabClick} />
   
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
        // return <WorkSpaceSecondPage data={data?.[0]} plugins={plugins ?? []} setActiveTab={setActiveTab} mutate={mutate} setCallback={setActiveArea} pluginsMutate={pluginsMutate} />
        return <WorkSpaceSecondPage
            // 1. 分页核心：父组件页码（同步子组件）
            currentManualPage={currentManualPage}
            // 2. 分页核心：页码更新方法（子组件同步父组件页码）
            setCurrentManualPage={setCurrentManualPage}
            // 3. 分页核心：总条数（优先传递，避免子组件重复计算）
            totalItems={data?.[currentManualPage - 1]?.total || 0}
            // 4. 分页核心：通知父组件加载对应页码数据
            setSize={setSize}
            // 5. 分页核心：每页条数（与父组件 AREA_PAGE_SIZE 保持一致）
            pageSize={AREA_PAGE_SIZE}
            // 6. 业务数据：分页分段数据（数组套数组，每一项对应一页）
            data={data}
            // 7. 插件数据：分页分段的插件数据（复用已有的 pluginAppsData）
            plugins={pluginAppsData || []}
            // 8. 业务数据刷新方法（携带分页参数）
            mutate={mutate}
            // 9. 插件数据刷新方法
            pluginsMutate={pluginAppsMutate}
            // 10. 插件页码加载方法（通知父组件加载插件对应页码）
            setPluginSize={setPluginAppsSize}
              // 补充：插件总条数传递（避免子组件重复计算，提升性能）
            pluginTotalItems={pluginAppsData?.[currentManualPage - 1]?.total || 0}
            // 11. 原有业务属性保留
            setActiveTab={setActiveTab}
            setCallback={setActiveArea}
            currentTabClick = {currentTabClick}
            setTcurrentTabClick = {setTcurrentTabClick}
          />
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

    // 先判断是否是个人空间(area)或项目空间(projectSpace)
    const targetKey = item.keyPath[0];
    if (targetKey === 'area' || targetKey === 'projectSpace') {
      setTcurrentTabClick('1'); // 重置为"1"
      setCurrentManualPage(1); // 可选：同步重置页码为第一页
    }

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
