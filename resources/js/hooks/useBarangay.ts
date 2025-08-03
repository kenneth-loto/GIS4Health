import { fetchBarangaysByMunicipalityOptionList, fetchBarangaysTableData } from '@/api/barangay';
import { useFilteredGeom, useFilteredOptionList, useTableData } from '@/hooks/useHooks';
import type { Barangay } from '@/types';

export function useBarangaysTableData(search = '', page = 1, per_page = 5) {
    return useTableData<Barangay>('barangays', fetchBarangaysTableData, search, page, per_page);
}

export function useBarangaysByMunicipalityOptionList(municipalityId: string) {
    return useFilteredOptionList<Barangay>('by-municipality', municipalityId, fetchBarangaysByMunicipalityOptionList);
}

export function useBarangayFilteredGeom(barangayId: string) {
    return useFilteredGeom('barangays', 'barangay', barangayId);
}
