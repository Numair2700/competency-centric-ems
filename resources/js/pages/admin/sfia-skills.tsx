import { Head } from '@inertiajs/react';
import { EmsCard, EmsPill, EmsTable } from '@/components/ems/ui';
import type { SfiaSkill } from '@/types/ems';

type Props = { skills: SfiaSkill[] };

export default function SfiaSkills({ skills }: Props) {
    return (
        <>
            <Head title="SFIA Skills" />
            <EmsCard delay={1} className="overflow-hidden">
                <div className="border-b border-ems-border/60 bg-white/30 px-6 py-5">
                    <h4 className="text-lg font-semibold">All Skills ({skills.length})</h4>
                    <p className="mt-0.5 text-[13px] text-ems-secondary">
                        SFIA 9 skills and responsibility levels (FR5)
                    </p>
                </div>
                <EmsTable
                    headers={['Code', 'Skill Name', 'Levels In Use', 'Mapped Units']}
                    align={['left', 'left', 'left', 'right']}
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
                        </tr>
                    ))}
                </EmsTable>
            </EmsCard>
        </>
    );
}

SfiaSkills.emsTitle = 'SFIA Skills';
