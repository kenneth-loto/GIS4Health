import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import DialogActionButtons from '@/components/CustomComponents/DialogActionButtons';
import { Category } from '@/types';
import { setServerErrors } from '@/utils/set-server-errors';

// Zod validation schema: validates name is required and short_description is optional
const categorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    short_description: z.string().optional(),
});

// Type inferred from schema for form values
type CategoryFormValues = z.infer<typeof categorySchema>;

// Props expected by the dialog
type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category: Category | null; // If null, this is an "Add" form
    isEditing: boolean;
};

export default function CategoryDialog({ open, onOpenChange, category, isEditing }: Props) {
    // Initialize the form using React Hook Form with Zod validation
    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: '',
            short_description: '',
        },
    });

    // Reset form values and errors when dialog opens or category changes
    useEffect(() => {
        if (open) {
            form.reset({
                name: category?.name || '',
                short_description: category?.short_description || '',
            });
            form.clearErrors(); // Clears server-side or client-side validation errors
        }
    }, [open, category]);

    // Submit handler: either create or update the category
    const onSubmit = (values: CategoryFormValues) => {
        // Callback for success response
        const onSuccess = () => {
            onOpenChange(false); // Close the dialog
            form.reset(); // Reset form values
        };

        // Callback for server-side validation errors
        const onError = (errors: Record<string, string>) => {
            setServerErrors(form, errors);
        };

        // Perform Inertia form request depending on whether we are editing or adding
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

                {/* Form wrapper from shadcn */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        {/* Name Field */}
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

                        {/* Category Short Description Field */}
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

                        {/* Action Buttons */}
                        <DialogFooter>
                            <DialogActionButtons isSubmitting={form.formState.isSubmitting} />
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
