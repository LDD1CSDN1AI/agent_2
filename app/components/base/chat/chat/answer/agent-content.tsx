import type { FC } from 'react'
import { memo, useEffect, useState } from 'react'
import type {
  ChatItem,
  VisionFile,
} from '../../types'
import { Markdown } from '@/app/components/base/markdown'
import Thought from '@/app/components/base/chat/chat/thought'
import ImageGallery from '@/app/components/base/image-gallery'
import type { Emoji } from '@/app/components/tools/types'
import { Collapse } from 'antd'

type AgentContentProps = {
  item: ChatItem
  responding?: boolean
  allToolIcons?: Record<string, string | Emoji>
  showDeepThink?: boolean
}
const AgentContent: FC<AgentContentProps> = ({
  item,
  responding,
  allToolIcons,
  showDeepThink
}) => {
  const {
    annotation,
    agent_thoughts,
  } = item
  const [showThinkContent, setShowThinkContent] = useState(showDeepThink)

  useEffect(() => {
    setShowThinkContent(showDeepThink);
  }, [showDeepThink])

  const getImgs = (list?: VisionFile[]) => {
    if (!list)
      return []
    return list.filter(file => file.type === 'image' && file.belongs_to === 'assistant')
  }

  if (annotation?.logAnnotation)
    return <Markdown content={annotation?.logAnnotation.content || ''} />

  console.log(agent_thoughts, '----------------------------agent_thoughts')
  return (
    <div>
      {agent_thoughts?.map((thought, index) => {
        const stringValue = thought?.thought || '';
        const arrayContent = stringValue.indexOf('</think>') + '' !== '-1' ? stringValue.split('</think>') : stringValue.split('</Think>');
        const content1 = arrayContent[0];
        const content2 = arrayContent && arrayContent[1];
        // console.log('----------------content1', content1, '----------------content2', content2)
        return (
          <div key={index}>
            {
              showDeepThink &&
              <Collapse style={{ marginBottom: '8px' }} bordered={false} defaultActiveKey={['1']} items={[{ key: '1', label: '深度思考', children: <Markdown content={content1} /> }]} />
            }
            {thought.thought && ((showDeepThink && content2) || !showDeepThink) && (
              <Markdown content={showDeepThink ? content2 : stringValue} />
            )}
            {/* {item.tool} */}
            {/* perhaps not use tool */}
            {!!thought.tool && (
              <Thought
                thought={thought}
                allToolIcons={allToolIcons || {}}
                isFinished={!!thought.observation || !responding}
              />
            )}

            {getImgs(thought.message_files).length > 0 && (
              <ImageGallery srcs={getImgs(thought.message_files).map(file => file.url)} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default memo(AgentContent)
