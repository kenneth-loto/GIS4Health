import { setServerErrors } from '@/utils/set-server-errors';
import { router } from '@inertiajs/react';
import { FieldValues, UseFormReturn } from 'react-hook-form';

interface UseFormSubmitParams<T extends FieldValues> {
    form: UseFormReturn<T>;
    data: any;
    isEditing: boolean;
    routePrefix: string;
    setSubmitting: (val: boolean) => void;
    onClose: () => void;
}

export function useFormSubmit<T extends FieldValues>({ form, data, isEditing, routePrefix, setSubmitting, onClose }: UseFormSubmitParams<T>) {
    return (values: T) => {
        setSubmitting(true);

        const onSuccess = () => {
            setSubmitting(false);
            onClose();
            form.reset();
        };

        const onError = (errors: Record<string, string>) => {
            setSubmitting(false);
            setServerErrors(form, errors);
        };

        const url = isEditing && data ? `/${routePrefix}/${data.id}` : `/${routePrefix}`;
        const method = isEditing && data ? 'put' : 'post';

        router[method](url, values as Record<string, any>, {
            onSuccess,
            onError,
        });
    };
}
