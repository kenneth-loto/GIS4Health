import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDebounce } from '@/hooks/use-debounce';
import { useTableReducer } from '@/hooks/use-table-reducer';
import { ChevronsLeft, ChevronsRight, Edit, Search, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

interface Column<T> {
    label: string;
    accessor: string;
}

interface Props<T> {
    columns: Column<T>[];
    fetchFn: (params: { search: string; page: number; per_page: number }) => Promise<{
        data: T[];
        total: number;
        last_page: number;
    }>;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
}

function getNestedValue(obj: any, accessor: string): any {
    return accessor.split('.').reduce((acc, key) => acc?.[key], obj);
}

export function CustomTable<T extends { id: number | string }>({ columns, fetchFn, onEdit, onDelete }: Props<T>) {
    const [state, dispatch] = useTableReducer<T>();
    const debouncedSearch = useDebounce(state.search, 500);
    const totalPages = Number.isFinite(state.total) && state.perPage > 0 ? Math.max(Math.ceil(state.total / state.perPage), 1) : 1;

    const loadData = () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: false });

        fetchFn({ search: debouncedSearch, page: state.page, per_page: state.perPage })
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
    }, [debouncedSearch, state.page, state.perPage]);

    return (
        <div className="container mx-auto space-y-4 rounded-xl border p-4">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                    <span className="text-sm whitespace-nowrap">Per page:</span>
                    <Select
                        value={String(state.perPage)}
                        onValueChange={(val) => {
                            dispatch({ type: 'SET_PER_PAGE', payload: Number(val) });
                            dispatch({ type: 'SET_PAGE', payload: 1 });
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[5, 10, 25, 50].map((num) => (
                                <SelectItem key={num} value={String(num)}>
                                    {num}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="relative w-full sm:w-1/4">
                    <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        aria-label="Search"
                        type="text"
                        placeholder="Search..."
                        value={state.search}
                        onChange={(e) => {
                            dispatch({ type: 'SET_SEARCH', payload: e.target.value });
                            dispatch({ type: 'SET_PAGE', payload: 1 });
                        }}
                        className="pl-9"
                    />
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>#</TableHead>
                        {columns.map((col, i) => (
                            <TableHead key={col.label + i}>{col.label}</TableHead>
                        ))}
                        {(onEdit || onDelete) && <TableHead>Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {state.loading ? (
                        Array.from({ length: state.perPage }).map((_, i) => (
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
                        ))
                    ) : state.error ? (
                        <TableRow>
                            <TableCell colSpan={columns.length + 2} className="py-10 text-center">
                                <p className="text-red-500">Error loading data.</p>
                                <Button onClick={loadData} className="mt-2">
                                    Retry
                                </Button>
                            </TableCell>
                        </TableRow>
                    ) : state.data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length + 2} className="py-10 text-center">
                                No records found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        state.data.map((row, i) => (
                            <TableRow key={row.id}>
                                <TableCell>{(state.page - 1) * state.perPage + i + 1}</TableCell>
                                {columns.map((col, index) => {
                                    const value = getNestedValue(row, col.accessor);
                                    return (
                                        <TableCell key={col.label + index}>
                                            <span className={(value == null ? 'text-gray-400 italic' : '') + ' block break-words whitespace-normal'}>
                                                {value ?? 'N/A'}
                                            </span>
                                        </TableCell>
                                    );
                                })}
                                {(onEdit || onDelete) && (
                                    <TableCell>
                                        <div className="flex w-full flex-col gap-2 lg:flex-row">
                                            {onEdit && (
                                                <Button variant="outline" className="w-full sm:w-auto" onClick={() => onEdit(row)}>
                                                    <Edit className="mr-1 h-4 w-4" />
                                                    Edit
                                                </Button>
                                            )}
                                            {onDelete && (
                                                <Button variant="destructive" className="w-full sm:w-auto" onClick={() => onDelete(row)}>
                                                    <Trash2 className="mr-1 h-4 w-4" />
                                                    Delete
                                                </Button>
                                            )}
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <div className="flex flex-col items-center justify-between gap-4 pt-2 lg:flex-row">
                <p className="text-sm text-muted-foreground">
                    Page {isNaN(state.page) ? 1 : state.page} of {isNaN(totalPages) ? 1 : totalPages} — Total {state.total ?? 0} item
                    {state.total === 1 ? '' : 's'}
                </p>
                <div className="flex flex-wrap items-center gap-1">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => dispatch({ type: 'SET_PAGE', payload: 1 })}
                                    disabled={state.page === 1}
                                    aria-label="First page"
                                >
                                    <ChevronsLeft className="h-4 w-4" />
                                </Button>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => dispatch({ type: 'SET_PAGE', payload: state.page - 1 })}
                                    className={state.page === 1 ? 'pointer-events-none opacity-50' : ''}
                                    aria-label="Previous page"
                                />
                            </PaginationItem>
                            <PaginationItem>
                                <Button size="sm" variant="default" disabled className="cursor-default">
                                    {state.page}
                                </Button>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => dispatch({ type: 'SET_PAGE', payload: state.page + 1 })}
                                    className={state.page === totalPages ? 'pointer-events-none opacity-50' : ''}
                                    aria-label="Next page"
                                />
                            </PaginationItem>
                            <PaginationItem>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => dispatch({ type: 'SET_PAGE', payload: totalPages })}
                                    disabled={state.page === totalPages}
                                    aria-label="Last page"
                                >
                                    <ChevronsRight className="h-4 w-4" />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    );
}
