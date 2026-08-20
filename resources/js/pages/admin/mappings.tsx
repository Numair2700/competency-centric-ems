import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import UnitSkillMappingController from '@/actions/App/Http/Controllers/Admin/UnitSkillMappingController';
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
import type { AcademicUnit, SfiaSkill, UnitSkillMapping } from '@/types/ems';

type Props = {
    mappings: UnitSkillMapping[];
    units: AcademicUnit[];
    skills: SfiaSkill[];
};

type MappingForm = {
    unit_id: string;
    sfia_skill_id: string;
    sfia_level_id: string;
    mapping_weight: number;
};

const blank: MappingForm = { unit_id: '', sfia_skill_id: '', sfia_level_id: '', mapping_weight: 1 };

export default function Mappings({ mappings: mappingList, units, skills }: Props) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<UnitSkillMapping | null>(null);
    const form = useForm<MappingForm>(blank);

    const selectedSkill = skills.find((s) => String(s.id) === form.data.sfia_skill_id);
    const levelOptions = selectedSkill?.levels ?? [];

    const openAdd = () => {
        setEditing(null);
        form.setData(blank);
        form.clearErrors();
        setOpen(true);
    };

    const openEdit = (mapping: UnitSkillMapping) => {
        setEditing(mapping);
        form.setData({
            unit_id: String(mapping.unit_id),
            sfia_skill_id: String(mapping.sfia_skill_id),
            sfia_level_id: String(mapping.sfia_level_id),
            mapping_weight: mapping.mapping_weight,
        });
        form.clearErrors();
        setOpen(true);
    };

    const submit = () => {
        const opts = { preserveScroll: true, onSuccess: () => setOpen(false) };
        if (editing) {
            form.put(UnitSkillMappingController.update(editing.id).url, opts);
        } else {
            form.post(UnitSkillMappingController.store().url, opts);
        }
    };

    return (
        <>
            <Head title="Unit-Skill Mappings" />
            <EmsCard delay={1} className="overflow-hidden">
                <div className="flex items-center justify-between border-b border-ems-border/60 bg-white/30 px-6 py-5 dark:bg-white/5">
                    <div>
                        <h4 className="text-lg font-semibold">All Mappings ({mappingList.length})</h4>
                        <p className="mt-0.5 text-[13px] text-ems-secondary">
                            The unit-to-SFIA catalogue from the document analysis — the relationship
                            the calculation engine depends on (FR6, FR17)
                        </p>
                    </div>
                    <AddButton label="Add Mapping" onClick={openAdd} />
                </div>
                <EmsTable
                    headers={['Unit', 'SFIA Skill', 'SFIA Level', 'Weight', '']}
                    align={['left', 'left', 'center', 'right', 'right']}
                >
                    {mappingList.map((mapping) => (
                        <tr key={mapping.id} className="transition-colors hover:bg-white/50">
                            <td className="px-6 py-4 text-sm">
                                <span className="font-semibold">{mapping.unit?.unit_code}</span>{' '}
                                {mapping.unit?.unit_title}
                            </td>
                            <td className="px-6 py-4 text-sm">
                                <span className="font-semibold">{mapping.sfia_skill?.skill_code}</span>{' '}
                                <span className="text-ems-secondary/80">
                                    {mapping.sfia_skill?.skill_name}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <EmsPill>Level {mapping.sfia_level?.responsibility_level}</EmsPill>
                            </td>
                            <td className="px-6 py-4 text-right text-sm">
                                {mapping.mapping_weight.toFixed(1)}
                            </td>
                            <td className="px-6 py-4">
                                <RowActions
                                    entityLabel="mapping"
                                    onEdit={() => openEdit(mapping)}
                                    deleteUrl={UnitSkillMappingController.destroy(mapping.id).url}
                                />
                            </td>
                        </tr>
                    ))}
                </EmsTable>
            </EmsCard>

            <FormDialog
                open={open}
                onOpenChange={setOpen}
                title={editing ? 'Edit Mapping' : 'Add Mapping'}
                processing={form.processing}
                onSubmit={submit}
            >
                <Field label="Academic Unit" error={form.errors.unit_id}>
                    <Select value={form.data.unit_id} onValueChange={(v) => form.setData('unit_id', v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a unit..." />
                        </SelectTrigger>
                        <SelectContent>
                            {units.map((unit) => (
                                <SelectItem key={unit.id} value={String(unit.id)}>
                                    {unit.unit_code} — {unit.unit_title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
                <Field label="SFIA Skill" error={form.errors.sfia_skill_id}>
                    <Select
                        value={form.data.sfia_skill_id}
                        onValueChange={(v) => {
                            form.setData((data) => ({ ...data, sfia_skill_id: v, sfia_level_id: '' }));
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select a skill..." />
                        </SelectTrigger>
                        <SelectContent>
                            {skills.map((skill) => (
                                <SelectItem key={skill.id} value={String(skill.id)}>
                                    {skill.skill_code} — {skill.skill_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="SFIA Level" error={form.errors.sfia_level_id}>
                        <Select
                            value={form.data.sfia_level_id}
                            onValueChange={(v) => form.setData('sfia_level_id', v)}
                            disabled={levelOptions.length === 0}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Level..." />
                            </SelectTrigger>
                            <SelectContent>
                                {levelOptions.map((level) => (
                                    <SelectItem key={level.id} value={String(level.id)}>
                                        Level {level.responsibility_level}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="Mapping Weight" htmlFor="mapping_weight" error={form.errors.mapping_weight}>
                        <Input
                            id="mapping_weight"
                            type="number"
                            step="0.1"
                            min="0.1"
                            max="1"
                            value={form.data.mapping_weight}
                            onChange={(e) => form.setData('mapping_weight', Number(e.target.value))}
                        />
                    </Field>
                </div>
            </FormDialog>
        </>
    );
}

Mappings.emsTitle = 'Mappings';
