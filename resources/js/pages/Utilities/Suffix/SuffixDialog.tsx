import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/CustomComponents/Dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import DialogActionButtons from '@/components/CustomComponents/DialogActionButtons';
import { Suffix } from '@/types';
import { setServerErrors } from '@/utils/set-server-errors';

const suffixSchema = z.object({
    name: z.string().min(1, 'Name is required'),
});

type SuffixFormValues = z.infer<typeof suffixSchema>;

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    suffix: Suffix | null;
    isEditing: boolean;
};

export default function SuffixDialog({ open, onOpenChange, suffix, isEditing }: Props) {
    const form = useForm<SuffixFormValues>({
        resolver: zodResolver(suffixSchema),
        defaultValues: {
            name: '',
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                name: suffix?.name || '',
            });
            form.clearErrors();
        }
    }, [open, suffix]);

    const onSubmit = (values: SuffixFormValues) => {
        const onSuccess = () => {
            onOpenChange(false);
            form.reset();
        };

        const onError = (errors: Record<string, string>) => {
            setServerErrors(form, errors);
        };

        if (isEditing && suffix) {
            router.put(`/suffixes/${suffix.id}`, values, { onSuccess, onError });
        } else {
            router.post('/suffixes', values, { onSuccess, onError });
        }
    };

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
                            <DialogActionButtons isSubmitting={form.formState.isSubmitting} />
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
