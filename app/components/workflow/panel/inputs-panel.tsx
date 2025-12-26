import {
  memo,
  useCallback,
  useMemo,
  useState
} from 'react'
import { useTranslation } from 'react-i18next'
import { useNodes } from 'reactflow'
import FormItem from '../nodes/_base/components/before-run-form/form-item'
import {
  BlockEnum,
  InputVarType,
  WorkflowRunningStatus,
} from '../types'
import {
  getProcessedInputs,
} from '@/app/components/base/chat/chat/utils'
import {
  useStore,
  useWorkflowStore,
} from '../store'
import { useWorkflowRun } from '../hooks'
import type { StartNodeType } from '../nodes/start/types'
import { TransferMethod } from '../../base/text-generation/types'
import Button from '@/app/components/base/button'
import { useFeatures } from '@/app/components/base/features/hooks'
import { Input } from 'antd';
import { useCheckInputsForms } from '@/app/components/base/chat/chat/check-input-forms-hooks'
import Toast from '../../base/toast';

const { TextArea } = Input;

type Props = {
  onRun: () => void
}

const InputsPanel = ({ onRun }: Props) => {
  const { t } = useTranslation()
  const workflowStore = useWorkflowStore()
  const fileSettings = useFeatures(s => s.features.file)
  const nodes = useNodes<StartNodeType>()
  const inputs = useStore(s => s.inputs)
  const files = useStore(s => s.files)
  const workflowRunningData = useStore(s => s.workflowRunningData)
  const { checkInputsForm } = useCheckInputsForms()
  const {
    handleRun,
  } = useWorkflowRun()
  const startNode = nodes.find(node => node.data.type === BlockEnum.Start)
  const startVariables = startNode?.data.variables
  const [textAreaValue, setTextAreaValue] = useState<string>('');

  const variables = useMemo(() => {
    const data = startVariables || []
    if (fileSettings?.image?.enabled) {
      return [
        ...data,
        {
          type: InputVarType.files,
          variable: '__image',
          required: false,
          label: 'files',
        },
      ]
    }

    return data
  }, [fileSettings?.image?.enabled, startVariables])

  const handleValueChange = (variable: string, v: any) => {
    if (variable === '__image') {
      workflowStore.setState({
        files: v,
      })
    }
    else {
      workflowStore.getState().setInputs({
        ...inputs,
        [variable]: v,
      })
    }
  }

  const doRun = useCallback(() => {
    if (!checkInputsForm(inputs, variables as any))
      return
    onRun()
    handleRun({ inputs: getProcessedInputs(inputs, variables as any), files })
  }, [files, handleRun, inputs, onRun, variables, checkInputsForm])

  const importJson = () => {
    if (!textAreaValue && variables) {
      Toast.notify({
        type: 'error',
        message: '请输入JSON内容'
      });
    }
    let obj = JSON.parse(textAreaValue);
    workflowStore.getState().setInputs({
      ...obj
    });
  };

  const canRun = (() => {
    if (files?.some(item => (item.transfer_method as any) === TransferMethod.local_file && !item.upload_file_id))
      return false

    return true
  })()

  return (
    <>
      <div className='px-4 pb-2 mt-2'>
        <TextArea onChange={(e) => setTextAreaValue(e.target.value)} value={textAreaValue} />
      </div>
      <div className='flex item-center justify-between px-4 py-2'>
        <Button
          variant='primary'
          className='w-full'
          onClick={importJson}
        >导入JSON以自动填充</Button>
      </div>
      <div className='px-4 pb-2'>
        {
          variables.map((variable, index) => (
            <div
              key={variable.variable}
              className='mb-2 last-of-type:mb-0'
            >
              <FormItem
                autoFocus={index === 0}
                className='!block'
                payload={variable}
                value={inputs[variable.variable]}
                onChange={v => handleValueChange(variable.variable, v)}
              />
            </div>
          ))
        }
      </div>
      <div className='flex items-center justify-between px-4 py-2'>
        <Button
          variant='primary'
          disabled={!canRun || workflowRunningData?.result?.status === WorkflowRunningStatus.Running}
          className='w-full'
          onClick={doRun}
        >
          {t('workflow.singleRun.startRun')}
        </Button>
      </div>
    </>
  )
}

export default memo(InputsPanel)
