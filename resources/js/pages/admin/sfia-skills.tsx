import { Head } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import sfiaSkills from '@/routes/admin/sfia-skills';
import type { SfiaSkill } from '@/types/ems';

type Props = {
    skills: SfiaSkill[];
};

export default function SfiaSkills({ skills }: Props) {
    return (
        <>
            <Head title="SFIA Skills" />
            <div className="flex flex-col gap-6 p-4">
                <div>
                    <h1 className="text-xl font-semibold">SFIA Skills</h1>
                    <p className="text-sm text-muted-foreground">
                        SFIA 9 skills and responsibility levels (FR5).
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            All Skills ({skills.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-xs font-semibold text-muted-foreground uppercase">
                                    <th className="pb-2">Code</th>
                                    <th className="pb-2">Skill Name</th>
                                    <th className="pb-2">Levels In Use</th>
                                    <th className="pb-2 text-right">Mapped Units</th>
                                </tr>
                            </thead>
                            <tbody>
                                {skills.map((skill) => (
                                    <tr key={skill.id} className="border-b last:border-0">
                                        <td className="py-2 font-medium">
                                            {skill.skill_code}
                                        </td>
                                        <td className="py-2">{skill.skill_name}</td>
                                        <td className="py-2">
                                            <div className="flex gap-1">
                                                {(skill.levels ?? []).map((level) => (
                                                    <Badge
                                                        key={level.id}
                                                        variant="secondary"
                                                        title={level.description ?? undefined}
                                                    >
                                                        {level.responsibility_level}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="py-2 text-right">
                                            {skill.unit_skill_mappings_count}
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

SfiaSkills.layout = {
    breadcrumbs: [{ title: 'SFIA Skills', href: sfiaSkills.index() }],
};
