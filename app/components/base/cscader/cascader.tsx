import React from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];
type Props = { items: MenuItem[] };
const dataList: React.FC<Props> = (props) => {
    const { items } = props;

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click', e);
    };
    return (
        <div style={{ border: "solid 1px #ccc" }}>
            <>

                <Menu selectable multiple onClick={(e) => onClick(e)} style={{ width: 150, marginTop: '10px' }} mode="vertical" items={items} />
            </>
        </div>

    )
}
export default dataList
