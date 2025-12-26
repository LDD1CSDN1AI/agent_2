import React, { useEffect, useState } from 'react'
import { Button } from 'antd';

type Props = {
  list?: Array
  active?: string | number
  size?: string 
}

const RadioButton: React.FC<Props> = (props) => {

  const { list, active, size } = props
  const setActive = (key) => {
    props.setActive(key)
  }

  return (
    <>
      {
        list.map(item => <Button
          key={item.key}
          size={size || 'default'}
          style={{
            marginRight: '16px',
            color: item.key === active ? '#3470f6' : '#5b5b5b',
            background: item.key === active ? 'rgba(102, 145, 246, .3)' : '#f8f8f8',
            border: 'none'
          }}
          onClick={() => setActive(item.key)}>{item.label}
        </Button>)
      }
    </>
  )
}

export default RadioButton;