import type { Disease } from '@/types';
import axios from 'axios';

export interface DiseaseDataParams {
    page?: number;
    per_page?: number;
    search?: string;
    category_id?: string;
}

export interface DiseaseDataResponse {
    current_page: number;
    data: Disease[];
    last_page: number;
    total: number;
}

// For simple list fetch (no pagination, no search)
export async function fetchDiseasesOption(): Promise<Disease[]> {
    const res = await axios.get('/api/diseases/list');
    return res.data.data;
}

// For dynamic list fetch (with pagination, search)
export async function fetchDiseasesTableData(params: DiseaseDataParams = { page: 1, per_page: 5 }): Promise<DiseaseDataResponse> {
    const res = await axios.get('/api/diseases', { params });
    return {
        data: res.data.data,
        current_page: res.data.meta.current_page,
        last_page: res.data.meta.last_page,
        total: res.data.meta.total,
    };
}

export async function fetchDiseasesByCategory(categoryId: string): Promise<Disease[]> {
    const res = await axios.get(`/api/diseases/by-category/${categoryId}`);
    return res.data.data;
}
