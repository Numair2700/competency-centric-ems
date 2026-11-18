import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Brain,
    ClipboardEdit,
    GraduationCap,
    LayoutGrid,
    Library,
    LogOut,
    Menu,
    Network,
    Radar,
    Settings,
    Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { dashboard } from '@/routes';
import { logout } from '@/routes';
import academicUnits from '@/routes/admin/academic-units';
import courses from '@/routes/admin/courses';
import gradeEntry from '@/routes/admin/grade-entry';
import mappings from '@/routes/admin/mappings';
import profiles from '@/routes/admin/profiles';
import sfiaSkills from '@/routes/admin/sfia-skills';
import students from '@/routes/admin/students';
import { edit as settingsEdit } from '@/routes/profile';
import { profile as studentProfile } from '@/routes/student';
import type { Auth } from '@/types';

type EmsNavItem = {
    title: string;
    href: { url: string } | string;
    icon: LucideIcon;
};

const adminNav: EmsNavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
    { title: 'Programmes & Courses', href: courses.index(), icon: Library },
    { title: 'Students', href: students.index(), icon: Users },
    {
        title: 'Academic Units',
        href: academicUnits.index(),
        icon: GraduationCap,
    },
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
 * Authenticated shell per the "Academic Precision" design: 240px translucent
 * sidebar with 3px active accent bar, sticky header with page title and user
 * block, 1280px content canvas. Below the lg breakpoint the sidebar becomes
 * a slide-in sheet opened from a menu button in the header.
 */
export default function EmsLayout({ children }: { children: ReactNode }) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const currentUrl = usePage().url;
    const page = children as { type?: { emsTitle?: string } } | null;
    const title = page?.type?.emsTitle ?? 'Dashboard';
    const isAdmin = auth.user.role === 'admin';
    const nav = isAdmin ? adminNav : studentNav;
    const [menuOpen, setMenuOpen] = useState(false);

    const active = (href: EmsNavItem['href']) => {
        const url = hrefUrl(href);

        return url === '/dashboard'
            ? currentUrl === '/dashboard'
            : currentUrl.startsWith(url);
    };

    const initials = auth.user.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('');

    const sidebar = (
        <div className="flex h-full flex-col py-6">
            <div className="mb-8 px-8">
                <p className="text-2xl font-bold tracking-tighter text-ems-primary">
                    EMS Portal
                </p>
                <p className="mt-1 text-[10px] font-bold tracking-[0.2em] text-ems-secondary/60 uppercase">
                    {isAdmin ? 'Academic Administration' : 'Student Portal'}
                </p>
            </div>
            <nav
                aria-label="Main"
                className="flex-1 space-y-1 overflow-y-auto px-4"
            >
                {nav.map((item) => {
                    const isActive = active(item.href);

                    return (
                        <Link
                            key={item.title}
                            href={hrefUrl(item.href)}
                            prefetch
                            onClick={() => setMenuOpen(false)}
                            aria-current={isActive ? 'page' : undefined}
                            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-[13px] font-medium transition-colors duration-150 ${
                                isActive
                                    ? 'ems-sidebar-active'
                                    : 'text-ems-secondary hover:bg-ems-surface-mid/50'
                            }`}
                        >
                            <item.icon
                                className="size-5 shrink-0"
                                strokeWidth={1.75}
                            />
                            {item.title}
                        </Link>
                    );
                })}
            </nav>
            <div className="mt-auto space-y-1 px-4 pt-4">
                <Link
                    href={settingsEdit()}
                    onClick={() => setMenuOpen(false)}
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
        </div>
    );

    return (
        <div className="min-h-screen bg-ems-bg font-inter text-ems-on-surface">
            <aside className="fixed top-0 left-0 z-50 hidden h-screen w-60 border-r border-ems-border/60 bg-ems-bg/80 backdrop-blur-md lg:block">
                {sidebar}
            </aside>

            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetContent
                    side="left"
                    className="w-72 bg-ems-bg p-0 lg:hidden"
                >
                    <SheetTitle className="sr-only">Navigation</SheetTitle>
                    {sidebar}
                </SheetContent>
            </Sheet>

            <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-ems-border/60 bg-ems-surface/70 px-4 backdrop-blur-xl sm:px-6 lg:ml-60 lg:h-20 lg:px-10">
                <div className="flex min-w-0 items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setMenuOpen(true)}
                        aria-label="Open navigation"
                        className="-ml-2 rounded-lg p-2 text-ems-secondary hover:bg-ems-surface-mid/60 lg:hidden"
                    >
                        <Menu className="size-5" />
                    </button>
                    <h1 className="truncate text-lg font-semibold tracking-tight sm:text-2xl">
                        {title}
                    </h1>
                </div>
                <div className="flex shrink-0 items-center gap-3 sm:gap-4 sm:border-l sm:border-ems-border sm:pl-6">
                    <div className="hidden text-right sm:block">
                        <p className="text-xs font-semibold">
                            {auth.user.name}
                        </p>
                        <p className="text-[10px] font-bold tracking-wider text-ems-secondary uppercase">
                            {isAdmin ? 'System Administrator' : 'Student'}
                        </p>
                    </div>
                    <div
                        className="flex size-9 items-center justify-center rounded-full bg-ems-primary/10 text-sm font-bold text-ems-primary ring-2 ring-ems-primary/10 sm:size-10"
                        title={auth.user.name}
                    >
                        {initials}
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:ml-60 lg:p-10">
                {children}
            </main>
        </div>
    );
}
