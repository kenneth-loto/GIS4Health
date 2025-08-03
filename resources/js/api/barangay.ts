import type { Barangay } from '@/types';
import { DataParams, fetchBy, fetchGeomBy, fetchTableData } from '@/utils/api-utils';

export const fetchBarangaysTableData = (params?: DataParams) => fetchTableData<Barangay>('barangays', params);

export function fetchBarangaysByMunicipalityOptionList(municipalityId: string): Promise<Barangay[]> {
    return fetchBy<Barangay>('barangays', 'municipality', municipalityId);
}

export function fetchFilteredBarangayGeom(barangayId: string) {
    return fetchGeomBy('barangays', 'barangay', barangayId);
}
