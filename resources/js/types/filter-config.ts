import { FilterOptions } from '@/types/filter-options';

export type FilterConfig = {
    label: string;
    accessor: string;
    param: string;
    dependsOn?: string;
    fetchOptions: (filters?: FilterOptions) => Promise<{ id: string; label: string }[]>;
};
