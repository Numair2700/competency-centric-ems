import { Head } from '@inertiajs/react';
import { Brain, GraduationCap, Radar, Users } from 'lucide-react';
import { EmsCard, EmsTable, GradePill, StatCard } from '@/components/ems/ui';

type Props = {
    stats: {
        students: number;
        academicUnits: number;
        sfiaSkills: number;
        profilesGenerated: number;
    };
    recentProfiles: { id: number; student_name: string; student_number: string; generated_at: string }[];
    recentGrades: { id: number; student_name: string; unit_title: string; grade: string }[];
};

export default function AdminDashboard({ stats, recentProfiles, recentGrades }: Props) {
    return (
        <>
            <Head title="Admin Dashboard" />

            <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard delay={1} icon={Users} label="Total Students" value={stats.students} />
                <StatCard delay={2} icon={GraduationCap} label="Academic Units" value={stats.academicUnits} />
                <StatCard delay={3} icon={Brain} label="SFIA Skills" value={stats.sfiaSkills} />
                <StatCard delay={4} icon={Radar} label="Profiles Generated" value={stats.profilesGenerated} />
            </section>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <EmsCard delay={5} className="overflow-hidden">
                    <div className="border-b border-ems-border/60 bg-white/30 px-6 py-5">
                        <h4 className="text-lg font-semibold">Recent Grade Entries</h4>
                    </div>
                    {recentGrades.length === 0 ? (
                        <p className="px-6 py-8 text-sm text-ems-secondary">No grades entered yet.</p>
                    ) : (
                        <EmsTable headers={['Student', 'Unit', 'Grade']} align={['left', 'left', 'center']}>
                            {recentGrades.map((record) => (
                                <tr key={record.id} className="group transition-colors hover:bg-white/50">
                                    <td className="flex items-center gap-3 px-6 py-4 text-sm font-semibold text-ems-on-surface/80">
                                        <span className="size-2 rounded-full bg-ems-primary/40 transition-colors group-hover:bg-ems-primary" />
                                        {record.student_name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-ems-secondary/80">{record.unit_title}</td>
                                    <td className="px-6 py-4 text-center">
                                        <GradePill grade={record.grade} />
                                    </td>
                                </tr>
                            ))}
                        </EmsTable>
                    )}
                </EmsCard>

                <EmsCard delay={5} className="overflow-hidden">
                    <div className="border-b border-ems-border/60 bg-white/30 px-6 py-5">
                        <h4 className="text-lg font-semibold">Recently Generated Profiles</h4>
                    </div>
                    {recentProfiles.length === 0 ? (
                        <p className="px-6 py-8 text-sm text-ems-secondary">No profiles generated yet.</p>
                    ) : (
                        <EmsTable headers={['Student', 'Number', 'Generated']} align={['left', 'left', 'right']}>
                            {recentProfiles.map((profile) => (
                                <tr key={profile.id} className="transition-colors hover:bg-white/50">
                                    <td className="px-6 py-4 text-sm font-semibold text-ems-on-surface/80">
                                        {profile.student_name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-ems-secondary/80">{profile.student_number}</td>
                                    <td className="px-6 py-4 text-right text-sm text-ems-secondary/60">
                                        {profile.generated_at}
                                    </td>
                                </tr>
                            ))}
                        </EmsTable>
                    )}
                </EmsCard>
            </div>
        </>
    );
}

AdminDashboard.emsTitle = 'Overview';
