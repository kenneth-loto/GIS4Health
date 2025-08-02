// components/Table/TableRows.tsx
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';
import { AlertTriangle, Edit, Trash2 } from 'lucide-react';

interface Column<T> {
    label: string;
    accessor: string | ((row: T) => React.ReactNode);
    subLabel?: string;
}

interface TableRowsProps<T> {
    data: T[];
    loading: boolean;
    error: boolean;
    page: number;
    perPage: number;
    columns: Column<T>[];
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    reload: () => void;
}

function getNestedValue(obj: any, accessor: string): any {
    return accessor.split('.').reduce((acc, key) => acc?.[key], obj);
}

function renderCellValue<T>(row: T, accessor: Column<T>['accessor']) {
    if (typeof accessor === 'function') return accessor(row);
    return getNestedValue(row, accessor);
}

export function TableRows<T extends { id: string | number }>({
    data,
    loading,
    error,
    page,
    perPage,
    columns,
    onEdit,
    onDelete,
    reload,
}: TableRowsProps<T>) {
    if (loading) {
        return Array.from({ length: perPage }).map((_, i) => (
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

    if (error) {
        return (
            <TableRow>
                <TableCell colSpan={columns.length + 2}>
                    <div className="flex flex-col items-center justify-center space-y-4 px-4 py-12 text-center">
                        <div className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="h-4 w-4 animate-pulse" />
                            <span className="text-sm font-medium sm:text-base">Failed to load data</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Please check your connection or try again later.</p>
                        <Button onClick={reload} variant="outline" className="w-full max-w-[200px] sm:w-auto">
                            Retry
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
        );
    }

    if (data.length === 0) {
        return (
            <TableRow>
                <TableCell colSpan={columns.length + 2} className="py-10 text-center">
                    No records found.
                </TableCell>
            </TableRow>
        );
    }

    return data.map((row, i) => (
        <TableRow key={row.id}>
            <TableCell>{(page - 1) * perPage + i + 1}</TableCell>
            {columns.map((col, index) => {
                const value = renderCellValue(row, col.accessor);
                return (
                    <TableCell key={`${col.label}-${index}`}>
                        <span className={`block break-words whitespace-normal ${value == null ? 'text-gray-400 italic' : ''}`}>{value ?? 'N/A'}</span>
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
}
