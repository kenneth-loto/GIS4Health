import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { AudioWaveform, Biohazard, Cog, Droplets, Earth, FileStack, LayoutGrid, OctagonAlert, Stethoscope, UserPlus } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },

    {
        title: 'HeatMap',
        href: '/heatmap',
        icon: Droplets,
    },

    {
        title: 'Choropleth',
        href: '/choropleth',
        icon: Earth,
    },

    {
        title: 'Health Case',
        href: '/health_cases',
        icon: Stethoscope,
    },

    {
        title: 'Patient Info',
        href: '/patient_infos',
        icon: UserPlus,
    },

    {
        title: 'Diseases',
        href: '/diseases',
        icon: Biohazard,
    },

    {
        title: 'Utilities',
        href: '/',
        icon: Cog,
        isActive: true,
        items: [
            {
                title: 'Categories',
                href: '/categories',
                icon: FileStack,
            },

            {
                title: 'Severity',
                href: '/severities',
                icon: OctagonAlert,
            },

            {
                title: 'Suffix',
                href: '/suffixes',
                icon: AudioWaveform,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
