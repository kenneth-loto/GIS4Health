import { fetchMunicipalitiesOptionList, fetchMunicipalitiesTableData } from '@/api/municipality';
import { useOptionList, useTableData } from '@/hooks/useHooks';
import type { Suffix } from '@/types';

export function useMunicipalitiesOptionList() {
    return useOptionList<Suffix>('municipalities', fetchMunicipalitiesOptionList);
}

export function useMunicipalitiesTableData(search = '', page = 1, per_page = 5) {
    return useTableData<Suffix>('municipalities', fetchMunicipalitiesTableData, search, page, per_page);
}
