import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FilterConfig } from '@/types';
import { useEffect, useState } from 'react';

interface FilterProps {
    filter: FilterConfig;
    value: string | undefined;
    onChange: (val: string | undefined) => void;
    filters: Record<string, string | undefined>;
}

export default function Filter({ filter, value, onChange, filters }: FilterProps) {
    const [options, setOptions] = useState<{ id: string; label: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetched, setFetched] = useState(false);

    useEffect(() => {
        if (filter.dependsOn) {
            setFetched(false);
            setOptions([]);
            if (value !== undefined) {
                onChange(undefined);
            }
        }
    }, [filter.dependsOn ? filters[filter.dependsOn] : null]);

    const loadOptions = async () => {
        if (fetched) return;
        setLoading(true);
        try {
            const res = await filter.fetchOptions(filters);
            setOptions(res);
            const isValid = res.some((opt) => String(opt.id) === String(value));
            if (value && !isValid) {
                onChange(undefined);
            }
        } catch {
            setOptions([]);
        } finally {
            setLoading(false);
            setFetched(true);
        }
    };

    const handleChange = (val: string) => {
        onChange(val === 'all' ? undefined : val);
    };

    return (
        <div className="w-full space-y-1">
            <Select
                value={value ?? 'all'}
                onValueChange={handleChange}
                onOpenChange={(open) => {
                    if (open) loadOptions();
                }}
            >
                <SelectTrigger>
                    <SelectValue placeholder={`Filter by ${filter.label}`} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All {filter.label}</SelectItem>
                    {loading ? (
                        <SelectItem disabled value="loading">
                            Loading...
                        </SelectItem>
                    ) : (
                        options.map((opt) => (
                            <SelectItem key={opt.id} value={String(opt.id)}>
                                {opt.label}
                            </SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>
        </div>
    );
}
