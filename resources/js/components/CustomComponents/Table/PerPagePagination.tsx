import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableAction } from '@/hooks/useTableReducer';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PerPagePaginationProps<T> {
    page: number;
    total: number;
    totalPages: number;
    perPage: number;
    dispatch: React.Dispatch<TableAction<T>>;
}

export function PerPagePagination<T>({ page, total, totalPages, perPage, dispatch }: PerPagePaginationProps<T>) {
    return (
        <div className="flex flex-col items-center gap-4 pt-2 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <div className="flex items-center gap-2">
                <span className="text-sm whitespace-nowrap">Rows per page</span>
                <Select
                    value={String(perPage)}
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

            <div className="flex flex-col-reverse items-center gap-2 sm:flex-col-reverse lg:flex-row lg:items-center lg:gap-8">
                <p className="text-sm text-muted-foreground">
                    Page {isNaN(page) ? 1 : page} of {isNaN(totalPages) ? 1 : totalPages}
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
        </div>
    );
}
