import { fetchSeveritiesTableData } from '@/api/severity';
import DeleteDialog from '@/components/CustomComponents/DeleteDialog';
import { CustomTable } from '@/components/CustomComponents/Table';
import { Button } from '@/components/ui/button';
import { useCrudDialog } from '@/hooks/use-crud-dialog';
import useToast from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import SeverityDialog from '@/pages/Severity/SeverityDialog';
import { Severity, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Severities', href: '/severities' }];

export default function Index() {
    const { isOpen, mode, data, isDeleteOpen, isDeleting, openAdd, openEdit, closeForm, openDelete, closeDelete, setDeleting } =
        useCrudDialog<Severity>();

    useToast();

    const [tableKey, setTableKey] = useState(0);

    useToast(() => setTableKey((prev) => prev + 1));

    const confirmDelete = () => {
        if (!data) return;
        setDeleting(true);
        router.delete(`/severities/${data.id}`, {
            onFinish: () => {
                setDeleting(false);
                closeDelete();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex justify-end">
                    <Button onClick={openAdd}>Add</Button>
                </div>

                <CustomTable
                    key={tableKey}
                    columns={[{ label: 'Name', accessor: 'name' }]}
                    fetchFn={fetchSeveritiesTableData}
                    onEdit={openEdit}
                    onDelete={openDelete}
                />

                <SeverityDialog open={isOpen} onOpenChange={closeForm} severity={data} isEditing={mode === 'edit'} />

                <DeleteDialog open={isDeleteOpen} onCancel={closeDelete} onConfirm={confirmDelete} isLoading={isDeleting} />
            </div>
        </AppLayout>
    );
}
