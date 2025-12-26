import type { FC } from 'react'
import React from 'react'
import { Select } from 'antd'
import { useTranslation } from 'react-i18next'
import useConfig from './use-config'
import type { AgentNodeType } from './types'
import VarList from '@/app/components/workflow/nodes/_base/components/variable/var-list'
import AddButton from '@/app/components/base/button/add-button'
import Field from '@/app/components/workflow/nodes/_base/components/field'
import type { NodePanelProps } from '@/app/components/workflow/types'
import OutputVars, { VarItem } from '@/app/components/workflow/nodes/_base/components/output-vars'
import useAvailableVarList from '@/app/components/workflow/nodes/_base/hooks/use-available-var-list'
const i18nPrefix = 'workflow.nodes.answer'

const Panel: FC<NodePanelProps<AgentNodeType>> = ({
  id,
  data,
}) => {
  const { t } = useTranslation()

  const {
    readOnly,
    inputs,
    handleAnswerChange,
    filterVar,
    handleAddVariable,
    handleVarListChange,
  } = useConfig(id, data)

  const { availableVars, availableNodesWithParent } = useAvailableVarList(id, {
    onlyLeafNodeVar: false,
    filterVar,
  })

  return (
    <div className='mt-2 mb-2 px-4 space-y-4'>
      <Field
        title="输入变量"
        operations={
          !readOnly ? <AddButton onClick={handleAddVariable} /> : undefined
        }
      >
        <VarList
          readonly={readOnly}
          nodeId={id}
          list={inputs.variables}
          onChange={handleVarListChange}
          filterVar={filterVar}
        />
      </Field>
      <Field
        title="请选择智能体"
      >
        <Select
          placeholder='请选择智能体'
          style={{ width: '100%' }}
          value={inputs.answer}
          onChange={handleAnswerChange}
          options={[
            { value: 'GetAccountList', label: '获取用户账户信息' },
            { value: 'SolutionConfirm', label: '询问用户是否解决' },
            { value: 'FailureCall', label: '是否报障' },
          ]}
        />
      </Field>
      <div className='px-4 pt-4 pb-2'>
        <OutputVars>
          <>
            <VarItem
              name='output'
              type='string'
              description="参数传递"
            />
          </>
        </OutputVars>
      </div>
      {/* <Editor
        readOnly={readOnly}
        justVar
        title={t(`${i18nPrefix}.answer`)!}
        value={inputs.answer}
        onChange={handleAnswerChange}
        nodesOutputVars={availableVars}
        availableNodes={availableNodesWithParent}
      /> */}
    </div>
  )
}

export default React.memo(Panel)
