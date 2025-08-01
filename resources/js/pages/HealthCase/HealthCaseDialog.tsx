import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/CustomComponents/Dialog';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { ComboboxField } from '@/components/CustomComponents/Combobox';
import DialogActionButtons from '@/components/CustomComponents/DialogActionButtons';

import { useDropdownOptions } from '@/hooks/useDropdownOptions';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { HealthCase } from '@/types';
import { FormDialogProps } from '@/types/dialog-props';

const healthCaseSchema = z.object({
    patient_info_id: z.string().min(1, 'Patient is required'),
    category_id: z.string().min(1, 'Category is required'),
    disease_id: z.string().min(1, 'Disease is required'),
    severity_id: z.string().min(1, 'Severity is required'),
});

type HealthCaseFormValues = z.infer<typeof healthCaseSchema>;

type Props = FormDialogProps<HealthCase>;

export default function HealthCaseDialog({ open, onOpenChange, initialValue, isEditing, isSubmitting, setSubmitting, modal = true }: Props) {
    if (!open) return null;

    const form = useForm<HealthCaseFormValues>({
        resolver: zodResolver(healthCaseSchema),
        defaultValues: {
            patient_info_id: '',
            category_id: '',
            disease_id: '',
            severity_id: '',
        },
    });

    const { patient_infos, categories, severities, diseases, loading, selected } = useDropdownOptions(form, {
        include: ['patient_infos', 'categories', 'severities', 'diseases'],
    });

    useEffect(() => {
        if (open) {
            form.reset({
                patient_info_id: initialValue?.patient_info.id || '',
                category_id: initialValue?.category.id || '',
                disease_id: initialValue?.disease.id || '',
                severity_id: initialValue?.severity.id || '',
            });
            form.clearErrors();
        }
    }, [open, initialValue]);

    const onSubmit = useFormSubmit<HealthCaseFormValues>({
        form,
        data: initialValue,
        isEditing,
        routePrefix: 'health_cases',
        setSubmitting,
        onClose: () => onOpenChange(false),
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal={modal}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Health Case' : 'Add Health Case'}</DialogTitle>
                    <DialogDescription>{isEditing ? 'Update the disease details below.' : 'Enter details for the new disease.'}</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <FormField
                            control={form.control}
                            name="patient_info_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Patient</FormLabel>
                                    <FormControl>
                                        <ComboboxField
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            items={patient_infos}
                                            placeholder="Select a patient"
                                            loading={loading.patient_infos}
                                            getLabel={(p) => `${p.last_name}, ${p.first_name} ${p.middle_name ?? ''} ${p.suffix?.name ?? ''}`}
                                            error={!!form.formState.errors.patient_info_id}
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
                                            loading={loading.categories}
                                            getLabel={(p) => p.name}
                                            error={!!form.formState.errors.category_id}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="disease_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Disease</FormLabel>
                                    <FormControl>
                                        <ComboboxField
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            items={diseases}
                                            placeholder="Select a disease"
                                            loading={loading.diseases}
                                            getLabel={(p) => p.name}
                                            error={!!form.formState.errors.disease_id}
                                            disabled={!selected.categoryId}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="severity_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Severity</FormLabel>
                                    <FormControl>
                                        <ComboboxField
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            items={severities}
                                            placeholder="Select a severity"
                                            loading={loading.severities}
                                            getLabel={(p) => p.name}
                                            error={!!form.formState.errors.severity_id}
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
