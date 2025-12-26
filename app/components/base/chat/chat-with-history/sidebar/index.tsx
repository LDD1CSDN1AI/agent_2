import {
  useCallback,
  useState, useEffect
} from 'react'
import { useTranslation } from 'react-i18next'
import { useChatWithHistoryContext } from '../context'
import Listt from './list'
import AppIcon from '@/app/components/base/app-icon'
import Button from '@/app/components/base/button'
import { Input } from 'antd'
import {
  SearchOutlined
} from '@ant-design/icons';
import { Divider, List, Typography } from 'antd';
import { Edit05 } from '@/app/components/base/icons/src/vender/line/general'
import type { ConversationItem } from '@/models/share'
import Confirm from '@/app/components/base/confirm'
import RenameModal from '@/app/components/base/chat/chat-with-history/sidebar/rename-modal'
import { fetchConversation } from '@/service/share'

const Sidebar = () => {
  const { t } = useTranslation()
  const {
    appData,
    pinnedConversationList,
    conversationList,
    handleNewConversation,
    currentConversationId,
    handleChangeConversation,
    handlePinConversation,
    handleUnpinConversation,
    conversationRenaming,
    handleRenameConversation,
    handleDeleteConversation,
    isMobile,
  } = useChatWithHistoryContext()
  const [showConfirm, setShowConfirm] = useState<ConversationItem | null>(null)
  const [showRename, setShowRename] = useState<ConversationItem | null>(null)
  const [searchValue, setSearchValue] = useState<string>('');
  const handleOperate = useCallback((type: string, item: ConversationItem) => {
    if (type === 'pin')
      handlePinConversation(item.id)

    if (type === 'unpin')
      handleUnpinConversation(item.id)

    if (type === 'delete')
      setShowConfirm(item)

    if (type === 'rename')
      setShowRename(item)
  }, [handlePinConversation, handleUnpinConversation])
  const handleCancelConfirm = useCallback(() => {
    setShowConfirm(null)
  }, [])
  const handleDelete = useCallback(() => {
    if (showConfirm)
      handleDeleteConversation(showConfirm.id, { onSuccess: handleCancelConfirm })
  }, [showConfirm, handleDeleteConversation, handleCancelConfirm])
  const handleCancelRename = useCallback(() => {
    setShowRename(null)
  }, [])
  const handleRename = useCallback((newName: string) => {
    // 12.25遗留问题，这里需要重新获取一次对话列表
    if (showRename)
      handleRenameConversation(showRename.id, newName, { onSuccess: handleCancelRename })
  }, [showRename, handleRenameConversation, handleCancelRename])

  const [conversations, setConversations] = useState([]);

  const installedApp_id = window.location.pathname.split('/')[4]

  useEffect(() => {
    (
      async () => {
        const isInstalledApp = true;
        const installedAppId = installedApp_id;
        const last_id = ''; // 可选，可传入对应值或者不传
        const pinned = false; // 可选，根据是否筛选置顶情况传入值
        const limit = 100; // 可选，传入期望获取的数量
        const name = searchValue; // 新增的可选参数，按需传入
        try {
          const result: any = await fetchConversation(isInstalledApp, installedAppId, last_id, pinned, limit, name);

          setConversations(result.data);

        } catch (error) {
          console.error('获取对话数据出错:', error);
        }
      }
    )()
  }, [searchValue])
  const handleSuggestionClick = (item: ConversationItem) => {//+

    handlePinConversation(item.id)
    setSearchValue('')
    conversationList.push(item)
  }


  return (
    <div className='shrink-0 h-full flex flex-col w-[240px] border-r border-r-gray-100'>
      {
        !isMobile && (
          <div className='shrink-0 flex p-4' style={{ fontWeight: '600' }}>
            {/* <AppIcon
              className='mr-3'
              size='small'
              icon={appData?.site.icon}
              background={appData?.site.icon_background}
            />
            <div className='py-1 text-base font-semibold text-gray-800'>
              {appData?.site.title}
            </div> */}
            历史记录
          </div>
        )
      }
      <div className='shrink-0 p-4 pb-1'>
        {/* <Button
          variant='secondary-accent'
          className='justify-start w-full'
          onClick={handleNewConversation}
        >
          <Edit05 className='mr-2 w-4 h-4' />
          {t('share.chat.newChat')}
        </Button> */}
        <Input placeholder='搜索历史对话记录' value={searchValue} onChange={(e: any) => setSearchValue(e.target.value)} allowClear suffix={<SearchOutlined />} />
      </div>
      <div className='grow px-4 py-2 overflow-y-auto' style={{ marginBottom: '100px' }}>
        {
          searchValue ? <List
            bordered
            style={{ maxHeight: '100px', overflowY: 'auto', marginBottom: "20px" }}
            dataSource={conversations}
            renderItem={(item: any) => (
              <List.Item onClick={() => handleSuggestionClick(item)}>
                {item.name}
              </List.Item>
            )}
          /> : null
        }
        {
          !!pinnedConversationList.length && (
            <div className='mb-4'>
              <Listt
                isPin
                title={t('share.chat.pinnedTitle') || ''}
                list={pinnedConversationList}
                onChangeConversation={handleChangeConversation}
                onOperate={handleOperate}
                currentConversationId={currentConversationId}
              />
            </div>
          )
        }
        {
          !!conversationList.length && (
            <Listt
              title={(pinnedConversationList.length && t('share.chat.unpinnedTitle')) || ''}
              list={conversationList}
              onChangeConversation={handleChangeConversation}
              onOperate={handleOperate}
              currentConversationId={currentConversationId}
            />
          )
        }
      </div>
      <div className='px-4 pb-4 text-xs text-gray-400' style={{ textAlign: 'center' }}>
        © {appData?.site.copyright || appData?.site.title} {(new Date()).getFullYear()}
      </div>
      {!!showConfirm && (
        <Confirm
          title={t('share.chat.deleteConversation.title')}
          content={t('share.chat.deleteConversation.content') || ''}
          isShow
          onClose={handleCancelConfirm}
          onCancel={handleCancelConfirm}
          onConfirm={handleDelete}
        />
      )}
      {showRename && (
        <RenameModal
          isShow
          onClose={handleCancelRename}
          saveLoading={conversationRenaming}
          name={showRename?.name || ''}
          onSave={handleRename}
        />
      )}
    </div>
  )
}

export default Sidebar
