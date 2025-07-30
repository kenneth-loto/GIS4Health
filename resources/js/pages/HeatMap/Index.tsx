// Imports
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Head } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { fetchHeatMapGeoJSON } from '@/api/heatmap';
import HeatMap, { HeatMapRef } from '@/pages/HeatMap/HeatMap';
import { useRef, useState } from 'react';

// UI Components
import { ComboboxField } from '@/components/CustomComponents/Combobox';
import { DatePicker } from '@/components/CustomComponents/DatePicker';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormRequiredLabel } from '@/components/CustomComponents/Form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDropdownOptions } from '@/hooks/useDropdownOptions';

// Schema
const FilterSchema = z
    .object({
        category_id: z.string().min(1, 'Category is required'),
        disease_id: z.string().min(1, 'Disease is required'),
        municipality_id: z.string().optional(),
        barangay_id: z.string().optional(),
        severity_id: z.string().optional(),
        from: z.string().optional(),
        to: z.string().optional(),
    })
    .refine((data) => !data.from || !data.to || new Date(data.from) <= new Date(data.to), {
        message: 'Start date must be before end date.',
        path: ['to'],
    });

type FilterFormValues = z.infer<typeof FilterSchema>;

const breadcrumbs: BreadcrumbItem[] = [{ title: 'HeatMap', href: '/heatmap' }];

export default function Index() {
    // Form Setup
    const form = useForm<FilterFormValues>({
        resolver: zodResolver(FilterSchema),
        defaultValues: {
            category_id: '',
            disease_id: '',
            municipality_id: '',
            barangay_id: '',
            severity_id: '',
        },
    });

    const {
        handleSubmit,
        reset,
        setValue,
        formState: { isSubmitting },
    } = form;

    // Map State
    const heatMapRef = useRef<HeatMapRef>(null);
    const [geojson, setGeojson] = useState<GeoJSON.FeatureCollection | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [loadingMap, setLoadingMap] = useState(false);

    // Filters
    const { categories, municipalities, severities, diseases, barangays, loading, selected } = useDropdownOptions(form);

    // Handlers
    const onSubmit = async (data: FilterFormValues) => {
        setLoadingMap(true);
        console.log(data);
        try {
            const result = await fetchHeatMapGeoJSON(data);
            setGeojson(result);
        } catch (error) {
            console.error('Failed to fetch heat map data:', error);
        } finally {
            setLoadingMap(false);
        }
    };

    const onReset = () => {
        reset();
        setGeojson(null);
        heatMapRef.current?.resetMap();
    };

    // Render
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="HeatMap" />

            <div className="flex flex-col gap-4 p-4 lg:min-h-[90vh] lg:flex-row">
                {/* Filter Panel */}
                <div className="w-full md:flex-shrink-0 lg:w-[320px]">
                    <Card className="h-full overflow-auto">
                        <CardHeader>
                            <CardTitle>Filters</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        name="municipality_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Municipality</FormLabel>
                                                <FormControl>
                                                    <ComboboxField
                                                        {...field}
                                                        value={field.value ?? ''}
                                                        onValueChange={(val) => {
                                                            field.onChange(val);
                                                            setValue('barangay_id', '');
                                                        }}
                                                        items={municipalities}
                                                        loading={loading.municipalities}
                                                        placeholder="Select a municipality"
                                                        getLabel={(item) => item.name}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        name="barangay_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Barangay</FormLabel>
                                                <FormControl>
                                                    <ComboboxField
                                                        {...field}
                                                        value={field.value ?? ''}
                                                        onValueChange={field.onChange}
                                                        items={barangays}
                                                        loading={loading.barangays}
                                                        disabled={!selected.municipalityId}
                                                        placeholder="Select a barangay"
                                                        getLabel={(item) => item.name}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        name="category_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormRequiredLabel>Category</FormRequiredLabel>
                                                <FormControl>
                                                    <ComboboxField
                                                        value={field.value ?? ''}
                                                        onValueChange={(val) => {
                                                            field.onChange(val);
                                                            setValue('disease_id', '');
                                                        }}
                                                        items={categories}
                                                        loading={loading.categories}
                                                        placeholder="Select a category"
                                                        getLabel={(item) => item.name}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        name="disease_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormRequiredLabel>Disease</FormRequiredLabel>
                                                <FormControl>
                                                    <ComboboxField
                                                        value={field.value ?? ''}
                                                        onValueChange={field.onChange}
                                                        items={diseases}
                                                        loading={loading.diseases}
                                                        disabled={!selected.categoryId}
                                                        placeholder="Select a disease"
                                                        getLabel={(item) => item.name}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        name="severity_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Severity</FormLabel>
                                                <FormControl>
                                                    <ComboboxField
                                                        value={field.value ?? ''}
                                                        onValueChange={field.onChange}
                                                        items={severities}
                                                        loading={loading.severities}
                                                        placeholder="Select a severity"
                                                        getLabel={(item) => item.name}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex gap-4">
                                        <FormField
                                            name="from"
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel>From</FormLabel>
                                                    <FormControl>
                                                        <DatePicker date={field.value} onChange={field.onChange} placeholder="From date" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            name="to"
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel>To</FormLabel>
                                                    <FormControl>
                                                        <DatePicker date={field.value} onChange={field.onChange} placeholder="To date" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <Button className="flex-1" type="submit" disabled={isSubmitting}>
                                            Filter
                                        </Button>
                                        <Button className="flex-1" type="button" variant="outline" onClick={onReset}>
                                            Reset
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                {/* Map Panel */}
                <div className="relative flex h-[300px] w-full items-center justify-center overflow-hidden rounded-lg bg-muted md:h-[400px] lg:h-full lg:flex-1">
                    <div className="relative h-full w-full rounded-xl border shadow">
                        {(!mapLoaded || loadingMap) && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center space-y-2 bg-muted text-muted-foreground">
                                <span className="font-medium">{!mapLoaded ? 'Loading map...' : 'Loading heat map...'}</span>
                            </div>
                        )}
                        <HeatMap ref={heatMapRef} geojson={geojson} onMapLoad={() => setMapLoaded(true)} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
