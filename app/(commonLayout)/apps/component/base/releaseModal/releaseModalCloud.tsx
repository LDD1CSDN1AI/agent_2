import React, { useState, useEffect } from 'react'
import { Form, Input, Modal, Select, message, Radio, TreeSelect } from 'antd'
import { useTranslation } from 'react-i18next'
import { RiQuestionLine } from '@remixicon/react'
import { getQueryParams } from '@/utils/getUrlParams'
import { pluginPublishedToPersonalSpace, publishedPersonal, agentFaBu, pluginReleaseAudit, workspaceAgentPublicAudit, workspacePublicAudit, checkPluginName } from '@/service/apps'
import type { WorkflowToolProviderRequest } from '@/app/components/tools/types'
import Tooltip from '@/app/components/base/tooltip'
import produce from 'immer'
import cn from 'classnames'
import '../createModal.scss'
import MethodSelector from '@/app/components/tools/workflow-tool/method-selector'

const { TextArea } = Input

type Props = {
  release: boolean
  appId: string | undefined
  appName?: string
  tabClick?: string | number
  isShowPublished?: boolean
  currentTab?: string
  data?: any
  fromType?: string,
  tenant_id?: string,
  parameter?: any[]
  descriptions?: string
  onClose?: () => void
  done?: (arg0: any) => void
  payload?: any
  onCreate?: (payload: WorkflowToolProviderRequest & { workflow_app_id: string }) => void
  mutate?: () => void
  listData: any
}
const CreateModal: React.FC<Props> = (props) => {
  const { listData, tabClick: tabClickValue, appId = props.appId ?? getQueryParams('app_id'), fromType: fromTypeValue, tenant_id: tenant_id_value, release, onClose, done, data = {}, payload = {}, parameter = [], descriptions = '', isShowPublished = false, currentTab = '', onCreate, mutate } = props
  const { t } = useTranslation()
  const menuType = getQueryParams('category')
  const areaPublickList = [{ value: 'publicPersonal', label: '发布到个人空间' }, { value: 'publicAudit', label: '发布到广场' },]
  const workSpacePublickList = [{ value: getQueryParams('tenant_id'), label: getQueryParams('name') }]
  const [tempValue, setTempValue] = useState('')
  const [tempValue1, setTempValue1] = useState('')
  const tenant_id = getQueryParams('tenant_id') || tenant_id_value
  const tabClick = getQueryParams('tabClick') || tabClickValue

  console.log(getQueryParams('tabClick'), tabClickValue, '---------------tabClickValue')
  const fromType = getQueryParams('fromType') || fromTypeValue
  const [release1, setRelease] = useState(release)
  const [releaseType, setReleaseType] = useState()
  const [releaseTypeId, setReleaseTypeId] = useState()
  const [parentRadioValue, setParentRadioValue] = useState<any>(isShowPublished ? 2 : null)
  const [name, setName] = useState(payload.name || payload.label || data?.name || '')
  const [emoji, setEmoji] = useState<any>(payload.icon || { content: null, background: null })
  const [labels, setLabels] = useState<string[]>(payload.labels || [])
  const [label, setLabel] = useState<string>(payload.label || data?.name || '')
  const [description, setDescription] = useState(payload.description || descriptions || '')
  const [parameters, setParameters] = useState<any[]>(payload.parameters || parameter || [])
  const [privacyPolicy, setPrivacyPolicy] = useState(payload.privacy_policy || '')

  const [selectList, setSelectList] = useState<any>([])
  // useEffect(() => {
  //   if (menuType && menuType === 'workSpaceSecondPage') {
  //     setSelectList(workSpacePublickList)
  //   }
  //   setSelectList(listData.map((item: any) => {
  //     return {
  //       value: item.tenant_id,
  //       label: item.display_name
  //     }
  //   }))
  // }, [listData, menuType])

  useEffect(() => {

    if (menuType && menuType === 'workSpaceSecondPage') {
      setSelectList(workSpacePublickList)
    }
    // setSelectList(listData.map((item: any) => {
    //   return {
    //     value: item.tenant_id,
    //     label: item.display_name
    //   }
    // }))

    const getTitleName = (vaule) => {
      switch (vaule + '') {
        case '1':
          return '发布到Agent广场';
        case '2':
          return '发布到插件广场';
        case '3':
          return '发布到工作流广场';
        case '4':
          return '发布到智能体广场';
      }
    }

    const selectListValue = listData.map((record: any) => (record.type !== 'project') && (!(record.type === 'default' && fromType === '项目空间') || fromType !== '项目空间') && ({
      value: record.tenant_id,
      label: record.tenant_name,
      title: record.type === 'public' ? getTitleName(tabClick) : record.display_name,
      type: record.type,

    })).filter(item => item);
    const projectValue = [
      {
        value: 'add',
        label: '项目空间',
        title: '项目空间',
        selectable: false,
        type: 'add',
        children: listData.map((record: any) => (record.type === 'project') && ((record.tenant_id === tenant_id && fromType === '项目空间') || fromType !== '项目空间') && ({
          value: record.tenant_id,
          label: record.tenant_name,
          title: record.tenant_name,
          type: record.type,
        })).filter(item => item)
      }
    ]
    setSelectList([...selectListValue, ...projectValue]);
  }, [listData, menuType, tabClick])

  const onSelectChange = (e: any) => {
    listData.map((item: any) => {
      if (item.tenant_id == e) {
        setReleaseType(item.type)
        setReleaseTypeId(item.tenant_id)
      }
    })
  }
  useEffect(() => {
    if (parameter.length > 0) {
      setParameters(parameter)
    }
    if (descriptions) {
      setDescription(descriptions)
    }
  }, [parameter, descriptions])

  useEffect(() => {
    setRelease(release)
  }, [release])

  const handleParameterChange = (key: string, value: string, index: number) => {
    const newData = produce(parameters, (draft: any[]) => {
      if (key === 'description')
        draft[index].description = value
      else
        draft[index].form = value
    })
    setParameters(newData)
  }
  const isNameValid = (name: string) => {
    return /^[a-zA-Z0-9_]+$/.test(name)
  }
  const PublishedSuccessfully = async () => {
    let requestParams: any = {}
    let pluginsParams: string = ''
    requestParams = {
      name,
      description,
      icon: emoji,
      label,
      parameters: parameters.map(item => ({
        name: item.name,
        description: item.description,
        form: item.form,
      })),
      labels,
      privacy_policy: privacyPolicy,
    }
    pluginsParams = JSON.stringify(requestParams)
    if (!isShowPublished && (!releaseType || (releaseType === 'default' && !tempValue1) || (releaseType === 'public' && (!tempValue1 || !tempValue)))) {
      return message.error('请填写完整信息！')
    } else if (isShowPublished && !name) {
      return message.error('请填写完整信息！')
    }
    if (requestParams.name === '' && parentRadioValue === 2) {
      return message.error('请填写插件参数后并点击‘确定’按钮')
    }
    if (!appId) {
      message.error('请先点击保存后发布')
    } else {
      if (tabClick === '2') {
        if (releaseType === 'project') {
          // 项目空间发布工具
          const param: any = {
            msg: tempValue,
            desc: tempValue1,
            workspace_id: menuType === 'workSpaceSecondPage' ? getQueryParams('tenant_id') : releaseTypeId
          }
          const res: any = await workspaceAgentPublicAudit({
            appId,
            body: param
          })

          if (res.detail == '流程已经创建，并且状态为 PENDING') {
            message.success(res.detail)
          } else if (res.result == 'success') {
            message.success('发布成功')
            mutate?.()
          } else {
            message.error('发布失败')
          }
          setRelease(false)
          onClose?.()
          return
        }
        if (releaseType === 'public') {
          const param: any = {
            msg: tempValue,
            desc: tempValue1,
          }
          // 插件发布到广场
          const res: any = await pluginReleaseAudit({
            appId,
            body: param
          })

          if (res.detail == '流程已经创建，并且状态为 PENDING') {
            message.success(res.detail)
          } else if (res.result == 'success') {
            message.success('发布成功')
            mutate?.()
          } else {
            message.error('发布失败')
          }
        }
        if (releaseType === 'default') {
          const param: any = {
            desc: tempValue1,
          }
          // 插件发布到个人空间
          const res: any = await pluginPublishedToPersonalSpace({
            appId,
            body: param
          })
          if (res.detail == '流程已经创建，并且状态为 PENDING') {
            message.success(res.detail)
          } else if (res.result == 'success') {
            message.success('发布成功')
            mutate?.()
          } else {
            message.error('发布失败')
          }
        }
      } else {
        if (releaseType === 'project') {
          const param: any = {
            msg: tempValue,
            desc: tempValue1,
            workspace_id: menuType === 'workSpaceSecondPage' ? getQueryParams('tenant_id') : releaseTypeId
          }
          if (pluginsParams) {
            param.tool_param = pluginsParams
            if (parentRadioValue === 2) {
              param.need_publish_tool = true
            } else if (parentRadioValue === 1) {
              param.need_publish_tool = false
            } else {
              param.need_publish_tool = false
            }
          }

          const res: any = await workspacePublicAudit({
            appId,
            body: param
          })
          if (res.detail == '流程已经创建，并且状态为 PENDING') {
            message.success(res.detail)
          } else if (res.result == 'success') {
            message.success('发布成功')
          } else {
            message.error('发布失败')
          }

          mutate?.()
          // done?.(res)
          setRelease(false)
          onClose?.()
          return
        }
        if (releaseType === 'default') {
          const param: any = {
            desc: tempValue1,
          }
          // agent 个人空间发布
          const res: any = await publishedPersonal({
            appId,
            body: param
          })
          if (res.detail == '流程已经创建，并且状态为 PENDING') {
            message.success(res.detail)
          } else if (res.result == 'success') {
            message.success('发布成功')
          } else {
            message.error('发布失败')
          }
          if (parentRadioValue === 2) {
            checkPluginName({
              url: '/workspaces/current/tool-provider/workflow/name/repeat',
              body: {
                tenant_id: data?.tenant_id,
                name: name,
                app_id: appId
              }
            }).then((r: any) => {
              if (r === false) {
                onCreate?.({
                  ...requestParams,
                  workflow_app_id: res.workflow_app_id
                })
              } else {
                message.error('名称已存在，请重新命名')
              }
            })
          }
          mutate?.()
          // done?.(res)
        } else if (releaseType === 'public') {
          const param: any = {
            desc: tempValue1,
            msg: tempValue
          }
          if (pluginsParams) {
            param.tool_param = pluginsParams
            param.need_publish_tool = true
          }

          // agent 广场
          const res: any = await agentFaBu({
            appId,
            body: param
          })
          if (res.detail == '流程已经创建，并且状态为 PENDING') {
            message.success(res.detail)
          } else if (res.result == 'success') {
            message.success('发布成功')
          } else {
            message.error('发布失败')
          }
          if (parentRadioValue === 2) {
            checkPluginName({
              url: '/workspaces/current/tool-provider/workflow/name/repeat',
              body: {
                tenant_id: data?.tenant_id,
                name: name,
                app_id: appId
              }
            }).then((r: any) => {
              if (r === false) {
                onCreate?.({
                  ...requestParams,
                  workflow_app_id: res.workflow_app_id
                })
              } else {
                message.error('名称已存在，请重新命名')
              }
            })
          }
          mutate?.()
          // done?.(res)
        }
        if ((menuType === 'area' || menuType === 'workSpaceSecondPage') && data.status === 'published') {
          checkPluginName({
            url: '/workspaces/current/tool-provider/workflow/name/repeat',
            body: {
              tenant_id: data?.tenant_id,
              name: name,
              app_id: appId
            }
          }).then((res: any) => {
            if (res === false) {
              onCreate?.({
                ...requestParams,
                workflow_app_id: data.id
              })
            } else {
              message.error('插件名称已存在导致发布失败，请重新命名！')
            }
          })
        }
      }
    }
    setRelease(false)
    onClose?.()
  }
  const handleCancel21 = () => {
    setRelease(false)
    onClose?.()
  }



  return (
    <Modal
      title='发布应用'
      open={release1}
      onOk={PublishedSuccessfully}
      onCancel={handleCancel21}
      width={539}
      okText='确定'
      cancelText='取消'
    >
      <div>
        <Form layout='vertical'>
          {!isShowPublished &&
            <>
              <Form.Item label='发布选择' name='workSpace' rules={[{ required: true, message: '请选择一个工作空间' }]}>
                {/* <Select placeholder='请选择一个工作空间' onChange={onSelectChange} options={selectList} /> */}
                <TreeSelect
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择一个工作空间"
                  allowClear
                  onChange={onSelectChange}
                  treeData={selectList}
                />
              </Form.Item>
              <Form.Item label='应用描述' name='name' rules={[{ required: true, message: '11111111111' }]}>
                <TextArea
                  value={tempValue1}
                  rows={5}
                  maxLength={200}
                  onChange={e => setTempValue1(e.target.value)}
                  placeholder='请输入内容'
                >
                </TextArea>
                <div className='position-absolute top-[470px] left-[300px]' >{tempValue1.length}/200</div>
              </Form.Item>
              {
                releaseType === "default" ?
                  null : <Form.Item label='申请原因' name='description' rules={[{ required: true, message: '请输入申请原因' }]}>
                    <TextArea
                      value={tempValue}
                      rows={5}
                      maxLength={200}
                      onChange={e => setTempValue(e.target.value)}
                      placeholder='请输入内容'
                    >
                    </TextArea>
                    <div className='position-absolute top-[470px] right-[50px]' >{tempValue.length}/200</div>
                  </Form.Item>
              }
              {
                currentTab === 'workflow' && tabClick === '3' ? <Form.Item>
                  <Radio.Group onChange={(e: any) => { setParentRadioValue(e.target.value) }} value={parentRadioValue}>
                    <Radio value={1}>发布仅体验</Radio>
                    <Radio value={2}>发布可被Agent调用</Radio>
                  </Radio.Group>
                </Form.Item> : null
              }
            </>
          }
          <Form.Item>
            {
              parentRadioValue === 2 ? <div>
                {/* name for tool call */}
                <div>
                  <div className='flex items-center py-2 leading-5 text-sm font-medium text-gray-900'>
                    {t('tools.createTool.nameForToolCall')}
                    <Tooltip
                      htmlContent={
                        <div className='w-[180px]'>
                          {t('tools.createTool.nameForToolCallPlaceHolder')}
                        </div>
                      }
                      selector='workflow-tool-modal-tooltip'
                    >
                      <RiQuestionLine className='ml-2 w-[14px] h-[14px] text-gray-400' />
                    </Tooltip>
                  </div>
                  <input
                    type='text'
                    className='w-full h-10 px-3 text-sm font-normal bg-gray-100 rounded-lg border border-transparent outline-none appearance-none caret-primary-600 placeholder:text-gray-400 hover:bg-gray-50 hover:border hover:border-gray-300 focus:bg-gray-50 focus:border focus:border-gray-300 focus:shadow-xs'
                    placeholder={t('tools.createTool.nameForToolCallPlaceHolder')!}
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                  {!isNameValid(name) && (
                    <div className='text-xs leading-[18px] text-[#DC6803]'>{t('tools.createTool.nameForToolCallTip')}</div>
                  )}
                </div>
                {/* description */}
                <div>
                  <div className='py-2 leading-5 text-sm font-medium text-gray-900'>{t('tools.createTool.description')}</div>
                  <textarea
                    className='w-full h-10 px-3 py-2 text-sm font-normal bg-gray-100 rounded-lg border border-transparent outline-none appearance-none caret-primary-600 placeholder:text-gray-400 hover:bg-gray-50 hover:border hover:border-gray-300 focus:bg-gray-50 focus:border focus:border-gray-300 focus:shadow-xs h-[80px] resize-none'
                    placeholder={t('tools.createTool.descriptionPlaceholder') || ''}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>
                {/* Tool Input  */}
                <div>
                  <div className='py-2 leading-5 text-sm font-medium text-gray-900'>{t('tools.createTool.toolInput.title')}</div>
                  <div className='rounded-lg border border-gray-200 w-full overflow-x-auto'>
                    <table className='w-full leading-[18px] text-xs text-gray-700 font-normal'>
                      <thead className='text-gray-500 uppercase'>
                        <tr className='border-b border-gray-200'>
                          <th className="p-2 pl-3 font-medium w-[156px]">{t('tools.createTool.toolInput.name')}</th>
                          <th className="p-2 pl-3 font-medium w-[102px]">{t('tools.createTool.toolInput.method')}</th>
                          <th className="p-2 pl-3 font-medium">{t('tools.createTool.toolInput.description')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parameters.map((item: any, index: any) => (
                          <tr key={index} className='border-b last:border-0 border-gray-200'>
                            <td className="p-2 pl-3 max-w-[156px]">
                              <div className='text-[13px] leading-[18px]'>
                                <div title={item.name} className='flex'>
                                  <span className='font-medium text-gray-900 truncate'>{item.name}</span>
                                  <span className='shrink-0 pl-1 text-[#ec4a0a] text-xs leading-[18px]'>{item.required ? t('tools.createTool.toolInput.required') : ''}</span>
                                </div>
                                <div className='text-gray-500'>{item.type}</div>
                              </div>
                            </td>
                            <td>
                              {item.name === '__image' && (
                                <div className={cn(
                                  'flex items-center gap-1 min-h-[56px] px-3 py-2 h-9 bg-white cursor-default',
                                )}>
                                  <div className={cn('grow text-[13px] leading-[18px] text-gray-700 truncate')}>
                                    {t('tools.createTool.toolInput.methodParameter')}
                                  </div>
                                </div>
                              )}
                              {item.name !== '__image' && (
                                <MethodSelector value={item.form} onChange={value => handleParameterChange('form', value, index)} />
                              )}
                            </td>
                            <td className="p-2 pl-3 text-gray-500 w-[236px]">
                              <input
                                type='text'
                                className='grow text-gray-700 text-[13px] leading-[18px] font-normal bg-white outline-none appearance-none caret-primary-600 placeholder:text-gray-300'
                                placeholder={t('tools.createTool.toolInput.descriptionPlaceholder')!}
                                value={item.description}
                                onChange={e => handleParameterChange('description', e.target.value, index)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div> : null
            }
          </Form.Item>

        </Form>
      </div >
    </Modal >
  )
}
export default CreateModal
