import { Head } from '@inertiajs/react';
import { Lock, Radar } from 'lucide-react';
import { useState } from 'react';
import { ProfileHistory } from '@/components/ems/profile-history';
import {
    EmptyState,
    EmsCard,
    EmsCardHeader,
    EmsPill,
    ScoreBars,
} from '@/components/ems/ui';
import RadarChart from '@/components/radar-chart';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { profile as profileRoute } from '@/routes/student';
import type {
    PreviousProfile,
    ProfileHistoryItem,
    ProfileSummary,
} from '@/types/ems';

type Props = {
    student: {
        name: string;
        student_number: string;
        course: string;
        level: string;
    };
    profile: ProfileSummary | null;
    previous: PreviousProfile | null;
    history: ProfileHistoryItem[];
};

export default function StudentProfile({
    student,
    profile,
    previous,
    history,
}: Props) {
    const [compare, setCompare] = useState(previous !== null);
    const isLatest = profile !== null && history[0]?.id === profile.id;
    const assessed =
        profile?.radar_data.filter((point) => point.assessed !== false) ?? [];
    const strongest = [...(profile?.scores ?? [])].sort(
        (a, b) => b.normalised_score - a.normalised_score,
    )[0];

    return (
        <>
            <Head title="My Competency Profile" />
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="flex flex-wrap items-center gap-2 text-sm text-ems-secondary">
                        {student.name} · {student.student_number} ·{' '}
                        {student.course}
                        <EmsPill>{student.level}</EmsPill>
                    </p>
                    <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-ems-surface-mid px-3 py-1 text-xs text-ems-secondary">
                        <Lock className="size-3" />
                        Read-only
                    </span>
                </div>

                {profile === null ? (
                    <EmsCard delay={1}>
                        <EmptyState
                            icon={Radar}
                            title="No competency profile yet"
                            description="Your administrator will generate your profile once your grades have been entered."
                        />
                    </EmsCard>
                ) : (
                    <>
                        {!isLatest && (
                            <div className="rounded-xl border border-ems-amber/40 bg-ems-amber/10 px-4 py-3 text-sm">
                                You are viewing an older profile from{' '}
                                {profile.generated_at}.
                            </div>
                        )}

                        <div className="grid gap-4 sm:grid-cols-3">
                            <Summary
                                label="Skills assessed"
                                value={`${assessed.length} of ${profile.radar_data.length}`}
                            />
                            <Summary
                                label="Strongest skill"
                                value={
                                    strongest
                                        ? `${strongest.skill_code} · ${strongest.normalised_score}%`
                                        : '—'
                                }
                                hint={strongest?.skill_name}
                            />
                            <Summary
                                label="Generated"
                                value={profile.generated_at}
                            />
                        </div>

                        <div className="grid gap-6 lg:grid-cols-5">
                            <EmsCard
                                delay={1}
                                className="overflow-hidden lg:col-span-3"
                            >
                                <EmsCardHeader
                                    title="Competency Radar"
                                    description="How your grades map onto SFIA skills. Skills marked (n/a) have no graded unit yet."
                                    actions={
                                        previous && (
                                            <div className="flex items-center gap-2">
                                                <Checkbox
                                                    id="compare"
                                                    checked={compare}
                                                    onCheckedChange={(value) =>
                                                        setCompare(
                                                            value === true,
                                                        )
                                                    }
                                                />
                                                <Label
                                                    htmlFor="compare"
                                                    className="text-xs"
                                                >
                                                    Compare with previous
                                                </Label>
                                            </div>
                                        )
                                    }
                                />
                                <div className="h-80 p-4 sm:h-[26rem] sm:p-6">
                                    <RadarChart
                                        data={profile.radar_data}
                                        previous={
                                            compare
                                                ? previous?.radar_data
                                                : null
                                        }
                                        previousLabel={`Previous (${previous?.generated_at})`}
                                    />
                                </div>
                            </EmsCard>

                            <EmsCard
                                delay={2}
                                className="overflow-hidden lg:col-span-2"
                            >
                                <EmsCardHeader
                                    title="My Scores"
                                    description={
                                        previous
                                            ? 'Change shown since your previous profile.'
                                            : 'Percentage of the maximum achievable score per skill.'
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

                        {history.length > 1 && (
                            <EmsCard
                                delay={3}
                                className="overflow-hidden lg:max-w-md"
                            >
                                <EmsCardHeader title="Profile History" />
                                <ProfileHistory
                                    history={history}
                                    href={(id) =>
                                        profileRoute.url({
                                            query: { profile: id },
                                        })
                                    }
                                />
                            </EmsCard>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

function Summary({
    label,
    value,
    hint,
}: {
    label: string;
    value: string;
    hint?: string;
}) {
    return (
        <EmsCard className="p-5">
            <p className="text-[10px] font-semibold tracking-[0.1em] text-ems-secondary/70 uppercase">
                {label}
            </p>
            <p className="mt-1 text-lg font-semibold">{value}</p>
            {hint && (
                <p className="truncate text-xs text-ems-secondary">{hint}</p>
            )}
        </EmsCard>
    );
}

StudentProfile.emsTitle = 'My Competency Profile';
