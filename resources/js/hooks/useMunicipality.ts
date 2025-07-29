import { fetchMunicipalitiesOption, fetchMunicipalitiesTableData } from '@/api/municipality';
import { useOptionList, usePaginatedTableData } from '@/hooks/useHooks';
import type { Suffix } from '@/types';

export function useMunicipalitiesOption() {
    return useOptionList<Suffix>('/api/municipalities/list', fetchMunicipalitiesOption);
}

export function useMunicipalitiesTableData(search = '', page = 1, per_page = 5) {
    return usePaginatedTableData<Suffix>('/api/municipalities', fetchMunicipalitiesTableData, search, page, per_page);
}
