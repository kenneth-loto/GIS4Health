import { fetchCategoriesOptionList } from '@/api/category';
import { fetchDiseasesTableData } from '@/api/disease';
import DeleteDialog from '@/components/CustomComponents/DeleteDialog';
import { CustomTable } from '@/components/CustomComponents/Table';
import { Button } from '@/components/ui/button';
import { useConfirmDelete } from '@/hooks/useConfirmDelete';
import { useCrudDialog } from '@/hooks/useCrudDialog';
import { useToastWithReload } from '@/hooks/useToast';
import AppLayout from '@/layouts/app-layout';
import DiseaseDialog from '@/pages/Utilities/Disease/DiseaseDialog';
import { Disease, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Utilities', href: '' },
    { title: 'Diseases', href: '/diseases' },
];

export default function Index() {
    const {
        isOpen,
        mode,
        data,
        isDeleteOpen,
        isDeleting,
        isSubmitting,
        openAdd,
        openEdit,
        closeForm,
        openDelete,
        closeDelete,
        setDeleting,
        setSubmitting,
    } = useCrudDialog<Disease>();

    const tableKey = useToastWithReload();

    const confirmDelete = useConfirmDelete(data, 'diseases', setDeleting, closeDelete);

    const columns = [
        { label: 'Name', accessor: 'name' },
        { label: 'Short Description', accessor: 'short_description' },
        { label: 'Category', accessor: 'category.name' },
    ];

    const filters = [
        {
            label: 'Category',
            accessor: 'category.name',
            param: 'category_id',
            fetchOptions: async () => {
                const data = await fetchCategoriesOptionList();
                return data.map((category) => ({
                    id: category.id,
                    label: category.name,
                }));
            },
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Diseases" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex justify-end">
                    <Button onClick={openAdd}>Add</Button>
                </div>

                <CustomTable
                    key={tableKey}
                    columns={columns}
                    fetchFn={fetchDiseasesTableData}
                    onEdit={openEdit}
                    onDelete={openDelete}
                    filters={filters}
                />

                <DiseaseDialog
                    open={isOpen}
                    onOpenChange={(open) => {
                        if (!isSubmitting && !open) closeForm();
                    }}
                    initialValue={data}
                    isEditing={mode === 'edit'}
                    isSubmitting={isSubmitting}
                    setSubmitting={setSubmitting}
                    modal={false}
                />

                <DeleteDialog open={isDeleteOpen} onCancel={closeDelete} onConfirm={confirmDelete} isLoading={isDeleting} />
            </div>
        </AppLayout>
    );
}
