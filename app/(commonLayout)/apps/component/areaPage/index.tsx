import React, { useEffect, useState } from 'react'
import { Button, Space, Pagination } from 'antd'
import useSwr from 'swr'
import { useDebounceFn } from 'ahooks'
import {
  RiAddBoxLine,
} from '@remixicon/react'
import UserCard from '../base/userCard'
import AddArea from './addArea'
import type { AppListResponse } from '@/models/app'
import type { PluginProvider } from '@/models/common'
import { getTenants } from '@/service/common'
import type { OpenTypes } from '@/app/(commonLayout)/apps/component/base/createModal'
import CreateModal from '@/app/(commonLayout)/apps/component/base/createModal'
import CreateFromDSLModal from '@/app/components/app/create-from-dsl-modal'
import GlobalUrl from '@/GlobalUrl'

type Props = {
  appData?: AppListResponse[] | undefined
  currentManualPage?: number // 父组件传递的当前手动页码
  setCurrentManualPage?: (page: number) => void // 页码更新方法
  totalItems?: number // 总条数（父组件传递，避免重复计算）
  plugins?: any[] | undefined // 修改：接收插件分页分段数据（数组套数组）
  mutate?: (page?: number, limit?: number) => void // 新增分页参数
  pluginsMutate?: () => void
  setPluginAppsSize?: (size: number) => void
  setActiveTab?: (newActiveTab: string) => void
  setCallback?: any
  fetchList?: (page: number, limit: number) => Promise<AppListResponse>
  setSize: (size: number) => void
  pageSize?: number // 接收父组件传递的每页条数
  currentTabClick: string; // 新增父组件传递的 tabClick
  setTcurrentTabClick: (key: string) => void; // 新增修改 tabClick 的回调
}

type AreaNameListItem = {
  id: string
  name: string
  status: string
  created_at: string
  current: boolean
}

type areaNameItem = {
  key: string
  name: string
}

