import React, { FC, useState, useEffect } from 'react'
import { Select, Input, Form, Button, Flex, List, Modal, Pagination, Segmented, Space } from 'antd'
import { fetchDcoosList } from '@/service/common'
import { getTenantDetail, getUserStudyBaseList, verifySceneEncoding } from "@/service/apps";
import { DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { NodePanelProps } from '@/app/components/workflow/types'
import type { RAGNodeType } from './types'
import useSWR from 'swr'
import useConfig from './use-config'
import Editor from './components/editor';
import Toast from '@/app/components/base/toast'
import './panel.css'
import { Upload, message } from 'antd';
import { getQueryParams } from '@/utils/getUrlParams';
import { ArrowNarrowLeft } from '@/app/components/base/icons/src/vender/line/arrows'
import { useAppContext } from '@/context/app-context'
import { get‌Assistant‌List } from '@/service/tools'
import Switch from '@/app/components/base/switch';
const Panel: FC<NodePanelProps<RAGNodeType>> = ({
  id,
  data,
}) => {
  const {
    inputs,
    availableVars,
    availableNodesWithParent,
    handleSelectChange,
    handleIsChart,
    handleParamsChange,
    handleCreateType,
    handleProvChange,
    handleQueryChange,
  } = useConfig(id, data)
  const { userProfile }: any = useAppContext()

  const [form] = Form.useForm();
  const [passwordVisible, setPasswordVisible] = useState('text')
  const [toastTitle, setToastTitle] = useState('')
  const [loading, setLodaing] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [options, setOptons] = useState([])
  const [RAGTypeList, setRAGTypeList] = useState([])
  const [userInput, setUserInput] = useState('')
  const { data: dcoosList } = useSWR(`/get-region-list`, fetchDcoosList)
  const [fileName, setFileName] = useState<string | null>(null);  // 存储文件名
  const [file, setFile] = useState<any>(null);  // 存储文件对象

  const [knowledgeValue, setKnowledgeValue] = useState<any>([])
  const [konwledgeShowTab, setKonwledgeShowTab] = useState('生产知识库')
  const [knowledgeModal, setKnowledgeModal] = useState<boolean>(false)
  const [knowledgeResult, setKnowledgeResult] = useState<any>([])
  const [limit, setLimit] = useState<number>(5)
  const [current, setCurrent] = useState<number>(1)
  const [jobTypeName, setJobTypeName] = useState<string>('')
  const [knowledgeArray, setKnowledgeArray] = useState<any>([])


  const changeResultRows = (code: string, is_chart: boolean) => {
    const newRows = knowledgeResult?.rows?.map(item => {
      if (item.ragName === code) {
        item.is_chart = is_chart;
      };
      return item;
    });
    if (code === knowledgeValue?.[0]?.self_build_rag?.ragName) {
      setKnowledgeValue([]);
    }
    setKnowledgeResult({ ...knowledgeResult, rows: newRows });
  }

  const selectKnowledge = (obj?: any) => {
    handleSelectChange(obj?.jobTypeCode || '');
    handleCreateType(obj);
    setKnowledgeArray(obj ? [obj] : [])
  }

  useEffect(() => {
    let arr: any = []
    if (dcoosList) {
      Object.entries(dcoosList).map((item: any) => {
        arr.push({
          label: item[0],
          value: item[1]
        })
      })
      setOptons(arr)
    }
    getRAGTypeList();
  }, [dcoosList])

  const handleFileChange = (info: any) => {
    if (info.fileList && info.fileList.length > 0) {
      // 获取文件名称
      const file = info.fileList[info.fileList.length - 1].originFileObj;
      if (file) {
        setFile(file);
        setFileName(file.name);  // 更新文件名称
      }
    }
  };

  const getRAGTypeList = async () => {

    // try {
    //   const response: any = await getUserStudyBaseList({
    //     url: 'kb_list',
    //     body: {
    //       tenant_id: getQueryParams('tenant_id')
    //     }

    //   })

    //   const result = await response
    //   if (result.status === "successful") {
    //     const timer = setTimeout(() => {
    //       setRAGTypeList((result.kb_list || []).map(record => ({ label: record.kb_name, value: record.kb_id })));
    //     }, 100)
    //   } else {
    //     message.error('查询失败')
    //     // localStorage.setItem('console_token', '')
    //   }
    // } catch (error) {
    //   message.error('请求失败，请检查网络或稍后重试')
    //   console.error('请求错误:', error)

    // }
  }

  // 提交表单时处理文件上传
  const handleSubmit = async (values: any) => {
    const jobTypeName = values.job_type_name;
    if (!file) {
      message.error('请先上传文件');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);  // 将文件添加到 FormData
    formData.append('job_type_name', jobTypeName);  // 将任务类型名称添加到 FormData
    setLodaing(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_PREFIX}/upload_file_for_rag`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("上传成功: ", data);
        message.success('文件上传成功！');
        setPasswordVisible('password');
        console.log("inputs.job_type_name:", jobTypeName);
        setUserInput(jobTypeName);
      } else {
        setPasswordVisible('text')
        message.error('文件上传失败');
      }
    } catch (e) {
      message.error('上传出错，请重试');
    } finally {
      setLodaing(false)
    }
  };



  const verifySceneEncodingFun = async (name: string) => {
    setLodaing(true)
    try {
      await verifySceneEncoding({
        url: `/check-assistant-code?name=${name}`,
      }).then((data: any) => {
        const key = Object.keys(data)[0]
        if (key) {
          setLodaing(false)
          setPasswordVisible('password')
          setToastTitle('匹配完成')

          handleSelectChange(key, form.getFieldValue('job_type_name'))
        } else {
          setLodaing(false)
          setPasswordVisible('text')
          setToastTitle('匹配失败')
          Toast.notify({
            type: 'error',
            message: '任务类型名称错误',
          })
        }
      })
    } catch (e) {
      Toast.notify({
        type: 'error',
        message: '验证RAG场景编码接口调用失败',
      })
    }
  }

  useEffect(() => {
    (
      async () => {
        getKnowledgeArray()
      }
    )()
  }, [])

  const getKnowledgeArray = async (current1?: any, limit1?: any, konwledgeShowTab1?: any) => {
    const currentValue = current1 || current
    const limitValue = limit1 || limit
    const konwledgeShowTabValue = konwledgeShowTab1 || konwledgeShowTab;
    current1 ? setCurrent(current1) : '';
    limit1 ? setLimit(limit1) : '';
    konwledgeShowTab1 ? setKonwledgeShowTab(konwledgeShowTab1) : '';
    const ip = konwledgeShowTabValue === '生产知识库' ? 'https://10.141.179.170:20085/' : 'https://10.141.179.170:20091/';
    const result: any = await get‌Assistant‌List(ip, { jobTypeName: jobTypeName, createBy: userProfile?.employee_number, pageNum: currentValue, pageSize: limitValue });
    if (result?.code + '' !== '200') {//|| result?.total <= 0
      return;
    }

    const newRows = result?.rows?.map(item => {
      item.is_personal = konwledgeShowTabValue === '生产知识库' ? 'false' : 'true';
      if (item.ragName === knowledgeValue?.self_build_rag?.ragName) {
        item.is_chart = knowledgeValue?.self_build_rag?.is_chart || undefined;
      };
      return item;
    });
    result.rows = newRows;
    console.log("---------------->newRows", newRows)
    setKnowledgeResult(result);
  }

  useEffect(() => {
    getKnowledgeArray()
  }, [current, limit, jobTypeName])

  const goTo = async () => {
    const consoleTokenFromLocalStorage = localStorage?.getItem('windowsToken')
    const category = getQueryParams('category');
    const tenantId = getQueryParams('tenant_id')
    const res: any = category !== 'area' && await getTenantDetail({ appId: tenantId })

    const param = {
      Authorization: consoleTokenFromLocalStorage,
      isRep: '0', //字典值：1代表查重，0代表不查重
      isPer: category === 'area' ? '1' : '0', //字典值：1代表个人空间，0代表项目空间
      createBy: category === 'area' ? '' : (res?.accounts?.map((record: any) => record.employee_number).join(';') || ''), //个人空间不需要这个字段
    }
    let url = `https://10.141.179.170:20082/knowledgebase?menu=ragClean&Authorization=${param.Authorization}&isPer=${param.isPer}&isRep=${param.isRep}`
    if (category !== 'area') {
      url = url + '&createBy=' + param.createBy
    }
    //history.pushState(null, '', url)
    window.location.href = url
  }

  return (
    <div className='mt-2 mb-2 px-4 space-y-4'>
      {
        localStorage.getItem("platform") === 'shufa'
          ? <div className='flex' style={{ flexDirection: 'column' }}>
            <div className='text-base mr-2.5' style={{
              fontSize: '13px',
              color: 'rgb(71 84 103 / var(--tw-text-opacity))',
              marginBottom: '8px',
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <p>选择知识库:</p>
              {/* <p style={{ cursor: !showContent ? 'pointer' : 'no-drop', color: !showContent ? 'rgb(21,94,239)' : 'gray' }}
            onClick={() => {
              setShowContent(true)
              setUserInput(inputs.user_select_scene)
            }}>+配置自建RAG</p> */}
            </div>
            <Select
              disabled={showContent}
              className='flex-1'
              placeholder='选择RAG场景类型'
              style={{ width: '100%' }}
              value={inputs.job_type_name !== '' ? inputs.job_type_name : (toastTitle === '匹配完成' ? form.getFieldValue('job_type_name') : inputs.user_select_scene)}
              onChange={(e: any) => handleSelectChange(e, '')}
              options={
                RAGTypeList
                //   [
                //   { value: '2', label: '综维知识助手' },
                //   { value: '3', label: '无线网优知识助手' },
                //   { value: '7', label: '装维知识助手' },
                //   { value: '8', label: '规章制度助手' },
                //   { value: '9', label: 'IT运维知识助手' },
                //   { value: '11', label: '无线故障处置助手' },
                //   { value: '13', label: '统一/通用知识助手' },
                // ]
              }
            />
          </div>
          : <div className='mt-4 text-sm font-semibold text-gray-800'>
            <div>知识库选择
              <a onClick={goTo} style={{ float: 'right', fontSize: '12px', fontWeight: '500', color: 'rgb(27, 102, 255)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>去创建知识库<ArrowNarrowLeft className='w-3 h-3 rotate-180' /></div>
              </a>
            </div>
            <Input placeholder='未配置知识库,请选择' allowClear onClear={() => selectKnowledge(undefined)} prefix={<Space>
              <SearchOutlined onClick={() => setKnowledgeModal(true)} />
              {/* <CloseCircleOutlined onClick={() => setKnowledgeValue([])} /> */}
            </Space>
            } value={knowledgeArray?.[0]?.jobTypeName || inputs?.self_build_rag?.jobTypeName || ''} />
          </div>
      }
      {showContent &&
        <div style={{ marginTop: '25px', position: 'relative' }}>
          <Form
            form={form}
            onFinish={(values) => {

              handleSubmit(values)
            }}
            onReset={() => {
              form.resetFields()
              setShowContent(false)
              setLodaing(false)
              setToastTitle('')
              setPasswordVisible('text')
              handleSelectChange(userInput, inputs.job_type_name)
            }}
          >
            <Form.Item name='job_type_name' rules={[{ required: true, message: '请填写任务类型名称' }]}>
              <label style={{ fontSize: '13px' }}>
                <div style={{ marginBottom: '8px', display: 'flex' }}>
                  <p>任务类型名称:</p>
                  {toastTitle === '' ? null : <p style={toastTitle === '匹配完成' ? { color: ' ', marginLeft: '10px' } : { color: 'red', marginLeft: '10px' }}>{toastTitle}</p>}
                </div>
                <Input />
              </label>
            </Form.Item>

            <Form.Item name='file_upload' label='选择文件' rules={[{ required: true, message: '请上传文件' }]}>
              <Upload
                accept='.pdf,.docx' // 限制上传文件的格式
                beforeUpload={(file) => {
                  const isPdfOrDocx = file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                  if (!isPdfOrDocx) {
                    message.error('只能上传PDF或DOCX文件');
                  }
                  return isPdfOrDocx; // 只有文件类型是PDF或DOCX才会允许上传
                }}
                onChange={handleFileChange} // 监听文件选择变化
                showUploadList={false}
              >
                <Button>{fileName || '选择PDF/DOCX文件'}</Button>
              </Upload>
            </Form.Item>



            {/* <Form.Item name='user_select_scene' rules={[{ required: true, message: '请填写任务类型编码' }]}>
              <label style={{ fontSize: '13px' }}>
                <div style={{ marginBottom: '8px', display: 'flex' }}>
                  <p>任务类型编码:</p>
                  {toastTitle === '匹配完成' ? <p style={{ marginLeft: '10px' }}> <DeleteOutlined
                    onClick={() => {
                      form.resetFields()
                      setLodaing(false)
                      setToastTitle('')
                      setPasswordVisible('text')
                      handleSelectChange(userInput, '')
                    }} style={{ cursor: 'pointer' }} /></p> : null}
                </div>
                <Input type={passwordVisible} />
              </label>
            </Form.Item> */}
            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <Button htmlType='submit' type='primary' loading={loading}>{loading ? '上传中' : '确定'}</Button>
                <Button htmlType='reset'>取消</Button>
              </div>
            </Form.Item>
          </Form>
          {
            loading && <div className='dots'>上传中</div>
          }
        </div>
      }
      <div>
        <div className='text-base mr-2.5' style={{ fontSize: '13px', color: 'rgb(71 84 103 / var(--tw-text-opacity))', marginBottom: '8px' }}>用户查询知识库的问题</div>
        <Editor
          // value={inputs.query}
          instanceId={'query'}
          value={inputs.query}
          onChange={handleQueryChange}
          nodesOutputVars={availableVars}
          availableNodes={availableNodesWithParent}
        />
      </div>
      <div>
        <div className='text-base mr-2.5' style={{ fontSize: '13px', color: 'rgb(71 84 103 / var(--tw-text-opacity))', marginBottom: '8px' }}>额外参数</div>
        <Editor
          value={inputs.params}
          instanceId={'params'}
          onChange={handleParamsChange}
          nodesOutputVars={availableVars}
          availableNodes={availableNodesWithParent}
        />
      </div>
      <div>

        {/* <div className='text-base mr-2.5' style={{ fontSize: '13px', color: 'rgb(71 84 103 / var(--tw-text-opacity))', marginBottom: '8px' }}>省份编码</div> */}
        {/* {options &&
          <Select
            placeholder="请输入省份编码"
            onChange={(e: any) => {
              handleProvChange(e)
            }}
            value={inputs.prov}
            showSearch
            style={{ width: '100%' }}
            options={options}
            optionFilterProp="label"
          />
        } */}
      </div>
      <Modal
        title={'选择知识库'}
        open={knowledgeModal}
        onOk={() => setKnowledgeModal(false)}
        width={'720px'}
        onCancel={() => setKnowledgeModal(false)}
        footer={null}
      >
        <div>
          <Flex justify='center' >
            <Segmented
              onChange={(e) => getKnowledgeArray(0, 5, e)}
              options={[
                {
                  label: '生产知识库',
                  value: '生产知识库'
                }, {
                  label: '个人知识库',
                  value: '个人知识库'
                }
              ]}
            />
          </Flex>
          <Input onPressEnter={(e) => setJobTypeName(e?.target?.value)} style={{ maxWidth: '360px', margin: '16px 4px 0 4px' }} size='small' placeholder='请输入知识库名称查找' />
          <List
            dataSource={knowledgeResult.rows}
            header={
              <table>
                <thead className="">
                  <tr>
                    <td width={360}>任务类型</td>
                    <td width={80}>省份</td>
                    <td width={360}>是否开启知识图谱检索</td>
                    <td width={80}>操作</td>
                  </tr>
                </thead>
              </table>
            }
            renderItem={(item) => {
              return (
                <List.Item>
                  <table className={` min-w-[440px] w-full max-w-full border-collapse border-1 rounded-lg text-sm`}>

                    <tbody className="text-gray-700 border-gray-200 mineTbody">
                      <tr>
                        <td width={360}>{item?.jobTypeName}</td>
                        <td width={80}>{item?.regionName}</td>
                        <td width={360}>
                          <Switch defaultValue={item.ragName === (knowledgeArray?.[0]?.ragName || inputs?.self_build_rag?.ragName) ? (knowledgeArray?.[0]?.is_chart || inputs?.self_build_rag?.is_chart) : false} onChange={e => {
                            changeResultRows(item?.ragName, e);
                            item.ragName === (knowledgeArray?.[0]?.ragName || inputs?.self_build_rag?.ragName) ? handleIsChart(e) : '';

                            if (item.ragName === (knowledgeArray?.[0]?.ragName || inputs?.self_build_rag?.ragName)) {
                              handleSelectChange(item?.jobTypeCode, ''); selectKnowledge(item);
                            }
                          }} size={'md'} />
                        </td>
                        <td width={80}>
                          {
                            item.ragName === (knowledgeArray?.[0]?.ragName || inputs?.self_build_rag?.ragName) ?
                              <a style={{ color: 'green' }} onClick={(e) => { handleSelectChange('', ''); selectKnowledge(item); setKnowledgeModal(false); }}><PlusOutlined />已添加</a>
                              :
                              <a onClick={(e) => { handleSelectChange(item?.jobTypeCode, ''); selectKnowledge(item); setKnowledgeModal(false); }}><PlusOutlined />添加</a>
                          }
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </List.Item>
              )
            }}
            footer={<Space>
              <Pagination hideOnSinglePage showQuickJumper showTotal={() => `共有${knowledgeResult.total}条`} pageSize={limit} current={current} total={knowledgeResult?.total} onChange={(page, pageSize) => { setLimit(pageSize); setCurrent(page); }} />
            </Space>
            }
          />
        </div>
      </Modal>
    </div >
  )
}

export default React.memo(Panel)
