import { useMemo } from 'react'
import { useGetLanguage } from '@/context/i18n'
import { BlockEnum } from '@/app/components/workflow/types'

export const useNodeHelpLink = (nodeType: BlockEnum) => {
  const language = useGetLanguage()
  const prefixLink = useMemo(() => {
    if (language === 'zh_Hans')
      return 'https://docs.dify.ai/v/zh-hans/guides/workflow/node/'

    return 'https://docs.dify.ai/guides/workflow/node/'
  }, [language])
  const linkMap = useMemo(() => {
    if (language === 'zh_Hans') {
      return {
        [BlockEnum.Start]: 'start',
        [BlockEnum.End]: 'end',
        [BlockEnum.Answer]: 'answer',
        [BlockEnum.LLM]: 'llm',
        [BlockEnum.KnowledgeRetrieval]: 'knowledge_retrieval',
        [BlockEnum.QuestionClassifier]: 'question_classifier',
        [BlockEnum.IfElse]: 'ifelse',
        [BlockEnum.Code]: 'code',
        [BlockEnum.TemplateTransform]: 'template',
        [BlockEnum.VariableAssigner]: 'variable_assigner',
        [BlockEnum.VariableAggregator]: 'variable_assigner',
        [BlockEnum.Iteration]: 'iteration',
        [BlockEnum.ParameterExtractor]: 'parameter_extractor',
        [BlockEnum.ParameterPasser]: 'parameter_transmit',
        [BlockEnum.HttpRequest]: 'http_request',
        [BlockEnum.Tool]: 'tools',
        [BlockEnum.DocExtractor]: 'doc-extractor',
      }
    }

    return {
      [BlockEnum.Start]: 'start',
      [BlockEnum.End]: 'end',
      [BlockEnum.Answer]: 'answer',
      [BlockEnum.AgentNode]: 'agent-node',
      [BlockEnum.RAGNode]: 'rag-node',
      [BlockEnum.LLM]: 'llm',
      [BlockEnum.KnowledgeRetrieval]: 'knowledge-retrieval',
      [BlockEnum.QuestionClassifier]: 'question-classifier',
      [BlockEnum.IfElse]: 'if-else',
      [BlockEnum.Code]: 'code',
      [BlockEnum.TemplateTransform]: 'template',
      [BlockEnum.VariableAssigner]: 'variable-assigner',
      [BlockEnum.VariableAggregator]: 'variable-assigner',
      [BlockEnum.Iteration]: 'iteration',
      [BlockEnum.ParameterExtractor]: 'parameter-extractor',
      [BlockEnum.ParameterPasser]: 'parameter-passer',
      [BlockEnum.HttpRequest]: 'http-request',
      [BlockEnum.Tool]: 'tools',
      [BlockEnum.DocExtractor]: 'doc-extractor',
    }
  }, [language])

  return `${prefixLink}${linkMap[nodeType]}`
}
