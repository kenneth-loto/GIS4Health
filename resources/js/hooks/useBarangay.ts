import { fetchBarangaysByMunicipalityOptionList } from '@/api/barangay';
import { useFilteredGeom, useFilteredOptionList } from '@/hooks/useHooks';
import type { Barangay } from '@/types';

export function useBarangaysByMunicipalityOptionList(municipalityId: string) {
    return useFilteredOptionList<Barangay>('by-municipality', municipalityId, fetchBarangaysByMunicipalityOptionList);
}

export function useBarangayFilteredGeom(barangayId: string) {
    return useFilteredGeom('barangays', 'barangay', barangayId);
}
