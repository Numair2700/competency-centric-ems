import { Head } from '@inertiajs/react';
import { Award, BookOpen, Radar, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';

type Props = {
    stats: {
        students: number;
        academicUnits: number;
        sfiaSkills: number;
        profilesGenerated: number;
    };
    recentProfiles: {
        id: number;
        student_name: string;
        student_number: string;
        generated_at: string;
    }[];
    recentGrades: {
        id: number;
        student_name: string;
        unit_title: string;
        grade: string;
    }[];
};

const statCards = [
    { key: 'students', label: 'Total Students', icon: Users },
    { key: 'academicUnits', label: 'Academic Units', icon: BookOpen },
    { key: 'sfiaSkills', label: 'SFIA Skills', icon: Award },
    { key: 'profilesGenerated', label: 'Profiles Generated', icon: Radar },
] as const;

export default function AdminDashboard({ stats, recentProfiles, recentGrades }: Props) {
    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex flex-col gap-6 p-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statCards.map(({ key, label, icon: Icon }) => (
                        <Card key={key}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                    {label}
                                </CardTitle>
                                <Icon className="size-4 text-[#1e40af]" />
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold">{stats[key]}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Recently Generated Profiles</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentProfiles.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No profiles generated yet.
                                </p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left text-xs font-semibold text-muted-foreground uppercase">
                                            <th className="pb-2">Student</th>
                                            <th className="pb-2">Number</th>
                                            <th className="pb-2">Generated</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentProfiles.map((profile) => (
                                            <tr key={profile.id} className="border-b last:border-0">
                                                <td className="py-2">{profile.student_name}</td>
                                                <td className="py-2">{profile.student_number}</td>
                                                <td className="py-2 text-muted-foreground">
                                                    {profile.generated_at}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Recent Grade Entries</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recentGrades.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No grades entered yet.
                                </p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left text-xs font-semibold text-muted-foreground uppercase">
                                            <th className="pb-2">Student</th>
                                            <th className="pb-2">Unit</th>
                                            <th className="pb-2">Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentGrades.map((record) => (
                                            <tr key={record.id} className="border-b last:border-0">
                                                <td className="py-2">{record.student_name}</td>
                                                <td className="py-2">{record.unit_title}</td>
                                                <td className="py-2 font-medium">{record.grade}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};
