import { fetchPatientInfosTableData } from '@/api/patient_info';
import DeleteDialog from '@/components/CustomComponents/DeleteDialog';
import { CustomTable } from '@/components/CustomComponents/Table';
import { Button } from '@/components/ui/button';
import { useCrudDialog } from '@/hooks/useCrudDialog';
import { useToastWithReload } from '@/hooks/useToast';
import AppLayout from '@/layouts/app-layout';
import PatientInfoDialog from '@/pages/PatientInfo/PatientInfoDialog';
import { PatientInfo, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Patient Infos', href: '/patient_infos' }];

export default function Index() {
    const { isOpen, mode, data, isDeleteOpen, isDeleting, openAdd, openEdit, closeForm, openDelete, closeDelete, setDeleting } =
        useCrudDialog<PatientInfo>();

    const tableKey = useToastWithReload();

    const confirmDelete = () => {
        if (!data) return;
        setDeleting(true);
        router.delete(`/patient_infos/${data.id}`, {
            onFinish: () => {
                setDeleting(false);
                closeDelete();
            },
        });
    };

    const columns = [
        {
            label: 'Name',
            accessor: (row: PatientInfo) => {
                const parts = [row.last_name, row.first_name, row.middle_name || '', row.suffix?.name || ''].filter(Boolean);
                return parts.join(', ');
            },
        },
        {
            label: 'Address',
            accessor: (row: PatientInfo) => {
                const parts = [row.street, row.barangay?.name, row.municipality?.name].filter(Boolean);
                return parts.join(', ');
            },
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patient Infos" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex justify-end">
                    <Button onClick={openAdd}>Add</Button>
                </div>

                <CustomTable key={tableKey} columns={columns} fetchFn={fetchPatientInfosTableData} onEdit={openEdit} onDelete={openDelete} />

                <PatientInfoDialog open={isOpen} onOpenChange={closeForm} patient_info={data} isEditing={mode === 'edit'} modal={false} />

                <DeleteDialog open={isDeleteOpen} onCancel={closeDelete} onConfirm={confirmDelete} isLoading={isDeleting} />
            </div>
        </AppLayout>
    );
}
