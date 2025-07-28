import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';

interface SearchProps {
    value: string;
    onChange: (val: string) => void;
}

export function Search({ value, onChange }: SearchProps) {
    return (
        <div className="relative w-full sm:w-1/4">
            <SearchIcon className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
            <Input
                aria-label="Search"
                type="text"
                placeholder="Search..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-9"
            />
        </div>
    );
}
