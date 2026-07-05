import { Head } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import students from '@/routes/admin/students';
import type { StudentRow } from '@/types/ems';

type Props = {
    students: StudentRow[];
};

export default function Students({ students: studentList }: Props) {
    return (
        <>
            <Head title="Students" />
            <div className="flex flex-col gap-6 p-4">
                <div>
                    <h1 className="text-xl font-semibold">Student Management</h1>
                    <p className="text-sm text-muted-foreground">
                        Student accounts are created by administrators (FR2).
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            All Students ({studentList.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-xs font-semibold text-muted-foreground uppercase">
                                    <th className="pb-2">Student Number</th>
                                    <th className="pb-2">Name</th>
                                    <th className="pb-2">Email</th>
                                    <th className="pb-2">Programme</th>
                                    <th className="pb-2">Level</th>
                                    <th className="pb-2 text-right">Units Graded</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentList.map((student) => (
                                    <tr key={student.id} className="border-b last:border-0">
                                        <td className="py-2 font-medium">
                                            {student.student_number}
                                        </td>
                                        <td className="py-2">{student.user?.name}</td>
                                        <td className="py-2 text-muted-foreground">
                                            {student.user?.email}
                                        </td>
                                        <td className="py-2">{student.programme}</td>
                                        <td className="py-2">
                                            <Badge variant="secondary">{student.level}</Badge>
                                        </td>
                                        <td className="py-2 text-right">
                                            {student.grade_records_count}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Students.layout = {
    breadcrumbs: [{ title: 'Students', href: students.index() }],
};
