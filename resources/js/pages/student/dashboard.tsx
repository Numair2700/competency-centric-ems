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
        course: string;
        level: string;
    } | null;
    units: {
        id: number;
        unit_code: string;
        unit_title: string;
        credit_value: number;
        unit_type: string;
        grade: string | null;
    }[];
    latestProfile: {
        id: number;
        generated_at: string;
        radar_data: RadarDataPoint[];
    } | null;
};

export default function StudentDashboard({ student, units, latestProfile }: Props) {
    const gradedCount = units.filter((unit) => unit.grade !== null).length;
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6">
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
                                        Course
                                    </p>
                                    <p className="font-medium">{student.course}</p>
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
                                <CardTitle className="text-base">My Units</CardTitle>
                                <Badge variant="secondary">
                                    {gradedCount} of {units.length} graded
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                {units.length === 0 ? (
                                    <p className="py-8 text-center text-sm text-muted-foreground">
                                        No units are listed for your course yet.
                                    </p>
                                ) : (
                                    <ul className="divide-y">
                                        {units.map((unit) => (
                                            <li
                                                key={unit.id}
                                                className="flex items-center justify-between gap-4 py-3"
                                            >
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium">
                                                        <span className="text-muted-foreground">
                                                            {unit.unit_code}
                                                        </span>{' '}
                                                        {unit.unit_title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground capitalize">
                                                        {unit.unit_type} · {unit.credit_value}{' '}
                                                        credits
                                                    </p>
                                                </div>
                                                {unit.grade === null ? (
                                                    <Badge variant="outline">Not yet graded</Badge>
                                                ) : (
                                                    <Badge>{unit.grade}</Badge>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
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
