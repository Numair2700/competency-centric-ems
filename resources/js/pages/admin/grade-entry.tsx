import { Head, router } from '@inertiajs/react';
import { Info, X } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        <div className="flex flex-col gap-6">
            <p className="text-sm text-ems-secondary">
                Enter student grades per academic unit (FR7). Weights apply
                automatically on save.
            </p>

            <Card className="max-w-md">
                <CardContent className="pt-6">
                    <div className="grid gap-2">
                        <Label htmlFor="student">Student</Label>
                        <Select
                            value={selectedStudentId ?? ''}
                            onValueChange={selectStudent}
                        >
                            <SelectTrigger id="student">
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
                </CardContent>
            </Card>

            {selectedStudentId !== null && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Unit Grades</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Alert className="border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
                            <Info className="size-4" />
                            <AlertDescription>
                                Grades are restricted to Pass, Merit, and
                                Distinction (FR16). Weights are applied
                                automatically: Pass = 0.5, Merit = 0.75,
                                Distinction = 1.0.
                            </AlertDescription>
                        </Alert>

                        {errorMessages.length > 0 && (
                            <Alert variant="destructive" role="alert">
                                <AlertDescription>
                                    <ul className="list-inside list-disc">
                                        {errorMessages.map((message) => (
                                            <li key={message}>{message}</li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}

                        {units.length === 0 ? (
                            <p className="py-6 text-center text-sm text-muted-foreground">
                                This student's course has no units yet.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[560px] text-sm">
                                    <thead>
                                        <tr className="border-b border-ems-border text-left text-xs font-semibold text-ems-secondary/60 uppercase">
                                            <th className="pb-2">Unit</th>
                                            <th className="pb-2 text-right">
                                                Credits
                                            </th>
                                            <th className="pb-2 text-right">
                                                Level
                                            </th>
                                            <th className="pb-2 pl-4">Grade</th>
                                            <th className="pb-2 text-right">
                                                Weight
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {units.map((unit) => {
                                            const grade = grades[unit.id] ?? '';
                                            const isChanged =
                                                grade !==
                                                (saved[unit.id] ?? '');

                                            return (
                                                <tr
                                                    key={unit.id}
                                                    className={`border-b border-ems-border/60 last:border-0 ${
                                                        isChanged
                                                            ? 'bg-amber-50/60 dark:bg-amber-950/30'
                                                            : ''
                                                    }`}
                                                >
                                                    <td className="py-2">
                                                        <span className="font-medium">
                                                            {unit.unit_code}
                                                        </span>{' '}
                                                        {unit.unit_title}
                                                    </td>
                                                    <td className="py-2 text-right">
                                                        {unit.credit_value}
                                                    </td>
                                                    <td className="py-2 text-right">
                                                        {unit.level}
                                                    </td>
                                                    <td className="py-2 pl-4">
                                                        <div className="flex items-center gap-1">
                                                            <Select
                                                                value={grade}
                                                                onValueChange={(
                                                                    value,
                                                                ) =>
                                                                    setGrade(
                                                                        unit.id,
                                                                        value as GradeValue,
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger
                                                                    className="h-8 w-36"
                                                                    aria-label={`Grade for ${unit.unit_code}`}
                                                                >
                                                                    <SelectValue placeholder="Not graded" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {GRADE_VALUES.map(
                                                                        (
                                                                            value,
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    value
                                                                                }
                                                                                value={
                                                                                    value
                                                                                }
                                                                            >
                                                                                {
                                                                                    value
                                                                                }
                                                                            </SelectItem>
                                                                        ),
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
                                                            {grade !== '' && (
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="size-8"
                                                                    title="Clear grade"
                                                                    aria-label={`Clear grade for ${unit.unit_code}`}
                                                                    onClick={() =>
                                                                        setGrade(
                                                                            unit.id,
                                                                            '',
                                                                        )
                                                                    }
                                                                >
                                                                    <X className="size-4 text-ems-secondary" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-2 text-right font-medium">
                                                        {grade === ''
                                                            ? '—'
                                                            : GRADE_WEIGHTS[
                                                                  grade
                                                              ].toFixed(2)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm text-muted-foreground">
                                {gradedCount} of {units.length} units graded
                                {dirty && (
                                    <span className="ml-2 font-medium text-amber-700 dark:text-amber-300">
                                        · {changed.length} unsaved{' '}
                                        {changed.length === 1
                                            ? 'change'
                                            : 'changes'}
                                    </span>
                                )}
                            </p>
                            <div className="flex gap-2">
                                {dirty && (
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
                                )}
                                <Button
                                    onClick={save}
                                    disabled={!dirty || processing}
                                    className="bg-ems-primary hover:bg-ems-primary-container"
                                >
                                    {processing && <Spinner />}
                                    Save Grades
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

GradeEntry.emsTitle = 'Grade Entry';
