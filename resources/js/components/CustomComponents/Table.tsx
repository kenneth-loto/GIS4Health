import { Edit, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { useDebounce } from '@/hooks/useDebounce';
import { useTableReducer } from '@/hooks/useTableReducer';

import { FilterConfig } from '@/types';

import Filter from './Table/Filter';
import { PerPage } from './Table/PerPage';
import { Search } from './Table/Search';
import { TablePagination } from './Table/TablePagination';

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

function getNestedValue(obj: any, accessor: string): any {
    return accessor.split('.').reduce((acc, key) => acc?.[key], obj);
}

export function CustomTable<T extends { id: number | string }>({ columns, fetchFn, filters = [], onEdit, onDelete }: TableProps<T>) {
    // Hooks
    const [state, dispatch] = useTableReducer<T>();
    const debouncedSearch = useDebounce(state.search);

    const totalPages = state.perPage > 0 && Number.isFinite(state.total) ? Math.max(Math.ceil(state.total / state.perPage), 1) : 1;

    // Data Fetching
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

    // Cell Rendering
    const renderCellValue = (row: T, accessor: Column<T>['accessor']) => {
        if (typeof accessor === 'function') return accessor(row);
        return getNestedValue(row, accessor);
    };

    // Row Rendering
    const renderTableRows = () => {
        if (state.loading) {
            return Array.from({ length: state.perPage }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                    <TableCell>
                        <Skeleton className="h-9 w-3" />
                    </TableCell>
                    {columns.map((_, j) => (
                        <TableCell key={`cell-${i}-${j}`}>
                            <Skeleton className="h-9 w-full" />
                        </TableCell>
                    ))}
                    {(onEdit || onDelete) && (
                        <TableCell>
                            <Skeleton className="h-9 w-20" />
                        </TableCell>
                    )}
                </TableRow>
            ));
        }

        if (state.error) {
            return (
                <TableRow>
                    <TableCell colSpan={columns.length + 2} className="py-10 text-center">
                        <p className="text-red-500">Error loading data.</p>
                        <Button onClick={loadData} className="mt-2">
                            Retry
                        </Button>
                    </TableCell>
                </TableRow>
            );
        }

        if (state.data.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={columns.length + 2} className="py-10 text-center">
                        No records found.
                    </TableCell>
                </TableRow>
            );
        }

        return state.data.map((row, i) => (
            <TableRow key={row.id}>
                <TableCell>{(state.page - 1) * state.perPage + i + 1}</TableCell>
                {columns.map((col, index) => {
                    const value = renderCellValue(row, col.accessor);
                    return (
                        <TableCell key={`${col.label}-${index}`}>
                            <span className={`block break-words whitespace-normal ${value == null ? 'text-gray-400 italic' : ''}`}>
                                {value ?? 'N/A'}
                            </span>
                        </TableCell>
                    );
                })}
                {(onEdit || onDelete) && (
                    <TableCell>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            {onEdit && (
                                <Button variant="outline" className="w-full sm:w-auto sm:min-w-[80px]" onClick={() => onEdit(row)}>
                                    <Edit className="mr-1 h-4 w-4" />
                                    Edit
                                </Button>
                            )}
                            {onDelete && (
                                <Button variant="destructive" className="w-full sm:w-auto sm:min-w-[80px]" onClick={() => onDelete(row)}>
                                    <Trash2 className="mr-1 h-4 w-4" />
                                    Delete
                                </Button>
                            )}
                        </div>
                    </TableCell>
                )}
            </TableRow>
        ));
    };

    // Render
    return (
        <div className="w-full max-w-full space-y-4 rounded-xl border p-4">
            {/* Controls */}
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <PerPage
                    value={state.perPage}
                    onChange={(val) => {
                        dispatch({ type: 'SET_PER_PAGE', payload: val });
                        dispatch({ type: 'SET_PAGE', payload: 1 });
                    }}
                />
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
                                dispatch({
                                    type: 'SET_FILTER',
                                    payload: { key: filter.param, value: val },
                                });
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
                <TableBody>{renderTableRows()}</TableBody>
            </Table>

            {/* Pagination */}
            <TablePagination page={state.page} total={state.total} totalPages={totalPages} dispatch={dispatch} />
        </div>
    );
}
