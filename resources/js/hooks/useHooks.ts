import type { DataParams, DataResponse } from '@/utils/api-utils';
import useSWR from 'swr';

export function useOptionList<T>(key: string, fetcher: () => Promise<T[]>, enabled: boolean = true) {
    const { data, error, isLoading } = useSWR<T[]>(enabled ? key : null, fetcher);

    return {
        data: data ?? [],
        loading: isLoading,
        error,
    };
}

export function usePaginatedTableData<T>(
    key: string,
    fetcher: (params: DataParams) => Promise<DataResponse<T>>,
    search: string = '',
    page: number = 1,
    per_page: number = 5,
) {
    const swrKey = [key, search, page, per_page];

    const { data, error, isLoading } = useSWR<DataResponse<T>>(() => fetcher({ search, page, per_page }));

    return {
        data: data?.data ?? [],
        total: data?.total ?? 0,
        lastPage: data?.last_page ?? 1,
        loading: isLoading,
        error,
    };
}
