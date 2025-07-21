import { fetchCategoriesOption, fetchCategoriesTableData } from '@/api/category';
import type { Category } from '@/types';
import { useEffect, useState } from 'react';

// 🔹 Simple list fetch (used in dialogs)
export function useCategoriesOption(dialogOpen: boolean = true) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!dialogOpen) return;

        setLoading(true);

        fetchCategoriesOption()
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
export function useCategoriesTableData(search: string = '', page: number = 1, per_page: number = 5) {
    const [data, setData] = useState<Category[]>([]);
    const [total, setTotal] = useState(0);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        fetchCategoriesTableData({ search, page, per_page })
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
