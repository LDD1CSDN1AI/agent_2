import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import InfoPanel from '../_base/components/info-panel'
import ReadonlyInputWithSelectVar from '../_base/components/readonly-input-with-select-var'
import type { AgentNodeType } from './types'
import type { NodeProps } from '@/app/components/workflow/types'
const Node: FC<NodeProps<AgentNodeType>> = ({
  id,
  data,
}) => {
  const { t } = useTranslation()

  return (
    <div className='mb-1 px-3 py-1'>
      <InfoPanel title={'选择'} content={
        <ReadonlyInputWithSelectVar
          value={data.answer}
          nodeId={id}
        />
      } />
    </div>
  )
}

export default React.memo(Node)
