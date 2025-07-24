import type { PatientInfo } from '@/types';
import axios from 'axios';

export interface PatientInfoDataParams {
    page?: number;
    per_page?: number;
    search?: string;
}

export interface PatientInfoDataResponse {
    data: PatientInfo[];
    last_page: number;
    current_page: number;
    total: number;
}

// For dynamic list fetch (with pagination, search)
export async function fetchPatientInfosTableData(params: PatientInfoDataParams = { page: 1, per_page: 5 }): Promise<PatientInfoDataResponse> {
    const res = await axios.get('/api/patient_infos', { params });
    return {
        data: res.data.data,
        current_page: res.data.meta.current_page,
        last_page: res.data.meta.last_page,
        total: res.data.meta.total,
    };
}
