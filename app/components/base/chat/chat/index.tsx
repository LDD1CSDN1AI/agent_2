import type {
  FC,
  ReactNode,
} from 'react'
import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { debounce } from 'lodash-es'
import classNames from 'classnames'
import { useShallow } from 'zustand/react/shallow'
import { useContext } from 'use-context-selector'
import { ToastContext } from '@/app/components/base/toast'

import { useChatWithHistoryContext } from '../chat-with-history/context'
import {
  TransferMethod,
  type ChatConfig,
  type ChatItem,
  type Feedback,
  type OnSend,
} from '../types'
import type { ThemeBuilder } from '../embedded-chatbot/theme/theme-context'
import Question from './question'
import Answer from './answer'
import ChatInput from './chat-input'
import TryToAsk from './try-to-ask'
import { ChatContextProvider } from './context'
import { Edit05 } from '@/app/components/base/icons/src/vender/line/general'
import type { Emoji } from '@/app/components/tools/types'
import Button from '@/app/components/base/button'
import { StopCircle } from '@/app/components/base/icons/src/vender/solid/mediaAndDevices'
import AgentLogModal from '@/app/components/base/agent-log-modal'
import PromptLogModal from '@/app/components/base/prompt-log-modal'
import { useStore as useAppStore } from '@/app/components/app/store'
import type { AppData } from '@/models/share'
import { useImageFiles } from '../../image-uploader/hooks'

