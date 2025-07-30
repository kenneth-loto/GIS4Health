import { fetchSuffixesOptionList, fetchSuffixesTableData } from '@/api/suffix';
import { useOptionList, useTableData } from '@/hooks/useHooks';
import type { Suffix } from '@/types';

export function useSuffixesOptionList() {
    return useOptionList<Suffix>('suffixes', fetchSuffixesOptionList);
}

export function useSuffixesTableData(search = '', page = 1, per_page = 5) {
    return useTableData<Suffix>('suffixes', fetchSuffixesTableData, search, page, per_page);
}
