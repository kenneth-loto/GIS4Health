import { fetchSuffixesOption, fetchSuffixesTableData } from '@/api/suffix';
import { useOptionList, usePaginatedTableData } from '@/hooks/useHooks';
import type { Suffix } from '@/types';

export function useSuffixesOption() {
    return useOptionList<Suffix>('/api/suffixes/list', fetchSuffixesOption);
}

export function useSuffixesTableData(search = '', page = 1, per_page = 5) {
    return usePaginatedTableData<Suffix>('/api/suffixes', fetchSuffixesTableData, search, page, per_page);
}
