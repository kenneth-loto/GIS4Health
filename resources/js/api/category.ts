import type { Category } from '@/types';
import axios from 'axios';

export interface CategoryDataParams {
    page?: number;
    per_page?: number;
    search?: string;
}

export interface CategoryDataResponse {
    data: Category[];
    last_page: number;
    current_page: number;
    total: number;
}

// For simple list fetch (no pagination, no search)
export async function fetchCategoriesOption(): Promise<Category[]> {
    const res = await axios.get('/api/categories/list');
    return res.data.data;
}

// For dynamic list fetch (with pagination, search)
export async function fetchCategoriesTableData(params: CategoryDataParams = { page: 1, per_page: 5 }): Promise<CategoryDataResponse> {
    const res = await axios.get('/api/categories', { params });
    return {
        data: res.data.data,
        current_page: res.data.meta.current_page,
        last_page: res.data.meta.last_page,
        total: res.data.meta.total,
    };
}
