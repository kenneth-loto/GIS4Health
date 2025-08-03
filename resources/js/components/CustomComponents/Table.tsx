import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useEffect } from 'react';

import { useDebounce } from '@/hooks/useDebounce';
import { useTableReducer } from '@/hooks/useTableReducer';

import { FilterConfig } from '@/types';

import Filter from '@/components/CustomComponents/Table/Filter';
import { Search } from '@/components/CustomComponents/Table/Search';
import { TableRows } from '@/components/CustomComponents/Table/TableRows';
import { RowsSelected } from './Table/RowSelected';
import { PerPagePagination } from './Table/PerPagePagination';

interface Column<T> {
    label: string;
    accessor: string | ((row: T) => React.ReactNode);
    subLabel?: string;
}

interface TableProps<T> {
    columns: Column<T>[];
    fetchFn: (params: { search: string; page: number; per_page: number; [key: string]: any }) => Promise<{
        data: T[];
        total: number;
        last_page: number;
    }>;
    filters?: FilterConfig[];
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
}

export function CustomTable<T extends { id: string | number }>({ columns, fetchFn, filters = [], onEdit, onDelete }: TableProps<T>) {
    const [state, dispatch] = useTableReducer<T>();
    const debouncedSearch = useDebounce(state.search);

    const totalPages = state.perPage > 0 && Number.isFinite(state.total) ? Math.max(Math.ceil(state.total / state.perPage), 1) : 1;

    const loadData = () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: false });

        fetchFn({
            search: debouncedSearch,
            page: state.page,
            per_page: state.perPage,
            ...state.filters,
        })
            .then((res) => {
                dispatch({ type: 'SET_DATA', payload: res.data });
                dispatch({ type: 'SET_TOTAL', payload: res.total });
            })
            .catch(() => {
                dispatch({ type: 'SET_DATA', payload: [] });
                dispatch({ type: 'SET_TOTAL', payload: 0 });
                dispatch({ type: 'SET_ERROR', payload: true });
            })
            .finally(() => {
                dispatch({ type: 'SET_LOADING', payload: false });
            });
    };

    useEffect(() => {
        loadData();
    }, [debouncedSearch, state.page, state.perPage, JSON.stringify(state.filters)]);

    return (
        <div className="w-full max-w-full space-y-4 rounded-xl border p-4">
            {/* Controls */}
            <div className="flex flex-col items-start">
                <Search
                    value={state.search}
                    onChange={(val) => {
                        dispatch({ type: 'SET_SEARCH', payload: val });
                        dispatch({ type: 'SET_PAGE', payload: 1 });
                    }}
                />
            </div>

            {/* Filters */}
            <div className="grid w-full gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
                {filters.map((filter) => (
                    <div key={filter.param} className="w-full">
                        <Filter
                            filter={filter}
                            value={String(state.filters[filter.param] ?? 'all')}
                            onChange={(val) => {
                                dispatch({ type: 'SET_FILTER', payload: { key: filter.param, value: val } });
                                dispatch({ type: 'SET_PAGE', payload: 1 });
                            }}
                            filters={state.filters}
                        />
                    </div>
                ))}
            </div>

            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        {columns.map((col, i) => (
                            <TableHead key={`${col.label}-${i}`}>
                                <div className="flex flex-col">
                                    <span className="font-medium">{col.label}</span>
                                    {col.subLabel && <span className="text-[10px] text-muted-foreground italic">{col.subLabel}</span>}
                                </div>
                            </TableHead>
                        ))}
                        {(onEdit || onDelete) && <TableHead>Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRows
                        data={state.data}
                        loading={state.loading}
                        error={state.error}
                        page={state.page}
                        perPage={state.perPage}
                        columns={columns}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        reload={loadData}
                    />
                </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex flex-col items-center justify-center gap-2 sm:gap-2 md:gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
                {/* Left: Rows selected */}
                <RowsSelected total={state.total} />

                {/* Right: Combined per page + rows */}
                <PerPagePagination page={state.page} total={state.total} totalPages={totalPages} perPage={state.perPage} dispatch={dispatch} />
            </div>
        </div>
    );
}
