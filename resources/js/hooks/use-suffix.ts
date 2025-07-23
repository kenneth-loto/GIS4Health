import { fetchSuffixesOption, fetchSuffixesTableData, SuffixDataResponse } from '@/api/suffix';
import type { Suffix } from '@/types';

import useSWR from 'swr';

export function useSuffixesOption(dialogOpen: boolean = true) {
    const shouldFetch = dialogOpen;
    const { data, error, isLoading } = useSWR<Suffix[]>(shouldFetch ? '/api/suffixes/options' : null, fetchSuffixesOption);

    return {
        suffixes: data ?? [],
        loading: isLoading,
        error,
    };
}

export function useSuffixesTableData(search: string = '', page: number = 1, per_page: number = 5) {
    const key = ['/api/suffixes', search, page, per_page];

    const { data, error, isLoading } = useSWR<SuffixDataResponse>(key, () => fetchSuffixesTableData({ search, page, per_page }));

    return {
        suffixes: data?.data ?? [],
        total: data?.total ?? 0,
        lastPage: data?.last_page ?? 1,
        loading: isLoading,
        error,
    };
}
