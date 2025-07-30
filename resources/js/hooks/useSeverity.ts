import { fetchSeveritiesOptionList, fetchSeveritiesTableData } from '@/api/severity';
import { useOptionList, useTableData } from '@/hooks/useHooks';
import type { Severity } from '@/types';

export function useSeveritiesOptionList() {
    return useOptionList<Severity>('severities', fetchSeveritiesOptionList);
}

export function useSeveritiesTableData(search = '', page = 1, per_page = 5) {
    return useTableData<Severity>('severities', fetchSeveritiesTableData, search, page, per_page);
}
