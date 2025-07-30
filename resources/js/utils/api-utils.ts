import axios from 'axios';

export interface DataParams {
    page?: number;
    per_page?: number;
    search?: string;
}

export interface DataResponse<T> {
    data: T[];
    last_page: number;
    current_page: number;
    total: number;
}

export async function fetchOptionList<T>(endpoint: string): Promise<T[]> {
    const res = await axios.get(`/api/${endpoint}/list`);
    return res.data.data;
}

export async function fetchTableData<T>(endpoint: string, params: DataParams = { page: 1, per_page: 5 }): Promise<DataResponse<T>> {
    const res = await axios.get(`/api/${endpoint}`, { params });
    return {
        data: res.data.data,
        current_page: res.data.meta.current_page,
        last_page: res.data.meta.last_page,
        total: res.data.meta.total,
    };
}

export async function fetchBy<T>(endpoint: string, key: string, value: string): Promise<T[]> {
    const res = await axios.get(`/api/${endpoint}/by-${key}/${value}`);
    return res.data.data;
}

export async function fetchGeomBy(endpoint: string, key: string, value: string): Promise<any> {
    const res = await axios.get(`/api/${endpoint}/${key}-geometries/${value}`);
    return res.data.data.geom;
}
