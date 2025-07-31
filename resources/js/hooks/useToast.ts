import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Flash {
    success?: string;
    error?: string;
}

export function useToast() {
    const { flash } = usePage<{ flash: Flash }>().props;

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);
}

export function useToastWithReload() {
    const { flash } = usePage<{ flash: Flash }>().props;
    const [tableKey, setTableKey] = useState(0);

    useEffect(() => {
        if (flash.success || flash.error) {
            if (flash.success) toast.success(flash.success);
            if (flash.error) toast.error(flash.error);

            setTableKey((prev) => prev + 1);
        }
    }, [flash]);

    return tableKey;
}
