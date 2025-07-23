import type { Barangay } from '@/types';
import axios from 'axios';

export async function fetchBarangaysByMunicipality(municipalityId: string): Promise<Barangay[]> {
    const res = await axios.get(`/api/barangays/by-municipality/${municipalityId}`);
    return res.data.data;
}

export async function fetchBarangayGeom(barangayId: string) {
    const res = await axios.get(`/api/barangays/barangay-geometries/${barangayId}`);
    return res.data.data.geom;
}
