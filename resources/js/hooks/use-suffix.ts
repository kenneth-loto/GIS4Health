import { fetchSuffixesOption, fetchSuffixesTableData } from '@/api/suffix';
import type { Suffix } from '@/types';
import { useEffect, useState } from 'react';

// 🔹 Simple list fetch (used in dialogs)
export function useSuffixesOption(dialogOpen: boolean = true) {
    const [suffixes, setSuffixes] = useState<Suffix[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!dialogOpen) return;

        setLoading(true);

        fetchSuffixesOption()
            .then((res) => {
                setSuffixes(res);
            })
            .catch(() => {
                setSuffixes([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [dialogOpen]);

    return { suffixes, loading };
}

// 🔹 Dynamic list fetch (used in index with pagination + search)
export function useSuffixesTableData(search: string = '', page: number = 1, per_page: number = 5) {
    const [data, setData] = useState<Suffix[]>([]);
    const [total, setTotal] = useState(0);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        fetchSuffixesTableData({ search, page, per_page })
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
        suffixes: data,
        total,
        lastPage,
        loading,
    };
}
