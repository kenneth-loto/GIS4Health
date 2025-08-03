import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/CustomComponents/Dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import DialogActionButtons from '@/components/CustomComponents/DialogActionButtons';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { Suffix } from '@/types';
import { FormDialogProps } from '@/types/dialog-props';

const suffixSchema = z.object({
    name: z.string().min(1, 'Name is required'),
});

type SuffixFormValues = z.infer<typeof suffixSchema>;

type Props = FormDialogProps<Suffix>;

export default function SuffixDialog({ open, onOpenChange, initialValue, isEditing, isSubmitting, setSubmitting }: Props) {
    const form = useForm<SuffixFormValues>({
        resolver: zodResolver(suffixSchema),
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

    const onSubmit = useFormSubmit<SuffixFormValues>({
        form,
        data: initialValue,
        isEditing,
        routePrefix: 'suffixes',
        setSubmitting,
        onClose: () => onOpenChange(false),
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Suffix' : 'Add Suffix'}</DialogTitle>
                    <DialogDescription>{isEditing ? 'Update the suffix details below.' : 'Enter details for the new suffix.'}</DialogDescription>
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
                                        <Input placeholder="e.g. Jr." autoFocus {...field} />
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
