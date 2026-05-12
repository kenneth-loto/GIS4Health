import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ComboboxField } from '@/components/CustomComponents/Combobox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/CustomComponents/Dialog';
import DialogActionButtons from '@/components/CustomComponents/DialogActionButtons';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useDropdownOptions } from '@/hooks/useDropdownOptions';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { PatientInfo } from '@/types';
import { FormDialogProps } from '@/types/dialog-props';
import MapComponent from './Map';

const patientInfoSchema = z.object({
    first_name: z.string().min(1, 'First Name is required'),
    middle_name: z.string().optional(),
    last_name: z.string().min(1, 'Last Name is required'),
    suffix_id: z.string().optional(),
    municipality_id: z.string().min(1, 'Municipality is required'),
    barangay_id: z.string().min(1, 'Barangay is required'),
    street: z.string().optional(),
    latitude: z.string().min(1, 'Latitude is required'),
    longitude: z.string().min(1, 'Longitude is required'),
});

type PatientInfoFormValues = z.infer<typeof patientInfoSchema>;

type Props = FormDialogProps<PatientInfo>;

export default function PatientInfoDialog({ open, onOpenChange, initialValue, isEditing, isSubmitting, setSubmitting, modal = true }: Props) {
    if (!open) return null;

    const form = useForm<PatientInfoFormValues>({
        resolver: zodResolver(patientInfoSchema),
        defaultValues: {
            first_name: '',
            middle_name: '',
            last_name: '',
            suffix_id: '',
            municipality_id: '',
            barangay_id: '',
            street: '',
            latitude: '',
            longitude: '',
        },
    });

    const { municipalities, barangays, suffixes, barangayGeometry, loading, selected } = useDropdownOptions(form, {
        include: ['municipalities', 'barangays', 'suffixes', 'barangayGeometry'],
    });

    useEffect(() => {
        if (open) {
            form.reset({
                first_name: initialValue?.first_name || '',
                middle_name: initialValue?.middle_name || '',
                last_name: initialValue?.last_name || '',
                suffix_id: initialValue?.suffix?.id || '',
                municipality_id: initialValue?.municipality?.id || '',
                barangay_id: initialValue?.barangay?.id || '',
                street: initialValue?.street || '',
                latitude: initialValue?.latitude || '',
                longitude: initialValue?.longitude || '',
            });
            form.clearErrors();
        }
    }, [open, initialValue]);

    const onSubmit = useFormSubmit<PatientInfoFormValues>({
        form,
        data: initialValue,
        isEditing,
        routePrefix: 'patient_infos',
        setSubmitting,
        onClose: () => onOpenChange(false),
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange} modal={modal}>
            <DialogContent className="sm:max-w-6xl">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Patient Info' : 'Add Patient Info'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Update the patient info details below.' : 'Enter details for the new patient info.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-3 gap-6">
                        {/* Column 1 */}
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="first_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} autoFocus />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="middle_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Middle Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="last_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="suffix_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <FormControl>
                                            <ComboboxField
                                                value={field.value ?? ''}
                                                onValueChange={field.onChange}
                                                items={suffixes}
                                                placeholder="Select a suffix"
                                                loading={loading.suffixes}
                                                getLabel={(p) => p.name}
                                                error={!!form.formState.errors.suffix_id}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="municipality_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Municipality</FormLabel>
                                        <FormControl>
                                            <ComboboxField
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                items={municipalities}
                                                placeholder="Select a municipality"
                                                loading={loading.municipalities}
                                                getLabel={(p) => p.name}
                                                error={!!form.formState.errors.municipality_id}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="barangay_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Barangay</FormLabel>
                                        <FormControl>
                                            <ComboboxField
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                items={barangays}
                                                placeholder="Select a barangay"
                                                loading={loading.barangays}
                                                getLabel={(p) => p.name}
                                                error={!!form.formState.errors.barangay_id}
                                                disabled={!selected.municipalityId}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="street"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Street</FormLabel>
                                        <FormControl>
                                            <Input {...field} readOnly />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="latitude"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Latitude</FormLabel>
                                            <FormControl>
                                                <Input {...field} readOnly />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="longitude"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Longitude</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <FormLabel>Location Map</FormLabel>
                            <MapComponent
                                geom={barangayGeometry}
                                loadingGeometry={loading.barangayGeometry}
                                onSelectCoordinates={(lat, lng) => {
                                    form.setValue('latitude', lat.toFixed(6));
                                    form.setValue('longitude', lng.toFixed(6));
                                }}
                                initialLatitude={initialValue ? parseFloat(initialValue.latitude) : undefined}
                                initialLongitude={initialValue ? parseFloat(initialValue.longitude) : undefined}
                            />
                        </div>

                        {/* Full-width Action Buttons */}
                        <div className="col-span-3">
                            <DialogFooter>
                                <DialogActionButtons isSubmitting={form.formState.isSubmitting} />
                            </DialogFooter>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
