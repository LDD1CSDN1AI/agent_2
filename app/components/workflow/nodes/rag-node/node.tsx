import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import InfoPanel from '../_base/components/info-panel'
import ReadonlyInputWithSelectVar from '../_base/components/readonly-input-with-select-var'
import type { RAGNodeType } from './types'
import type { NodeProps } from '@/app/components/workflow/types'
const Node: FC<NodeProps<RAGNodeType>> = ({
  id,
  data,
}) => {
  const { t } = useTranslation()

  let answerStr = '';
  if (data.answer === '2') { answerStr = '综维知识助手' }
  if (data.answer === '3') { answerStr = '无线网优知识助手' }
  if (data.answer === '7') { answerStr = '装维知识助手' }
  if (data.answer === '8') { answerStr = '规章制度助手' }
  if (data.answer === '9') { answerStr = 'IT运维知识助手' }
  if (data.answer === '11') { answerStr = '无线故障处置助手' }
  if (data.answer === '13') { answerStr = '统一/通用知识助手' }

  return (
    <div className='mb-1 px-3 py-1'>
      <InfoPanel title={'已选择'} content={
        <ReadonlyInputWithSelectVar
          value={answerStr}
          nodeId={id}
        />
      } />
    </div>
  )
}

export default React.memo(Node)
