import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import StudentController from '@/actions/App/Http/Controllers/Admin/StudentController';
import { AddButton, Field, FormDialog, RowActions } from '@/components/ems/crud';
import { EmsCard, EmsPill, EmsTable } from '@/components/ems/ui';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Course, StudentRow } from '@/types/ems';

type Props = { students: StudentRow[]; courses: Course[] };

type StudentForm = {
    name: string;
    email: string;
    password: string;
    student_number: string;
    course_id: string;
};

const blank: StudentForm = { name: '', email: '', password: '', student_number: '', course_id: '' };

export default function Students({ students: studentList, courses }: Props) {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<StudentRow | null>(null);
    const form = useForm<StudentForm>(blank);

    const openAdd = () => {
        setEditing(null);
        form.setData(blank);
        form.clearErrors();
        setOpen(true);
    };

    const openEdit = (student: StudentRow) => {
        setEditing(student);
        form.setData({
            name: student.user?.name ?? '',
            email: student.user?.email ?? '',
            password: '',
            student_number: student.student_number,
            course_id: String(student.course_id),
        });
        form.clearErrors();
        setOpen(true);
    };

    const submit = () => {
        const opts = { preserveScroll: true, onSuccess: () => setOpen(false) };
        if (editing) {
            form.put(StudentController.update(editing.id).url, opts);
        } else {
            form.post(StudentController.store().url, opts);
        }
    };

    return (
        <>
            <Head title="Students" />
            <EmsCard delay={1} className="overflow-hidden">
                <div className="flex items-center justify-between border-b border-ems-border/60 bg-white/30 px-6 py-5 dark:bg-white/5">
                    <div>
                        <h4 className="text-lg font-semibold">All Students ({studentList.length})</h4>
                        <p className="mt-0.5 text-[13px] text-ems-secondary">
                            Accounts are created by administrators — students do not self-register (FR2)
                        </p>
                    </div>
                    <AddButton label="Add Student" onClick={openAdd} />
                </div>
                <EmsTable
                    headers={['Student Number', 'Name', 'Email', 'Course', 'Level', 'Units Graded', '']}
                    align={['left', 'left', 'left', 'left', 'center', 'right', 'right']}
                >
                    {studentList.map((student) => (
                        <tr key={student.id} className="transition-colors hover:bg-white/50">
                            <td className="px-6 py-4 text-sm font-semibold">{student.student_number}</td>
                            <td className="px-6 py-4 text-sm">{student.user?.name}</td>
                            <td className="px-6 py-4 text-sm text-ems-secondary/80">{student.user?.email}</td>
                            <td className="px-6 py-4 text-sm text-ems-secondary/80">{student.course?.name}</td>
                            <td className="px-6 py-4 text-center">
                                <EmsPill>{student.course?.level}</EmsPill>
                            </td>
                            <td className="px-6 py-4 text-right text-sm">{student.grade_records_count}</td>
                            <td className="px-6 py-4">
                                <RowActions
                                    entityLabel={`student ${student.student_number}`}
                                    onEdit={() => openEdit(student)}
                                    deleteUrl={StudentController.destroy(student.id).url}
                                />
                            </td>
                        </tr>
                    ))}
                </EmsTable>
            </EmsCard>

            <FormDialog
                open={open}
                onOpenChange={setOpen}
                title={editing ? 'Edit Student' : 'Add Student'}
                description={editing ? 'Leave the password blank to keep it unchanged.' : undefined}
                processing={form.processing}
                onSubmit={submit}
            >
                <Field label="Full Name" htmlFor="name" error={form.errors.name}>
                    <Input id="name" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                </Field>
                <Field label="Email Address" htmlFor="email" error={form.errors.email}>
                    <Input id="email" type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Student Number" htmlFor="student_number" error={form.errors.student_number}>
                        <Input
                            id="student_number"
                            value={form.data.student_number}
                            onChange={(e) => form.setData('student_number', e.target.value)}
                            placeholder="S2529001"
                        />
                    </Field>
                    <Field label="Password" htmlFor="password" error={form.errors.password}>
                        <Input
                            id="password"
                            type="password"
                            value={form.data.password}
                            onChange={(e) => form.setData('password', e.target.value)}
                            placeholder={editing ? '••••••••' : ''}
                        />
                    </Field>
                </div>
                <Field label="Course" error={form.errors.course_id}>
                    <Select value={form.data.course_id} onValueChange={(v) => form.setData('course_id', v)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a course..." />
                        </SelectTrigger>
                        <SelectContent>
                            {courses.map((course) => (
                                <SelectItem key={course.id} value={String(course.id)}>
                                    {course.name} ({course.level})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
            </FormDialog>
        </>
    );
}

Students.emsTitle = 'Students';
