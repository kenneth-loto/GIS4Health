import { fetchMunicipalitiesTableData } from '@/api/municipality';
import { CustomTable } from '@/components/CustomComponents/Table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Utilities', href: '' },
    { title: 'Municipalities', href: '/municipalities' },
];

export default function Index() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Municipalities" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <CustomTable
                    columns={[
                        { label: 'Code', accessor: 'code' },
                        { label: 'Name', accessor: 'name' },
                    ]}
                    fetchFn={fetchMunicipalitiesTableData}
                />
            </div>
        </AppLayout>
    );
}
