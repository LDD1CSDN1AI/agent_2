/* eslint-disable multiline-ternary */
'use client'
import type { FC } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import {
  RiAddLine,
  RiDeleteBinLine,
} from '@remixicon/react'
import { useContext } from 'use-context-selector'
import produce from 'immer'
import { useTranslation } from 'react-i18next'
import { useBoolean } from 'ahooks'
import { ReactSortable } from 'react-sortablejs'
import sty from './style.module.css'
import ConfigContext from '@/context/debug-configuration'
import Panel from '@/app/components/app/configuration/base/feature-panel'
import Button from '@/app/components/base/button'
import OperationBtn from '@/app/components/app/configuration/base/operation-btn'
import { getInputKeys } from '@/app/components/base/block-input'
import ConfirmAddVar from '@/app/components/app/configuration/config-prompt/confirm-add-var'
import { getNewVar } from '@/utils/var'
import { varHighlightHTML } from '@/app/components/app/configuration/base/var-highlight'
import { debounce } from 'lodash'

const MAX_QUESTION_NUM = 5

export type IOpeningStatementProps = {
  value: string
  readonly?: boolean
  onChange?: (value: string) => void
  suggestedQuestions?: string[]
  onSuggestedQuestionsChange?: (value: string[]) => void
}

// regex to match the {{}} and replace it with a span
const regex = /\{\{([^}]+)\}\}/g

