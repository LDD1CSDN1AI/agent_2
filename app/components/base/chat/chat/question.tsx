import type {
  FC,
  ReactNode,
} from 'react'
import {
  memo,
  useState,
} from 'react'
import type { ChatItem } from '../types'
import type { Theme } from '../embedded-chatbot/theme/theme-context'
import { CssTransform } from '../embedded-chatbot/theme/utils'
import { QuestionTriangle } from '@/app/components/base/icons/src/vender/solid/general'
import { User } from '@/app/components/base/icons/src/public/avatar'
import { Markdown } from '@/app/components/base/markdown'
import ImageGallery from '@/app/components/base/image-gallery'
import { EditOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import { useTranslation } from 'react-i18next'
import { useContext } from 'use-context-selector'
import { ToastContext } from '@/app/components/base/toast'

type QuestionProps = {
  item: ChatItem
  questionIcon?: ReactNode
  theme: Theme | null | undefined
  handleSend?: any
}
const Question: FC<QuestionProps> = ({
  item,
  questionIcon,
  theme,
  handleSend
}) => {
  const {
    content,
    message_files,
  } = item;
  const { notify } = useContext(ToastContext)
  const { t } = useTranslation()

  const [showEdit, setShowEdit] = useState(false)
  const [edit, setEdit] = useState(false)
  const [textValue, setTextValue] = useState(content);

  const sendSecond = () => {
    setShowEdit(false)
    if (!textValue || !textValue.trim()) {
      notify({ type: 'info', message: t('appAnnotation.errorMessage.queryRequired') })
      return
    }
    handleSend(textValue)
    setEdit(false)
  }

  const imgSrcs = message_files?.length ? message_files.map(item => item.url) : []
  return (
    edit ?
      <div style={{ width: '100%', height: '100%' }}>
        <Input.TextArea onPressEnter={() => sendSecond()} onChange={(e) => setTextValue(e.target.value)} autoSize={{ minRows: 2, maxRows: 6 }} value={textValue} />
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', margin: '4px' }}>
          <Button size='small' style={{ marginRight: '16px' }} onClick={() => setEdit(false)}>取消</Button>
          <Button size='small' onClick={() => sendSecond()} type={'primary'}>确定</Button>
        </div>
      </div>
      :
      <div onMouseEnter={() => setShowEdit(true)} onMouseLeave={() => setShowEdit(false)} className='flex justify-end mb-2 last:mb-0 pl-10'>
        {
          showEdit &&
          <div className='flex center' style={{ height: '45px', marginRight: '8px' }}>
            <EditOutlined style={{ cursor: 'pointer' }} onClick={() => setEdit(true)} />
          </div>
        }
        <div className='group relative mr-4'>
          <QuestionTriangle
            className='absolute -right-2 top-0 w-2 h-3 text-[#D1E9FF]/50'
            style={theme ? { color: theme.chatBubbleColor } : {}}
          />
          <div
            className='px-4 py-3 bg-[#D1E9FF]/50 rounded-b-2xl rounded-tl-2xl text-sm text-gray-900'
            style={theme?.chatBubbleColorStyle ? CssTransform(theme.chatBubbleColorStyle) : {}}
          >
            {
              !!imgSrcs.length && (
                <ImageGallery srcs={imgSrcs} />
              )
            }
            <Markdown content={content} />
          </div>
          <div className='mt-1 h-[18px]' />
        </div>
        <div className='shrink-0 w-10 h-10'>
          {
            questionIcon || (
              <div className='w-full h-full rounded-full border-[0.5px] border-black/5'>
                <User className='w-full h-full' />
              </div>
            )
          }
        </div>
      </div>

  )
}

export default memo(Question)
