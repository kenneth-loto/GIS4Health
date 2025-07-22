import { fetchDiseasesOption, fetchDiseasesTableData } from '@/api/disease';
import type { Disease } from '@/types';
import { useEffect, useState } from 'react';

// 🔹 Simple list fetch (used in dialogs)
export function useDiseasesOption(dialogOpen: boolean = true) {
    const [diseases, setDiseases] = useState<Disease[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!dialogOpen) return;

        setLoading(true);

        fetchDiseasesOption()
            .then((res) => {
                setDiseases(res);
            })
            .catch(() => {
                setDiseases([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [dialogOpen]);

    return { diseases, loading };
}

// 🔹 Dynamic list fetch (used in index with pagination + search)
export function useDiseasesTableData(search: string = '', page: number = 1, per_page: number = 5) {
    const [data, setData] = useState<Disease[]>([]);
    const [total, setTotal] = useState(0);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        fetchDiseasesTableData({ search, page, per_page })
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
        diseases: data,
        total,
        lastPage,
        loading,
    };
}
