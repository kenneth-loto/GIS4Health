import { fetchSeveritiesOption, fetchSeveritiesTableData } from '@/api/severity';
import type { Severity } from '@/types';
import { useEffect, useState } from 'react';

// 🔹 Simple list fetch (used in dialogs)
export function useSeveritiesOption(dialogOpen: boolean = true) {
    const [categories, setCategories] = useState<Severity[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!dialogOpen) return;

        setLoading(true);

        fetchSeveritiesOption()
            .then((res) => {
                setCategories(res);
            })
            .catch(() => {
                setCategories([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [dialogOpen]);

    return { categories, loading };
}

// 🔹 Dynamic list fetch (used in index with pagination + search)
export function useSeveritiesTableData(search: string = '', page: number = 1, per_page: number = 5) {
    const [data, setData] = useState<Severity[]>([]);
    const [total, setTotal] = useState(0);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        fetchSeveritiesTableData({ search, page, per_page })
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
        categories: data,
        total,
        lastPage,
        loading,
    };
}
