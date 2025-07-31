import { fetchSuffixesTableData } from '@/api/suffix';
import DeleteDialog from '@/components/CustomComponents/DeleteDialog';
import { CustomTable } from '@/components/CustomComponents/Table';
import { Button } from '@/components/ui/button';
import { useCrudDialog } from '@/hooks/use-crud-dialog';
import { useToastWithReload } from '@/hooks/useToast';
import AppLayout from '@/layouts/app-layout';
import SuffixDialog from '@/pages/Suffix/SuffixDialog';
import { Suffix, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Utilities', href: '' },
    { title: 'Suffixes', href: '/suffix' },
];

export default function Index() {
    const { isOpen, mode, data, isDeleteOpen, isDeleting, openAdd, openEdit, closeForm, openDelete, closeDelete, setDeleting } =
        useCrudDialog<Suffix>();

    const tableKey = useToastWithReload();

    const confirmDelete = () => {
        if (!data) return;
        setDeleting(true);
        router.delete(`/suffixes/${data.id}`, {
            onFinish: () => {
                setDeleting(false);
                closeDelete();
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Suffixes" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex justify-end">
                    <Button onClick={openAdd}>Add</Button>
                </div>

                <CustomTable
                    key={tableKey}
                    columns={[{ label: 'Name', accessor: 'name' }]}
                    fetchFn={fetchSuffixesTableData}
                    onEdit={openEdit}
                    onDelete={openDelete}
                />

                <SuffixDialog open={isOpen} onOpenChange={closeForm} suffix={data} isEditing={mode === 'edit'} />

                <DeleteDialog open={isDeleteOpen} onCancel={closeDelete} onConfirm={confirmDelete} isLoading={isDeleting} />
            </div>
        </AppLayout>
    );
}
