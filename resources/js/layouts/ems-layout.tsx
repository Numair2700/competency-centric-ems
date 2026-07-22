import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Brain,
    ClipboardEdit,
    GraduationCap,
    LayoutGrid,
    Library,
    LogOut,
    Network,
    Radar,
    Settings,
    Users,
} from 'lucide-react';
import type { LucideIcon, ReactNode } from 'react';
import { dashboard } from '@/routes';
import academicUnits from '@/routes/admin/academic-units';
import courses from '@/routes/admin/courses';
import gradeEntry from '@/routes/admin/grade-entry';
import mappings from '@/routes/admin/mappings';
import profiles from '@/routes/admin/profiles';
import sfiaSkills from '@/routes/admin/sfia-skills';
import students from '@/routes/admin/students';
import { logout } from '@/routes';
import { edit as settingsEdit } from '@/routes/profile';
import { profile as studentProfile } from '@/routes/student';
import type { Auth } from '@/types';

type EmsNavItem = { title: string; href: { url: string } | string; icon: LucideIcon };

const adminNav: EmsNavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
    { title: 'Programmes & Courses', href: courses.index(), icon: Library },
    { title: 'Students', href: students.index(), icon: Users },
    { title: 'Academic Units', href: academicUnits.index(), icon: GraduationCap },
    { title: 'SFIA Skills', href: sfiaSkills.index(), icon: Brain },
    { title: 'Mappings', href: mappings.index(), icon: Network },
    { title: 'Grade Entry', href: gradeEntry.index(), icon: ClipboardEdit },
    { title: 'Generate Profile', href: profiles.index(), icon: BarChart3 },
];

const studentNav: EmsNavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
    { title: 'My Profile', href: studentProfile(), icon: Radar },
];

function hrefUrl(href: EmsNavItem['href']): string {
    return typeof href === 'string' ? href : href.url;
}

/**
 * Authenticated shell per the Stitch "Academic Precision" design: fixed
 * 240px translucent sidebar with 3px active accent bar, 80px sticky header
 * with page title and user block, 1280px content canvas on #f7f9fb.
 */
export default function EmsLayout({ children }: { children: ReactNode }) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const currentUrl = usePage().url;
    const page = children as { type?: { emsTitle?: string } } | null;
    const title = page?.type?.emsTitle ?? 'Dashboard';
    const isAdmin = auth.user.role === 'admin';
    const nav = isAdmin ? adminNav : studentNav;

    const active = (href: EmsNavItem['href']) => {
        const url = hrefUrl(href);
        return url === '/dashboard'
            ? currentUrl === '/dashboard'
            : currentUrl.startsWith(url);
    };

    return (
        <div className="min-h-screen bg-ems-bg font-inter text-ems-on-surface">
            <aside className="fixed top-0 left-0 z-50 flex h-screen w-60 flex-col border-r border-ems-border/60 bg-ems-bg/80 py-6 backdrop-blur-md">
                <div className="mb-10 px-8">
                    <h1 className="text-2xl font-bold tracking-tighter text-ems-primary">
                        EMS Portal
                    </h1>
                    <p className="mt-1 text-[10px] font-bold tracking-[0.2em] text-ems-secondary/60 uppercase">
                        {isAdmin ? 'Academic Administration' : 'Student Portal'}
                    </p>
                </div>
                <nav className="flex-1 space-y-1 px-4">
                    {nav.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            prefetch
                            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-[13px] font-medium transition-colors duration-150 ${
                                active(item.href)
                                    ? 'ems-sidebar-active'
                                    : 'text-ems-secondary hover:bg-ems-surface-mid/50'
                            }`}
                        >
                            <item.icon className="size-5" strokeWidth={1.75} />
                            {item.title}
                        </Link>
                    ))}
                </nav>
                <div className="mt-auto space-y-1 px-4">
                    <Link
                        href={settingsEdit()}
                        className="flex items-center gap-3 rounded-lg px-4 py-3 text-[13px] font-medium text-ems-secondary transition-colors duration-150 hover:bg-ems-surface-mid/50"
                    >
                        <Settings className="size-5" strokeWidth={1.75} />
                        Settings
                    </Link>
                    <Link
                        href={logout()}
                        as="button"
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-[13px] font-medium text-ems-secondary transition-colors duration-150 hover:bg-ems-surface-mid/50"
                    >
                        <LogOut className="size-5" strokeWidth={1.75} />
                        Logout
                    </Link>
                </div>
            </aside>

            <header className="sticky top-0 z-40 ml-60 flex h-20 items-center justify-between border-b border-ems-border/60 bg-ems-surface/70 px-10 backdrop-blur-xl">
                <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
                <div className="flex items-center gap-4 border-l border-ems-border pl-6">
                    <div className="text-right">
                        <p className="text-xs font-semibold">{auth.user.name}</p>
                        <p className="text-[10px] font-bold tracking-wider text-ems-secondary uppercase">
                            {isAdmin ? 'System Administrator' : 'Student'}
                        </p>
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-full bg-ems-primary/10 text-sm font-bold text-ems-primary ring-2 ring-ems-primary/10">
                        {auth.user.name
                            .split(' ')
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join('')}
                    </div>
                </div>
            </header>

            <main className="mx-auto ml-60 max-w-7xl p-10">{children}</main>
        </div>
    );
}
