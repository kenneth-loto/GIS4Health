import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Row } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
// import { useTasks } from '../context/tasks-context';
// import { labels } from '../data/data';
// import { taskSchema } from '../data/schema';

interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
    // const task = taskSchema.parse(row.original);

    // const { setOpen, setCurrentRow } = useTasks();

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                    <Ellipsis className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem
                // onClick={() => {
                //     setCurrentRow(task);
                //     setOpen('update');
                // }}
                >
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem disabled>Make a copy</DropdownMenuItem>
                <DropdownMenuItem disabled>Favorite</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        {/* <DropdownMenuRadioGroup value={task.label}>
                            {labels.map((label) => (
                                <DropdownMenuRadioItem key={label.value} value={label.value}>
                                    {label.label}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup> */}
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem
                    onClick={() => {
                        setCurrentRow(task);
                        setOpen('delete');
                    }}
                >
                    Delete
                    <DropdownMenuShortcut>
                        <Trash size={16} />
                    </DropdownMenuShortcut>
                </DropdownMenuItem> */}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
