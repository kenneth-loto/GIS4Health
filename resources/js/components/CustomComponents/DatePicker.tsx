import { CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerProps {
    date?: string; // expects 'yyyy-mm-dd'
    onChange: (date: string | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function DatePicker({ date, onChange, placeholder = 'Pick a date', disabled = false, className }: DatePickerProps) {
    const [open, setOpen] = React.useState(false);

    const parsedDate = date ? new Date(date) : undefined;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground', className)}
                    disabled={disabled}
                >
                    <CalendarIcon />
                    {parsedDate ? parsedDate.toLocaleDateString('en-CA') : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={parsedDate}
                    onSelect={(selectedDate) => {
                        const formatted = selectedDate?.toLocaleDateString('en-CA');
                        onChange(formatted);
                        setOpen(false);
                    }}
                    captionLayout="dropdown"
                />
            </PopoverContent>
        </Popover>
    );
}
