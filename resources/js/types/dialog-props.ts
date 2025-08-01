export interface FormDialogProps<T> {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialValue: T | null;
    isEditing: boolean;
    isSubmitting: boolean;
    setSubmitting: (val: boolean) => void;
    modal?: boolean;
}
