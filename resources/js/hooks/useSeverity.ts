import { fetchSeveritiesOptionList, fetchSeveritiesTableData } from '@/api/severity';
import { useOptionList, usePaginatedTableData } from '@/hooks/useHooks';
import type { Severity } from '@/types';

export function useSeveritiesOptionList() {
    return useOptionList<Severity>('/api/severities/list', fetchSeveritiesOptionList);
}

export function useSeveritiesTableData(search = '', page = 1, per_page = 5) {
    return usePaginatedTableData<Severity>('/api/severities', fetchSeveritiesTableData, search, page, per_page);
}
