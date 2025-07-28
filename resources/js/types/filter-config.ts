export type FilterConfig = {
    label: string;
    accessor: string;
    param: string;
    dependsOn?: string;
    fetchOptions: (filters?: Record<string, string | undefined>) => Promise<{ id: string; label: string }[]>;
};
