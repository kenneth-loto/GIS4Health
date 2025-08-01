import { router } from '@inertiajs/react';

type SetLoadingFn = (loading: boolean) => void;
type CloseFn = () => void;

export function useConfirmDelete<T>(data: T | null, routePrefix: string, setDeleting: SetLoadingFn, closeDelete: CloseFn) {
    return () => {
        if (!data) return;
        setDeleting(true);
        router.delete(`/${routePrefix}/${(data as any).id}`, {
            onFinish: () => {
                setDeleting(false);
                closeDelete();
            },
        });
    };
}
