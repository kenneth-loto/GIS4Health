import { fetchPatientInfosTableData } from '@/api/patient_info';
import type { PatientInfo } from '@/types';
import { useEffect, useState } from 'react';

// 🔹 Dynamic list fetch (used in index with pagination + search)
export function usePatientInfosTableData(search: string = '', page: number = 1, per_page: number = 5) {
    const [data, setData] = useState<PatientInfo[]>([]);
    const [total, setTotal] = useState(0);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        fetchPatientInfosTableData({ search, page, per_page })
            .then((res) => {
                setData(res.data);
                setTotal(res.total);
                setLastPage(res.last_page);
            })
            .catch(() => {
                setData([]);
                setTotal(0);
                setLastPage(1);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [search, page, per_page]);

    return {
        patient_infos: data,
        total,
        lastPage,
        loading,
    };
}
