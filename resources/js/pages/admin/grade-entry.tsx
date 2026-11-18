import { Head, router } from '@inertiajs/react';
import { ClipboardEdit, X } from 'lucide-react';
import { useState } from 'react';
import {
    EmptyState,
    EmsCard,
    EmsCardHeader,
    ProgressBar,
    SearchInput,
    useSearch,
} from '@/components/ems/ui';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import gradeEntry from '@/routes/admin/grade-entry';
import type { AcademicUnit, GradeValue } from '@/types/ems';
import { GRADE_VALUES, GRADE_WEIGHTS } from '@/types/ems';

type StudentOption = {
    id: number;
    student_number: string;
    user: { id: number; name: string };
    course: { id: number; name: string };
};

type ExistingGrade = {
    id: number;
    unit_id: number;
    grade: GradeValue;
    weight: number;
};

type Props = {
    students: StudentOption[];
    selectedStudentId: string | null;
    units: AcademicUnit[];
    existingGrades: ExistingGrade[];
};

type GradeMap = Record<number, GradeValue | ''>;

export default function GradeEntry(props: Props) {
    // Remount the editor whenever the student or their saved grades change,
    // so local edits always start from what the server actually holds.
    const savedKey = props.existingGrades
        .map((record) => `${record.unit_id}:${record.grade}`)
        .join(',');

    return (
        <>
            <Head title="Grade Entry" />
            <GradeEntryEditor
                key={`${props.selectedStudentId}|${savedKey}`}
                {...props}
            />
        </>
    );
}

