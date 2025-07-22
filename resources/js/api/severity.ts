import type { Severity } from '@/types';
import axios from 'axios';

export interface SeverityDataParams {
    page?: number;
    per_page?: number;
    search?: string;
}

export interface SeverityDataResponse {
    data: Severity[];
    last_page: number;
    current_page: number;
    total: number;
}

// For simple list fetch (no pagination, no search)
export async function fetchSeveritiesOption(): Promise<Severity[]> {
    const res = await axios.get('/api/severities/list');
    return res.data.data;
}

// For dynamic list fetch (with pagination, search)
export async function fetchSeveritiesTableData(params: SeverityDataParams = { page: 1, per_page: 5 }): Promise<SeverityDataResponse> {
    const res = await axios.get('/api/severities', { params });
    return {
        data: res.data.data,
        current_page: res.data.meta.current_page,
        last_page: res.data.meta.last_page,
        total: res.data.meta.total,
    };
}
