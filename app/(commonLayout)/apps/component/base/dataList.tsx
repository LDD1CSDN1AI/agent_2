import React from 'react'
import { Table } from 'antd'

type Props = {
    dataSource: any
    onClose: () => void
    columns: any,
    dataList: string
}
const dataList: React.FC<Props> = (props) => {
    const { onClose, dataSource, columns, dataList } = props

    return (

        <>
            {
                dataList==='个人空间' ? <div className='w-[700px] h-[480pxpx] bg-white ' style={{ position: 'absolute', top: "80px", right: "74px", border: "solid 1px #ccc", borderRadius: "10px", zIndex: '999999' }}>
                    <div style={{ padding: '20px' }}>
                        <div className='h-[40px]mt-[20px] flex justify-between  mb-[15px] fontSize-[16px] whitespace-nowrap ' style={{ fontWeight: "800", color: "#000" }}>
                            <h1>历史记录</h1>
                            <h1 style={{ cursor: 'pointer' }} onClick={() => onClose()}>X</h1>
                        </div>
                        <Table dataSource={dataSource} columns={columns} />
                    </div>
                </div > : ''
            }
            {
                dataList === 'API管理' ?

                        <Table dataSource={dataSource} columns={columns} />
                  : ''
            }
        </>
    )
}
export default dataList
