import { Tabs } from "antd";
import OverallView from "./OverallView";
import ApplicationDetails from "./ApplicationDetails";

const NewCallStatistics = () => {

    const items = [
        {
            key: '1',
            label: '总视图',
            children: <OverallView />
        }, {
            key: '2',
            label: '应用详情',
            children: <ApplicationDetails />
        }
    ]
    return <div style={{ width: '100%', height: `calc(100% - 60px)`, backgroundColor: '#F5F6F9', padding: '0 0 0 8px', overflow: 'auto' }}>
        <Tabs tabBarStyle={{ fontFamily: 'Source Han Sans-Bold', fontWeight: 700, color: '#1C2748', fontSize: '16px' }} items={items} />
    </div>
}

export default NewCallStatistics;