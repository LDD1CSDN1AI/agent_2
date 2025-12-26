'use client'
import type { FC } from 'react'
import React, { useState } from 'react'
import { Steps, Upload, Radio, Button, message, Row, Col, Select, Slider, InputNumber, Input } from 'antd'
import { UploadOutlined, PlusOutlined, LineChartOutlined, LoadingOutlined, CheckCircleFilled, MinusCircleOutlined, PlusCircleOutlined, CheckCircleTwoTone } from '@ant-design/icons'
import upfileImg from '@/public/image/upfileImg.png'
import createConfigImg from '@/public/image/createConfig.png'
import createConfigHighImg from '@/public/image/createConfigHigh.png'
import dataFixImg from '@/public/image/dataFix.png'
import dataFixHighImg from '@/public/image/dataFixHigh.png'
import uploadImg from '@/public/image/uploadImg.png'
import wordImg from '@/public/image/fileicon.png'
import type { UploadFile } from 'antd/es/upload/interface'
import { submitStudyBase } from '@/service/tools'

import styles from './styles.module.css'
import GlobalUrl from '@/GlobalUrl'
import { log } from 'node:console'

const AppDetail: FC = (props) => {
  const [current, setCurrent] = useState(0)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [parseStrategy, setParseStrategy] = useState('quick')
  const [loading, setLoading] = useState(false)
  const [autoSelectType, setAutoSelectType] = useState('')
  const [autoSliderNumber, setAutoSliderNumber] = useState(32000)
  const [customSplitChar, setCustomSplitChar] = useState(''); // 存储自定义分隔符
  const [showCustomInput, setShowCustomInput] = useState(false); // 控制是否显示自定义输入框
  const [autoInputNumber, setAutoInputNumber] = useState(10)
  const [segmentStrategy, setSegmentStrategy] = useState('auto')
  const [submitStatus, setSubmitStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [stat, setStat] = useState([]);
  const getStepIcon = (step: number) => {
    switch (step) {
      case 0:
        return <img src={upfileImg.src} alt="upload" className={styles['step-icon']} />;
      case 1:
        return <img
          src={current >= 1 ? createConfigHighImg.src : createConfigImg.src}
          alt="config"
          className={styles['step-icon']}
        />;
      case 2:
        return <img
          src={current >= 2 ? dataFixHighImg.src : dataFixImg.src}
          alt="data"
          className={styles['step-icon']}
        />;
      default:
        return null;
    }
  };

  const steps = [
    {
      title: '1上传',
      icon: getStepIcon(0)
    },
    {
      title: '2创建设置',
      icon: getStepIcon(1)
    },
    {
      title: '3数据处理',
      icon: getStepIcon(2)
    }
  ]

  // 处理文件上传
  const handleFileChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList)
    console.log("fileList: handleFileChange", fileList);

  }

  let timer = null;

  const handleNextTimer = () => {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      handleNext()
    }, 100);
  }

  const handleNext = async () => {
    console.log("fileList: handleNext", fileList);
    console.log("current:", current);
    // 第一步：检查是否有文件
    if (current === 0) {
      if (fileList.length === 0) {

        message.error('请先上传文件')
        return
      }
      await setCurrent(current + 1)
    }
    // 第二步：提交处理
    else if (current === 1) {
      // try {

      if (loading) {
        message.info('处理中，请等待')
        return;
      }
      await setLoading(true);
      const { selectedRow, fromSource, tenant_id } = props as any;
      try {
        const formData = new FormData();
        // console.log(fileList, '------------------fileList')
        fileList.map(file => formData.append('files', file.originFileObj as File));
        formData.append('split_char', autoSelectType);
        formData.append('max_length', autoSliderNumber + '');

        if (autoSelectType === "自定义") {
          formData.append('custom_split_char', customSplitChar);
        }

        formData.append('overlap_rate', (autoInputNumber ? autoInputNumber / 100 : autoInputNumber) + '');
        if (fromSource === 'workSpaceSecondPage') {
          formData.append('tenant_id', tenant_id);
        }
        formData.append('kb_id', selectedRow.studyBaseId);//selectedRow.studyBaseId
        let param = GlobalUrl.defaultUrlIp + '/console/api';

        // if (process.env.NEXT_PUBLIC_API_PREFIX) {
        //   param = process.env.NEXT_PUBLIC_API_PREFIX;
        // }
        // else if (process.environment.NEXT_PUBLIC_API_PREFIX) {
        //   param = process.environment.NEXT_PUBLIC_API_PREFIX;
        // }
        console.log(param, 'process.env.NEXT_PUBLIC_API_PREFIX');
        const response = await fetch(`${param}/upload_file`, {
          method: 'POST',
          headers: {
            'Authorization': localStorage.getItem('console_token')//, // 添加 Token
            // 'Content-Type': 'multipart/form-data', // 不要手动设置，浏览器会自动添加
          },
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          // states = result.rag_response.status
          console.log('<<<<<<<<<<<<<<result>>>>>>>>>>>>>>:', result);
          setStat(result.rag_response.files)
          result.rag_response.files.forEach(element => {
            if (element.status == "success") {
              message.success('文件上传成功');
            } else {
              message.error('文件上传失败');
            }
          });
          setCurrent(current + 1)
          setLoading(false);
          // if (result.rag_response.status == "successful") {
          //   // message.success('文件上传成功');
          //   // console.log('上传结果:', result);
          //   setCurrent(current + 1)
          //   setLoading(false);
          // } else {
          //   // message.error('文件上传失败');
          //   // console.log('上传结果:', result);
          //   setCurrent(current + 1)
          //   setLoading(false);
          //   // const errorData = await response.json();
          //   // message.error(`文件上传失败: ${errorData.detail || '未知错误'}`);
          //   // setLoading(false);
          // }
        }
      } catch (error) {
        message.error('请求失败，请检查网络或稍后重试');
        console.error('上传错误:', error);
        setLoading(false);
      }



    }



  }

  const handlePrev = () => {
    setCurrent(current - 1)
  }

  const renderProcessingFile = (file) => {
    if (!file) return null;
    const fileName = file.name;
    const fileSize = file.size ? `${(file.size / 1024).toFixed(1)}kb` : '';
    console.log('上传结果<<<<<<<<<<<<', file);
    let iconClassname = ""
    let iconClass = ""
    let icontext = ""
    stat.forEach(element => {
      if (element.file_name == file.name) {
        iconClassname = element.status == "success" ? styles['success-icon'] : styles['error-icon'];
        iconClass = element.status == "success" ? "#00B42A" : "#963a23";
        icontext = element.status == "success" ? "处理完成" : "处理失败";
      }
    });

    return (
      <div className={styles['file-item']}>
        <div className={styles['file-icon']}>
          <img src={wordImg.src} alt="word" />
        </div>
        <div className={styles['file-info']}>
          <div className={styles['file-name']}>{fileName}</div>
          {fileSize && <div className={styles['file-size']}>{fileSize}</div>}
        </div>
        <div className={styles['file-status']}>
          {/* {submitStatus === 'loading' && <LoadingOutlined className={styles['loading-icon']} />}
          {submitStatus === 'success' && (
            <>
              <CheckCircleFilled className={styles['success-icon']} />
              <span>处理完成</span>
            </>
          )} */}
          <>
            {/* <CheckCircleFilled className={iconClass} /> */}
            <CheckCircleTwoTone twoToneColor={iconClass} />
            <span className={iconClassname}>{icontext}</span>
          </>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (current) {
      case 0:
        return (
          <div className={styles['upload-container']}>
            <Upload
              fileList={fileList}
              onChange={handleFileChange}
              multiple={true}
              beforeUpload={() => {
                setFileList([...fileList]);

                return false;
              }}
              // maxCount={1}
              accept=".pdf,.txt,.doc,.docx,.xls,.xlsx"
            >
              <div className={styles['upload-area']}>
                <img src={uploadImg.src} alt="upload" className={styles['upload-icon']} />
                <p>点击上传或拖拽文档到这里</p>
                <p className={styles['upload-hint']}>支持 PDF、TXT、DOC、DOCX、XLS、XLSX 可同时上传多个文件</p>
              </div>
            </Upload>
          </div>
        )
      case 1:
        return (
          <div className={styles['config-container']}>
            <div className={styles.section}>
              <h3>文档解析策略</h3>
              <Radio.Group value={parseStrategy} onChange={e => setParseStrategy(e.target.value)}>
                <Radio.Button value="quick">
                  <span data-desc="不会对文档提取图像等元素，适用于文本和表格">快速解析</span>
                </Radio.Button>
                <Radio.Button value="precise" disabled>
                  <span data-desc="将从文档中提取图片、表格等元素，需要耗费更长的时间">精准解析</span>
                </Radio.Button>
              </Radio.Group>
            </div>
            <div className={styles.section}>
              <h3>分段策略</h3>
              <Radio.Group value={segmentStrategy} onChange={e => setSegmentStrategy(e.target.value)}>
                <Radio.Button value="auto">
                  <span data-desc="自动分段与预处理规则">自动分段与清洗</span>
                </Radio.Button>
                <Radio.Button value="custom">
                  <span data-desc="自定义分段规则、分段长度及预处理规则">自定义</span>
                  <div style={{ color: 'rgba(0, 0, 0, 0.88)' }}>
                    <div style={{ color: '#86909C', marginTop: '-10px' }}>自定义分段规则、分段长度及预处理规则</div>
                    <div style={{ marginTop: '8px' }}>
                      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col span={8}>分段标识符</Col>
                        <Col span={8}>分段最大长度</Col>
                        <Col span={8}>分段重叠度</Col>
                      </Row>
                      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col span={8}>
                          <Select size={'middle'}
                            style={{ width: '100%', maxWidth: '240px' }}
                            // onChange={(e) => setAutoSelectType(e)}
                            onChange={(value) => {
                              if (value === '自定义') {
                                setShowCustomInput(true); // 显示自定义输入框
                                setAutoSelectType(value); // 使用已保存的自定义值
                              } else {
                                setShowCustomInput(false); // 隐藏自定义输入框
                                setAutoSelectType(value); // 使用预定义值
                              }
                            }}
                            value={autoSelectType}
                            // value={autoSelectType === customSplitChar ? '自定义' : autoSelectType} // 显示正确的选中项
                            options={[{ label: '空', value: '' }, { label: '换行', value: '换行' },
                            { label: '2个换行', value: '2个换行' }, { label: '中文句号', value: '中文句号' },
                            { label: '中文叹号', value: '中文叹号' }, { label: '英文句号', value: '英文句号' },
                            { label: '英文叹号', value: '英文叹号' }, { label: '英文问号', value: '英文问号' },
                            { label: '中文问号', value: '中文问号' }, { label: '自定义', value: '自定义' }]} />
                          {/* { label: '自定义', value: '自定义' } */}
                          {showCustomInput && (
                            <Input
                              style={{ marginTop: 8, width: '100%', maxWidth: '240px' }}
                              placeholder="请输入您的自定义分隔符"
                              value={customSplitChar}
                              onChange={(e) => {
                                const value = e.target.value;
                                setCustomSplitChar(value);
                                // setAutoSelectType(value); // 同时更新主状态值
                              }}
                            />
                          )}



                        </Col>
                        <Col span={8}>
                          <Row>
                            <Col span={12}>
                              <Slider
                                min={128}
                                max={32000}
                                onChange={(value) => setAutoSliderNumber(value)}
                                value={typeof autoSliderNumber === 'number' ? autoSliderNumber : 0}
                              />
                            </Col>
                            <Col span={4}>
                              <InputNumber
                                min={128}
                                max={32000}
                                value={typeof autoSliderNumber === 'number' ? autoSliderNumber : 0}
                                onChange={(value) => setAutoSliderNumber(value as number)}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col span={8}>
                          <InputNumber
                            style={{ width: '100%', maxWidth: '240px' }}
                            min={0}
                            suffix={'%'}
                            max={30}
                            addonAfter={
                              <div style={{ display: 'flex', alignItems: 'start', flexDirection: 'row' }}>
                                <MinusCircleOutlined onClick={() => setAutoInputNumber(autoInputNumber >= 5 ? autoInputNumber - 5 : 0)} />
                                <PlusCircleOutlined onClick={() => setAutoInputNumber(autoInputNumber <= 25 ? autoInputNumber + 5 : 30)} style={{ marginLeft: '8px' }} />
                              </div>
                            }
                            value={typeof autoInputNumber === 'number' ? autoInputNumber : 0}
                            onChange={(value) => setAutoInputNumber(value as number)}
                          />
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Radio.Button>
                <Radio.Button value="hierarchy" disabled>
                  <span data-desc="按照文档层级结构分段，将文档转化为有层级信息的树结构">按层级分段</span>
                </Radio.Button>
              </Radio.Group>
            </div>
          </div>
        )
      case 2:
        return (
          <div className={styles['process-container']}>
            <div className={styles['processing-status']}>
              {/* <h3>{submitStatus === 'loading' ? '服务器处理中' : '处理完成'}</h3> */}
              <h3>{'处理完成'}</h3>
              {fileList.map(file => renderProcessingFile(file))}
            </div>
          </div>
        )
    }
  }

  const complete = () => {
    props.changeShowTypePage('fileList');
  }

  return (
    <div className={styles['study-base-process-page-container']}>
      <div className={styles['header']}>
        <div className={styles['back-title']}>
          <span style={{ cursor: 'pointer', fontSize: '30px', marginRight: '10px' }} onClick={() => props.changeShowTypePage('fileList')} className="left-symbol">
            &lt;
          </span>
          添加内容
        </div>
        <div className={styles['header-actions']}>
          {current === 1 && <Button onClick={handlePrev}>上一步</Button>}
          {current < steps.length - 1 && <Button type="primary" onClick={handleNextTimer}>下一步</Button>}
          {current === steps.length - 1 && <Button onClick={() => complete()} type="primary">完成</Button>}
        </div>
      </div>
      <Steps
        current={current}
        items={steps}
        className={styles['steps-nav']}
        labelPlacement="vertical"
      />
      <div className={styles['content-container']}>
        {renderContent()}
      </div>
    </div>
  )
}

export default React.memo(AppDetail)
