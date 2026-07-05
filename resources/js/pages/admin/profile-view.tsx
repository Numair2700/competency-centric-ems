import { Head, Link, useForm } from '@inertiajs/react';
import { RefreshCw } from 'lucide-react';
import RadarChart from '@/components/radar-chart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import profiles from '@/routes/admin/profiles';
import type { CompetencyScoreRow, RadarDataPoint } from '@/types/ems';

type DerivationRow = {
    unit_code: string;
    unit_title: string;
    credit_value: number;
    grade: string;
    weight: number;
    contribution: number;
};

type Props = {
    profile: {
        id: number;
        generated_at: string;
        radar_data: RadarDataPoint[];
        student: {
            id: number;
            name: string;
            student_number: string;
            programme: string;
        };
        scores: CompetencyScoreRow[];
    };
    derivation: { skill_code: string; units: DerivationRow[] }[];
};

export default function ProfileView({ profile, derivation }: Props) {
    const recalculate = useForm({ student_id: String(profile.student.id) });

    return (
        <>
            <Head title={`Profile — ${profile.student.name}`} />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">
                            {profile.student.name}{' '}
                            <span className="text-muted-foreground">
                                · {profile.student.student_number}
                            </span>
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {profile.student.programme} · Generated {profile.generated_at}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge variant="secondary">
                            Admin View · Read-only for Students
                        </Badge>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={recalculate.processing}
                            onClick={() => recalculate.post(profiles.store.url())}
                        >
                            {recalculate.processing ? (
                                <Spinner />
                            ) : (
                                <RefreshCw className="size-4" />
                            )}
                            Recalculate
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Competency Radar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mx-auto h-96">
                                <RadarChart data={profile.radar_data} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Score Breakdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-xs font-semibold text-muted-foreground uppercase">
                                        <th className="pb-2">SFIA Skill</th>
                                        <th className="pb-2 text-right">Raw</th>
                                        <th className="pb-2 text-right">Normalised</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {profile.scores.map((score) => (
                                        <tr
                                            key={score.skill_code}
                                            className="border-b last:border-0"
                                        >
                                            <td className="py-2">
                                                <span className="font-medium">
                                                    {score.skill_code}
                                                </span>{' '}
                                                <span className="text-muted-foreground">
                                                    {score.skill_name}
                                                </span>
                                            </td>
                                            <td className="py-2 text-right">
                                                {score.raw_score}
                                            </td>
                                            <td className="py-2 text-right font-semibold text-[#1e40af]">
                                                {score.normalised_score}%
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Score Derivation (FR14 — how each score was calculated)
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                            Contribution per unit = credit value × grade weight (Pass 0.5 ·
                            Merit 0.75 · Distinction 1.0)
                        </p>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {derivation.map((skill) => (
                            <div key={skill.skill_code}>
                                <h3 className="mb-1 text-sm font-semibold">
                                    {skill.skill_code}
                                </h3>
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left text-xs font-semibold text-muted-foreground uppercase">
                                            <th className="pb-1">Unit</th>
                                            <th className="pb-1 text-right">Credits</th>
                                            <th className="pb-1 text-right">Grade</th>
                                            <th className="pb-1 text-right">Weight</th>
                                            <th className="pb-1 text-right">Contribution</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {skill.units.map((unit) => (
                                            <tr
                                                key={`${skill.skill_code}-${unit.unit_code}`}
                                                className="border-b last:border-0"
                                            >
                                                <td className="py-1.5">
                                                    {unit.unit_code} {unit.unit_title}
                                                </td>
                                                <td className="py-1.5 text-right">
                                                    {unit.credit_value}
                                                </td>
                                                <td className="py-1.5 text-right">
                                                    {unit.grade}
                                                </td>
                                                <td className="py-1.5 text-right">
                                                    {unit.weight}
                                                </td>
                                                <td className="py-1.5 text-right font-medium">
                                                    {unit.contribution}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ProfileView.layout = {
    breadcrumbs: [{ title: 'Generate Profile', href: profiles.index() }],
};
