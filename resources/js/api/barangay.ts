import type { Barangay } from '@/types';
import { fetchBy, fetchGeomBy } from '@/utils/api-utils';

export function fetchBarangaysByMunicipality(municipalityId: string): Promise<Barangay[]> {
    return fetchBy<Barangay>('barangays', 'municipality', municipalityId);
}

export function fetchBarangayGeom(barangayId: string) {
    return fetchGeomBy('barangays', 'barangay', barangayId);
}
