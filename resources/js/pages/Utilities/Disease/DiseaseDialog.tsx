import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/CustomComponents/Dialog';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { ComboboxField } from '@/components/CustomComponents/Combobox';
import DialogActionButtons from '@/components/CustomComponents/DialogActionButtons';

import { useDropdownOptions } from '@/hooks/useDropdownOptions';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { Disease } from '@/types';
import { FormDialogProps } from '@/types/dialog-props';

const diseaseSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    short_description: z.string().optional(),
    category_id: z.string().min(1, 'Category is required'),
});

type DiseaseFormValues = z.infer<typeof diseaseSchema>;

type Props = FormDialogProps<Disease>;

export default function DiseaseDialog({ open, onOpenChange, initialValue, isEditing, isSubmitting, setSubmitting, modal = true }: Props) {
    if (!open) return null;

    const form = useForm<DiseaseFormValues>({
        resolver: zodResolver(diseaseSchema),
        defaultValues: {
            name: '',
            short_description: '',
            category_id: '',
        },
    });

    const { categories, loading, selected } = useDropdownOptions(form, {
        include: ['categories'],
    });

    useEffect(() => {
        if (open) {
            form.reset({
                name: initialValue?.name || '',
                short_description: initialValue?.short_description || '',
                category_id: initialValue?.category.id || '',
            });
            form.clearErrors();
        }
    }, [open, initialValue]);

    const onSubmit = useFormSubmit<DiseaseFormValues>({
        form,
        data: initialValue,
        isEditing,
        routePrefix: 'diseases',
        setSubmitting,
        onClose: () => onOpenChange(false),
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal={modal}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Disease' : 'Add Disease'}</DialogTitle>
                    <DialogDescription>{isEditing ? 'Update the disease details below.' : 'Enter details for the new disease.'}</DialogDescription>
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
                                        <Input placeholder="e.g. Tuberculosis" autoFocus {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="short_description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Short Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="e.g. A bacterial infection that mainly affects the lungs and spreads through the air."
                                            className="h-24 resize-none overflow-y-auto"
                                            {...field}
                                            aria-label="Chat input"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    form.handleSubmit(onSubmit)();
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="category_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <ComboboxField
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            items={categories}
                                            placeholder="Select a category"
                                            loading={loading}
                                            getLabel={(p) => p.name}
                                            error={!!form.formState.errors.category_id}
                                        />
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
