import { fetchCategoriesOption } from '@/api/category';
import { fetchDiseasesByCategory } from '@/api/disease';
import { fetchHealthCasesTableData } from '@/api/health_case';
import { fetchSeveritiesOptionList } from '@/api/severity';
import DeleteDialog from '@/components/CustomComponents/DeleteDialog';
import { CustomTable } from '@/components/CustomComponents/Table';
import { Button } from '@/components/ui/button';
import { useCrudDialog } from '@/hooks/use-crud-dialog';
import useToast from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { HealthCase, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import HealthCaseDialog from './HealthCaseDialog';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Health Cases', href: '/health_cases' }];

export default function Index() {
    const { isOpen, mode, data, isDeleteOpen, isDeleting, openAdd, openEdit, closeForm, openDelete, closeDelete, setDeleting } =
        useCrudDialog<HealthCase>();

    useToast(() => setTableKey((prev) => prev + 1));

    const [tableKey, setTableKey] = useState(0);

    const confirmDelete = () => {
        if (!data) return;
        setDeleting(true);
        router.delete(`/health_cases/${data.id}`, {
            onFinish: () => {
                setDeleting(false);
                closeDelete();
            },
        });
    };

    const columns = [
        {
            label: 'Name',
            accessor: (row: HealthCase) => {
                const parts = [
                    row.patient_info.last_name,
                    row.patient_info.first_name,
                    row.patient_info.middle_name || '',
                    row.patient_info.suffix?.name || '',
                ].filter(Boolean);
                return parts.join(', ');
            },
        },
        {
            label: 'Category',
            accessor: (row: HealthCase) => row.category?.name ?? '',
        },
        {
            label: 'Disease',
            accessor: (row: HealthCase) => row.disease?.name ?? '',
        },
        {
            label: 'Severity',
            accessor: (row: HealthCase) => row.severity?.name ?? '',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Health Cases" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex justify-end">
                    <Button onClick={openAdd}>Add</Button>
                </div>

                <CustomTable
                    key={tableKey}
                    columns={columns}
                    fetchFn={fetchHealthCasesTableData}
                    onEdit={openEdit}
                    onDelete={openDelete}
                    filters={[
                        {
                            label: 'Category',
                            accessor: 'category.name',
                            param: 'category_id',
                            fetchOptions: async () => {
                                const data = await fetchCategoriesOption();
                                return data.map((category) => ({
                                    id: category.id,
                                    label: category.name,
                                }));
                            },
                        },
                        {
                            label: 'Disease',
                            accessor: 'disease.name',
                            param: 'disease_id',
                            dependsOn: 'category_id',
                            fetchOptions: async (filters) => {
                                const categoryId = filters?.category_id;
                                if (!categoryId) return [];
                                const data = await fetchDiseasesByCategory(categoryId);
                                return data.map((disease) => ({
                                    id: disease.id,
                                    label: disease.name,
                                }));
                            },
                        },
                        {
                            label: 'Severity',
                            accessor: 'severity.name',
                            param: 'severity_id',
                            fetchOptions: async () => {
                                const data = await fetchSeveritiesOptionList();
                                return data.map((severity) => ({
                                    id: severity.id,
                                    label: severity.name,
                                }));
                            },
                        },
                    ]}
                />

                <HealthCaseDialog open={isOpen} onOpenChange={closeForm} health_case={data} isEditing={mode === 'edit'} modal={false} />

                <DeleteDialog open={isDeleteOpen} onCancel={closeDelete} onConfirm={confirmDelete} isLoading={isDeleting} />
            </div>
        </AppLayout>
    );
}
