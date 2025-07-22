import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/CustomComponents/Dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import DialogActionButtons from '@/components/CustomComponents/DialogActionButtons';
import { Severity } from '@/types';
import { setServerErrors } from '@/utils/set-server-errors';

const severitySchema = z.object({
    name: z.string().min(1, 'Name is required'),
});

type SeverityFormValues = z.infer<typeof severitySchema>;

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    severity: Severity | null;
    isEditing: boolean;
};

export default function SeverityDialog({ open, onOpenChange, severity, isEditing }: Props) {
    const form = useForm<SeverityFormValues>({
        resolver: zodResolver(severitySchema),
        defaultValues: {
            name: '',
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                name: severity?.name || '',
            });
            form.clearErrors();
        }
    }, [open, severity]);

    const onSubmit = (values: SeverityFormValues) => {
        const onSuccess = () => {
            onOpenChange(false);
            form.reset();
        };

        const onError = (errors: Record<string, string>) => {
            setServerErrors(form, errors);
        };

        // Perform Inertia form request depending on whether we are editing or adding
        if (isEditing && severity) {
            router.put(`/severities/${severity.id}`, values, { onSuccess, onError });
        } else {
            router.post('/severities', values, { onSuccess, onError });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Severity' : 'Add Severity'}</DialogTitle>
                    <DialogDescription>{isEditing ? 'Update the severity details below.' : 'Enter details for the new severity.'}</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Mild" autoFocus {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <DialogActionButtons isSubmitting={form.formState.isSubmitting} />
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
