import React, { useEffect, useImperativeHandle, useState } from 'react'
import Search from 'antd/es/input/Search'
import Image from 'next/image'
import { useRequest } from 'ahooks'
import { Select } from 'antd'
import { CloseCircleFilled } from '@ant-design/icons'
import memberIcon from '../../../../assets/image/member-icon.png'
import styles from './style.module.scss'
import { fetchAllUser } from '@/app/(commonLayout)/apps/component/ProjectSpace/member/service'
import type { ResultAccountList } from '@/models/log'
import type { ProjectAccountType } from '@/app/(commonLayout)/apps/component/ProjectSpace/member/interface'
import { getQueryParams } from '@/utils/getUrlParams'

export type MemberSelectorInstance = {
  clearSelectedMember: () => void
}

type Props = {
  proRef?: React.MutableRefObject<MemberSelectorInstance | undefined>
  onChange?: (list: ProjectAccountType[]) => void
  value?: ResultAccountList[]
}

const options = [
  { label: '普通用户', value: 'normal', title: '1，创建/编辑智能体工作流\n2，发布应用，应用需经过创建者/管理员审批。' },
  { label: '管理员', value: 'admin', title: '1、成员管理：可在项目空间中添加新成员或删除已经添加的成员。（普通用户无法在项目空间中添加/删除成员\n2、解散项目：可解散项目空间，空间中的智能体/插件/工作流等会被删除，项目成员被移出，解散操作不可撤销\n3、应用审批：对项目中申请发布的应用进行审核\n4、其它普通用户具有的权限如智能体、工作流创建、编辑等' },
  // { label: '编辑人员', value: 'editor', title: '编辑人员' },
  { label: '创建者', value: 'owner', title: '1，成员管理：可在项目空间中添加新成员或删除已经添加的成员。（普通用户无法在项目空间中添加/删除成员\n2，解散项目：可解散项目空间，空间中的智能体/插件/工作流等会被删除，项目成员被移出，解散操作不可撤销\n3，应用审批：对项目中申请发布的应用进行审核\n4，其它普通用户具有的权限如智能体、工作流创建、' },
]


const MemberSelector: React.FC<Props> = (props) => {
  const { onChange, proRef } = props
  const [selectedList, setSelectedList] = useState<ProjectAccountType[]>([])
  const { data: list = [], run: fetchUser } = useRequest(async (key: string) => {
    try {
      const response = await fetchAllUser({ tenant_id: getQueryParams('tenant_id'), name: key })
      return response !== null ? response : []
    } catch (e) {
      return []
    }
  })

  function search(key: string) {
    fetchUser(key)
  }

  function hasSelected(member: ResultAccountList) {
    return selectedList.findIndex(item => item.account_id === member.id) >= 0
  }

  function deleteMember(id: string) {
    setSelectedList(prev => prev.filter(item => item.account_id !== id))
  }

  function toggleMember(member: ResultAccountList) {
    const index = selectedList.findIndex(item => item.account_id === member.id)
    if (index >= 0) {
      deleteMember(member.id)
    } else {
      const temp: ProjectAccountType = {
        account_id: member.id,
        role: 'normal',
        name: member.name,
        employee_number: member.employee_number,
      }
      setSelectedList(prev => [...prev, temp])
    }
  }

  function changeRole(role: ProjectAccountType['role'], id: string) {
    setSelectedList(prev => prev.map(item =>
      item.account_id === id ? { ...item, role } : item
    ));
  }

  function clearSelectedMember() {
    setSelectedList([])
  }

  useImperativeHandle(proRef, () => ({
    clearSelectedMember,
  }))

  useEffect(() => {
    onChange?.(selectedList)
  }, [selectedList])

  return (
    <article className={`${styles.memberSelector} w-[800px] h-[400px] p-3 flex justify-between gap-4`}>
      <section className="flex-1 relative">
        <Search placeholder="搜索人力编码或者用户名" onSearch={search} width={300} />

        {
          list.length > 0
          && <ul
            className="list-none shadow-lg w-full h-80 rounded absolute top-12 p-2 overflow-y-scroll border-[1px] border-solid border-[#D8DCE6]">
            {
              list.map(item =>
                <li
                  key={item.id}
                  className={`rounded px-2.5 py-2 mb-2 flex items-center cursor-pointer hover:bg-[#EEEEEE] ${hasSelected(item) && 'bg-[#EEE]'}`}
                  onClick={() => toggleMember(item)}
                >
                  <Image alt="" src={memberIcon} className="size-6 mr-2" />
                  <h3 className="text-base text-[#1C2748] mr-4 w-10">{item.name}</h3>
                  <p className="text-[#acafbc]">{item.employee_number}</p>
                </li>)
            }
          </ul>
        }
      </section>

      <div className="w-[1px] h-full bg-[#D7D7D7]" />

      <section className="flex-1">
        <h2 className="text-[#1C2748] mb-2 text-lg">已选定人员({selectedList.length}/50)</h2>
        <ul className="list-none m-0 h-80 overflow-y-scroll">
          {
            selectedList.map(item =>
              <li
                key={item.account_id}
                className="rounded px-2.5 py-2 mb-2 flex items-center justify-between border-b-[1px] border-solid border-[#D8DCE6]"
              >
                <Image alt="" src={memberIcon} className="size-6 mr-2" />
                <h3 className="text-base w-10 text-[#1C2748] mr-2">{item.name}</h3>
                <p className="text-[#acafbc] mr-4">{item.employee_number}</p>
                <Select
                  defaultValue={item.role}
                  className="flex-1 mr-4"
                  options={options}
                  onChange={role =>
                    changeRole(role, item.account_id)
                  }
                />
                <CloseCircleFilled
                  onClick={() => deleteMember(item.account_id)}
                  className="text-[#EEEEEE] hover:text-[#216eff] text-xl cursor-pointer" />
              </li>)
          }
        </ul>
      </section>
    </article>
  )
}

export default MemberSelector
