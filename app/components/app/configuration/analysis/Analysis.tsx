import { Tabs, TabsProps } from 'antd';
import './index.scss';
import { EchartsAnalysis } from './EchartsAnalysis';
import TableAnalysis from './table/Table';
import { getQueryParams } from '@/utils/getUrlParams';
import Overview from '@/app/(commonLayout)/app/(appDetailLayout)/[appId]/overview/page';
import ChatRecord from '@/app/(commonLayout)/app/(appDetailLayout)/[appId]/chatRecord'

type props = {
    appId: string
}

export const Analysis: React.FC<props> = (props) => {
    const { appId } = props;

    const tabs: TabsProps['items'] = [
        {
            key: '1',
            label: '日志',
            children: <TableAnalysis />
        },
        // {
        //     key: '2',
        //     label: '监测',
        //     children: <EchartsAnalysis />
        // }, 
        {
            key: '3',
            label: '数据',
            children: <Overview appId={appId} />
        },
        {
            key: '4',
            label: '对话记录',
            children: <ChatRecord entry="analysis" />
        }
    ]

    return (
        <div style={{ overflow: 'auto' }} className='analysis'>
            <Tabs items={tabs} />
        </div>
    )
}