interface RowsSelectedProps {
    total: number;
    selected?: number;
}

export function RowsSelected({ total, selected = 0 }: RowsSelectedProps) {
    return (
        <div className="flex items-center pt-2">
            <p className="text-sm text-muted-foreground">
                {selected} of {total ?? 0} row{total !== 1 ? 's' : ''} selected
            </p>
        </div>
    );
}
