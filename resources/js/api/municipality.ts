import type { Municipality } from '@/types';
import axios from 'axios';

// For simple list fetch (no pagination, no search)
export async function fetchMunicipalitiesOption(): Promise<Municipality[]> {
    const res = await axios.get('/api/municipalities/list');
    return res.data.data;
}
