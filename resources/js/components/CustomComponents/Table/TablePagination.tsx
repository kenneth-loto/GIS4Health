import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { TableAction } from '@/hooks/use-table-reducer';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

interface TablePaginationProps<T> {
    page: number;
    total: number;
    totalPages: number;
    dispatch: React.Dispatch<TableAction<T>>;
}

export function TablePagination<T>({ page, total, totalPages, dispatch }: TablePaginationProps<T>) {
    return (
        <div className="flex flex-col items-center justify-between gap-4 pt-2 lg:flex-row">
            <p className="text-sm text-muted-foreground">
                Page {isNaN(page) ? 1 : page} of {isNaN(totalPages) ? 1 : totalPages} — Total {total ?? 0} item
                {total === 1 ? '' : 's'}
            </p>
            <div className="flex flex-wrap items-center gap-1">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => dispatch({ type: 'SET_PAGE', payload: 1 })}
                                disabled={page === 1}
                                aria-label="First page"
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => dispatch({ type: 'SET_PAGE', payload: page - 1 })}
                                className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                                aria-label="Previous page"
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <Button size="sm" variant="default" disabled className="cursor-default">
                                {page}
                            </Button>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => dispatch({ type: 'SET_PAGE', payload: page + 1 })}
                                className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
                                aria-label="Next page"
                            />
                        </PaginationItem>
                        <PaginationItem>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => dispatch({ type: 'SET_PAGE', payload: totalPages })}
                                disabled={page === totalPages}
                                aria-label="Last page"
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}
