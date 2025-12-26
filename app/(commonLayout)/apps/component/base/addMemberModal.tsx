import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Input, List, Button, Avatar, Select } from 'antd';
import { UserOutlined, CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { getAllAccount, getPermissions } from '@/service/log'

type Props = {
  data?: any;
  tenantId?: any,
  ref: any,
  onConfirm: () => void;
  setUserpermissionsList: any
}

const AddMemberModal: React.FC<Props> = forwardRef((props, ref) => {
  const { onConfirm, tenantId, data, setUserpermissionsList } = props
  const [selectedMembers, setSelectedMembers] = useState<any>([]);
  const [members, setMembers] = useState<any>([]);
  const [searchText, setSearchText] = useState('');

  const handleSearch = (e: any) => {
    setSearchText(e.target.value);
  };

  const handleAddMember = (member: any) => {
    if (!selectedMembers.find((m: any) => m.id === member.id)) {
      setSelectedMembers([...selectedMembers, { ...member, permission: '仅体验' }]);
    }
  };

  const handleChangePermission = (value: any, memberId: any) => {
    setSelectedMembers((prev: any) =>
      prev.map((m: any) => (m.id === memberId ? { ...m, permission: value } : m))
    );
  };

  const getAllAccountList = async () => {
    const res = await getAllAccount({
      url: '/getAllAccount',
      body: {
        tenant_id: tenantId,
        name: searchText
      },
    })
    setMembers(res)
  }

  const getPermissionsList = async () => {
    const res = await getPermissions({
      url: '/user/permissions/list',
      body: {
        app_id: data.id
      }
    })
    if (res) {
      let arr: any = [];
      if (res.user_permissions_list.length > 0) {
        res.user_permissions_list?.map((item: any) => {
          arr.push({
            company_name: item?.company_name || '',
            email: item?.email || '',
            employee_number: item?.user_id,
            id: item?.user_id,
            name: item?.user_name,
            permission: item?.can_edit ? '可编辑' : '仅体验'
          })
        })
      }
      setSelectedMembers(arr)
    }
  }

  const deleteItem = (item: any) => {
    setSelectedMembers(selectedMembers.filter((m: any) => m.id !== item.id))
  }

  useEffect(() => {
    if (tenantId && data) {
      getAllAccountList()
    }
  }, [tenantId, searchText])

  useEffect(() => {
    if (data) {
      getPermissionsList()
    }
  }, [data])

  useEffect(() => {
    setUserpermissionsList(selectedMembers)
  }, [selectedMembers])

  useImperativeHandle(ref, () => ({
    getPermissionsList
  }))

  return (
    <React.Fragment>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, marginRight: '16px' }}>
          <Input
            allowClear
            placeholder="搜索成员"
            value={searchText}
            onChange={handleSearch}
            style={{ marginBottom: '16px' }}
            suffix={<SearchOutlined />}
          />
          <List
            style={{ height: '50vh', overflowY: 'auto' }}
            itemLayout="horizontal"
            dataSource={searchText === '' ? [] : members}
            renderItem={(item: any) => (
              <List.Item
                actions={[
                  <Button type="link" onClick={() => handleAddMember(item)}>
                    添加
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={item.name}
                  description={item.employee_number}
                />
              </List.Item>
            )}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '12px 0px' }}>已选定成员 ({selectedMembers.length})</h3>
          <List
            style={{
              height: '50vh',
              overflowY: 'auto'
            }}
            itemLayout="horizontal"
            dataSource={selectedMembers}
            renderItem={(item: any) => (
              <List.Item
                actions={[
                  <Select
                    defaultValue={item.permission || '仅体验'}
                    onChange={(value) => handleChangePermission(value, item.id)}
                    style={{ width: 120 }}
                    options={[
                      { value: '仅体验', label: '仅体验' }, { value: '可编辑', label: '可编辑' }
                    ]}
                  />,
                  <CloseCircleOutlined onClick={() => deleteItem(item)} />
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={item.name}
                  description={item.employee_number}
                />
              </List.Item>
            )}
          />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row-reverse', marginTop: '20px' }}>
        <Button type='primary' onClick={onConfirm}>确定</Button>
      </div>
    </React.Fragment>
  );
});

export default AddMemberModal;
