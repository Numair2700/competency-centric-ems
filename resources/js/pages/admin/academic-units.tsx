import { Head } from '@inertiajs/react';
import { EmsCard, EmsPill, EmsTable } from '@/components/ems/ui';
import type { AcademicUnit } from '@/types/ems';

type Props = { units: AcademicUnit[] };

export default function AcademicUnits({ units }: Props) {
    return (
        <>
            <Head title="Academic Units" />
            <EmsCard delay={1} className="overflow-hidden">
                <div className="border-b border-ems-border/60 bg-white/30 px-6 py-5">
                    <h4 className="text-lg font-semibold">All Units ({units.length})</h4>
                    <p className="mt-0.5 text-[13px] text-ems-secondary">
                        Pearson BTEC HN Computing units with credit values (FR3, FR4)
                    </p>
                </div>
                <EmsTable
                    headers={['Code', 'Title', 'Credits', 'RQF Level', 'Mappings']}
                    align={['left', 'left', 'right', 'center', 'right']}
                >
                    {units.map((unit) => (
                        <tr key={unit.id} className="transition-colors hover:bg-white/50">
                            <td className="px-6 py-4 text-sm font-semibold">{unit.unit_code}</td>
                            <td className="px-6 py-4 text-sm">{unit.unit_title}</td>
                            <td className="px-6 py-4 text-right text-sm">{unit.credit_value}</td>
                            <td className="px-6 py-4 text-center">
                                <EmsPill>Level {unit.level}</EmsPill>
                            </td>
                            <td className="px-6 py-4 text-right text-sm">{unit.unit_skill_mappings_count}</td>
                        </tr>
                    ))}
                </EmsTable>
            </EmsCard>
        </>
    );
}

AcademicUnits.emsTitle = 'Academic Units';
