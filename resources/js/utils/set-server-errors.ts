import { FieldValues, Path, UseFormReturn } from 'react-hook-form';

export function setServerErrors<T extends FieldValues>(form: UseFormReturn<T>, errors: Record<string, string>) {
    Object.entries(errors).forEach(([field, message]) => {
        form.setError(field as Path<T>, {
            type: 'server',
            message,
        });
    });
}
