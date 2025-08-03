import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';

type Props = {
    isSubmitting: boolean;
    submitLabel?: string;
    cancelLabel?: string;
};

export default function DialogActionButtons({ isSubmitting, submitLabel = 'Save', cancelLabel = 'Cancel' }: Props) {
    return (
        <div className="mt-4 flex items-center justify-end gap-2">
            <DialogClose asChild>
                <Button type="button" variant="outline">
                    <XCircle className="h-4 w-4" />
                    {cancelLabel}
                </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <Loader2 className="animate-spin" />
                        Saving...
                    </>
                ) : (
                    <>
                        <CheckCircle className="h-4 w-4" />
                        {submitLabel}
                    </>
                )}
            </Button>
        </div>
    );
}
