import { fetchMunicipalitiesOption, fetchMunicipalitiesTableData } from '@/api/municipality';
import { useOptionList, usePaginatedTableData } from '@/hooks/useHooks';
import type { Suffix } from '@/types';

export function useMunicipalitiesOptionList() {
    return useOptionList<Suffix>('municipalities', fetchMunicipalitiesOption);
}

export function useMunicipalitiesTableData(search = '', page = 1, per_page = 5) {
    return usePaginatedTableData<Suffix>('municipalities', fetchMunicipalitiesTableData, search, page, per_page);
}
