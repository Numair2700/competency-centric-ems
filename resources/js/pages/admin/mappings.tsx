import { Head } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import mappings from '@/routes/admin/mappings';
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
            <div className="flex flex-col gap-6 p-4">
                <div>
                    <h1 className="text-xl font-semibold">Unit-to-SFIA Mappings</h1>
                    <p className="text-sm text-muted-foreground">
                        The mapping catalogue produced by document analysis — the
                        relationship the calculation engine depends on (FR6, FR17).
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            All Mappings ({mappingList.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-xs font-semibold text-muted-foreground uppercase">
                                    <th className="pb-2">Unit</th>
                                    <th className="pb-2">SFIA Skill</th>
                                    <th className="pb-2 text-right">SFIA Level</th>
                                    <th className="pb-2 text-right">Weight</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mappingList.map((mapping) => (
                                    <tr key={mapping.id} className="border-b last:border-0">
                                        <td className="py-2">
                                            <span className="font-medium">
                                                {mapping.unit?.unit_code}
                                            </span>{' '}
                                            {mapping.unit?.unit_title}
                                        </td>
                                        <td className="py-2">
                                            <span className="font-medium">
                                                {mapping.sfia_skill?.skill_code}
                                            </span>{' '}
                                            <span className="text-muted-foreground">
                                                {mapping.sfia_skill?.skill_name}
                                            </span>
                                        </td>
                                        <td className="py-2 text-right">
                                            <Badge variant="secondary">
                                                Level{' '}
                                                {mapping.sfia_level?.responsibility_level}
                                            </Badge>
                                        </td>
                                        <td className="py-2 text-right">
                                            {mapping.mapping_weight.toFixed(1)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Mappings.layout = {
    breadcrumbs: [{ title: 'Mappings', href: mappings.index() }],
};
