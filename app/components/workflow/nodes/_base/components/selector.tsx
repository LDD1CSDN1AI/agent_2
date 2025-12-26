'use client'
import type { FC } from 'react'
import React from 'react'
import { useBoolean, useClickAway } from 'ahooks'
import cn from 'classnames'
import { ChevronSelectorVertical } from '@/app/components/base/icons/src/vender/line/arrows'
import { Check } from '@/app/components/base/icons/src/vender/line/general'
type Item = {
  value: string
  label: string
}
type Props = {
  className?: string
  trigger?: React.JSX.Element
  DropDownIcon?: any
  noLeft?: boolean
  options: Item[]
  allOptions?: Item[]
  value: string
  placeholder?: string
  onChange: (value: any) => void
  uppercase?: boolean
  popupClassName?: string
  triggerClassName?: string
  itemClassName?: string
  readonly?: boolean
  showChecked?: boolean
}

const TypeSelector: FC<Props> = ({
  className,
  trigger,
  DropDownIcon = ChevronSelectorVertical,
  noLeft,
  options: list,
  allOptions,
  value,
  placeholder = '',
  onChange,
  uppercase,
  triggerClassName,
  popupClassName,
  itemClassName,
  readonly,
  showChecked,
}) => {
  const noValue = value === '' || value === undefined || value === null
  const item = allOptions ? allOptions.find(item => item.value === value) : list.find(item => item.value === value)
  const [showOption, { setFalse: setHide, toggle: toggleShow }] = useBoolean(false)
  const ref = React.useRef(null)
  useClickAway(() => {
    setHide()
  }, ref)
  return (
    <div className={cn(!trigger && !noLeft && 'left-[-8px]', 'relative select-none', className)} ref={ref}>
      {trigger
        ? (
          <div
            onClick={toggleShow}
            className={cn(!readonly && 'cursor-pointer')}
          >
            {trigger}
          </div>
        )
        : (
          <div
            onClick={toggleShow}
            className={cn(showOption && 'bg-state-base-hover', 'flex h-5 cursor-pointer items-center rounded-md pl-1 pr-0.5 text-xs font-semibold text-text-secondary hover:bg-state-base-hover')}>
            <div className={cn('text-sm font-semibold', uppercase && 'uppercase', noValue && 'text-text-tertiary', triggerClassName)}>{!noValue ? item?.label : placeholder}</div>
            {!readonly && <DropDownIcon className='w-3 h-3 ' />}
          </div>
        )}

      {(showOption && !readonly) && (
        <div className={cn('absolute top-[24px] z-10 w-[120px]  select-none rounded-lg border border-components-panel-border bg-components-panel-bg p-1 shadow-lg', popupClassName)}>
          {list.map(item => (
            <div
              key={item.value}
              onClick={() => {
                setHide()
                onChange(item.value)
              }}
              className={cn(itemClassName, uppercase && 'uppercase', 'flex items-center h-[30px] justify-between min-w-[44px] px-3 rounded-lg cursor-pointer text-[13px] font-medium text-text-secondary hover:bg-state-base-hover')}
            >
              <div>{item.label}</div>
              {showChecked && item.value === value && <Check className='text-primary-600 w-4 h-4' />}
            </div>
          ))
          }
        </div>
      )
      }
    </div>
  )
}
export default React.memo(TypeSelector)
