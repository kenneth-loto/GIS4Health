import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface Flash {
    success?: string;
    error?: string;
}

export default function useToast(callback?: (flash: Flash) => void) {
    const { flash } = usePage<{ flash: Flash }>().props;

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success);
        }

        if (flash.error) {
            toast.error(flash.error);
        }

        if ((flash.success || flash.error) && callback) {
            callback(flash);
        }
    }, [flash]);
}
