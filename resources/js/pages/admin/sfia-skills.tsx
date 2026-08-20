import { Head, useForm } from '@inertiajs/react';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import SfiaSkillController from '@/actions/App/Http/Controllers/Admin/SfiaSkillController';
import { AddButton, Field, FormDialog, RowActions } from '@/components/ems/crud';
import { EmsCard, EmsTable } from '@/components/ems/ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { SfiaSkill } from '@/types/ems';

type Props = { skills: SfiaSkill[] };

type LevelRow = { responsibility_level: number; description: string };

type SkillForm = {
    skill_code: string;
    skill_name: string;
    description: string;
    levels: LevelRow[];
};

const blank: SkillForm = { skill_code: '', skill_name: '', description: '', levels: [] };

export default function SfiaSkills({ skills }: Props) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<SfiaSkill | null>(null);
    const form = useForm<SkillForm>(blank);

    const openAdd = () => {
        setEditing(null);
        form.setData(blank);
        form.clearErrors();
        setOpen(true);
    };

    const openEdit = (skill: SfiaSkill) => {
        setEditing(skill);
        form.setData({
            skill_code: skill.skill_code,
            skill_name: skill.skill_name,
            description: skill.description ?? '',
            levels: (skill.levels ?? []).map((l) => ({
                responsibility_level: l.responsibility_level,
                description: l.description ?? '',
            })),
        });
        form.clearErrors();
        setOpen(true);
    };

    const addLevel = () =>
        form.setData('levels', [...form.data.levels, { responsibility_level: 1, description: '' }]);

    const updateLevel = (index: number, patch: Partial<LevelRow>) =>
        form.setData(
            'levels',
            form.data.levels.map((row, i) => (i === index ? { ...row, ...patch } : row)),
        );

    const removeLevel = (index: number) =>
        form.setData('levels', form.data.levels.filter((_, i) => i !== index));

    const submit = () => {
        const opts = { preserveScroll: true, onSuccess: () => setOpen(false) };
        if (editing) {
            form.put(SfiaSkillController.update(editing.id).url, opts);
        } else {
            form.post(SfiaSkillController.store().url, opts);
        }
    };

    return (
        <>
            <Head title="SFIA Skills" />
            <EmsCard delay={1} className="overflow-hidden">
                <div className="flex items-center justify-between border-b border-ems-border/60 bg-white/30 px-6 py-5 dark:bg-white/5">
                    <div>
                        <h4 className="text-lg font-semibold">All Skills ({skills.length})</h4>
                        <p className="mt-0.5 text-[13px] text-ems-secondary">
                            SFIA 9 skills and their responsibility levels (FR5)
                        </p>
                    </div>
                    <AddButton label="Add Skill" onClick={openAdd} />
                </div>
                <EmsTable
                    headers={['Code', 'Skill Name', 'Levels In Use', 'Mapped Units', '']}
                    align={['left', 'left', 'left', 'right', 'right']}
                >
                    {skills.map((skill) => (
                        <tr key={skill.id} className="transition-colors hover:bg-white/50">
                            <td className="px-6 py-4 text-sm font-semibold">{skill.skill_code}</td>
                            <td className="px-6 py-4 text-sm">{skill.skill_name}</td>
                            <td className="px-6 py-4">
                                <div className="flex gap-1.5">
                                    {(skill.levels ?? []).map((level) => (
                                        <span
                                            key={level.id}
                                            title={level.description ?? undefined}
                                            className="flex size-6 items-center justify-center rounded bg-ems-primary/5 text-xs font-bold text-ems-primary"
                                        >
                                            {level.responsibility_level}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right text-sm">{skill.unit_skill_mappings_count}</td>
                            <td className="px-6 py-4">
                                <RowActions
                                    entityLabel={`skill ${skill.skill_code}`}
                                    onEdit={() => openEdit(skill)}
                                    deleteUrl={SfiaSkillController.destroy(skill.id).url}
                                />
                            </td>
                        </tr>
                    ))}
                </EmsTable>
            </EmsCard>

            <FormDialog
                open={open}
                onOpenChange={setOpen}
                title={editing ? 'Edit SFIA Skill' : 'Add SFIA Skill'}
                processing={form.processing}
                onSubmit={submit}
            >
                <div className="grid grid-cols-3 gap-4">
                    <Field label="Code" htmlFor="skill_code" error={form.errors.skill_code}>
                        <Input
                            id="skill_code"
                            value={form.data.skill_code}
                            onChange={(e) => form.setData('skill_code', e.target.value)}
                            placeholder="PROG"
                        />
                    </Field>
                    <div className="col-span-2">
                        <Field label="Skill Name" htmlFor="skill_name" error={form.errors.skill_name}>
                            <Input
                                id="skill_name"
                                value={form.data.skill_name}
                                onChange={(e) => form.setData('skill_name', e.target.value)}
                                placeholder="Programming/software development"
                            />
                        </Field>
                    </div>
                </div>
                <Field label="Description" htmlFor="description" error={form.errors.description}>
                    <textarea
                        id="description"
                        value={form.data.description}
                        onChange={(e) => form.setData('description', e.target.value)}
                        rows={2}
                        className="w-full rounded-md border border-ems-border bg-transparent px-3 py-2 text-sm focus:border-ems-primary focus:ring-2 focus:ring-ems-primary/20 focus:outline-none"
                    />
                </Field>

                <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                        <Label>Responsibility Levels</Label>
                        <Button type="button" variant="outline" size="sm" onClick={addLevel}>
                            <Plus className="size-3.5" /> Add level
                        </Button>
                    </div>
                    {form.data.levels.length === 0 && (
                        <p className="text-xs text-ems-secondary">No levels added yet.</p>
                    )}
                    {form.data.levels.map((row, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <Input
                                type="number"
                                min={1}
                                max={7}
                                value={row.responsibility_level}
                                onChange={(e) =>
                                    updateLevel(index, { responsibility_level: Number(e.target.value) })
                                }
                                className="w-20"
                            />
                            <Input
                                value={row.description}
                                onChange={(e) => updateLevel(index, { description: e.target.value })}
                                placeholder="Level descriptor (optional)"
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-9"
                                onClick={() => removeLevel(index)}
                            >
                                <X className="size-4 text-ems-amber" />
                            </Button>
                        </div>
                    ))}
                </div>
            </FormDialog>
        </>
    );
}

SfiaSkills.emsTitle = 'SFIA Skills';
