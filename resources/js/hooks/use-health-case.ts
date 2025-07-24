import { fetchHealthCasesTableData } from '@/api/health_case';
import type { HealthCase } from '@/types';
import { useEffect, useState } from 'react';

// 🔹 Dynamic list fetch (used in index with pagination + search)
export function useHealthCasesTableData(search: string = '', page: number = 1, per_page: number = 5) {
    const [data, setData] = useState<HealthCase[]>([]);
    const [total, setTotal] = useState(0);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        fetchHealthCasesTableData({ search, page, per_page })
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
        health_cases: data,
        total,
        lastPage,
        loading,
    };
}
