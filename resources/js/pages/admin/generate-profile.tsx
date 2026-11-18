import { Head, Link, router, usePage } from '@inertiajs/react';
import { AlertTriangle, BarChart3, Eye, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import {
    EmsCard,
    EmsCardHeader,
    EmsPill,
    EmsTable,
    NoResultsRow,
    ProgressBar,
    SearchInput,
    useSearch,
} from '@/components/ems/ui';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import profiles from '@/routes/admin/profiles';

type StudentRow = {
    id: number;
    name: string;
    student_number: string;
    course: string;
    level: string;
    graded_units: number;
    total_units: number;
    profiles_count: number;
    latest_profile: {
        id: number;
        generated_at: string;
        generated_ago: string;
    } | null;
};

type Props = {
    students: StudentRow[];
};

export default function GenerateProfile({ students }: Props) {
    const { errors } = usePage<{ errors: Record<string, string> }>().props;
    const [generatingId, setGeneratingId] = useState<number | null>(null);
    const { query, setQuery, results } = useSearch(students, (student) => [
        student.name,
        student.student_number,
        student.course,
    ]);

    const generate = (student: StudentRow) => {
        router.post(
            profiles.store.url(),
            { student_id: student.id },
            {
                preserveScroll: true,
                onStart: () => setGeneratingId(student.id),
                onFinish: () => setGeneratingId(null),
            },
        );
    };

    const withProfiles = students.filter(
        (student) => student.latest_profile !== null,
    ).length;

    const actions = (student: StudentRow) => (
        <Actions
            student={student}
            busy={generatingId === student.id}
            disabled={generatingId !== null}
            onGenerate={() => generate(student)}
        />
    );

    return (
        <>
            <Head title="Generate Profile" />
            <div className="flex flex-col gap-6">
                {errors.student_id && (
                    <div
                        role="alert"
                        className="flex items-start gap-2 rounded-xl border border-ems-amber/40 bg-ems-amber/10 px-4 py-3 text-sm"
                    >
                        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-ems-amber" />
                        {errors.student_id}
                    </div>
                )}

                <EmsCard delay={1} className="overflow-hidden">
                    <EmsCardHeader
                        title={`Students (${students.length})`}
                        description={`Run the calculation engine to create a new competency profile. ${withProfiles} of ${students.length} students have a profile.`}
                        actions={
                            <SearchInput
                                value={query}
                                onChange={setQuery}
                                placeholder="Search students…"
                            />
                        }
                    />

                    {/* Phones: stacked cards */}
                    <ul className="divide-y divide-ems-border/50 md:hidden">
                        {results.length === 0 && (
                            <li className="px-4 py-10 text-center text-sm text-ems-secondary">
                                No matches.
                            </li>
                        )}
                        {results.map((student) => (
                            <li
                                key={student.id}
                                className="flex flex-col gap-3 px-4 py-4"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <StudentCell student={student} />
                                    <EmsPill>{student.level}</EmsPill>
                                </div>
                                <GradesCell student={student} />
                                <div className="flex items-center justify-between gap-3">
                                    <LatestCell student={student} />
                                    {actions(student)}
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Tablet and up: table */}
                    <div className="hidden md:block">
                        <EmsTable
                            headers={[
                                'Student',
                                'Course',
                                'Grades',
                                'Latest Profile',
                                '',
                            ]}
                            align={['left', 'left', 'left', 'left', 'right']}
                        >
                            {results.length === 0 && (
                                <NoResultsRow
                                    colSpan={5}
                                    onClear={() => setQuery('')}
                                />
                            )}
                            {results.map((student) => (
                                <tr
                                    key={student.id}
                                    className="transition-colors hover:bg-white/50 dark:hover:bg-white/5"
                                >
                                    <td className="px-6 py-4">
                                        <StudentCell student={student} />
                                    </td>
                                    <td className="px-6 py-4 text-sm text-ems-secondary">
                                        <span className="mr-2">
                                            {student.course}
                                        </span>
                                        <EmsPill>{student.level}</EmsPill>
                                    </td>
                                    <td className="min-w-40 px-6 py-4">
                                        <GradesCell student={student} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <LatestCell student={student} />
                                    </td>
                                    <td className="px-6 py-4">
                                        {actions(student)}
                                    </td>
                                </tr>
                            ))}
                        </EmsTable>
                    </div>
                </EmsCard>
            </div>
        </>
    );
}

function StudentCell({ student }: { student: StudentRow }) {
    return (
        <div className="min-w-0">
            <p className="text-sm font-semibold">{student.name}</p>
            <p className="text-xs text-ems-secondary">
                {student.student_number}
                <span className="md:hidden"> · {student.course}</span>
            </p>
        </div>
    );
}

function GradesCell({ student }: { student: StudentRow }) {
    const complete =
        student.total_units > 0 && student.graded_units >= student.total_units;

    return (
        <div>
            <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
                <span className="font-medium">
                    {student.graded_units} / {student.total_units} units graded
                </span>
                {!complete && student.graded_units > 0 && (
                    <span
                        className="text-ems-amber"
                        title="A profile generated now will not reflect every unit"
                    >
                        incomplete
                    </span>
                )}
            </div>
            <ProgressBar
                value={student.graded_units}
                max={student.total_units}
                tone={complete ? 'emerald' : 'primary'}
                label={`${student.name}: ${student.graded_units} of ${student.total_units} units graded`}
            />
        </div>
    );
}

function LatestCell({ student }: { student: StudentRow }) {
    if (student.latest_profile === null) {
        return (
            <span className="text-sm text-ems-secondary/70">
                Never generated
            </span>
        );
    }

    return (
        <span className="text-sm" title={student.latest_profile.generated_at}>
            {student.latest_profile.generated_ago}
            <span className="block text-xs text-ems-secondary">
                {student.profiles_count}{' '}
                {student.profiles_count === 1 ? 'profile' : 'profiles'}
            </span>
        </span>
    );
}

function Actions({
    student,
    busy,
    disabled,
    onGenerate,
}: {
    student: StudentRow;
    busy: boolean;
    disabled: boolean;
    onGenerate: () => void;
}) {
    const hasProfile = student.latest_profile !== null;

    return (
        <div className="flex shrink-0 justify-end gap-2">
            {student.latest_profile && (
                <Button asChild variant="outline" size="sm">
                    <Link href={profiles.show.url(student.latest_profile.id)}>
                        <Eye className="size-4" />
                        View
                    </Link>
                </Button>
            )}
            <Button
                size="sm"
                disabled={student.graded_units === 0 || disabled}
                title={
                    student.graded_units === 0
                        ? 'Enter grades before generating a profile'
                        : undefined
                }
                onClick={onGenerate}
                className="bg-ems-primary hover:bg-ems-primary-container"
            >
                {busy ? (
                    <Spinner />
                ) : hasProfile ? (
                    <RefreshCw className="size-4" />
                ) : (
                    <BarChart3 className="size-4" />
                )}
                {hasProfile ? 'Regenerate' : 'Generate'}
            </Button>
        </div>
    );
}

GenerateProfile.emsTitle = 'Generate Profile';
