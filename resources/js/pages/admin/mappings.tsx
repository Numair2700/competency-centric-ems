import { Head } from '@inertiajs/react';
import { EmsCard, EmsPill, EmsTable } from '@/components/ems/ui';
import type { AcademicUnit, SfiaSkill, UnitSkillMapping } from '@/types/ems';

type Props = {
    mappings: UnitSkillMapping[];
    units: AcademicUnit[];
    skills: SfiaSkill[];
};

export default function Mappings({ mappings: mappingList }: Props) {
    return (
        <>
            <Head title="Unit-Skill Mappings" />
            <EmsCard delay={1} className="overflow-hidden">
                <div className="border-b border-ems-border/60 bg-white/30 px-6 py-5">
                    <h4 className="text-lg font-semibold">All Mappings ({mappingList.length})</h4>
                    <p className="mt-0.5 text-[13px] text-ems-secondary">
                        The unit-to-SFIA catalogue from the document analysis — the relationship
                        the calculation engine depends on (FR6, FR17)
                    </p>
                </div>
                <EmsTable
                    headers={['Unit', 'SFIA Skill', 'SFIA Level', 'Weight']}
                    align={['left', 'left', 'center', 'right']}
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
                        </tr>
                    ))}
                </EmsTable>
            </EmsCard>
        </>
    );
}

Mappings.emsTitle = 'Mappings';
