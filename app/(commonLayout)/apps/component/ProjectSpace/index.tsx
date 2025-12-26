import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Empty
} from "antd";
import TextArea from "antd/es/input/TextArea";
import useSwr from "swr";
import { PlusSquareOutlined, SearchOutlined } from "@ant-design/icons";
import Space from "./space";
import { getTenants } from "@/service/common";
import {
  AddMembers,
  getAllAccountMembers,
} from "@/service/apps";
import Toast from '@/app/components/base/toast'

type Props = {
  data?: any;
  mutate?: () => void;
  setCallback?: any;
  setActiveTab?: any
  setActiveId?: any
};

const roleSelectList = [
  { value: "normal", label: "普通用户" },
  { value: "owner", label: "管理员" },
]

const roleSelectList1 = [
  { value: "normal", label: "普通用户" },
]
const ProjectSpace: React.FC<Props> = (props) => {
  const { setActiveTab, setActiveId } = props;
  const [form] = Form.useForm();
  const [IsRequested, setIsRequested] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputName, setInputName] = useState<string | null>(null);
  const [textArea, setTextArea] = useState<string | null>(null);
  const [memnerList, setMemnerList] = useState<any[]>([]);
  const [accountId, setAccountId] = useState<string[] | null>([]);
  const [accountRole, setAccountRole] = useState<string[]>([]);
  const [newTeants, setNewTenats] = useState<any>([])
  const [filteredOptions, setFilteredOptions] = useState<any['options']>([]);

  const onSelectChange = (e: any, key: string) => {
    if (key === 'role')
      setAccountRole(e)
  }

  const { data: tenants, mutate: tenantsMutate }: any = useSwr(
    "/getTenants",
    getTenants,
  );

  const getAllAccountMembersList = async () => {
    const res: any = await getAllAccountMembers({ url: '/getAllAccountNormal', body: { tenant_id: '', name: "" } })
    const list = (res || []).map((item: any) => {
      return {
        value: item.id,
        label: item.name
      }
    })
    setMemnerList(list)
  }

  const onNameSelectChange = async (e: string) => {
    const data = (tenants || [])?.filter((item: any) => {
      return item.name.includes(e)
    });
    setNewTenats(data);
  };

  const onRoleSelectChange = (e: string) => {
    const data = (tenants || [])?.filter((item: any) => {
      return item.role === e || !e;
    });
    setNewTenats(data);
  }

  const handleOk = async () => {
    if (!accountId || !inputName || !textArea || !accountRole) {
      Toast.notify({
        type: "error",
        message: "请输入完整信息！",
      });
      return
    }
    if (IsRequested) {
      Toast.notify({
        type: "error",
        message: "创建中，请稍后......",
      });
      return
    }
    setIsRequested(true);
    if (textArea != null && textArea.length != 0) {
      try {
        if (accountId.length > 0) {
          const accountList = accountId?.map((item: any) => {
            return {
              id: item,
              role: accountRole
            }
          })
          await AddMembers({
            url: '/createTenant',
            body: {
              name: inputName,
              description: textArea,
              accounts: accountList
            },
          })
          setIsRequested(false);
          form.resetFields();
          tenantsMutate();
          setIsModalOpen(false);
          Toast.notify({
            type: "success",
            message: "创建成功",
          });
        } else {
          Toast.notify({
            type: "error",
            message: "请选择成员",
          });
        }
      } catch (err) {
        Toast.notify({
          type: "error",
          message: "创建失败",
        });
      }
    } else {
      Toast.notify({
        type: "error",
        message: "请输入信息",
      });
    }
  };

  const showModal = () => {
    setInputName(null);
    setAccountId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChange = (value: any) => {
    if (value.length === 0) {
      setFilteredOptions([]);
    } else {
      setAccountId(value)
    }
  };

  const handleSearch = (value: string) => {
    if (value) {
      const filtered = memnerList.filter((item: any) =>
        item.label.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions([]);
    }
  };

  useEffect(() => {
    getAllAccountMembersList()
  }, [])

  useEffect(() => {
    const arr: any = tenants?.filter((item: any) => item.name !== '默认空间')
    setNewTenats(arr)
  }, [tenants])

  return (
    <>
      <div className='mt-[24px]'>
        <div style={{ justifyContent: 'space-between', fontWeight: '700', backgroundColor: 'white', padding: '16px 16px', marginBottom: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center' }} className='flex'>
          <div className='text-[#1C2748] text-[20px]'>项目空间</div>
        </div>
        <div className='bg-[#fff] rounded-[8px] px-[24px]' style={{ height: 'calc(100vh - 138px)', overflowY: 'auto', position: 'relative' }}>
          <div className="flex h-[70px]  items-center mb-[10px] py-[12px] border-bottom-[1px solid #F1F2F5]" style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
            <div className="flex">
              <Input
                placeholder="搜索应用名称"
                allowClear
                onChange={(e) => onNameSelectChange(e.target.value)}
                style={{ width: 300, height: 40, marginRight: 20 }}
                suffix={<SearchOutlined />}
              />
              <Select
                style={{ width: 120, height: 40, marginRight: 30 }}
                allowClear
                options={roleSelectList}
                placeholder="请选择角色"
                onChange={(e) => onRoleSelectChange(e)}
              />
            </div>
            <div>
              {
                // localStorage.getItem('showAddProjectButton') === 'true' &&
                <Button
                  onClick={() => showModal()}
                  style={{ marginRight: 20, height: 40 }}
                  type="primary"
                >
                  <PlusSquareOutlined />
                  创建新项目
                </Button>
              }
            </div>
          </div>
          <div
            className="flex-1 overflow-hidden overflow-y-auto w-[100%] "
            style={{ height: "calc(100% -70px)", marginTop: '10px' }}
          >
            <div
              className="h-full flex flex-1 flex-wrap overflow-hidden overflow-y-auto pb-12 gap-[1.45vw]">
              {
                (newTeants || []).length === 0 || ((newTeants || []).length === 1 && newTeants?.[0].name === '默认空间') ? <div className="flex justify-center overflow-hidden  w-full items-center">
                  <Empty />
                </div> : <Space setActiveId={setActiveId} setActiveTab={setActiveTab} data={(newTeants || [])} onOut={() => tenantsMutate()} />
              }
            </div>
          </div>
        </div>
      </div >

      <Modal

        title="创建项目"
        okText="确认"
        cancelText="取消"
        open={isModalOpen}
        onOk={() => handleOk()}
        onCancel={handleCancel}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="项目名称"
            name="inputName"
            rules={[
              { required: true, message: "请选择一个工作空间" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value !== "默认空间") {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("名字不符合要求，请重新输入"));
                },
              }),
            ]}
          >
            <Input
              onChange={(e) => {
                setInputName(e.target.value);
              }}
              maxLength={20}
              placeholder="给项目起个名字,支持中英文，数字"
            />
          </Form.Item>
          <Form.Item
            label={"选择成员"}
            name="inputValue"
            rules={[{ required: true, message: "请输入你要添加的成员" }]}
          >
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="请先搜索后再选择成员"
              onChange={handleChange}
              onSearch={handleSearch}
              filterOption={false}
              showSearch
              options={filteredOptions}
            />
          </Form.Item>
          <Form.Item
            label={"成员角色"}
            name="accountRole"
            rules={[{ required: true, message: "请选择角色" }]}
          >
            <Select
              allowClear
              options={roleSelectList1}
              placeholder="请选择角色"
              onChange={(e) => onSelectChange(e, 'role')}
            />
          </Form.Item>
          <Form.Item
            label={"项目描述"}
            name="textArea"
            rules={[
              {
                required: true,
                message: "介绍项目的内容，目标等，将会展示会给可见的用户",
              },
            ]}
          >
            <TextArea
              onChange={(e) => {
                setTextArea(e.target.value);
              }}
              maxLength={200}
              rows={3}
              placeholder={"介绍项目的内容，目标等，将会展示会给可见的用户"}
            ></TextArea>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ProjectSpace;
