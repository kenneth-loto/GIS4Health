import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PerPageProps {
    value: number;
    onChange: (val: number) => void;
}

export function PerPage({ value, onChange }: PerPageProps) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">Per page:</span>
            <Select value={String(value)} onValueChange={(val) => onChange(Number(val))}>
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
    );
}
