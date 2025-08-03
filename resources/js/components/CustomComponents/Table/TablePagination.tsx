import { Button } from '@/components/ui/button';
import { TableAction } from '@/hooks/useTableReducer';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface TablePaginationProps<T> {
    page: number;
    total: number;
    totalPages: number;
    dispatch: React.Dispatch<TableAction<T>>;
}

export function TablePagination<T>({ page, total, totalPages, dispatch }: TablePaginationProps<T>) {
    return (
        <div className="flex flex-col-reverse items-center justify-between gap-6 pt-2 lg:flex-row lg:items-center lg:justify-end">
            <p className="text-sm text-muted-foreground">
                Page {isNaN(page) ? 1 : page} of {isNaN(totalPages) ? 1 : totalPages} — Total {total ?? 0} item
                {total === 1 ? '' : 's'}
            </p>
            <div className="flex items-center gap-2">
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => dispatch({ type: 'SET_PAGE', payload: 1 })}
                    disabled={page === 1}
                    aria-label="First page"
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => dispatch({ type: 'SET_PAGE', payload: page - 1 })}
                    disabled={page === 1}
                    aria-label="Previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => dispatch({ type: 'SET_PAGE', payload: page + 1 })}
                    disabled={page === totalPages}
                    aria-label="Next page"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => dispatch({ type: 'SET_PAGE', payload: totalPages })}
                    disabled={page === totalPages}
                    aria-label="Last page"
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