function GradeEntryEditor({
    students,
    selectedStudentId,
    units,
    existingGrades,
}: Props) {
    const saved: GradeMap = Object.fromEntries(
        existingGrades.map((record) => [record.unit_id, record.grade]),
    );

    const [grades, setGrades] = useState<GradeMap>(saved);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const { query, setQuery, results } = useSearch(units, (unit) => [
        unit.unit_code,
        unit.unit_title,
    ]);

    const selectedStudent = students.find(
        (student) => String(student.id) === selectedStudentId,
    );
    const changed = units.filter(
        (unit) => (grades[unit.id] ?? '') !== (saved[unit.id] ?? ''),
    );
    const dirty = changed.length > 0;

    const selectStudent = (value: string) => {
        if (
            dirty &&
            !window.confirm(
                'You have unsaved grade changes. Discard them and switch student?',
            )
        ) {
            return;
        }

        router.get(
            gradeEntry.index.url(),
            { student_id: value },
            { preserveScroll: true, replace: true },
        );
    };

    const setGrade = (unitId: number, grade: GradeValue | '') => {
        setGrades((current) => ({ ...current, [unitId]: grade }));
    };

    const save = () => {
        const payload = changed.map((unit) => ({
            unit_id: unit.id,
            grade: grades[unit.id] || null,
        }));

        router.post(
            gradeEntry.store.url(),
            { student_id: Number(selectedStudentId), grades: payload },
            {
                preserveScroll: true,
                onStart: () => {
                    setProcessing(true);
                    setErrors({});
                },
                onError: (validationErrors) => setErrors(validationErrors),
                onFinish: () => setProcessing(false),
            },
        );
    };

    const gradedCount = units.filter(
        (unit) => (grades[unit.id] ?? '') !== '',
    ).length;
    const errorMessages = [...new Set(Object.values(errors))];

    return (
        <div className="flex flex-col gap-6 pb-20">
            <EmsCard delay={1} className="p-4 sm:p-6">
                <div className="grid gap-4 md:grid-cols-[minmax(0,28rem)_1fr] md:items-end">
                    <div className="grid gap-2">
                        <Label htmlFor="student">Student</Label>
                        <Select
                            value={selectedStudentId ?? ''}
                            onValueChange={selectStudent}
                        >
                            <SelectTrigger
                                id="student"
                                className="bg-ems-surface"
                            >
                                <SelectValue placeholder="Select a student..." />
                            </SelectTrigger>
                            <SelectContent>
                                {students.map((student) => (
                                    <SelectItem
                                        key={student.id}
                                        value={String(student.id)}
                                    >
                                        {student.student_number} —{' '}
                                        {student.user.name} (
                                        {student.course.name})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.student_id} />
                    </div>
                    {selectedStudent && units.length > 0 && (
                        <div className="md:pb-1">
                            <div className="mb-1.5 flex justify-between text-xs text-ems-secondary">
                                <span>{selectedStudent.course.name}</span>
                                <span className="font-semibold text-ems-on-surface">
                                    {gradedCount} of {units.length} units graded
                                </span>
                            </div>
                            <ProgressBar
                                value={gradedCount}
                                max={units.length}
                                tone={
                                    gradedCount === units.length
                                        ? 'emerald'
                                        : 'primary'
                                }
                                label={`${gradedCount} of ${units.length} units graded`}
                            />
                        </div>
                    )}
                </div>
            </EmsCard>

            {selectedStudentId === null ? (
                <EmsCard delay={2}>
                    <EmptyState
                        icon={ClipboardEdit}
                        title="Choose a student to enter grades"
                        description="Only the units on the student's own course are listed. Grades are Pass, Merit or Distinction, and their weights (0.5, 0.75, 1.0) are applied automatically."
                    />
                </EmsCard>
            ) : (
                <EmsCard delay={2} className="overflow-hidden">
                    <EmsCardHeader
                        title="Unit Grades"
                        description="Pass = 0.5 · Merit = 0.75 · Distinction = 1.0. Changed rows are highlighted until saved."
                        actions={
                            <SearchInput
                                value={query}
                                onChange={setQuery}
                                placeholder="Filter units…"
                            />
                        }
                    />

                    {errorMessages.length > 0 && (
                        <div
                            role="alert"
                            className="mx-4 mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 sm:mx-6 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
                        >
                            <ul className="list-inside list-disc">
                                {errorMessages.map((message) => (
                                    <li key={message}>{message}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {units.length === 0 ? (
                        <EmptyState
                            icon={ClipboardEdit}
                            title="This student's course has no units yet."
                        />
                    ) : (
                        <ul className="divide-y divide-ems-border/50">
                            {results.length === 0 && (
                                <li className="px-6 py-10 text-center text-sm text-ems-secondary">
                                    No units match “{query}”.
                                </li>
                            )}
                            {results.map((unit) => {
                                const grade = grades[unit.id] ?? '';
                                const isChanged =
                                    grade !== (saved[unit.id] ?? '');

                                return (
                                    <li
                                        key={unit.id}
                                        className={`flex flex-col gap-2 px-4 py-3 transition-colors sm:flex-row sm:items-center sm:gap-4 sm:px-6 ${
                                            isChanged
                                                ? 'bg-ems-amber/10'
                                                : 'hover:bg-white/40 dark:hover:bg-white/5'
                                        }`}
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm">
                                                <span className="font-semibold">
                                                    {unit.unit_code}
                                                </span>{' '}
                                                {unit.unit_title}
                                            </p>
                                            <p className="text-xs text-ems-secondary">
                                                {unit.credit_value} credits ·
                                                Level {unit.level}
                                                {isChanged && (
                                                    <span className="ml-2 font-semibold text-ems-amber">
                                                        unsaved
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Select
                                                value={grade}
                                                onValueChange={(value) =>
                                                    setGrade(
                                                        unit.id,
                                                        value as GradeValue,
                                                    )
                                                }
                                            >
                                                <SelectTrigger
                                                    className="h-9 w-40 bg-ems-surface"
                                                    aria-label={`Grade for ${unit.unit_code}`}
                                                >
                                                    <SelectValue placeholder="Not graded" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {GRADE_VALUES.map(
                                                        (value) => (
                                                            <SelectItem
                                                                key={value}
                                                                value={value}
                                                            >
                                                                {value}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <span className="w-10 text-right text-sm font-medium tabular-nums">
                                                {grade === ''
                                                    ? '—'
                                                    : GRADE_WEIGHTS[
                                                          grade
                                                      ].toFixed(2)}
                                            </span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className={`size-8 ${grade === '' ? 'invisible' : ''}`}
                                                title="Clear grade"
                                                aria-label={`Clear grade for ${unit.unit_code}`}
                                                onClick={() =>
                                                    setGrade(unit.id, '')
                                                }
                                            >
                                                <X className="size-4 text-ems-secondary" />
                                            </Button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </EmsCard>
            )}

            {dirty && (
                <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ems-border bg-ems-surface/90 backdrop-blur-md lg:left-60">
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-10">
                        <p className="text-sm font-medium">
                            {changed.length} unsaved{' '}
                            {changed.length === 1 ? 'change' : 'changes'}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={processing}
                                onClick={() => {
                                    setGrades(saved);
                                    setErrors({});
                                }}
                            >
                                Discard
                            </Button>
                            <Button
                                onClick={save}
                                disabled={processing}
                                className="bg-ems-primary hover:bg-ems-primary-container"
                            >
                                {processing && <Spinner />}
                                Save grades
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

GradeEntry.emsTitle = 'Grade Entry';
