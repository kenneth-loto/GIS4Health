import { fetchPatientInfosTableData } from '@/api/patient_info';
import DeleteDialog from '@/components/CustomComponents/DeleteDialog';
import { CustomTable } from '@/components/CustomComponents/Table';
import { Button } from '@/components/ui/button';
import { useConfirmDelete } from '@/hooks/useConfirmDelete';
import { useCrudDialog } from '@/hooks/useCrudDialog';
import { useToastWithReload } from '@/hooks/useToast';
import AppLayout from '@/layouts/app-layout';
import PatientInfoDialog from '@/pages/PatientInfo/PatientInfoDialog';
import { PatientInfo, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Patient Infos', href: '/patient_infos' }];

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
    } = useCrudDialog<PatientInfo>();

    const tableKey = useToastWithReload();

    const confirmDelete = useConfirmDelete(data, 'patient_infos', setDeleting, closeDelete);

    const columns = [
        {
            label: 'Name',
            accessor: (row: PatientInfo) => {
                const name = [row.first_name, row.middle_name, row.suffix?.name].filter(Boolean).join(' ');
                return [row.last_name, name].filter(Boolean).join(', ');
            },
            subLabel: 'Lastname, Firstname Middlename Suffix',
        },
        {
            label: 'Address',
            accessor: (row: PatientInfo) => {
                const beforeMunicipality = [row.street, row.barangay?.name].filter(Boolean).join(' ');
                return [beforeMunicipality, row.municipality?.name].filter(Boolean).join(', ');
            },
            subLabel: 'Street Barangay, Municipality',
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

                <PatientInfoDialog
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
