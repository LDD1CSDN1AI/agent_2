import { useState, useRef, useEffect } from 'react';
import Loading from '@/app/components/base/loading'
import GlobalUrl from '@/GlobalUrl';
import { message } from 'antd';
import AppList from '@/app/(commonLayout)/datasets/page';
import DatasetCreation from '@/app/(commonLayout)/datasets/create/page';
import DatasetDetail from '@/app/(commonLayout)/datasets/(datasetDetailLayout)/[datasetId]/layout';
import HitTesting from '@/app/(commonLayout)/datasets/(datasetDetailLayout)/[datasetId]/hitTesting/page';
import Documents from '@/app/components/datasets/documents';
import DocumentDetail from '@/app/(commonLayout)/datasets/(datasetDetailLayout)/[datasetId]/documents/[documentId]/page';
import Create from '@/app/(commonLayout)/datasets/(datasetDetailLayout)/[datasetId]/documents/create/page';
import { ExternalKnowledgeApiProvider } from '@/context/external-knowledge-api-context';
import { ExternalApiPanelProvider } from '@/context/external-api-panel-context';
import useSWR from 'swr';
import { fetchDatasetDetail } from '@/service/datasets';
import DatasetDetailContext from '@/context/dataset-detail';
import DocumentSettings from '@/app/(commonLayout)/datasets/(datasetDetailLayout)/[datasetId]/documents/[documentId]/settings/page';

const Datasets: React.FC = (props) => {
    const { tenant_id = '' } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [lastData, setLastData] = useState({});
    const [datasetId, setDatasetId] = useState('');
    const [docId, setDocId] = useState('');
    const [currentData, setCurrentData] = useState({});
    const [contentType, setContentType] = useState('main');
    const [detailContentType, setDetailContentType] = useState('documents');
    const [loadTime, setLoadTime] = useState<number | null>(null);
    const [hasRefreshed, setHasRefreshed] = useState(false);
    // const startTimeRef = useRef<number>(0);

    useEffect(() => {
        window.addEventListener('message', setIframeUrl);

        return () => {
            console.log('我清空啦');
            window.removeEventListener('message', setIframeUrl);
        }
    }, []);

    const { data: datasetRes, error, mutate: mutateDatasetRes } = useSWR({
        url: 'fetchDatasetDetail',
        datasetId,
    }, apiParams => datasetId && fetchDatasetDetail(apiParams.datasetId))

    useEffect(() => {
        mutateDatasetRes();
    }, [datasetId]);

    const getContent = () => {
        const commonUrl = 'http://localhost:3000/agent-platform-web';
        switch (contentType) {
            case 'main':
                return <AppList />
            // return commonUrl + `/datasets?tenant_id=${tenant_id || ''}`;
            case 'add':
                return <DatasetCreation />;
            // return commonUrl + `/datasets/create?tenant_id=${tenant_id || ''}`;
            case 'hitTesting':
                return <DatasetDetail
                    params={{
                        datasetId: (currentData?.id || datasetId),
                        documentId: docId,
                        detailContentType
                    }}
                    children={getDetailContent()}
                />
            case 'settings':
                return <DatasetDetail
                    params={{
                        datasetId: (currentData?.id || datasetId),
                        documentId: docId,
                        detailContentType
                    }}
                    children={getDetailContent()}
                />
            case 'documents':
                return <DatasetDetail
                    params={{
                        datasetId: (currentData?.id || datasetId),
                        documentId: docId,
                        detailContentType
                    }}
                    children={getDetailContent()}
                />
            case 'create':
                return <Create params={{ 'datasetId': (currentData?.id || datasetId) }} />;
            // return commonUrl + `/datasets/${currentData?.id || datasetId}/documents/create?tenant_id=${tenant_id || ''}`;
            case 'documentsMark':
                return <DocumentDetail params={{ datasetId: (currentData?.id || datasetId), documentId: docId }} />
            // return commonUrl + `/datasets/${currentData?.id || datasetId}/documents/${docId}?tenant_id=${tenant_id || ''}`;
            default:
                return commonUrl + `/datasets?tenant_id=${tenant_id || ''}`;
        }
    }

    const getDetailContent = () => {
        switch (detailContentType) {
            case 'hitTesting':
                return <HitTesting datasetId={currentData?.id || datasetId} />;
            case 'settings':
                return <DocumentSettings params={{ datasetId: (currentData?.id || datasetId), documentId: docId }} />
                return '';
            case 'documents':
                return <Documents datasetId={currentData?.id || datasetId} />;
        }
    }

    const setIframeUrl = (e: any) => {
        const data = e.data;
        setLastData({ currentData, contentType: contentType });
        setCurrentData(data);
        data?.id && setDatasetId(data?.id);
        data?.docId && setDocId(data?.docId);

        if (data?.type === 'newDataSet') {
            if (data?.value === contentType && (data?.value === 'hitTesting' || data?.value === 'documents' || data?.value === 'settings')) {
                return;
            }
            if (data.value === 'main') {
                setDatasetId('')
                setContentType('main')
            } else if (data.value === 'add') {
                setContentType('add')
            } else if (['hitTesting', 'documents', 'settings'].includes(data.value)) {
                setContentType(data.value)
                setDetailContentType(data.value)
            } else if (data.value === 'create') {
                setContentType('create')
            } else if (data.value === 'documentsMark') {
                setContentType('documentsMark')
            } else if (data.value === 'lastPage') {
                setContentType(lastData?.contentType || 'main')
                setCurrentData(lastData);
            }
            setIsLoading(true);
        }
        console.log('--------------------当前展示页面', contentType, '         参数为->>>>', data, '------------->>>', { ...lastData, ...currentData, contentType: contentType })
    }
    const consoleTokenFromLocalStorage = localStorage?.getItem('console_token')

    return (
        <div style={{ width: '100%', height: '100%' }} className="iframe-container">

            <DatasetDetailContext.Provider value={{
                indexingTechnique: datasetRes?.indexing_technique,
                dataset: datasetRes,
                mutateDatasetRes: () => mutateDatasetRes(),
            }}>
                {
                    getContent()
                }
            </DatasetDetailContext.Provider>
        </div >
    );
}

export default Datasets;