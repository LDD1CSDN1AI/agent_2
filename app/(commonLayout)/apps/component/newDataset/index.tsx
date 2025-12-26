import { useState, useRef, useEffect } from 'react';
import Loading from '@/app/components/base/loading'
import GlobalUrl from '@/GlobalUrl';
import { message } from 'antd';

const NewDataset: React.FC = (props) => {
    const { tenant_id = '' } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [lastData, setLastData] = useState({});
    const [datasetId, setDatasetId] = useState('');
    const [docId, setDocId] = useState('');
    const [currentData, setCurrentData] = useState({});
    const [contentType, setContentType] = useState('main');
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

    const getUrlFromType = (contentType: string) => {

        const commonUrl = 'http://localhost:3000/agent-platform-web';
        // const commonUrl = GlobalUrl.defaultUrlIp + '/agent-platform-web';
        switch (contentType) {
            case 'main':
                return commonUrl + `/datasets?tenant_id=${tenant_id || ''}`;
            case 'add':
                return commonUrl + `/datasets/create?tenant_id=${tenant_id || ''}`;
            case 'hitTesting':
                return commonUrl + `/datasets/${currentData?.id || datasetId}/hitTesting?tenant_id=${tenant_id || ''}`;
            case 'settings':
                return commonUrl + `/datasets/${currentData?.id || datasetId}/settings?tenant_id=${tenant_id || ''}`;
            case 'documents':
                return commonUrl + `/datasets/${currentData?.id || datasetId}/documents?tenant_id=${tenant_id || ''}`;
            case 'create':
                return commonUrl + `/datasets/${currentData?.id || datasetId}/documents/create?tenant_id=${tenant_id || ''}`;
            case 'documentsMark':
                return commonUrl + `/datasets/${currentData?.id || datasetId}/documents/${docId}?tenant_id=${tenant_id || ''}`;
            default:
                return commonUrl + `/datasets?tenant_id=${tenant_id || ''}`;
        }
    }

    const handleLoadStart = () => {
        // startTimeRef.current = performance.now();
        console.log('重新加载啦')
        setIsLoading(true);
    };

    const handleLoadComplete = (e: React.SyntheticEvent<HTMLIFrameElement>) => {
        // const endTime = performance.now();
        // const duration = endTime - startTimeRef.current;
        // setLoadTime(duration);
        // 检查是否包含目标路径，并且尚未刷新过

        // const iframe = e.target as HTMLIFrameElement;
        // const iframeUrl = iframe.src;
        // console.log("iframeUrl--------------------------------->", iframeUrl)
        // // message.info(iframeUrl, 10)
        // if (iframeUrl.includes('/apps') && !hasRefreshed) {
        //     console.log('检测到目标路径，刷新整个页面');
        //     setHasRefreshed(true); // 标记已刷新，避免无限循环
        //     window.location.reload(); // 强制刷新整个页面
        //     return;
        // }

        // const iframe = e.target as HTMLIFrameElement;
        // const iframeSrc = iframe.src;
        // console.log("iframeUrl--------------------------------->", iframeSrc);

        // try {
        //     // 尝试获取iframe内部的实际URL（同源情况下）
        //     const iframeWindow = iframe.contentWindow;
        //     if (iframeWindow) {
        //         const iframeCurrentUrl = iframeWindow.location.href;
        //         console.log("iframeCurrentUrl---------------------------->", iframeCurrentUrl);

        //         // 检查URL是否一致
        //         // if (iframeCurrentUrl !== iframeSrc) {
        //         console.log('URL不一致，强制修改为src的URL');
        //         // iframeWindow.location.href = iframeSrc;
        //         // return;
        //         // }
        //     }
        // } catch (error) {
        //     // 跨域情况下会抛出错误，改用其他方式处理
        //     console.log('跨域限制，无法直接访问iframe URL', error);

        // }


        console.log('加载结束啦')
        setIsLoading(false);
    };

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
            } else if (data.value === 'hitTesting') {
                setContentType('hitTesting')
            } else if (data.value === 'documents') {
                setContentType('documents')
            } else if (data.value === 'settings') {
                setContentType('settings')
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
            {isLoading && <div className='flex h-full items-center justify-center bg-white'>
                <Loading />
            </div>}

            <iframe
                key={contentType}
                src={getUrlFromType(contentType) + `&console_token=${consoleTokenFromLocalStorage}`}
                onLoad={handleLoadComplete}
                onLoadStart={handleLoadStart}
                style={{ display: isLoading ? 'none' : 'block', width: '100%', height: '100%' }}
            />
        </div>
    );
}

// export default NewDataset;