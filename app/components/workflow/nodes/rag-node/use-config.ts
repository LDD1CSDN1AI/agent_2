import { useCallback } from 'react'
import produce from 'immer'
import useVarList from '../_base/hooks/use-var-list'
import type { Var } from '../../types'
import { VarType } from '../../types'
import type { RAGNodeType } from './types'
import useNodeCrud from '@/app/components/workflow/nodes/_base/hooks/use-node-crud'
import {
  useNodesReadOnly,
} from '@/app/components/workflow/hooks'
import useAvailableVarList from '../_base/hooks/use-available-var-list'

const useConfig = (id: string, payload: RAGNodeType) => {
  const { nodesReadOnly: readOnly } = useNodesReadOnly()
  const { inputs, setInputs } = useNodeCrud<RAGNodeType>(id, payload)
  // variables
  const { handleVarListChange } = useVarList<RAGNodeType>({
    inputs,
    setInputs,
  })

  const handleSelectChange = useCallback((user_select_scene?: any, job_type_name?: any) => {
    const newInputs = produce(inputs, (draft) => {
      draft.user_select_scene = user_select_scene
      draft.job_type_name = job_type_name
    })
    setInputs(newInputs)
  }, [inputs, setInputs]);

  const handleCreateType = useCallback((self_build_rag: object) => {
    const newInputs = produce(inputs, (draft) => {
      draft.self_build_rag = self_build_rag;
    })
    setInputs(newInputs)
  }, [inputs, setInputs]);

  const handleJobNameChange = useCallback((value: any) => {
    const newInputs = produce(inputs, (draft) => {
      draft.job_type_name = value
    })
    setInputs(newInputs)
  }, [inputs, setInputs]);

  const handleParamsChange = useCallback((value: any) => {
    const newInputs = produce(inputs, (draft) => {
      draft.params = value
    })
    setInputs(newInputs)
  }, [inputs, setInputs]);

  const handleProvChange = useCallback((value: any) => {
    const newInputs = produce(inputs, (draft) => {
      draft.prov = value
    })
    setInputs(newInputs)
  }, [inputs, setInputs]);

  const handleQueryChange = useCallback((value: any) => {
    const newInputs = produce(inputs, (draft) => {
      draft.query = value
    })
    setInputs(newInputs)
  }, [inputs, setInputs]);

  const filterVar = useCallback((varPayload: Var) => {
    return varPayload.type !== VarType.arrayObject
  }, [])

  const handleIsChart = useCallback((value: any) => {
    const newInputs = produce(inputs, (draft) => {
      draft.is_chart = value
    })
    setInputs(newInputs)
  }, [inputs, setInputs]);

  const {
    availableVars,
    availableNodesWithParent,
  } = useAvailableVarList(id, {
    onlyLeafNodeVar: false,
    filterVar,
  })

  return {
    readOnly,
    inputs,
    availableVars,
    availableNodesWithParent,
    handleVarListChange,
    handleSelectChange,
    handleJobNameChange,
    handleIsChart,
    handleParamsChange,
    handleProvChange,
    handleCreateType,
    handleQueryChange,
    filterVar,
  }
}

export default useConfig
