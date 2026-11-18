import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { ProfileHistory } from '@/components/ems/profile-history';
import {
    EmsCard,
    EmsCardHeader,
    EmsPill,
    ScoreBars,
} from '@/components/ems/ui';
import RadarChart from '@/components/radar-chart';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import profiles from '@/routes/admin/profiles';
import type {
    PreviousProfile,
    ProfileHistoryItem,
    ProfileSummary,
} from '@/types/ems';

type DerivationRow = {
    unit_code: string;
    unit_title: string;
    credit_value: number;
    grade: string;
    weight: number;
    mapping_weight: number;
    sfia_level?: number | null;
    contribution: number;
};

type Props = {
    student: {
        id: number;
        name: string;
        student_number: string;
        course: string;
        level: string;
    };
    profile: ProfileSummary;
    previous: PreviousProfile | null;
    history: ProfileHistoryItem[];
    derivation: { skill_code: string; units: DerivationRow[] }[];
};

export default function ProfileView({
    student,
    profile,
    previous,
    history,
    derivation,
}: Props) {
    const recalculate = useForm({ student_id: String(student.id) });
    const [compare, setCompare] = useState(previous !== null);
    const isLatest = history[0]?.id === profile.id;
    const skillNames = Object.fromEntries(
        profile.radar_data.map((point) => [point.skill_code, point.skill_name]),
    );

    return (
        <>
            <Head title={`Profile — ${student.name}`} />
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <Link
                            href={profiles.index.url()}
                            className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-ems-secondary hover:text-ems-primary"
                        >
                            <ArrowLeft className="size-3.5" />
                            All students
                        </Link>
                        <h2 className="text-xl font-semibold">
                            {student.name}{' '}
                            <span className="font-normal text-ems-secondary">
                                · {student.student_number}
                            </span>
                        </h2>
                        <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ems-secondary">
                            {student.course} <EmsPill>{student.level}</EmsPill>
                            <span>· Generated {profile.generated_at}</span>
                            {!isLatest && (
                                <span className="rounded bg-ems-amber/10 px-2 py-0.5 text-xs font-semibold text-ems-amber">
                                    Older profile
                                </span>
                            )}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        disabled={recalculate.processing}
                        onClick={() => recalculate.post(profiles.store.url())}
                        title="Generate a new profile from the student's current grades"
                    >
                        {recalculate.processing ? (
                            <Spinner />
                        ) : (
                            <RefreshCw className="size-4" />
                        )}
                        Recalculate
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-5">
                    <EmsCard
                        delay={1}
                        className="overflow-hidden lg:col-span-3"
                    >
                        <EmsCardHeader
                            title="Competency Radar"
                            description="One axis per SFIA skill on the student's course. Skills marked (n/a) have no graded unit yet."
                            actions={
                                previous && (
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            id="compare"
                                            checked={compare}
                                            onCheckedChange={(value) =>
                                                setCompare(value === true)
                                            }
                                        />
                                        <Label
                                            htmlFor="compare"
                                            className="text-xs"
                                        >
                                            Compare with {previous.generated_at}
                                        </Label>
                                    </div>
                                )
                            }
                        />
                        <div className="h-80 p-4 sm:h-[26rem] sm:p-6">
                            <RadarChart
                                data={profile.radar_data}
                                previous={compare ? previous?.radar_data : null}
                                previousLabel={`Previous (${previous?.generated_at})`}
                            />
                        </div>
                    </EmsCard>

                    <EmsCard
                        delay={2}
                        className="overflow-hidden lg:col-span-2"
                    >
                        <EmsCardHeader
                            title="Scores"
                            description={
                                previous
                                    ? 'Normalised score, with change since the previous profile.'
                                    : 'Normalised score per assessed skill.'
                            }
                        />
                        <div className="p-4 sm:p-6">
                            <ScoreBars
                                scores={profile.scores}
                                showChange={previous !== null}
                            />
                        </div>
                    </EmsCard>
                </div>

                <div className="grid gap-6 lg:grid-cols-5">
                    <EmsCard
                        delay={3}
                        className="overflow-hidden lg:col-span-3"
                    >
                        <EmsCardHeader
                            title="Score Derivation"
                            description="Contribution = credits × grade weight (Pass 0.5 · Merit 0.75 · Distinction 1.0) × mapping weight. Inputs as recorded when this profile was generated."
                        />
                        <div className="divide-y divide-ems-border/60">
                            {derivation.map((skill) => (
                                <details
                                    key={skill.skill_code}
                                    className="group"
                                >
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 hover:bg-white/40 sm:px-6 dark:hover:bg-white/5 [&::-webkit-details-marker]:hidden">
                                        <span className="flex min-w-0 items-center gap-2 text-sm">
                                            <ChevronRight className="size-4 shrink-0 text-ems-secondary transition-transform group-open:rotate-90" />
                                            <span className="font-semibold">
                                                {skill.skill_code}
                                            </span>
                                            <span className="truncate text-ems-secondary">
                                                {skillNames[skill.skill_code]}
                                            </span>
                                        </span>
                                        <span className="shrink-0 text-xs text-ems-secondary">
                                            {skill.units.length}{' '}
                                            {skill.units.length === 1
                                                ? 'unit'
                                                : 'units'}
                                        </span>
                                    </summary>
                                    <div className="overflow-x-auto px-4 pb-4 sm:px-6">
                                        <table className="w-full min-w-[560px] text-sm">
                                            <thead>
                                                <tr className="border-b border-ems-border text-left text-[11px] font-semibold text-ems-secondary/70 uppercase">
                                                    <th className="py-2">
                                                        Unit
                                                    </th>
                                                    <th className="py-2 text-right">
                                                        Credits
                                                    </th>
                                                    <th className="py-2 text-right">
                                                        Grade
                                                    </th>
                                                    <th className="py-2 text-right">
                                                        Grade wt.
                                                    </th>
                                                    <th className="py-2 text-right">
                                                        Mapping wt.
                                                    </th>
                                                    <th className="py-2 text-right">
                                                        SFIA lvl
                                                    </th>
                                                    <th className="py-2 text-right">
                                                        Contribution
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {skill.units.map((unit) => (
                                                    <tr
                                                        key={`${skill.skill_code}-${unit.unit_code}`}
                                                        className="border-b border-ems-border/50 last:border-0"
                                                    >
                                                        <td className="py-1.5">
                                                            <span className="font-medium">
                                                                {unit.unit_code}
                                                            </span>{' '}
                                                            <span className="text-ems-secondary">
                                                                {
                                                                    unit.unit_title
                                                                }
                                                            </span>
                                                        </td>
                                                        <td className="py-1.5 text-right tabular-nums">
                                                            {unit.credit_value}
                                                        </td>
                                                        <td className="py-1.5 text-right">
                                                            {unit.grade}
                                                        </td>
                                                        <td className="py-1.5 text-right tabular-nums">
                                                            {unit.weight}
                                                        </td>
                                                        <td className="py-1.5 text-right tabular-nums">
                                                            {
                                                                unit.mapping_weight
                                                            }
                                                        </td>
                                                        <td className="py-1.5 text-right tabular-nums">
                                                            {unit.sfia_level ??
                                                                '—'}
                                                        </td>
                                                        <td className="py-1.5 text-right font-semibold tabular-nums">
                                                            {unit.contribution}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </EmsCard>

                    <EmsCard
                        delay={4}
                        className="overflow-hidden lg:col-span-2"
                    >
                        <EmsCardHeader
                            title="Profile History"
                            description={`${history.length} ${history.length === 1 ? 'profile' : 'profiles'} generated for this student.`}
                        />
                        <ProfileHistory
                            history={history}
                            href={(id) => profiles.show.url(id)}
                        />
                    </EmsCard>
                </div>
            </div>
        </>
    );
}

ProfileView.emsTitle = 'Competency Profile';
