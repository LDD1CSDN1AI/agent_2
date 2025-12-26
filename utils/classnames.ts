import cn from 'classnames'
import { twMerge } from 'tailwind-merge'

const classNames = (...cls: cn.ArgumentArray) => {
  return twMerge(cn(cls))
  // return cn(cls)
}

export default classNames
