import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import type {
  Model,
  ModelItem,
  ModelProvider,
} from '../declarations'
import { useLanguage } from '../hooks'
import { useProviderContext } from '@/context/provider-context'

export type TriggerProps = {
  open?: boolean
  disabled?: boolean
  currentProvider?: ModelProvider | Model
  currentModel?: ModelItem
  providerName?: string
  modelId?: any
  hasDeprecated?: boolean
  modelDisabled?: boolean
  isInWorkflow?: boolean
  modelName?: string
}
const Trigger: FC<TriggerProps> = ({
  disabled,
  currentProvider,
  currentModel,
  providerName,
  modelId,
  hasDeprecated,
  modelDisabled,
  isInWorkflow,
  modelName,
}) => {
  const { t } = useTranslation()
  const language = useLanguage()
  const { modelProviders } = useProviderContext()


  const getModelName = (modelName: any) => {
    console.log("getModelNamegetModelNamegetModelNamegetModelName---   ", modelName)
    switch (modelName) {
      case 'deepseek-r1-awq':
        return 'DeepSeek-R1-671B';
      case 'deepseek-v3-671b':
        return 'DeepSeek-V3-671B';
      case 'qwen2.5-72b-instruct':
        return 'Qwen2.5-72b-instruct';
      case 'qwen3-32b':
        return 'Qwen3-32B';
      case 'deepseek-r1-671b':
        return 'DeepSeek-R1-671B';
      case 'QiMing-14B':
        return 'QiMing_14B';
      case 'QiMing70B-9eaf8668-d4eb-4ae2-98f5-0db9a292330c':
        return 'QiMing_70B';
      case 'qimingr1_0416':
        return 'QiMingr1_72B';
      case 'qiming25_72b_fc':
        return 'QiMing25_72B_fc';
      case 'qiming25_72b':
        return 'QiMing25_72B';
      default:
        return modelName;
    }
  }

  return (
    <div className='border rounded border-slate-200 py-1.5 px-2.5 flex items-center'
    // className={cn(
    //   'relative flex items-center px-2 h-8 rounded-lg  cursor-pointer',
    //   !isInWorkflow && 'border hover:border-[1.5px]',
    //   !isInWorkflow && (disabled ? 'border-[#F79009] bg-[#FFFAEB]' : 'border-[#444CE7] bg-primary-50'),
    //   isInWorkflow && 'pr-[30px] bg-gray-100 border border-gray-100  hover:border-gray-200',
    // )}
    >
      {/* {
        currentProvider && (
          <ModelIcon
            className='mr-1.5 !w-5 !h-5'
            provider={currentProvider}
            modelName={currentModel?.model}
          />
        )
      }
      {
        !currentProvider && (
          <ModelIcon
            className='mr-1.5 !w-5 !h-5'
            provider={modelProviders.find(item => item.provider === providerName)}
            modelName={modelId}
          />
        )
      } */}
      {/* {
        !currentModel && (
          <ModelName
            className='mr-1.5 text-gray-900'
            modelItem={currentModel}
            showMode
            modeClassName={cn(!isInWorkflow ? '!text-[#444CE7] !border-[#A4BCFD]' : '!text-gray-500 !border-black/8')}
            showFeatures
            featuresClassName={cn(!isInWorkflow ? '!text-[#444CE7] !border-[#A4BCFD]' : '!text-gray-500 !border-black/8')}
          />
        )
      } */}
      {
        currentModel && (
          <div className='mr-1 text-[13px] font-medium text-gray-900 truncate flex-1'>
            {getModelName(modelName)}
          </div>
        )
      }
      {
        !currentModel && (
          <div className='mr-1 text-[13px] font-medium text-gray-900 truncate flex-1'>
            请选择模型
          </div>
        )
      }

      <div className='text-[12px] bg-[#155eef] rounded py-0.5 px-1.5 text-white'>模型选择</div>
      {/* {
        disabled
          ? (
            <TooltipPlus
              popupContent={
                hasDeprecated
                  ? t('common.modelProvider.deprecated')
                  : (modelDisabled && currentModel)
                    ? MODEL_STATUS_TEXT[currentModel.status as string][language]
                    : ''
              }
            >
              <AlertTriangle className='w-4 h-4 text-[#F79009]' />
            </TooltipPlus>
          )
          : (
            <SlidersH className={cn(!isInWorkflow ? 'text-indigo-600' : 'text-gray-500', 'shrink-0 w-4 h-4')} />
          )
      } */}
      {/* {isInWorkflow && (<RiArrowDownSLine className='absolute top-[9px] right-2 w-3.5 h-3.5 text-gray-500' />)} */}
    </div>
  )
}

export default Trigger
