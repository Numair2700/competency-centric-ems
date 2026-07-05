import { Head, Link } from '@inertiajs/react';
import RadarChart from '@/components/radar-chart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';
import { profile } from '@/routes/student';
import type { RadarDataPoint } from '@/types/ems';

type Props = {
    student: {
        name: string;
        student_number: string;
        programme: string;
        level: string;
    } | null;
    latestProfile: {
        id: number;
        generated_at: string;
        radar_data: RadarDataPoint[];
    } | null;
};

export default function StudentDashboard({ student, latestProfile }: Props) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-4">
                {student === null ? (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            No student record is linked to your account. Contact your
                            administrator.
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-base">
                                    Welcome, {student.name}
                                </CardTitle>
                                <Badge variant="secondary">Read-only</Badge>
                            </CardHeader>
                            <CardContent className="grid gap-2 text-sm sm:grid-cols-3">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase">
                                        Student Number
                                    </p>
                                    <p className="font-medium">{student.student_number}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase">
                                        Programme
                                    </p>
                                    <p className="font-medium">{student.programme}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase">
                                        Level
                                    </p>
                                    <p className="font-medium">{student.level}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-base">
                                    My Competency Profile
                                </CardTitle>
                                {latestProfile && (
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={profile()}>View Full Profile</Link>
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent>
                                {latestProfile === null ? (
                                    <p className="py-8 text-center text-sm text-muted-foreground">
                                        Your competency profile has not been generated yet.
                                    </p>
                                ) : (
                                    <div className="mx-auto h-80 max-w-lg">
                                        <RadarChart data={latestProfile.radar_data} />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </>
    );
}

StudentDashboard.emsTitle = 'Dashboard';
