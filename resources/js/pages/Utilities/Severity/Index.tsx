import { fetchSeveritiesTableData } from '@/api/severity';
import DeleteDialog from '@/components/CustomComponents/DeleteDialog';
import { CustomTable } from '@/components/CustomComponents/Table';
import { Button } from '@/components/ui/button';
import { useConfirmDelete } from '@/hooks/useConfirmDelete';
import { useCrudDialog } from '@/hooks/useCrudDialog';
import { useToastWithReload } from '@/hooks/useToast';
import AppLayout from '@/layouts/app-layout';
import SeverityDialog from '@/pages/Utilities/Severity/SeverityDialog';
import { Severity, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Utilities', href: '' },
    { title: 'Severities', href: '/severities' },
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
    } = useCrudDialog<Severity>();

    const tableKey = useToastWithReload();

    const confirmDelete = useConfirmDelete(data, 'severities', setDeleting, closeDelete);

    const columns = [{ label: 'Name', accessor: 'name' }];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Severities" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex justify-end">
                    <Button onClick={openAdd}>Add</Button>
                </div>

                <CustomTable key={tableKey} columns={columns} fetchFn={fetchSeveritiesTableData} onEdit={openEdit} onDelete={openDelete} />

                <SeverityDialog
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
