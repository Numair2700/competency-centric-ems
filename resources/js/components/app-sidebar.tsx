import { Link, usePage } from '@inertiajs/react';
import {
    Award,
    BookOpen,
    ClipboardList,
    GraduationCap,
    LayoutGrid,
    Link2,
    Radar,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import academicUnits from '@/routes/admin/academic-units';
import gradeEntry from '@/routes/admin/grade-entry';
import mappings from '@/routes/admin/mappings';
import profiles from '@/routes/admin/profiles';
import sfiaSkills from '@/routes/admin/sfia-skills';
import students from '@/routes/admin/students';
import { profile } from '@/routes/student';
import type { Auth, NavItem } from '@/types';

const adminNavItems: NavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
    { title: 'Students', href: students.index(), icon: Users },
    { title: 'Academic Units', href: academicUnits.index(), icon: BookOpen },
    { title: 'SFIA Skills', href: sfiaSkills.index(), icon: Award },
    { title: 'Mappings', href: mappings.index(), icon: Link2 },
    { title: 'Grade Entry', href: gradeEntry.index(), icon: ClipboardList },
    { title: 'Generate Profile', href: profiles.index(), icon: Radar },
];

const studentNavItems: NavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
    { title: 'My Profile', href: profile(), icon: GraduationCap },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const navItems = auth.user.role === 'admin' ? adminNavItems : studentNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
