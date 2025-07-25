import { zodResolver } from '@hookform/resolvers/zod';
import { Head } from '@inertiajs/react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { ComboboxField } from '@/components/CustomComponents/Combobox';

import { fetchBarangayChoroplethGeoJSON } from '@/api/barangay-choropleth-geojson';
import { useCategoriesOption } from '@/hooks/use-category';
import { useDiseasesByCategoryOptions } from '@/hooks/use-disease';

import Choropleth, { ChoroplethRef } from '@/pages/Choropleth/ChoroplethMap';

const filterSchema = z.object({
    time_range: z.string().min(1, 'Time range is required'),
    category_id: z.string().min(1, 'Category is required'),
    disease_id: z.string().min(1, 'Disease is required'),
});

type FilterFormValues = z.infer<typeof filterSchema>;

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Choropleth', href: '/choropleth' }];

export default function ChoroplethIndex() {
    const choroplethRef = useRef<ChoroplethRef>(null);
    const mapRef = useRef<maplibregl.Map>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    const [geojson, setGeojson] = useState<GeoJSON.FeatureCollection | null>(null);
    const [loadingMap, setLoadingMap] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);

    const form = useForm<FilterFormValues>({
        resolver: zodResolver(filterSchema),
        defaultValues: {
            time_range: '',
            category_id: '',
            disease_id: '',
        },
    });

    const {
        control,
        watch,
        setValue,
        reset,
        handleSubmit,
        formState: { isSubmitting },
        getValues,
    } = form;

    const selectedCategoryId = watch('category_id');

    const { categories, loading: loadingCategories } = useCategoriesOption();
    const { diseases, loading: loadingDiseases } = useDiseasesByCategoryOptions(selectedCategoryId);

    const onSubmit = async (data: FilterFormValues) => {
        try {
            setLoadingMap(true);
            const result = await fetchBarangayChoroplethGeoJSON(data);
            setGeojson(result);
        } catch (error) {
            console.error('Failed to fetch choropleth data:', error);
        } finally {
            setLoadingMap(false);
        }
    };

    const onReset = () => {
        reset(); // Reset form
        setGeojson(null); // Clear choropleth
        choroplethRef.current?.resetMap(); // Reset map view
    };

    const selectedDays = getValues('time_range') === 'last_30_days' ? 30 : getValues('time_range') === 'last_90_days' ? 90 : 7;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Choropleth" />

            <div className="flex flex-col gap-4 p-4 lg:min-h-[90vh] lg:flex-row">
                {/* Sidebar */}
                <div className="w-full md:flex-shrink-0 lg:w-[300px]">
                    <Card className="h-full overflow-auto">
                        <CardHeader>
                            <CardTitle>Filters</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    {/* Time Range */}
                                    <FormField
                                        control={control}
                                        name="time_range"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Time Range</FormLabel>
                                                <FormControl>
                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Time Range" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                                                            <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                                                            <SelectItem value="last_90_days">Last 90 Days</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Category */}
                                    <FormField
                                        control={control}
                                        name="category_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <FormControl>
                                                    <ComboboxField
                                                        value={field.value}
                                                        onValueChange={(val) => {
                                                            field.onChange(val);
                                                            setValue('disease_id', ''); // Clear disease on category change
                                                        }}
                                                        items={categories}
                                                        placeholder="Select a category"
                                                        loading={loadingCategories}
                                                        getLabel={(item) => item.name}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Disease */}
                                    <FormField
                                        control={control}
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
                                                        getLabel={(item) => item.name}
                                                        disabled={!selectedCategoryId}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Action Buttons */}
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

                {/* Map Area */}
                <div className="relative flex h-[300px] w-full items-center justify-center overflow-hidden rounded-lg bg-muted md:h-[400px] lg:h-full lg:flex-1">
                    <div className="h-full w-full rounded-xl border shadow">
                        {(!mapLoaded || loadingMap) && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center space-y-2 bg-muted text-muted-foreground">
                                <span className="font-medium">{!mapLoaded ? 'Loading map...' : 'Loading choropleth map...'}</span>
                            </div>
                        )}

                        <Choropleth ref={choroplethRef} geojson={geojson} days={selectedDays} onMapLoad={() => setMapLoaded(true)} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
