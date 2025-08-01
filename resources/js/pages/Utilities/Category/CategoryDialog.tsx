import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/CustomComponents/Dialog';
import DialogActionButtons from '@/components/CustomComponents/DialogActionButtons';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { Category } from '@/types';
import { FormDialogProps } from '@/types/dialog-props';

const categorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    short_description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

type Props = FormDialogProps<Category>;

export default function CategoryDialog({ open, onOpenChange, initialValue, isEditing, isSubmitting, setSubmitting }: Props) {
    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: '',
            short_description: '',
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                name: initialValue?.name || '',
                short_description: initialValue?.short_description || '',
            });
            form.clearErrors();
        }
    }, [open, initialValue]);

    const onSubmit = useFormSubmit<CategoryFormValues>({
        form,
        data: initialValue,
        isEditing,
        routePrefix: 'categories',
        setSubmitting,
        onClose: () => onOpenChange(false),
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Category' : 'Add Category'}</DialogTitle>
                    <DialogDescription>{isEditing ? 'Update the category details below.' : 'Enter details for the new category.'}</DialogDescription>
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
                                        <Input placeholder="e.g. Waterborne Diseases" autoFocus {...field} />
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
                                            placeholder="e.g. Diseases caused by contaminated water sources, such as cholera and typhoid."
                                            className="h-24 resize-none overflow-y-auto"
                                            {...field}
                                            aria-label="Short Description"
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

                        <DialogFooter>
                            <DialogActionButtons isSubmitting={form.formState.isSubmitting} />
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
