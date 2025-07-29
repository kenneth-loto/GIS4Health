import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/CustomComponents/Dialog';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { ComboboxField } from '@/components/CustomComponents/Combobox';
import DialogActionButtons from '@/components/CustomComponents/DialogActionButtons';

import { useCategoriesOption } from '@/hooks/use-category';
import { useDiseasesByCategoryOptions } from '@/hooks/use-disease';
import { usePatientInfosOption } from '@/hooks/use-patient-info';
import { useSeveritiesOptionList } from '@/hooks/useSeverity';
import { HealthCase } from '@/types';
import { setServerErrors } from '@/utils/set-server-errors';

const healthCaseSchema = z.object({
    patient_info_id: z.string().min(1, 'Patient is required'),
    category_id: z.string().min(1, 'Category is required'),
    disease_id: z.string().min(1, 'Disease is required'),
    severity_id: z.string().min(1, 'Severity is required'),
});

type HealthCaseFormValues = z.infer<typeof healthCaseSchema>;

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    health_case: HealthCase | null;
    isEditing: boolean;
    modal: boolean;
};

export default function HealthCaseDialog({ open, onOpenChange, health_case, isEditing, modal = true }: Props) {
    const form = useForm<HealthCaseFormValues>({
        resolver: zodResolver(healthCaseSchema),
        defaultValues: {
            patient_info_id: '',
            category_id: '',
            disease_id: '',
            severity_id: '',
        },
    });
    const { watch } = form;

    const selectedCategoryId = watch('category_id');

    const { patient_infos, loading: loadingPatientInfos } = usePatientInfosOption(open);
    const { categories, loading: loadingCategories } = useCategoriesOption(open);
    const { diseases, loading: loadingDiseases } = useDiseasesByCategoryOptions(open ? selectedCategoryId : '');
    const { data: severities, loading } = useSeveritiesOptionList();

    const isDiseaseDisabled = !selectedCategoryId;

    useEffect(() => {
        if (open) {
            form.reset({
                patient_info_id: health_case?.patient_info.id || '',
                category_id: health_case?.category.id || '',
                disease_id: health_case?.disease.id || '',
                severity_id: health_case?.severity.id || '',
            });
            form.clearErrors();
        }
    }, [open, health_case]);

    const onSubmit = (values: HealthCaseFormValues) => {
        console.log(values);
        const onSuccess = () => {
            onOpenChange(false);
            form.reset();
        };

        const onError = (errors: Record<string, string>) => {
            setServerErrors(form, errors);
        };

        if (isEditing && health_case) {
            router.put(`/health_cases/${health_case.id}`, values, { onSuccess, onError });
        } else {
            router.post('/health_cases', values, { onSuccess, onError });
        }
    };

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
                                            loading={loadingPatientInfos}
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
                                            loading={loadingCategories}
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
                                            loading={loadingDiseases}
                                            getLabel={(p) => p.name}
                                            error={!!form.formState.errors.disease_id}
                                            disabled={isDiseaseDisabled}
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
                                            loading={loading}
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
