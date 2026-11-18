import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    GraduationCap,
    Radar,
    UserX,
} from 'lucide-react';
import {
    EmptyState,
    EmsCard,
    EmsCardHeader,
    EmsPill,
    GradePill,
    ProgressBar,
    StatCard,
} from '@/components/ems/ui';
import RadarChart from '@/components/radar-chart';
import { Button } from '@/components/ui/button';
import { profile } from '@/routes/student';
import type { RadarDataPoint } from '@/types/ems';
import { GRADE_VALUES } from '@/types/ems';

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

export default function StudentDashboard({
    student,
    units,
    latestProfile,
}: Props) {
    if (student === null) {
        return (
            <>
                <Head title="Dashboard" />
                <EmsCard>
                    <EmptyState
                        icon={UserX}
                        title="No student record"
                        description="No student record is linked to your account. Contact your administrator."
                    />
                </EmsCard>
            </>
        );
    }

    const graded = units.filter((unit) => unit.grade !== null);
    const totalCredits = units.reduce(
        (sum, unit) => sum + unit.credit_value,
        0,
    );
    const earnedCredits = graded.reduce(
        (sum, unit) => sum + unit.credit_value,
        0,
    );
    const distribution = GRADE_VALUES.map((grade) => ({
        grade,
        count: graded.filter((unit) => unit.grade === grade).length,
    })).reverse();

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6">
                <div>
                    <h2 className="text-xl font-semibold">
                        Welcome back, {student.name.split(' ')[0]}
                    </h2>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ems-secondary">
                        {student.student_number} · {student.course}
                        <EmsPill>{student.level}</EmsPill>
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <StatCard
                        delay={1}
                        icon={BookOpen}
                        label="Units Graded"
                        value={`${graded.length} / ${units.length}`}
                    />
                    <StatCard
                        delay={2}
                        icon={GraduationCap}
                        label="Credits Completed"
                        value={`${earnedCredits} / ${totalCredits}`}
                    />
                    <EmsCard
                        delay={3}
                        className="flex flex-col justify-between gap-3 p-5"
                    >
                        <p className="text-[10px] font-semibold tracking-[0.1em] text-ems-secondary/60 uppercase">
                            Grade Mix
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {distribution.map(({ grade, count }) => (
                                <span
                                    key={grade}
                                    className="flex items-center gap-1.5"
                                >
                                    <GradePill grade={grade} />
                                    <span className="text-sm font-semibold tabular-nums">
                                        {count}
                                    </span>
                                </span>
                            ))}
                        </div>
                        <ProgressBar
                            value={graded.length}
                            max={units.length}
                            tone={
                                graded.length === units.length &&
                                units.length > 0
                                    ? 'emerald'
                                    : 'primary'
                            }
                            label={`${graded.length} of ${units.length} units graded`}
                        />
                    </EmsCard>
                </div>

                <div className="grid gap-6 lg:grid-cols-5">
                    <EmsCard
                        delay={2}
                        className="overflow-hidden lg:col-span-3"
                    >
                        <EmsCardHeader
                            title="My Units"
                            description={`${graded.length} of ${units.length} graded`}
                        />
                        {units.length === 0 ? (
                            <EmptyState
                                icon={BookOpen}
                                title="No units listed for your course yet."
                            />
                        ) : (
                            <ul className="divide-y divide-ems-border/50">
                                {units.map((unit) => (
                                    <li
                                        key={unit.id}
                                        className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium">
                                                <span className="text-ems-secondary">
                                                    {unit.unit_code}
                                                </span>{' '}
                                                {unit.unit_title}
                                            </p>
                                            <p className="text-xs text-ems-secondary">
                                                <span className="capitalize">
                                                    {unit.unit_type}
                                                </span>{' '}
                                                · {unit.credit_value} credits
                                            </p>
                                        </div>
                                        {unit.grade === null ? (
                                            <span className="shrink-0 text-xs text-ems-secondary/70">
                                                Not yet graded
                                            </span>
                                        ) : (
                                            <span className="flex shrink-0 items-center gap-1.5">
                                                <CheckCircle2 className="size-3.5 text-ems-emerald" />
                                                <GradePill grade={unit.grade} />
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </EmsCard>

                    <EmsCard
                        delay={3}
                        className="h-fit overflow-hidden lg:col-span-2"
                    >
                        <EmsCardHeader
                            title="Competency Profile"
                            description={
                                latestProfile
                                    ? `Generated ${latestProfile.generated_at}`
                                    : undefined
                            }
                        />
                        {latestProfile === null ? (
                            <EmptyState
                                icon={Radar}
                                title="Not generated yet"
                                description="Your administrator will generate your profile once your grades are in."
                            />
                        ) : (
                            <div className="flex flex-col gap-4 p-4 sm:p-6">
                                <div className="h-72">
                                    <RadarChart
                                        data={latestProfile.radar_data}
                                    />
                                </div>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="w-full"
                                >
                                    <Link href={profile()}>
                                        View full profile
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </EmsCard>
                </div>
            </div>
        </>
    );
}

StudentDashboard.emsTitle = 'Dashboard';
