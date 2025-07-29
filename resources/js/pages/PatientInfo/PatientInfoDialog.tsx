import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { ComboboxField } from '@/components/CustomComponents/Combobox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/CustomComponents/Dialog';
import DialogActionButtons from '@/components/CustomComponents/DialogActionButtons';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { usePatientInfoLogic } from '@/hooks/use-patient-info-logic';
import { PatientInfo } from '@/types';
import { setServerErrors } from '@/utils/set-server-errors';
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

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    patient_info: PatientInfo | null;
    isEditing: boolean;
    modal: boolean;
};

export default function PatientInfoDialog({ open, onOpenChange, patient_info, isEditing, modal = true }: Props) {
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

    const {
        suffixes,
        loading,
        municipalities,
        loadingMunicipalities,
        barangays,
        loadingBarangays,
        barangayGeometry,
        loadingBarangayGeometry,
        isBarangayDisabled,
        mapResetKey,
    } = usePatientInfoLogic(form, open);

    useEffect(() => {
        if (open) {
            form.reset({
                first_name: patient_info?.first_name || '',
                middle_name: patient_info?.middle_name || '',
                last_name: patient_info?.last_name || '',
                suffix_id: patient_info?.suffix?.id || '',
                municipality_id: patient_info?.municipality?.id || '',
                barangay_id: patient_info?.barangay?.id || '',
                street: patient_info?.street || '',
                latitude: patient_info?.latitude || '',
                longitude: patient_info?.longitude || '',
            });
            form.clearErrors();
        }
    }, [open, patient_info]);

    const onSubmit = (values: PatientInfoFormValues) => {
        const onSuccess = () => {
            onOpenChange(false);
            form.reset();
        };

        const onError = (errors: Record<string, string>) => {
            setServerErrors(form, errors);
        };

        if (isEditing && patient_info) {
            router.put(`/patient_infos/${patient_info.id}`, values, { onSuccess, onError });
        } else {
            router.post('/patient_infos', values, { onSuccess, onError });
        }
    };

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
                                                loading={loading}
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
                                                loading={loadingMunicipalities}
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
                                                loading={loadingBarangays}
                                                getLabel={(p) => p.name}
                                                error={!!form.formState.errors.barangay_id}
                                                disabled={isBarangayDisabled}
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
                                loadingGeometry={loadingBarangayGeometry}
                                resetMap={mapResetKey}
                                onSelectCoordinates={(lat, lng) => {
                                    form.setValue('latitude', lat.toFixed(6));
                                    form.setValue('longitude', lng.toFixed(6));
                                }}
                                initialLatitude={patient_info ? parseFloat(patient_info.latitude) : undefined}
                                initialLongitude={patient_info ? parseFloat(patient_info.longitude) : undefined}
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
