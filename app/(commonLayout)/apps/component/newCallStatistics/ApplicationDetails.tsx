import Dashboard from "@/app/(commonLayout)/apps/component/newCallStatistics/Dashboard";
import DashboardDeail from "@/app/(commonLayout)/apps/component/newCallStatistics/DashboardDeail";
import { useState } from "react";

const ApplicationDetails = () => {
    const [showTable, setShowTable] = useState(true);
    const [selectedRow, setSelectedRow] = useState('');
    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchValue, setSearchValue] = useState('');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc' | ''>('desc');
    const [sortField, setSortField] = useState<'business_type' | 'call_count' | 'succeed_count' | 'create_time' | ''>('create_time');

    return <>
        {
            showTable ?
                <Dashboard
                    current={current}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    setCurrent={setCurrent}
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    setSelectedRow={setSelectedRow}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    sortField={sortField}
                    setSortField={setSortField}
                    onShow={() => setShowTable(false)}
                />
                :
                <DashboardDeail selectedRow={selectedRow} onClose={() => setShowTable(true)} />
        }
    </>
}

export default ApplicationDetails;