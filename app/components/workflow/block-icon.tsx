import type { FC } from 'react'
import { memo } from 'react'
import { BlockEnum } from './types'
import {
  AgentNode,
  RAGNode,
  Answer,
  Assigner,
  Code,
  End,
  Home,
  Http,
  IfElse,
  Iteration,
  KnowledgeRetrieval,
  Llm,
  DocsExtractor,
  Loop,
  LoopEnd,
  ParameterExtractor,
  ParameterPasser,
  QuestionClassifier,
  TemplatingTransform,
  VariableX,
} from '@/app/components/base/icons/src/vender/workflow'
import AppIcon from '@/app/components/base/app-icon'

type BlockIconProps = {
  type: BlockEnum
  size?: string
  className?: string
  toolIcon?: string | { content: string; background: string }
}
const ICON_CONTAINER_CLASSNAME_SIZE_MAP: Record<string, string> = {
  xs: 'w-4 h-4 rounded-[5px] shadow-xs',
  sm: 'w-5 h-5 rounded-md shadow-xs',
  md: 'w-6 h-6 rounded-lg shadow-md',
}
const getIcon = (type: BlockEnum, className: string) => {
  return {
    [BlockEnum.Start]: <Home className={className} />,
    [BlockEnum.LLM]: <Llm className={className} />,
    [BlockEnum.Code]: <Code className={className} />,
    [BlockEnum.End]: <End className={className} />,
    [BlockEnum.IfElse]: <IfElse className={className} />,
    [BlockEnum.HttpRequest]: <Http className={className} />,
    [BlockEnum.Answer]: <Answer className={className} />,
    [BlockEnum.AgentNode]: <AgentNode className={className} />,
    [BlockEnum.RAGNode]: <RAGNode className={className} />,
    [BlockEnum.KnowledgeRetrieval]: <KnowledgeRetrieval className={className} />,
    [BlockEnum.QuestionClassifier]: <QuestionClassifier className={className} />,
    [BlockEnum.TemplateTransform]: <TemplatingTransform className={className} />,
    [BlockEnum.VariableAssigner]: <VariableX className={className} />,
    [BlockEnum.VariableAggregator]: <VariableX className={className} />,
    [BlockEnum.Assigner]: <Assigner className={className} />,
    [BlockEnum.DocExtractor]: <DocsExtractor className={className} />,
    [BlockEnum.Tool]: <VariableX className={className} />,
    [BlockEnum.LoopStart]: <VariableX className={className} />,
    [BlockEnum.Loop]: <Loop className={className} />,
    [BlockEnum.LoopEnd]: <LoopEnd className={className} />,
    [BlockEnum.Iteration]: <Iteration className={className} />,
    [BlockEnum.ParameterExtractor]: <ParameterExtractor className={className} />,
    [BlockEnum.ParameterPasser]: <ParameterPasser className={className} />,
  }[type]
}
const ICON_CONTAINER_BG_COLOR_MAP: Record<string, string> = {
  [BlockEnum.Start]: 'bg-primary-500',
  [BlockEnum.LLM]: 'bg-[#6172F3]',
  [BlockEnum.Code]: 'bg-[#2E90FA]',
  [BlockEnum.End]: 'bg-[#F79009]',
  [BlockEnum.IfElse]: 'bg-[#06AED4]',
  [BlockEnum.Iteration]: 'bg-[#06AED4]',
  [BlockEnum.HttpRequest]: 'bg-[#875BF7]',
  [BlockEnum.Answer]: 'bg-[#F79009]',
  [BlockEnum.AgentNode]: 'bg-[#2E90FA]',
  [BlockEnum.RAGNode]: 'bg-[#2E90FA]',
  [BlockEnum.KnowledgeRetrieval]: 'bg-[#16B364]',
  [BlockEnum.QuestionClassifier]: 'bg-[#16B364]',
  [BlockEnum.TemplateTransform]: 'bg-[#2E90FA]',
  [BlockEnum.Loop]: 'bg-util-colors-cyan-cyan-500',
  [BlockEnum.LoopEnd]: 'bg-util-colors-warning-warning-500',
  [BlockEnum.VariableAssigner]: 'bg-[#2E90FA]',
  [BlockEnum.VariableAggregator]: 'bg-[#2E90FA]',
  [BlockEnum.Assigner]: 'bg-util-colors-blue-blue-500',
  [BlockEnum.ParameterExtractor]: 'bg-[#2E90FA]',
  [BlockEnum.ParameterPasser]: 'bg-[#2E90FA]',
  [BlockEnum.DocExtractor]: 'bg-util-colors-green-green-500',
}

// const ICON_CONTAINER_BG_COLOR_MAP: Record<string, string> = {
//   [BlockEnum.Start]: 'bg-util-colors-blue-brand-blue-brand-500',
//   [BlockEnum.LLM]: 'bg-util-colors-indigo-indigo-500',
//   [BlockEnum.Code]: 'bg-util-colors-blue-blue-500',
//   [BlockEnum.End]: 'bg-util-colors-warning-warning-500',
//   [BlockEnum.IfElse]: 'bg-util-colors-cyan-cyan-500',
//   [BlockEnum.Iteration]: 'bg-util-colors-cyan-cyan-500',
//   [BlockEnum.HttpRequest]: 'bg-util-colors-violet-violet-500',
//   [BlockEnum.Answer]: 'bg-util-colors-warning-warning-500',
//   [BlockEnum.KnowledgeRetrieval]: 'bg-util-colors-green-green-500',
//   [BlockEnum.QuestionClassifier]: 'bg-util-colors-green-green-500',
//   [BlockEnum.TemplateTransform]: 'bg-util-colors-blue-blue-500',
//   [BlockEnum.VariableAssigner]: 'bg-util-colors-blue-blue-500',
//   [BlockEnum.VariableAggregator]: 'bg-util-colors-blue-blue-500',
//   [BlockEnum.ParameterExtractor]: 'bg-util-colors-blue-blue-500',
//   [BlockEnum.DocExtractor]: 'bg-util-colors-green-green-500',
// }
const BlockIcon: FC<BlockIconProps> = ({
  type,
  size = 'sm',
  className,
  toolIcon,
}) => {
  return (
    <div className={`
      flex items-center justify-center border-[0.5px] border-white/2 text-white
      ${ICON_CONTAINER_CLASSNAME_SIZE_MAP[size]}
      ${ICON_CONTAINER_BG_COLOR_MAP[type]}
      ${toolIcon && '!shadow-none'}
      ${className}
    `}
    >
      {
        type !== BlockEnum.Tool && (
          getIcon(type, size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5')
        )
      }
      {
        type === BlockEnum.Tool && toolIcon && (
          <>
            {
              typeof toolIcon === 'string'
                ? (
                  <div
                    className='shrink-0 w-full h-full bg-cover bg-center rounded-md'
                    style={{
                      backgroundImage: `url(${toolIcon})`,
                    }}
                  ></div>
                )
                : (
                  <AppIcon
                    className='shrink-0 !w-full !h-full'
                    size='tiny'
                    icon={toolIcon?.content}
                    background={toolIcon?.background}
                  />
                )
            }
          </>
        )
      }
    </div>
  )
}

export const VarBlockIcon: FC<BlockIconProps> = ({
  type,
  className,
}) => {
  return (
    <>
      {getIcon(type, `w-3 h-3 ${className}`)}
    </>
  )
}

export default memo(BlockIcon)
