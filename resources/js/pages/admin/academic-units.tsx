import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AcademicUnitController from '@/actions/App/Http/Controllers/Admin/AcademicUnitController';
import { AddButton, Field, FormDialog, RowActions } from '@/components/ems/crud';
import { EmsCard, EmsPill, EmsTable } from '@/components/ems/ui';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { AcademicUnit } from '@/types/ems';

type Props = { units: AcademicUnit[] };

type UnitForm = {
    unit_code: string;
    unit_title: string;
    credit_value: number;
    level: '4' | '5';
};

const blank: UnitForm = { unit_code: '', unit_title: '', credit_value: 15, level: '4' };

export default function AcademicUnits({ units }: Props) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<AcademicUnit | null>(null);
    const form = useForm<UnitForm>(blank);

    const openAdd = () => {
        setEditing(null);
        form.setData(blank);
        form.clearErrors();
        setOpen(true);
    };

    const openEdit = (unit: AcademicUnit) => {
        setEditing(unit);
        form.setData({
            unit_code: unit.unit_code,
            unit_title: unit.unit_title,
            credit_value: unit.credit_value,
            level: unit.level,
        });
        form.clearErrors();
        setOpen(true);
    };

    const submit = () => {
        const opts = { preserveScroll: true, onSuccess: () => setOpen(false) };
        if (editing) {
            form.put(AcademicUnitController.update(editing.id).url, opts);
        } else {
            form.post(AcademicUnitController.store().url, opts);
        }
    };

    return (
        <>
            <Head title="Academic Units" />
            <EmsCard delay={1} className="overflow-hidden">
                <div className="flex items-center justify-between border-b border-ems-border/60 bg-white/30 px-6 py-5 dark:bg-white/5">
                    <div>
                        <h4 className="text-lg font-semibold">All Units ({units.length})</h4>
                        <p className="mt-0.5 text-[13px] text-ems-secondary">
                            Pearson BTEC HN Computing units with credit values (FR3, FR4)
                        </p>
                    </div>
                    <AddButton label="Add Unit" onClick={openAdd} />
                </div>
                <EmsTable
                    headers={['Code', 'Title', 'Credits', 'RQF Level', 'Courses', 'Mappings', '']}
                    align={['left', 'left', 'right', 'center', 'left', 'right', 'right']}
                >
                    {units.map((unit) => (
                        <tr key={unit.id} className="transition-colors hover:bg-white/50">
                            <td className="px-6 py-4 text-sm font-semibold">{unit.unit_code}</td>
                            <td className="px-6 py-4 text-sm">{unit.unit_title}</td>
                            <td className="px-6 py-4 text-right text-sm">{unit.credit_value}</td>
                            <td className="px-6 py-4 text-center">
                                <EmsPill>Level {unit.level}</EmsPill>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex max-w-64 flex-wrap gap-1">
                                    {(unit.courses ?? []).map((course) => (
                                        <span
                                            key={course.id}
                                            className="rounded bg-ems-surface-mid px-1.5 py-0.5 text-[11px] font-medium text-ems-secondary"
                                        >
                                            {course.name}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right text-sm">{unit.unit_skill_mappings_count}</td>
                            <td className="px-6 py-4">
                                <RowActions
                                    entityLabel={`unit ${unit.unit_code}`}
                                    onEdit={() => openEdit(unit)}
                                    deleteUrl={AcademicUnitController.destroy(unit.id).url}
                                />
                            </td>
                        </tr>
                    ))}
                </EmsTable>
            </EmsCard>

            <FormDialog
                open={open}
                onOpenChange={setOpen}
                title={editing ? 'Edit Academic Unit' : 'Add Academic Unit'}
                processing={form.processing}
                onSubmit={submit}
            >
                <Field label="Unit Code" htmlFor="unit_code" error={form.errors.unit_code}>
                    <Input
                        id="unit_code"
                        value={form.data.unit_code}
                        onChange={(e) => form.setData('unit_code', e.target.value)}
                        placeholder="U01"
                    />
                </Field>
                <Field label="Unit Title" htmlFor="unit_title" error={form.errors.unit_title}>
                    <Input
                        id="unit_title"
                        value={form.data.unit_title}
                        onChange={(e) => form.setData('unit_title', e.target.value)}
                        placeholder="Programming"
                    />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Credit Value" htmlFor="credit_value" error={form.errors.credit_value}>
                        <Input
                            id="credit_value"
                            type="number"
                            value={form.data.credit_value}
                            onChange={(e) => form.setData('credit_value', Number(e.target.value))}
                        />
                    </Field>
                    <Field label="RQF Level" error={form.errors.level}>
                        <Select
                            value={form.data.level}
                            onValueChange={(v) => form.setData('level', v as '4' | '5')}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="4">Level 4</SelectItem>
                                <SelectItem value="5">Level 5</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </FormDialog>
        </>
    );
}

AcademicUnits.emsTitle = 'Academic Units';
