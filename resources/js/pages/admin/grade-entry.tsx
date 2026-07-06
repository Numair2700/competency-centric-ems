import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Info } from 'lucide-react';
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
import InputError from '@/components/input-error';
import gradeEntry from '@/routes/admin/grade-entry';
import type { AcademicUnit, GradeValue } from '@/types/ems';
import { GRADE_VALUES, GRADE_WEIGHTS } from '@/types/ems';

type StudentOption = {
    id: number;
    student_number: string;
    programme: string;
    user: { id: number; name: string };
};

type ExistingGrade = {
    id: number;
    unit_id: number;
    grade: GradeValue;
    weight: number;
};

type Props = {
    students: StudentOption[];
    units: AcademicUnit[];
    existingGrades?: ExistingGrade[];
};

export default function GradeEntry({ students, units, existingGrades }: Props) {
    const [studentId, setStudentId] = useState('');
    const [grades, setGrades] = useState<Record<number, GradeValue | ''>>({});

    const form = useForm({});

    const selectStudent = (value: string) => {
        setStudentId(value);
        setGrades({});
        router.reload({
            only: ['existingGrades'],
            data: { student_id: value },
            onSuccess: (page) => {
                const existing = (page.props.existingGrades ?? []) as ExistingGrade[];
                setGrades(
                    Object.fromEntries(
                        existing.map((record) => [record.unit_id, record.grade]),
                    ),
                );
            },
        });
    };

    const setGrade = (unitId: number, grade: GradeValue) => {
        setGrades((current) => ({ ...current, [unitId]: grade }));
    };

    const save = () => {
        const payload = Object.entries(grades)
            .filter(([, grade]) => grade !== '')
            .map(([unitId, grade]) => ({ unit_id: Number(unitId), grade }));

        router.post(
            gradeEntry.store.url(),
            { student_id: Number(studentId), grades: payload },
            { preserveScroll: true, preserveState: true },
        );
    };

    const enteredCount = Object.values(grades).filter((grade) => grade !== '').length;

    return (
        <>
            <Head title="Grade Entry" />
            <div className="flex flex-col gap-6">
                <p className="text-sm text-ems-secondary">
                    Enter student grades per academic unit (FR7). Weights apply
                    automatically on save.
                </p>

                <Card className="max-w-md">
                    <CardContent className="pt-6">
                        <div className="grid gap-2">
                            <Label htmlFor="student">Student</Label>
                            <Select value={studentId} onValueChange={selectStudent}>
                                <SelectTrigger id="student">
                                    <SelectValue placeholder="Select a student..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {students.map((student) => (
                                        <SelectItem
                                            key={student.id}
                                            value={String(student.id)}
                                        >
                                            {student.student_number} — {student.user.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.student_id} />
                        </div>
                    </CardContent>
                </Card>

                {studentId !== '' && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Unit Grades</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <Alert className="border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
                                <Info className="size-4" />
                                <AlertDescription>
                                    Grades are restricted to Pass, Merit, and Distinction
                                    (FR16). Weights are applied automatically: Pass = 0.5,
                                    Merit = 0.75, Distinction = 1.0.
                                </AlertDescription>
                            </Alert>

                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-ems-border text-left text-xs font-semibold text-ems-secondary/60 uppercase">
                                        <th className="pb-2">Unit</th>
                                        <th className="pb-2 text-right">Credits</th>
                                        <th className="pb-2 text-right">Level</th>
                                        <th className="pb-2">Grade</th>
                                        <th className="pb-2 text-right">Weight</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {units.map((unit) => {
                                        const grade = grades[unit.id] ?? '';

                                        return (
                                            <tr key={unit.id} className="border-b border-ems-border/60 last:border-0">
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
                                                <td className="py-2">
                                                    <Select
                                                        value={grade}
                                                        onValueChange={(value) =>
                                                            setGrade(
                                                                unit.id,
                                                                value as GradeValue,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="h-8 w-36">
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {GRADE_VALUES.map((value) => (
                                                                <SelectItem
                                                                    key={value}
                                                                    value={value}
                                                                >
                                                                    {value}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                                <td className="py-2 text-right font-medium">
                                                    {grade === ''
                                                        ? '—'
                                                        : GRADE_WEIGHTS[grade].toFixed(2)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    {enteredCount} of {units.length} units graded
                                </p>
                                <Button
                                    onClick={save}
                                    disabled={enteredCount === 0 || form.processing}
                                    className="bg-ems-primary hover:bg-ems-primary-container"
                                >
                                    {form.processing && <Spinner />}
                                    Save Grades
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

GradeEntry.emsTitle = 'Grade Entry';
