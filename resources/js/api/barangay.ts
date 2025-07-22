import type { Barangay } from '@/types';
import axios from 'axios';

export async function fetchBarangaysByMunicipality(municipalityId: string): Promise<Barangay[]> {
    const res = await axios.get(`/api/barangays/by-municipality/${municipalityId}`);
    return res.data.data;
}
