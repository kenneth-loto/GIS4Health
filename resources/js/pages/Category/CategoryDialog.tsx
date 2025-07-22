import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/CustomComponents/Dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import DialogActionButtons from '@/components/CustomComponents/DialogActionButtons';
import { Category } from '@/types';
import { setServerErrors } from '@/utils/set-server-errors';

const categorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    short_description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: Category | null;
    isEditing: boolean;
};

export default function CategoryDialog({ open, onOpenChange, category, isEditing }: Props) {
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
                name: category?.name || '',
                short_description: category?.short_description || '',
            });
            form.clearErrors();
        }
    }, [open, category]);

    const onSubmit = (values: CategoryFormValues) => {
        const onSuccess = () => {
            onOpenChange(false);
            form.reset();
        };

        const onError = (errors: Record<string, string>) => {
            setServerErrors(form, errors);
        };

        if (isEditing && category) {
            router.put(`/categories/${category.id}`, values, { onSuccess, onError });
        } else {
            router.post('/categories', values, { onSuccess, onError });
        }
    };

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
