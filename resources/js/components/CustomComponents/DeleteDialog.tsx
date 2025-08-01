import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import React, { ReactNode } from 'react';

interface Props {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
    title?: ReactNode;
    description?: ReactNode;
    cancelButtonText?: string;
    confirmButtonText?: string;
}

export default function DeleteDialog({
    open,
    onCancel,
    onConfirm,
    isLoading = false,
    title = 'Are you absolutely sure?',
    description = 'This action cannot be undone. This will permanently delete this item and remove their data from our servers.',
    cancelButtonText = 'Cancel',
    confirmButtonText = 'Confirm',
}: Props) {
    const handleConfirm = (e: React.MouseEvent) => {
        e.preventDefault();
        onConfirm();
    };

    const handleCancel = () => {
        if (!isLoading) {
            onCancel();
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={handleCancel}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel} disabled={isLoading}>
                        {cancelButtonText}
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            confirmButtonText
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
