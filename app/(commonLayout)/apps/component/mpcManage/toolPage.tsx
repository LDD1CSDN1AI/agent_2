import { ApiOutlined } from "@ant-design/icons";
import { Button, Collapse, Input } from "antd";

type Props = {
    dataSource: any,
    selectData?: any
}

const ToolPage: React.FC<Props> = (props) => {
    const { dataSource, selectData } = props;

    const getRunPanel = (item: any) => {
        return <div style={{ color: 'gray' }}>
            <div style={{ margin: '4px 16px 0 16px' }}>{selectData.description}</div>
            <div style={{ margin: '12px 16px 0 16px' }}>{selectData.param} (string)</div>
            <div style={{ margin: '8px 16px 0 16px' }}>{item.param3}</div>
            <Input placeholder={`请输入${selectData.param}`} style={{ margin: '8px 16px 0 16px', width: '60%', maxWidth: '480px' }} />
            <Button disabled style={{ margin: '8px 16px 0 16px' }} type={'primary'}>运行</Button>
        </div>
    }

    const getRunLabel = (item: any) => {
        return <div style={{ fontWeight: '700' }}>
            <ApiOutlined />
            <span>{selectData.englishName}</span>
        </div>
    }

    const getItem = (item: any, index: number) => {
        return {
            key: index,
            label: getRunLabel(item),
            children: getRunPanel(item),
        };
    }


    return (
        <div style={{ textAlign: 'left', marginTop: '16px' }}>
            <Collapse ghost items={dataSource.map((item, index) => getItem(item, index + 1))} bordered={false} defaultActiveKey={['1']} />
        </div>
    )
}

export default ToolPage;