export type ChatProps = {
  appData?: AppData
  chatList: ChatItem[]
  config?: ChatConfig
  isResponding?: boolean
  noStopResponding?: boolean
  onStopResponding?: () => void
  noChatInput?: boolean
  onSend?: OnSend
  chatContainerClassName?: string
  chatContainerInnerClassName?: string
  chatFooterClassName?: string
  chatFooterInnerClassName?: string
  suggestedQuestions?: string[]
  showPromptLog?: boolean
  questionIcon?: ReactNode
  answerIcon?: ReactNode
  allToolIcons?: Record<string, string | Emoji>
  onAnnotationEdited?: (question: string, answer: string, index: number) => void
  onAnnotationAdded?: (annotationId: string, authorName: string, question: string, answer: string, index: number) => void
  onAnnotationRemoved?: (index: number) => void
  chatNode?: ReactNode
  onFeedback?: (messageId: string, feedback: Feedback) => void
  chatAnswerContainerInner?: string
  hideProcessDetail?: boolean
  hideLogModal?: boolean
  themeBuilder?: ThemeBuilder,
  showDeepThink?: boolean
}
//
const Chat: FC<ChatProps> = ({
  appData,
  config,
  onSend,
  chatList,
  isResponding,
  noStopResponding,
  onStopResponding,
  noChatInput,
  showDeepThink,
  chatContainerClassName,
  chatContainerInnerClassName,
  chatFooterClassName,
  chatFooterInnerClassName,
  suggestedQuestions,
  showPromptLog,
  questionIcon,
  answerIcon,
  allToolIcons,
  onAnnotationAdded,
  onAnnotationEdited,
  onAnnotationRemoved,
  chatNode,
  onFeedback,
  chatAnswerContainerInner,
  hideProcessDetail,
  hideLogModal,
  themeBuilder,
}) => {
  const { t } = useTranslation()
  const {
    files,
    onUpload,
    onRemove,
    onReUpload,
    onImageLinkLoadError,
    onImageLinkLoadSuccess,
    onClear,
  } = useImageFiles()
  const { currentLogItem, setCurrentLogItem, showPromptLogModal, setShowPromptLogModal, showAgentLogModal, setShowAgentLogModal } = useAppStore(useShallow(state => ({
    currentLogItem: state.currentLogItem,
    setCurrentLogItem: state.setCurrentLogItem,
    showPromptLogModal: state.showPromptLogModal,
    setShowPromptLogModal: state.setShowPromptLogModal,
    showAgentLogModal: state.showAgentLogModal,
    setShowAgentLogModal: state.setShowAgentLogModal,
  })))
  const [width, setWidth] = useState(0)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const chatContainerInnerRef = useRef<HTMLDivElement>(null)
  const chatFooterRef = useRef<HTMLDivElement>(null)
  const chatFooterInnerRef = useRef<HTMLDivElement>(null)
  const userScrolledRef = useRef(false)
  const {
    handleNewConversation,
  } = useChatWithHistoryContext()
  const handleScrolltoBottom = useCallback(() => {
    if (chatContainerRef.current && !userScrolledRef.current)
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
  }, [])
  const location = window.location.pathname.split('/')

  const handleWindowResize = useCallback(() => {
    if (chatContainerRef.current)
      setWidth(document.body.clientWidth - (chatContainerRef.current?.clientWidth + 16) - 8)

    if (chatContainerRef.current && chatFooterRef.current)
      chatFooterRef.current.style.width = `${chatContainerRef.current.clientWidth}px`

    if (chatContainerInnerRef.current && chatFooterInnerRef.current)
      chatFooterInnerRef.current.style.width = `${chatContainerInnerRef.current.clientWidth}px`
  }, [])

  useEffect(() => {
    handleScrolltoBottom()
    handleWindowResize()
  }, [handleScrolltoBottom, handleWindowResize])

  useEffect(() => {
    if (chatContainerRef.current) {
      requestAnimationFrame(() => {
        handleScrolltoBottom()
        handleWindowResize()
      })
    }
  })

  useEffect(() => {
    window.addEventListener('resize', debounce(handleWindowResize))
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [handleWindowResize])

  useEffect(() => {
    if (chatFooterRef.current && chatContainerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { blockSize } = entry.borderBoxSize[0]

          chatContainerRef.current!.style.paddingBottom = `${blockSize}px`
          handleScrolltoBottom()
        }
      })

      resizeObserver.observe(chatFooterRef.current)

      return () => {
        resizeObserver.disconnect()
      }
    }
  }, [handleScrolltoBottom])
  const { notify } = useContext(ToastContext)

  const handleSend = (query: string) => {
    if (onSend) {
      if (files.find(item => item.type === TransferMethod.local_file && !item.fileId)) {
        notify({ type: 'info', message: t('appDebug.errorMessage.waitForImgUpload') })
        return
      }
      if (!query || !query.trim()) {
        notify({ type: 'info', message: t('appAnnotation.errorMessage.queryRequired') })
        return
      }
      onSend(query, files.filter(file => file.progress !== -1).map(fileItem => ({
        type: 'image',
        transfer_method: fileItem.type,
        url: fileItem.url,
        upload_file_id: fileItem.fileId,
      })))
      onClear()
    }
  }

  useEffect(() => {
    const chatContainer = chatContainerRef.current
    if (chatContainer) {
      const setUserScrolled = () => {
        if (chatContainer)
          userScrolledRef.current = chatContainer.scrollHeight - chatContainer.scrollTop >= chatContainer.clientHeight + 300
      }
      chatContainer.addEventListener('scroll', setUserScrolled)
      return () => chatContainer.removeEventListener('scroll', setUserScrolled)
    }
  }, [])

  const hasTryToAsk = config?.suggested_questions_after_answer?.enabled && !!suggestedQuestions?.length && onSend

  // console.log(chatList, '------------------aaaaaaaaaaaaaaaa')
  return (
    <ChatContextProvider
      config={config}
      chatList={chatList}
      isResponding={isResponding}
      showPromptLog={showPromptLog}
      questionIcon={questionIcon}
      answerIcon={answerIcon}
      allToolIcons={allToolIcons}
      onSend={onSend}
      onAnnotationAdded={onAnnotationAdded}
      onAnnotationEdited={onAnnotationEdited}
      onAnnotationRemoved={onAnnotationRemoved}
      onFeedback={onFeedback}
    >
      <div className='relative h-full'>
        <div
          // style={{ bottom: '80px', left: '20px' }}
          ref={chatContainerRef}
          className={classNames('relative h-full overflow-y-auto', chatContainerClassName)}
        >
          {chatNode}
          <div
            ref={chatContainerInnerRef}
            className={`${chatContainerInnerClassName}`}
          >
            {
              chatList.map((item, index) => {
                if (item.isAnswer) {
                  const isLast = item.id === chatList[chatList.length - 1]?.id;
                  if (item?.showDeepThink === undefined) {
                    console.log('showDeepThink', showDeepThink, item)
                    Object.assign(item, { showDeepThink })
                  }
                  return (
                    <Answer
                      appData={appData}
                      key={item.id}
                      item={item}
                      question={chatList[index - 1]?.content}
                      index={index}
                      config={config}
                      answerIcon={answerIcon}
                      showDeepThink={item.showDeepThink}
                      responding={isLast && isResponding}
                      allToolIcons={allToolIcons}
                      showPromptLog={showPromptLog}
                      chatAnswerContainerInner={chatAnswerContainerInner}
                      hideProcessDetail={hideProcessDetail}
                    />
                  )
                }
                return (
                  <Question
                    key={item.id}
                    handleSend={handleSend}
                    item={item}
                    questionIcon={questionIcon}
                    theme={themeBuilder?.theme}
                  />
                )
              })
            }
          </div>
          {
            location[2] === 'explore'
              ? <Button
                style={{
                  width: '193px',
                  height: '2rem',
                  position: 'fixed',
                  left: '30px',
                  bottom: '90px',
                }}
                variant='secondary-accent'
                className='justify-start w-full'
                onClick={handleNewConversation}
              >
                <Edit05 className='mr-2 w-4 h-4' />
                {t('share.chat.newChat')}
              </Button>
              : null
          }
          {/* <Button
            onClick={handleNewConversation}
          ><PlusCircleOutlined />新建对话</Button> */}
        </div>
        <div
          className={`absolute bottom-0 ${(hasTryToAsk || !noChatInput || !noStopResponding) && chatFooterClassName}`}
          ref={chatFooterRef}
          style={{
            background: 'linear-gradient(0deg, #F9FAFB 40%, rgba(255, 255, 255, 0.00) 100%)',
          }}
        >
          <div
            ref={chatFooterInnerRef}
            style={{ width: '90%', margin: '0 auto' }}
            className={'!w-full px-5'}
          >
            {
              !noStopResponding && isResponding && (
                <div className='flex justify-center mb-2'>
                  <Button onClick={onStopResponding}>
                    <StopCircle className='mr-[5px] w-3.5 h-3.5 text-gray-500' />
                    <span className='text-xs text-gray-500 font-normal'>{t('appDebug.operation.stopResponding')}</span>
                  </Button>
                </div>
              )
            }
            {
              hasTryToAsk && (
                <TryToAsk
                  suggestedQuestions={suggestedQuestions}
                  onSend={onSend}
                />
              )
            }
            {
              !noChatInput && (
                <ChatInput
                  visionConfig={config?.file_upload?.image}
                  speechToTextConfig={config?.speech_to_text}
                  onSend={onSend}
                  theme={themeBuilder?.theme}
                />
              )
            }
          </div>
        </div>
        {showPromptLogModal && !hideLogModal && (
          <PromptLogModal
            width={width}
            currentLogItem={currentLogItem}
            onCancel={() => {
              setCurrentLogItem()
              setShowPromptLogModal(false)
            }}
          />
        )}
        {showAgentLogModal && !hideLogModal && (
          <AgentLogModal
            width={width}
            currentLogItem={currentLogItem}
            onCancel={() => {
              setCurrentLogItem()
              setShowAgentLogModal(false)
            }}
          />
        )}
      </div>
    </ChatContextProvider>
  )
}

export default memo(Chat)
