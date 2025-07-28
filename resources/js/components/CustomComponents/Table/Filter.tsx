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

    useEffect(() => {
        let active = true;
        setLoading(true);

        filter
            .fetchOptions(filters)
            .then((res) => {
                if (!active) return;

                setOptions(res);

                const isValid = res.some((opt) => String(opt.id) === String(value));
                if (value && !isValid) {
                    onChange(undefined);
                }
            })
            .catch(() => {
                if (active) setOptions([]);
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [filter.param, filter.dependsOn ? filters[filter.dependsOn] : null, filter.fetchOptions]);

    const handleChange = (val: string) => {
        onChange(val === 'all' ? undefined : val);
    };

    return (
        <div className="w-full sm:w-1/6">
            <Select value={value ?? 'all'} onValueChange={handleChange}>
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