const OpeningStatement: FC<IOpeningStatementProps> = ({
  value = '',
  readonly,
  onChange,
  suggestedQuestions = [],
  onSuggestedQuestionsChange = () => { },
}) => {
  const { t } = useTranslation()
  const {
    modelConfig,
    setModelConfig,
  } = useContext(ConfigContext)
  const promptVariables = modelConfig.configs.prompt_variables
  const [notIncludeKeys, setNotIncludeKeys] = useState<string[]>([])

  const hasValue = !!(value || '').trim()
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const [isFocus, { setTrue: didSetFocus, setFalse: setBlur }] = useBoolean(false)

  const setFocus = () => {
    didSetFocus()
    setTimeout(() => {
      const input = inputRef.current
      if (input) {
        input.focus()
        input.setSelectionRange(input.value.length, input.value.length)
      }
    }, 0)
  }

  const [tempValue, setTempValue] = useState(value)
  useEffect(() => {
    setTempValue(value || '')
    setFocus()

    const textArea = document.getElementById('text-area')
    const charCount = document.getElementById('char-count')
    if (!textArea)
      return
    textArea.addEventListener('input', () => {
      if (!textArea)
        return
      const currentLength = textArea?.value?.length
      if (!charCount || currentLength > 200)
        return
      charCount.textContent = `${currentLength}/200`
    })
  }, [value])

  const [tempSuggestedQuestions, setTempSuggestedQuestions] = useState(suggestedQuestions || [])
  const notEmptyQuestions = tempSuggestedQuestions.filter(question => !!question && question.trim())
  const coloredContent = (tempValue || '')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(regex, varHighlightHTML({ name: '$1' })) // `<span class="${highLightClassName}">{{$1}}</span>`
    .replace(/\n/g, '<br />')

  const handleEdit = () => {
    if (readonly)
      return
    setFocus()
  }

  const [isShowConfirmAddVar, { setTrue: showConfirmAddVar, setFalse: hideConfirmAddVar }] = useBoolean(false)

  const handleCancel = () => {
    setBlur()
    setTempValue(value)
    setTempSuggestedQuestions(suggestedQuestions)
  }

  const autoSave = useRef(
    debounce((newValue: string, newQuestions: string[]) => {
      const keys = getInputKeys(newValue)
      const promptKeys = promptVariables.map(item => item.key)
      let notIncludeKeys: string[] = []

      if (promptKeys.length === 0) {
        if (keys.length > 0)
          notIncludeKeys = keys
      }
      else {
        notIncludeKeys = keys.filter(key => !promptKeys.includes(key))
      }

      if (notIncludeKeys.length > 0) {
        setNotIncludeKeys(notIncludeKeys)
        showConfirmAddVar()
        return
      }

      onChange?.(newValue)
      onSuggestedQuestionsChange(newQuestions)
    }, 200)
  ).current

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setTempValue(newValue)
    autoSave(newValue, tempSuggestedQuestions)
    window.dispatchEvent(new Event('auto-save'))
  }

  const handleQuestionsChange = (newQuestions: string[]) => {
    setTempSuggestedQuestions(newQuestions)
    autoSave(tempValue, newQuestions)
    window.dispatchEvent(new Event('auto-save'))
  }

  const headerRight = null

  const renderQuestions = () => {
    return true ? (
      <div>
        <div className='flex items-center py-1'>
          <div className='shrink-0 flex space-x-0.5 leading-[18px] text-xs font-medium text-gray-500'>
            <div className='uppercase'>{t('appDebug.openingStatement.openingQuestion')}</div>
            <div>·</div>
            <div>{tempSuggestedQuestions.length}/{MAX_QUESTION_NUM}</div>
          </div>
          <div className='ml-3 grow w-0 h-px bg-[#243, 244, 246]'></div>
        </div>
        <ReactSortable
          className="space-y-1"
          list={tempSuggestedQuestions.map((name, index) => {
            return {
              id: index,
              name,
            }
          })}
          setList={list => handleQuestionsChange(list.map(item => item.name))}
          handle='.handle'
          ghostClass="opacity-50"
          animation={150}
        >
          {tempSuggestedQuestions.map((question, index) => {
            return (
              <div className='group relative rounded border border-gray-200 flex items-center pl-2.5 hover:border-gray-300 hover:bg-white' key={index}>
                <div className='handle flex items-center justify-center w-4 h-4 cursor-grab'>
                  <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M1 2C1.55228 2 2 1.55228 2 1C2 0.447715 1.55228 0 1 0C0.447715 0 0 0.447715 0 1C0 1.55228 0.447715 2 1 2ZM1 6C1.55228 6 2 5.55228 2 5C2 4.44772 1.55228 4 1 4C0.447715 4 0 4.44772 0 5C0 5.55228 0.447715 6 1 6ZM6 1C6 1.55228 5.55228 2 5 2C4.44772 2 4 1.55228 4 1C4 0.447715 4.44772 0 5 0C5.55228 0 6 0.447715 6 1ZM5 6C5.55228 6 6 5.55228 6 5C6 4.44772 5.55228 4 5 4C4.44772 4 4 4.44772 4 5C4 5.55228 4.44772 6 5 6ZM2 9C2 9.55229 1.55228 10 1 10C0.447715 10 0 9.55229 0 9C0 8.44771 0.447715 8 1 8C1.55228 8 2 8.44771 2 9ZM5 10C5.55228 10 6 9.55229 6 9C6 8.44771 5.55228 8 5 8C4.44772 8 4 8.44771 4 9C4 9.55229 4.44772 10 5 10Z" fill="#98A2B3" />
                  </svg>
                </div>
                <input
                  type="input"
                  value={question || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    const newQuestions = tempSuggestedQuestions.map((item, i) => {
                      if (index === i)
                        return value
                      return item
                    })
                    handleQuestionsChange(newQuestions)
                  }}
                  className={'w-full overflow-x-auto pl-1.5 pr-8 text-sm leading-9 text-gray-900 border-0 grow h-9 bg-transparent focus:outline-none cursor-pointer rounded'}
                />

                <div
                  className='block absolute top-1/2 translate-y-[-50%] right-1.5 p-1 rounded cursor-pointer hover:bg-[#FEE4E2] hover:text-[#D92D20]'
                  onClick={() => {
                    const newQuestions = tempSuggestedQuestions.filter((_, i) => index !== i)
                    handleQuestionsChange(newQuestions)
                  }}
                >
                  <RiDeleteBinLine className='w-3.5 h-3.5' />
                </div>
              </div>
            )
          })}</ReactSortable>
        {tempSuggestedQuestions.length < MAX_QUESTION_NUM && (
          <div
            onClick={() => {
              handleQuestionsChange([...tempSuggestedQuestions, ''])
            }}
            className='mt-1 flex items-center h-9 px-3 gap-2 rounded-lg cursor-pointer text-gray-400  bg-gray-100 hover:bg-gray-200'>
            <RiAddLine className='w-4 h-4' />
            <div className='text-gray-500 text-[13px]'>{t('appDebug.variableConfig.addOption')}</div>
          </div>
        )}
      </div>
    ) : (
      <div className='mt-1.5 flex flex-wrap'>
        {notEmptyQuestions.map((question, index) => {
          return (
            <div key={index} className='mt-1 mr-1 max-w-full truncate last:mr-0 shrink-0 leading-8 items-center px-2.5 rounded border border-gray-200 shadow-xs bg-white text-[13px] font-normal text-gray-900 cursor-pointer'>
              {question}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Panel
      className='bg-white border-0 shadow-none mb-2'
      noBodySpacing={true}
      title="对话开场白"
      headerRight={headerRight}
      hasHeaderBottomBorder={!hasValue}
    >
      <div style={{ position: 'relative' }}>
        {(hasValue || (!hasValue && true)) ? (
          <>
            <div className='relative'>
              <textarea
                id='text-area'
                ref={inputRef}
                value={tempValue}
                rows={5}
                maxLength={200}
                onChange={handleInputChange}
                className={sty.openingStatementInput}
                placeholder='请输入内容'
              >
              </textarea>
              {tempValue?.length ? <div id="char-count" className={sty.openingStatementInputNode}>{tempValue.length}/200</div> : null}
            </div>
            {renderQuestions()}
          </>) : (
          <div className='pt-2 pb-1 text-xs text-gray-500'>{t('appDebug.openingStatement.noDataPlaceHolder')}123</div>
        )}

        {isShowConfirmAddVar && (
          <ConfirmAddVar
            varNameArr={notIncludeKeys}
            onConfrim={() => {
              const newModelConfig = produce(modelConfig, (draft) => {
                draft.configs.prompt_variables = [...draft.configs.prompt_variables, ...notIncludeKeys.map(key => getNewVar(key, 'string'))]
              })
              setModelConfig(newModelConfig)
              hideConfirmAddVar()
              setBlur()
            }}
            onCancel={hideConfirmAddVar}
            onHide={hideConfirmAddVar}
          />
        )}

      </div>
    </Panel>
  )
}
export default React.memo(OpeningStatement)