const AreaPage: React.FC<Props> = (props) => {
  const { 
    appData, 
    currentManualPage: parentManualPage,
    setCurrentManualPage: setParentManualPage,
    totalItems: parentTotalItems,
    plugins, 
    setActiveTab, 
    mutate, 
    pluginsMutate, 
    setPluginAppsSize,
    setCallback, 
    fetchList,
    setSize,
    pageSize
  } = props

  // 子组件页码与父组件同步
  const [currentPage, setCurrentPage] = useState(parentManualPage || 1)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [activeArea, setActiveArea] = useState<any>('')
  const [showCreateFromDSLModal, setShowCreateFromDSLModal] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState<OpenTypes>({
    isOpen: false,
    title: '',
  })
  const [header_image, setHeaderImage] = useState('agent')
  const [areaName, setAreaName] = useState<Array<areaNameItem>>([])

  // 选项卡状态管理（从localStorage初始化）
  const [tabClick, setTabClick] = useState(() => {
    
      // return props.currentTabClick || '1';
      return  '1';
  });

  // 修正：页索引 = 当前页码 - 1（对应 appData/plugins 数组索引）
  const pageIndex = currentPage - 1
  // 当前页数据：优先使用父组件页码对应的数据，保证一致性
  const targetPageData = appData?.[(parentManualPage || currentPage) - 1]
  // 插件当前页数据：从分页分段数据中获取对应页码数据
  const targetPluginPageData = plugins?.[pageIndex];
  
  // 动态总条数：根据当前选项卡切换（插件用自己的 total，其他用 parentTotalItems）
  const dynamicTotalItems = (() => {
    if (tabClick === '2') {
      // 插件选项卡：使用插件数据的总条数
      return targetPluginPageData?.total || 0;
    }
    // 其他选项卡：使用原有总条数
    return parentTotalItems || targetPageData?.total || 0;
  })();

  // 总条数：兼容原有逻辑，优先使用动态总条数
  const totalItems = dynamicTotalItems

  const { data: tenants, mutate: tenantsMutate }: any = useSwr('/getTenants', getTenants)
  // 定义 PAGE_SIZE，优先使用父组件传递的值，默认值兜底
  const PAGE_SIZE = pageSize || 12;

  // 给 fetchList 增加防抖处理，避免快速切换选项卡触发多次请求（500ms 内仅执行一次）
  const { run: debouncedFetchList } = useDebounceFn((page: number, limit: number) => {
    if (fetchList) {
      fetchList(page, limit);
    }
  }, { wait: 100 });
  // const [currentTabClick, setcurrentTabClick] = useState(props.currentTabClick);
  // 选项卡切换处理（核心优化：精准隔离，避免冗余请求 + 切换时重置页码）
  const handleTabChange = (key: string) => {
    setTabClick(key);
    props.setTcurrentTabClick(key);
    // localStorage.setItem('areaTabType', key);
    // 切换选项卡时重置到第一页，并同步父子组件页码
    const resetPage = 1
    setCurrentPage(resetPage)
    if (setParentManualPage) {
      setParentManualPage(resetPage)
    }

    // 核心优化：仅目标选项卡（1/3/5）调用 setSize，插件选项卡不调用，避免触发父组件批量接口
    const targetTabs = ['1', '3', '5'];
    if (targetTabs.includes(key)) {
      setSize(prevSize => Math.max(prevSize, resetPage));
    }

    // 隔离插件选项卡逻辑：仅调用 pluginsMutate + 加载插件第一页数据
    if (key === '2' && pluginsMutate) {
      pluginsMutate();
      setPluginAppsSize?.(prevSize => Math.max(prevSize, resetPage));
      return; // 直接终止函数，避免后续逻辑执行
    }

    // 非插件选项卡：正常调用 mutate 刷新对应列表
    if ((key === '1' || key === '3' || key === '5') && mutate) {
      mutate(resetPage, PAGE_SIZE);
    }

    mutate?.(1, PAGE_SIZE);

  };

  // 分页切换处理（同步父子页码 + 确保加载对应页数据，兼容所有选项卡）
  const handlePageChange = (newPage: number) => {
    // 1. 更新子组件当前页码
    setCurrentPage(newPage)
    // 2. 同步到父组件，确保父子页码一致
    if (setParentManualPage) {
      setParentManualPage(newPage)
    }
    // 3. 根据当前选项卡，确保加载对应页码数据
    if (tabClick === '2') {
      // 插件选项卡：确保插件数据加载对应页码
      if (setPluginAppsSize) {
        setPluginAppsSize(prevSize => Math.max(prevSize, newPage))
      }
      // 刷新插件数据
      pluginsMutate?.();
    } else {
      // 其他选项卡：确保 Agent/工作流/对话流 数据加载对应页码
      setSize(prevSize => Math.max(prevSize, newPage))
      // 刷新对应列表数据
      mutate?.(newPage, PAGE_SIZE)
    }
  };

  // 处理租户数据和分页总数
  useEffect(() => {
    if (tenants) {
      const newArr: any = []
      const defaultSpace = tenants?.find((item: any) => item.current === true)
      if (defaultSpace) {
        setActiveArea(defaultSpace.id)
        setCallback(defaultSpace.id)
      }
      tenants.forEach((item: AreaNameListItem, index: any) => {
        newArr.push({ key: item.id, name: item.name })
      })
      setAreaName(newArr)
    }

    // 父子页码同步：父组件页码变化时，子组件跟随更新
    if (parentManualPage) {
      setCurrentPage(parentManualPage)
    }
  }, [tenants, parentManualPage, setCallback])
  useEffect(() => {
    setTabClick(props.currentTabClick);
    // setTabClick('1');
  }, [props.currentTabClick]);
  // 优化后的初始加载数据：精准过滤选项卡，避免误触发冗余接口
  useEffect(() => {
    const targetTabs = ['1', '3', '5'];
    // 非目标选项卡（插件/其他）直接终止，不执行任何接口请求
    if (!targetTabs.includes(tabClick)  || !mutate) {
      return;
    }
    // 使用防抖后的方法，避免快速切换选项卡触发多次请求
    // debouncedFetchList(1, PAGE_SIZE);
  }, [tabClick, debouncedFetchList, PAGE_SIZE]) // 移除无关依赖，减少触发次数

  // 获取选项卡对应名称和模式
  const getTabName = () => {
    switch (tabClick) {
      case '1':
        return { name: 'Agent', mode: 'agent-chat', upload: '导入' };
      case '2':
        return { name: '插件', mode: 'chat' };
      case '3':
        return { name: '工作流', mode: 'workflow' };
      case '4':
        return { name: '智能体', mode: 'metabolic' };
      case '5':
        return { name: '对话流', mode: 'advanced-chat' };
      default:
        return { name: '' };
    }
  }

  // 顶部操作按钮
  const operations = () => {
    return <Space>
      <div 
        className='flex items-center justify-center text-18 text-#216EFF cursor-pointer color-#216EFF' 
        onClick={() => {
          const mode = getTabName().mode;
          setIsAddOpen({
            isOpen: true,
            title: `创建${getTabName().name}`,
            titleName: `${getTabName().name}`,
            mode,
          })
          const headerImg = tabClick === '1' ? 'agent' : tabClick === '2' ? 'chat' : tabClick === '3' ? 'workflow' : 'metabolic'
          setHeaderImage(headerImg)
        }}
      >
        <RiAddBoxLine style={{ width: '20px', height: '20px', color: '#216EFF', marginRight: '5px' }} />
        <p style={{ color: '#216EFF' }}>{`创建${getTabName().name}`}</p>
      </div>
      {
        GlobalUrl.platform_type === 'shufa' && getTabName().upload && 
        <Button onClick={() => setShowCreateFromDSLModal(true)}>{getTabName().upload}</Button>
      }
    </Space>
  }

  const fromType = '个人空间';
  
  // 渲染列表项（根据当前页码和模式过滤数据，兼容Agent/工作流/对话流）item.mode === mode
  const renderListItems = (mode: string) => {
    const filteredData = targetPageData?.data?.filter(item => item.mode === mode) || [];
    return (
      <>
        <div className='flex flex-1 flex-wrap overflow-hidden overflow-y-auto gap-[1.45vw]'>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <UserCard
                headerImag={
                  mode === 'agent-chat' ? 'header_agent1' : 
                  mode === 'workflow' ? 'header_workflow1' : 
                  'header_workflow1'
                }
                mutate={() => mutate?.(currentPage, PAGE_SIZE)}
                key={item.id || index} // 优化：使用item.id作为key，提升性能
                fromType={fromType}
                data={item}
                areaList={areaName}
                tabClick={tabClick}
                activeArea={activeArea}
                currentTab={mode === 'agent-chat' ? 'agent' : 'workflow'}
              />
            ))
          ) : (
            <div style={{ 
              width: '100%', 
              height: '360px', 
              fontSize: '20px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              暂无{getTabName().name}数据
            </div>
          )}
        </div>
        
        {/* 分页组件 - 只有当有数据且总数大于每页显示数时显示 */}
        {totalItems > 0 && totalItems > PAGE_SIZE && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginTop: '20px', 
            paddingBottom: '20px' 
          }}>
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={totalItems}
              onChange={handlePageChange}
              showSizeChanger={false}
              showTotal={(total) => `共 ${total} 条 / 共 ${Math.ceil(total / PAGE_SIZE)} 页`}
            />
          </div>
        )}
      </>
    );
  };

  // 渲染插件列表项（单独封装，支持分页）
  const renderPluginItems = () => {
    // 插件当前页数据列表
    const currentPluginList = targetPluginPageData?.data || [];
    return (
      <>
        <div className='flex flex-1 flex-wrap overflow-hidden overflow-y-auto gap-[1.45vw]'>
          {currentPluginList.length > 0 ? (
            currentPluginList.map((item, index) => (
              <UserCard
                headerImag='header_chat1'
                mutate={pluginsMutate}
                key={item.id || index}
                plugin={item}
                areaList={areaName}
                fromType={fromType}
                tabClick={tabClick}
                activeArea={activeArea}
                currentTab='chat'
              />
            ))
          ) : (
            <div style={{ 
              width: '100%', 
              height: '360px', 
              fontSize: '20px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              暂无插件数据
            </div>
          )}
        </div>

        {/* 插件分页组件 - 与其他选项卡共用一套参数 */}
        {totalItems > 0 && totalItems > PAGE_SIZE && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            marginTop: '20px', 
            paddingBottom: '20px' 
          }}>
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={totalItems}
              onChange={handlePageChange}
              showSizeChanger={false}
              showTotal={(total) => `共 ${total} 条 / 共 ${Math.ceil(total / PAGE_SIZE)} 页`}
            />
          </div>
        )}
      </>
    )
  }

  // 选项卡配置（修改：插件选项卡调用独立渲染函数）
  const items = [
    {
      label: 'Agent',
      key: '1',
      children: (
        <div className='flex-1 w-[100%] overflow-y-auto' style={{ height: 'calc(100vh - 320px)' }}>
          {renderListItems('agent-chat')}
        </div>
      ),
    },
    {
      label: '插件',
      key: '2',
      children: (
        <div className='flex-1 w-[100%] overflow-y-auto' style={{ height: 'calc(100vh - 320px)' }}>
          {renderPluginItems()} {/* 插件使用独立渲染函数，支持分页 */}
        </div>
      ),
    },
    {
      label: '工作流',
      key: '3',
      children: (
        <div className='flex-1 w-[100%] overflow-y-auto' style={{ height: 'calc(100vh - 320px)' }}>
          {renderListItems('workflow')}
        </div>
      ),
    },
    {
      label: '对话流',
      key: '5',
      children: (
        <div className='flex-1 w-[100%] overflow-y-auto' style={{ height: 'calc(100vh - 320px)' }}>
          {renderListItems('advanced-chat')}
        </div>
      ),
    }
  ]

  return (
    <>
      <div className='mt-[24px]'>
        <div className='flex' style={{ 
          justifyContent: 'space-between', 
          fontWeight: '700', 
          backgroundColor: 'white', 
          padding: '16px 16px', 
          marginBottom: '16px', 
          borderRadius: '8px', 
          alignItems: 'center' 
        }}>
          <div className='text-[#1C2748] text-[20px]'>个人空间</div>
        </div>

        <div 
          className='bg-[#fff] rounded-[8px] px-[24px]'
          style={{ height: 'calc(100vh - 138px)' }}
        >
          <div style={{ 
            paddingTop: '16px', 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <div>
              {
                items.map(item => (
                  <Button 
                    key={item.key}
                    style={{ 
                      marginRight: '16px', 
                      color: item.key === tabClick ? '#1677ff' : '', 
                      border: item.key === tabClick ? '1px solid #1677ff' : '1px solid rgb(217, 217, 217)' 
                    }} 
                    onClick={() => handleTabChange(item.key)}
                  >
                    {item.label}
                  </Button>
                ))
              }
            </div>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              {operations()}
              <Button style={{ marginLeft: '16px' }} onClick={() => {
                setActiveTab?.('release')
              }}>发布管理</Button>
            </div>
          </div>
          <div style={{ marginTop: '16px' }}>
            {items.find(item => item.key === tabClick)?.children}
          </div>
        </div>
      </div >
      <CreateFromDSLModal
        tenant_id={activeArea}
        fromType='个人空间'
        tabClick={tabClick}
        show={showCreateFromDSLModal}
        onClose={() => setShowCreateFromDSLModal(false)}
        onSuccess={() => mutate?.(currentPage, PAGE_SIZE)}
      />
      <AddArea modalState={openModal} onClose={(val: boolean) => setOpenModal(val)} />
      {
        isAddOpen.isOpen
          ? <CreateModal 
              fromType='个人空间' 
              tabClick={tabClick} 
              categoryTenants={true} 
              tenant_id={activeArea} 
              isAddOpen={isAddOpen} 
              onClose={(val: boolean) => setIsAddOpen({ ...isAddOpen, isOpen: val })} 
              onSuccess={() => mutate?.(currentPage, PAGE_SIZE)}
            />
          : null
      }
    </>
  )
}

export default AreaPage