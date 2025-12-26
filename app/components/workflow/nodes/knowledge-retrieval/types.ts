import type { CommonNodeType, ModelConfig, ValueSelector } from '@/app/components/workflow/types'
import { DataSet } from '@/models/datasets'
import type { RETRIEVE_TYPE } from '@/types/app'

export type MultipleRetrievalConfig = {
  top_k: number
  score_threshold: number | null | undefined
  reranking_model?: {
    provider: string
    model: string
  }
}

export type SingleRetrievalConfig = {
  model: ModelConfig
}

export enum LogicalOperator {
  and = 'and',
  or = 'or',
}

export enum ComparisonOperator {
  contains = 'contains',
  notContains = 'not contains',
  startWith = 'start with',
  endWith = 'end with',
  is = 'is',
  isNot = 'is not',
  empty = 'empty',
  notEmpty = 'not empty',
  equal = '=',
  notEqual = '≠',
  largerThan = '>',
  lessThan = '<',
  largerThanOrEqual = '≥',
  lessThanOrEqual = '≤',
  isNull = 'is null',
  isNotNull = 'is not null',
  in = 'in',
  notIn = 'not in',
  allOf = 'all of',
  exists = 'exists',
  notExists = 'not exists',
  before = 'before',
  after = 'after',
}

export enum MetadataFilteringModeEnum {
  disabled = 'disabled',
  automatic = 'automatic',
  manual = 'manual',
}

export enum MetadataFilteringVariableType {
  string = 'string',
  number = 'number',
  time = 'time',
  select = 'select',
}

export type MetadataFilteringCondition = {
  id: string
  name: string
  comparison_operator: ComparisonOperator
  value?: string | number
}

export type MetadataFilteringConditions = {
  logical_operator: LogicalOperator
  conditions: MetadataFilteringCondition[]
}

export type KnowledgeRetrievalNodeType = CommonNodeType & {
  query_variable_selector: ValueSelector
  dataset_ids: string[]
  retrieval_mode: RETRIEVE_TYPE
  multiple_retrieval_config?: MultipleRetrievalConfig
  single_retrieval_config?: SingleRetrievalConfig
  _datasets?: DataSet[]
  metadata_filtering_mode?: MetadataFilteringModeEnum
  metadata_filtering_conditions?: MetadataFilteringConditions
  metadata_model_config?: ModelConfig
}
