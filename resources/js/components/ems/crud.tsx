import { router } from '@inertiajs/react';
import { Pencil, Plus, Trash2, TriangleAlert } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

/** Labelled field wrapper with a visible label above the control (W3C 1.3.1). */
export function Field({
    label,
    htmlFor,
    error,
    children,
}: {
    label: string;
    htmlFor?: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div className="grid gap-1.5">
            <Label htmlFor={htmlFor}>{label}</Label>
            {children}
            {error && <p className="text-xs font-medium text-ems-amber">{error}</p>}
        </div>
    );
}

/** "Add …" button for a card header. */
export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <Button onClick={onClick} className="bg-ems-primary hover:bg-ems-primary-container">
            <Plus className="size-4" />
            {label}
        </Button>
    );
}

/** Create/edit dialog shell: header, body (fields), footer with Cancel + Save. */
export function FormDialog({
    open,
    onOpenChange,
    title,
    description,
    processing,
    onSubmit,
    children,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    processing: boolean;
    onSubmit: () => void;
    children: ReactNode;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }}
                    className="flex flex-col gap-4"
                >
                    {children}
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-ems-primary hover:bg-ems-primary-container"
                        >
                            {processing && <Spinner />}
                            Save
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

/** Row edit + delete buttons; delete opens a confirmation dialog (easy reversal). */
export function RowActions({
    onEdit,
    deleteUrl,
    entityLabel,
}: {
    onEdit: () => void;
    deleteUrl: string;
    entityLabel: string;
}) {
    const [confirming, setConfirming] = useState(false);
    const [deleting, setDeleting] = useState(false);

    return (
        <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="icon" className="size-8" onClick={onEdit} title="Edit">
                <Pencil className="size-4 text-ems-secondary" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => setConfirming(true)}
                title="Delete"
            >
                <Trash2 className="size-4 text-ems-amber" />
            </Button>

            <Dialog open={confirming} onOpenChange={setConfirming}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <TriangleAlert className="size-5 text-ems-amber" />
                            Delete {entityLabel}?
                        </DialogTitle>
                        <DialogDescription>
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirming(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={deleting}
                            onClick={() => {
                                setDeleting(true);
                                router.delete(deleteUrl, {
                                    preserveScroll: true,
                                    onFinish: () => {
                                        setDeleting(false);
                                        setConfirming(false);
                                    },
                                });
                            }}
                        >
                            {deleting && <Spinner />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
