import { Head } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import academicUnits from '@/routes/admin/academic-units';
import type { AcademicUnit } from '@/types/ems';

type Props = {
    units: AcademicUnit[];
};

export default function AcademicUnits({ units }: Props) {
    return (
        <>
            <Head title="Academic Units" />
            <div className="flex flex-col gap-6 p-4">
                <div>
                    <h1 className="text-xl font-semibold">Academic Units</h1>
                    <p className="text-sm text-muted-foreground">
                        Pearson BTEC HN Computing units with credit values (FR3, FR4).
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            All Units ({units.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-xs font-semibold text-muted-foreground uppercase">
                                    <th className="pb-2">Code</th>
                                    <th className="pb-2">Title</th>
                                    <th className="pb-2 text-right">Credits</th>
                                    <th className="pb-2 text-right">RQF Level</th>
                                    <th className="pb-2 text-right">Mappings</th>
                                </tr>
                            </thead>
                            <tbody>
                                {units.map((unit) => (
                                    <tr key={unit.id} className="border-b last:border-0">
                                        <td className="py-2 font-medium">{unit.unit_code}</td>
                                        <td className="py-2">{unit.unit_title}</td>
                                        <td className="py-2 text-right">
                                            {unit.credit_value}
                                        </td>
                                        <td className="py-2 text-right">
                                            <Badge variant="secondary">
                                                Level {unit.level}
                                            </Badge>
                                        </td>
                                        <td className="py-2 text-right">
                                            {unit.unit_skill_mappings_count}
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

AcademicUnits.layout = {
    breadcrumbs: [{ title: 'Academic Units', href: academicUnits.index() }],
};
