import type { HealthCase } from '@/types';
import axios from 'axios';

export interface HealthCaseDataParams {
    page?: number;
    per_page?: number;
    search?: string;
}

export interface HealthCaseDataResponse {
    data: HealthCase[];
    last_page: number;
    current_page: number;
    total: number;
}

// For dynamic list fetch (with pagination, search)
export async function fetchHealthCasesTableData(params: HealthCaseDataParams = { page: 1, per_page: 5 }): Promise<HealthCaseDataResponse> {
    const res = await axios.get('/api/health_cases', { params });
    return {
        data: res.data.data,
        current_page: res.data.meta.current_page,
        last_page: res.data.meta.last_page,
        total: res.data.meta.total,
    };
}
