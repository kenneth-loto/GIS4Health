import { fetchBarangaysByMunicipality } from '@/api/barangay';
import { useFilteredGeom, useFilteredOptionList } from '@/hooks/useHooks';
import type { Barangay } from '@/types';

export function useBarangaysByMunicipalityOptions(municipalityId: string) {
    return useFilteredOptionList<Barangay>('by-municipality', municipalityId, fetchBarangaysByMunicipality);
}

export function useBarangayFilteredGeom(barangayId: string) {
    return useFilteredGeom('barangays', 'barangay', barangayId);
}
