import { Head } from '@inertiajs/react';
import { EmsCard, EmsPill, EmsTable } from '@/components/ems/ui';
import type { StudentRow } from '@/types/ems';

type Props = { students: StudentRow[] };

export default function Students({ students: studentList }: Props) {
    return (
        <>
            <Head title="Students" />
            <EmsCard delay={1} className="overflow-hidden">
                <div className="border-b border-ems-border/60 bg-white/30 px-6 py-5">
                    <h4 className="text-lg font-semibold">All Students ({studentList.length})</h4>
                    <p className="mt-0.5 text-[13px] text-ems-secondary">
                        Accounts are created by administrators — students do not self-register (FR2)
                    </p>
                </div>
                <EmsTable
                    headers={['Student Number', 'Name', 'Email', 'Pathway', 'Level', 'Units Graded']}
                    align={['left', 'left', 'left', 'left', 'center', 'right']}
                >
                    {studentList.map((student) => (
                        <tr key={student.id} className="transition-colors hover:bg-white/50">
                            <td className="px-6 py-4 text-sm font-semibold">{student.student_number}</td>
                            <td className="px-6 py-4 text-sm">{student.user?.name}</td>
                            <td className="px-6 py-4 text-sm text-ems-secondary/80">{student.user?.email}</td>
                            <td className="px-6 py-4 text-sm text-ems-secondary/80">{student.pathway?.name}</td>
                            <td className="px-6 py-4 text-center">
                                <EmsPill>{student.pathway?.level}</EmsPill>
                            </td>
                            <td className="px-6 py-4 text-right text-sm">{student.grade_records_count}</td>
                        </tr>
                    ))}
                </EmsTable>
            </EmsCard>
        </>
    );
}

Students.emsTitle = 'Students';
