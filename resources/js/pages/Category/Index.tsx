import DeleteDialog from '@/components/CustomComponents/DeleteDialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCrudDialog } from '@/hooks/use-crud-dialog'; // 👈 NEW
import useToast from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import CategoryDialog from '@/pages/Category/CategoryDialog';
import { Category, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Categories', href: '/categories' }];

type Props = {
    categories: Category[];
};

export default function Index({ categories = [] }: Props) {
    useToast();
    const { isOpen, mode, data, isDeleteOpen, isDeleting, openAdd, openEdit, closeForm, openDelete, closeDelete, setDeleting } =
        useCrudDialog<Category>();

    const confirmDelete = () => {
        if (!data) return;
        setDeleting(true);
        router.delete(`/categories/${data.id}`, {
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

                <div className="container mx-auto rounded-xl border p-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>#</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Short Description</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.length > 0 ? (
                                categories.map((cat, i) => (
                                    <TableRow key={cat.id}>
                                        <TableCell>{i + 1}</TableCell>
                                        <TableCell>{cat.name}</TableCell>
                                        <TableCell>{cat.short_description ?? '—'}</TableCell>
                                        <TableCell className="space-x-2">
                                            <Button size="sm" onClick={() => openEdit(cat)}>
                                                Edit
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={() => openDelete(cat)}>
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        No categories found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <CategoryDialog open={isOpen} onOpenChange={closeForm} category={data} isEditing={mode === 'edit'} />

                    <DeleteDialog open={isDeleteOpen} onCancel={closeDelete} onConfirm={confirmDelete} isLoading={isDeleting} />
                </div>
            </div>
        </AppLayout>
    );
}
