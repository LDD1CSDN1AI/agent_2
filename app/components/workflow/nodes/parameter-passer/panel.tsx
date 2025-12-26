import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import Field from '../_base/components/field'
import RemoveEffectVarConfirm from '../_base/components/remove-effect-var-confirm'
import useConfig from './use-config'
import type { ParameterPasserNodeType } from './types'
import VarGroupItem from './components/var-group-item'
import { type NodePanelProps } from '@/app/components/workflow/types'
import Split from '@/app/components/workflow/nodes/_base/components/split'
import OutputVars, { VarItem } from '@/app/components/workflow/nodes/_base/components/output-vars'
import Switch from '@/app/components/base/switch'
import AddButton from '@/app/components/base/button/add-button'
import OutputVarList from '@/app/components/workflow/nodes/_base/components/variable/output-var-list'

const i18nPrefix = 'workflow.nodes.variableAssigner'
const Panel: FC<NodePanelProps<ParameterPasserNodeType>> = ({
  id,
  data,
}) => {
  const { t } = useTranslation()

  const {
    readOnly,
    inputs,
    outputKeyOrders,
    handleAddOutputVariable,
    handleVarsChange,
    handleRemoveVariable,
    handleListOrTypeChange,
    isEnableGroup,
    handleGroupEnabledChange,
    handleAddGroup,
    handleListOrTypeChangeInGroup,
    handleGroupRemoved,
    handleVarGroupNameChange,
    isShowRemoveVarConfirm,
    hideRemoveVarConfirm,
    onRemoveVarConfirm,
    getAvailableVars,
    filterVar,
  } = useConfig(id, data)

  return (
    <div className='mt-2'>
      <div className='px-4 pt-4 pb-2'>
        <Field
          title='变量输出'
          operations={
            <AddButton onClick={handleAddOutputVariable} />
          }
        >
          <OutputVarList
            readonly={readOnly}
            outputs={inputs.outputs}
            outputKeyOrders={outputKeyOrders}
            onChange={handleVarsChange}
            onRemove={handleRemoveVariable}
          />
        </Field>
      </div>

      {/* <Split /> */}
      {/* <div className={cn('px-4 pt-4', isEnableGroup ? 'pb-4' : 'pb-2')}>
        <Field
          title={t(`${i18nPrefix}.aggregationGroup`)}
          tooltip={t(`${i18nPrefix}.aggregationGroupTip`)!}
          operations={
            <Switch
              defaultValue={isEnableGroup}
              onChange={handleGroupEnabledChange}
              size='md'
              disabled={readOnly}
            />
          }
        />
      </div> */}
      {isEnableGroup && (
        <>
          <Split />
          <div className='px-4 pt-4 pb-2'>
            <OutputVars>
              <>
                {inputs.advanced_settings?.groups.map((item, index) => (
                  <VarItem
                    key={index}
                    name={`${item.group_name}.output`}
                    type={item.output_type}
                    description={t(`${i18nPrefix}.outputVars.varDescribe`, {
                      groupName: item.group_name,
                    })}
                  />
                ))}
              </>
            </OutputVars>
          </div>
        </>
      )}
      <RemoveEffectVarConfirm
        isShow={isShowRemoveVarConfirm}
        onCancel={hideRemoveVarConfirm}
        onConfirm={onRemoveVarConfirm}
      />
    </div>
  )
}

export default React.memo(Panel)
