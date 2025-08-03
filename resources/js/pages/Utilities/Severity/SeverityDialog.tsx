import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/CustomComponents/Dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import DialogActionButtons from '@/components/CustomComponents/DialogActionButtons';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { Severity } from '@/types';
import { FormDialogProps } from '@/types/dialog-props';

const severitySchema = z.object({
    name: z.string().min(1, 'Name is required'),
});

type SeverityFormValues = z.infer<typeof severitySchema>;

type Props = FormDialogProps<Severity>;

export default function SeverityDialog({ open, onOpenChange, initialValue, isEditing, isSubmitting, setSubmitting }: Props) {
    const form = useForm<SeverityFormValues>({
        resolver: zodResolver(severitySchema),
        defaultValues: {
            name: '',
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                name: initialValue?.name || '',
            });
            form.clearErrors();
        }
    }, [open, initialValue]);

    const onSubmit = useFormSubmit<SeverityFormValues>({
        form,
        data: initialValue,
        isEditing,
        routePrefix: 'severities',
        setSubmitting,
        onClose: () => onOpenChange(false),
    });

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
                            <DialogActionButtons isSubmitting={isSubmitting} />
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
