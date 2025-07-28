import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/CustomComponents/Dialog';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { ComboboxField } from '@/components/CustomComponents/Combobox';
import DialogActionButtons from '@/components/CustomComponents/DialogActionButtons';

import { useCategoriesOption } from '@/hooks/use-category';
import { Disease } from '@/types';
import { setServerErrors } from '@/utils/set-server-errors';

const diseaseSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    short_description: z.string().optional(),
    category_id: z.string().min(1, 'Category is required'),
});

type DiseaseFormValues = z.infer<typeof diseaseSchema>;

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    disease: Disease | null;
    isEditing: boolean;
    modal: boolean;
};

export default function DiseaseDialog({ open, onOpenChange, disease, isEditing, modal = true }: Props) {
    const form = useForm<DiseaseFormValues>({
        resolver: zodResolver(diseaseSchema),
        defaultValues: {
            name: '',
            short_description: '',
            category_id: '',
        },
    });

    const { categories, loading: loadingCategories } = useCategoriesOption(open);

    useEffect(() => {
        if (open) {
            form.reset({
                name: disease?.name || '',
                short_description: disease?.short_description || '',
                category_id: disease?.category.id || '',
            });
            form.clearErrors();
        }
    }, [open, disease]);

    const onSubmit = (values: DiseaseFormValues) => {
        const onSuccess = () => {
            onOpenChange(false);
            form.reset();
        };

        const onError = (errors: Record<string, string>) => {
            setServerErrors(form, errors);
        };

        if (isEditing && disease) {
            router.put(`/diseases/${disease.id}`, values, { onSuccess, onError });
        } else {
            router.post('/diseases', values, { onSuccess, onError });
        }
    };

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
                                            loading={loadingCategories}
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
