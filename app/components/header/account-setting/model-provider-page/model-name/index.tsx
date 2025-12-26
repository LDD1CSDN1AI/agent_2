import type { FC, PropsWithChildren } from 'react'
import classNames from 'classnames'
import {
  modelTypeFormat,
  sizeFormat,
} from '../utils'
import { useLanguage } from '../hooks'
import type { ModelItem } from '../declarations'
import ModelBadge from '../model-badge'
import FeatureIcon from '../model-selector/feature-icon'

type ModelNameProps = PropsWithChildren<{
  modelItem: ModelItem
  className?: string
  showModelType?: boolean
  modelTypeClassName?: string
  showMode?: boolean
  modeClassName?: string
  showFeatures?: boolean
  featuresClassName?: string
  showContextSize?: boolean
}>
const ModelName: FC<ModelNameProps> = ({
  modelItem,
  className,
  showModelType,
  modelTypeClassName,
  showMode,
  modeClassName,
  showFeatures,
  featuresClassName,
  showContextSize,
  children,
}) => {
  const language = useLanguage()

  const getModelName = (modelName: any) => {
    // console.log("执行getModelNamegetModelNamegetModelNamegetModelName      ", modelName)
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
        return modelItem.label[language];
    }
  }

  if (!modelItem)
    return null
  return (
    <div
      className={`
        flex items-center truncate text-[13px] font-medium text-gray-800
        ${className}
      `}
    >
      <div
        className='truncate'
        title={
          getModelName(modelItem.label[language]) || modelItem.label.en_US}
      >
        {
          getModelName(modelItem.label[language]) || modelItem.label.en_US}
      </div>
      {
        showModelType && modelItem.model_type && (
          <ModelBadge className={classNames('ml-1', modelTypeClassName)}>
            {modelTypeFormat(modelItem.model_type)}
          </ModelBadge>
        )
      }
      {/* {
        modelItem.model_properties.mode && showMode && (
          <ModelBadge className={classNames('ml-1', modeClassName)}>
            {(modelItem.model_properties.mode as string).toLocaleUpperCase()}
          </ModelBadge>
        )
      } */}
      {
        showFeatures && modelItem.features?.map(feature => (
          <FeatureIcon
            key={feature}
            feature={feature}
            className={featuresClassName}
          />
        ))
      }
      {
        showContextSize && modelItem.model_properties.context_size && (
          <ModelBadge className='ml-1'>
            {sizeFormat(modelItem.model_properties.context_size as number)}
          </ModelBadge>
        )
      }
      {children}
    </div>
  )
}

export default ModelName
