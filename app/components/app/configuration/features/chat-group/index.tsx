'use client'
import type { FC } from 'react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import GroupName from '../../base/group-name'
import type { IOpeningStatementProps } from './opening-statement'
import OpeningStatement from './opening-statement'
import SuggestedQuestionsAfterAnswer from './suggested-questions-after-answer'
import SpeechToText from './speech-to-text'
import TextToSpeech from './text-to-speech'
import Citation from './citation'
import s from './style.module.css'
import { Background } from 'reactflow'

/*
* Include
* 1. Conversation Opener
* 2. Opening Suggestion
* 3. Next question suggestion
*/
type ChatGroupProps = {
  isShowOpeningStatement: boolean
  openingStatementConfig: IOpeningStatementProps
  isShowSuggestedQuestionsAfterAnswer: boolean
  isShowSpeechText: boolean
  isShowTextToSpeech: boolean
  isShowCitation: boolean
}
const ChatGroup: FC<ChatGroupProps> = ({
  isShowOpeningStatement,
  openingStatementConfig,
  isShowSuggestedQuestionsAfterAnswer,
  isShowSpeechText,
  isShowTextToSpeech,
  isShowCitation,
}) => {
  const { t } = useTranslation()

  return (
    <div >
      <OpeningStatement {...openingStatementConfig} />
    </div>
  )
}
export default React.memo(ChatGroup)
