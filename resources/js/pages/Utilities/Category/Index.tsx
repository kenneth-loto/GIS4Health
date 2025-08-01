import { fetchCategoriesTableData } from '@/api/category';
import DeleteDialog from '@/components/CustomComponents/DeleteDialog';
import { CustomTable } from '@/components/CustomComponents/Table';
import { Button } from '@/components/ui/button';
import { useConfirmDelete } from '@/hooks/useConfirmDelete';
import { useCrudDialog } from '@/hooks/useCrudDialog';
import { useToastWithReload } from '@/hooks/useToast';
import AppLayout from '@/layouts/app-layout';
import CategoryDialog from '@/pages/Utilities/Category/CategoryDialog';
import { Category, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Utilities', href: '' },
    { title: 'Categories', href: '/categories' },
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
    } = useCrudDialog<Category>();

    const tableKey = useToastWithReload();

    const confirmDelete = useConfirmDelete(data, 'categories', setDeleting, closeDelete);

    const columns = [
        { label: 'Name', accessor: 'name' },
        { label: 'Short Description', accessor: 'short_description' },
        { label: 'Diseases Count', accessor: 'disease_count' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex justify-end">
                    <Button onClick={openAdd}>Add</Button>
                </div>

                <CustomTable key={tableKey} columns={columns} fetchFn={fetchCategoriesTableData} onEdit={openEdit} onDelete={openDelete} />

                <CategoryDialog
                    open={isOpen}
                    onOpenChange={(open) => {
                        if (!isSubmitting && !open) closeForm();
                    }}
                    initialValue={data}
                    isEditing={mode === 'edit'}
                    isSubmitting={isSubmitting}
                    setSubmitting={setSubmitting}
                />

                <DeleteDialog open={isDeleteOpen} onCancel={closeDelete} onConfirm={confirmDelete} isLoading={isDeleting} />
            </div>
        </AppLayout>
    );
}
