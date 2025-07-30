import { fetchGeomBy, type DataParams, type DataResponse } from '@/utils/api-utils';
import useSWR from 'swr';

export function useOptionList<T>(key: string, fetcher: () => Promise<T[]>) {
    const { data, error, isLoading } = useSWR<T[]>(key, fetcher);

    return {
        data: data ?? [],
        loading: isLoading,
        error,
    };
}

export function useTableData<T>(
    key: string,
    fetcher: (params: DataParams) => Promise<DataResponse<T>>,
    search: string = '',
    page: number = 1,
    per_page: number = 5,
) {
    const swrKey = [key, search, page, per_page];

    const { data, error, isLoading } = useSWR<DataResponse<T>>(swrKey, () => fetcher({ search, page, per_page }));

    return {
        data: data?.data ?? [],
        total: data?.total ?? 0,
        lastPage: data?.last_page ?? 1,
        loading: isLoading,
        error,
    };
}

export function useFilteredOptionList<T>(key: string, value: string, fetcher: (value: string) => Promise<T[]>) {
    const shouldFetch = Boolean(value);

    const { data, error, isLoading } = useSWR<T[]>(shouldFetch ? `${key}-${value}` : null, () => fetcher(value));

    return {
        data: data ?? [],
        loading: isLoading,
        error,
    };
}

export function useFilteredGeom(endpoint: string, key: string, value: string) {
    const shouldFetch = Boolean(value);

    const { data, error, isLoading } = useSWR(shouldFetch ? `${endpoint}-${key}-geometries-${value}` : null, () => fetchGeomBy(endpoint, key, value));

    return {
        geom: data ?? null,
        loading: isLoading,
        error,
    };
}
