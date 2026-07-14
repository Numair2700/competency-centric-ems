import { Head } from '@inertiajs/react';
import RadarChart from '@/components/radar-chart';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { profile } from '@/routes/student';
import type { CompetencyScoreRow, RadarDataPoint } from '@/types/ems';

type Props = {
    student: {
        name: string;
        student_number: string;
        pathway: string;
        level: string;
    };
    profile: {
        generated_at: string;
        radar_data: RadarDataPoint[];
        scores: CompetencyScoreRow[];
    } | null;
};

export default function StudentProfile({ student, profile: competencyProfile }: Props) {
    return (
        <>
            <Head title="My Competency Profile" />
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-ems-secondary">
                        {student.name} · {student.student_number} · {student.pathway}
                    </p>
                    <Badge variant="secondary">Read-only for Students</Badge>
                </div>

                {competencyProfile === null ? (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            Your competency profile has not been generated yet. Your
                            administrator will generate it once your grades are complete.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Competency Radar
                                </CardTitle>
                                <p className="text-xs text-muted-foreground">
                                    Generated {competencyProfile.generated_at}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="mx-auto h-96">
                                    <RadarChart data={competencyProfile.radar_data} />
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
                                        <tr className="border-b border-ems-border text-left text-xs font-semibold text-ems-secondary/60 uppercase">
                                            <th className="pb-2">SFIA Skill</th>
                                            <th className="pb-2 text-right">Raw Score</th>
                                            <th className="pb-2 text-right">Normalised</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {competencyProfile.scores.map((score) => (
                                            <tr
                                                key={score.skill_code}
                                                className="border-b border-ems-border/60 last:border-0"
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
                                                <td className="py-2 text-right font-semibold text-ems-primary">
                                                    {score.normalised_score}%
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </>
    );
}

StudentProfile.emsTitle = 'My Competency Profile';
