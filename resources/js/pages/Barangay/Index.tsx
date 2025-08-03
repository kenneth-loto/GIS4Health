import { fetchBarangaysTableData } from '@/api/barangay';
import { fetchMunicipalitiesOptionList } from '@/api/municipality';
import { CustomTable } from '@/components/CustomComponents/Table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Utilities', href: '' },
    { title: 'Barangays', href: '/barangays' },
];

export default function Index() {
    const columns = [
        { label: 'Code', accessor: 'code' },
        { label: 'Name', accessor: 'name' },
        { label: 'Municipality', accessor: 'municipality.name' },
    ];

    const filters = [
        {
            label: 'Municipality',
            accessor: 'municipality.name',
            param: 'municipality_id',
            fetchOptions: async () => {
                const data = await fetchMunicipalitiesOptionList();
                return data.map((municipality) => ({
                    id: municipality.id,
                    label: municipality.name,
                }));
            },
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Diseases" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <CustomTable columns={columns} fetchFn={fetchBarangaysTableData} filters={filters} />
            </div>
        </AppLayout>
    );
}
