'use client'
import type { FC } from 'react'
import React from 'react'
import cn from 'classnames'
import {
    RiArrowDownSLine,
    RiQuestionLine,
} from '@remixicon/react'
import { useBoolean } from 'ahooks'
import type { DefaultTFuncReturn } from 'i18next'
import TooltipPlus from '@/app/components/base/tooltip-plus'

type Props = {
    className?: string
    title: JSX.Element | string | DefaultTFuncReturn
    tooltip?: string
    supportFold?: boolean
    children?: JSX.Element | string | null
    operations?: JSX.Element
    inline?: boolean
}

const Filed: FC<Props> = ({
    className,
    title,
    tooltip,
    children,
    operations,
    inline,
    supportFold,
}) => {
    const [fold, {
        toggle: toggleFold,
    }] = useBoolean(true)
    return (
        <div className={cn(className, inline && 'flex justify-between items-center w-full')}>
            {children && (!supportFold || (supportFold && !fold)) && <div className={cn(!inline && 'mt-1')}>{children}</div>}
        </div>
    )
}
export default React.memo(Filed)
