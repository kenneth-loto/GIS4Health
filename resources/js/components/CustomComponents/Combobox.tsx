import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useId, useState } from 'react';

interface Option {
    id: string | number;
    [key: string]: any;
}

interface ComboboxFieldProps {
    value: string;
    onValueChange: (value: string) => void;
    items: Option[];
    placeholder?: string;
    loading?: boolean;
    error?: boolean;
    disabled?: boolean;
    getLabel?: (item: Option) => string;
    noResultsText?: string;
    className?: string;
}

export function ComboboxField({
    value,
    onValueChange,
    items,
    placeholder = 'Select an option',
    loading = false,
    error = false,
    disabled = false,
    getLabel = (item) => item?.name ?? '—',
    noResultsText = 'No results found',
    className,
}: ComboboxFieldProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const controlId = useId();

    const selectedItem = items.find((item) => String(item.id) === value);
    const debouncedSearch = useDebounce(search, 300);
    const filteredItems = items.filter((item) => getLabel(item).toLowerCase().includes(debouncedSearch.toLowerCase()));

    return (
        <div className="grid gap-1.5">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id={controlId}
                        disabled={disabled || loading}
                        role="combobox"
                        aria-haspopup="listbox"
                        aria-expanded={open}
                        aria-controls={`${controlId}-options`}
                        variant="outline"
                        className={cn(
                            'w-full justify-between bg-transparent font-normal text-muted-foreground',
                            error && 'border-destructive ring-1 ring-destructive',
                            className,
                        )}
                    >
                        {loading ? 'Loading...' : selectedItem ? getLabel(selectedItem) : placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent
                    className="max-h-60 w-[var(--radix-popover-trigger-width)] overflow-auto p-0"
                    sideOffset={4}
                    align="start"
                    forceMount
                    avoidCollisions={false}
                    side="bottom"
                >
                    <Command>
                        <CommandInput placeholder="Search..." value={search} onValueChange={setSearch} />
                        <CommandEmpty>{noResultsText}</CommandEmpty>
                        <CommandGroup id={`${controlId}-options`}>
                            {filteredItems.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    onSelect={() => {
                                        onValueChange(String(item.id));
                                        setOpen(false);
                                    }}
                                >
                                    <Check className={cn('mr-2 h-4 w-4', String(item.id) === value ? 'opacity-100' : 'opacity-0')} />
                                    {getLabel(item)}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}
