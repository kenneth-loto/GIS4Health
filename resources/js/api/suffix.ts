import type { Suffix } from '@/types';
import axios from 'axios';

export interface SuffixDataParams {
    page?: number;
    per_page?: number;
    search?: string;
}

export interface SuffixDataResponse {
    data: Suffix[];
    last_page: number;
    current_page: number;
    total: number;
}

// For simple list fetch (no pagination, no search)
export async function fetchSuffixesOption(): Promise<Suffix[]> {
    const res = await axios.get('/api/suffixes/list');
    return res.data.data;
}

// For dynamic list fetch (with pagination, search)
export async function fetchSuffixesTableData(params: SuffixDataParams = { page: 1, per_page: 5 }): Promise<SuffixDataResponse> {
    const res = await axios.get('/api/suffixes', { params });
    return {
        data: res.data.data,
        current_page: res.data.meta.current_page,
        last_page: res.data.meta.last_page,
        total: res.data.meta.total,
    };
}
