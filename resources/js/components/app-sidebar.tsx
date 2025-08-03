import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    AudioWaveform,
    Biohazard,
    Building2,
    Cog,
    ContactRound,
    Droplets,
    Earth,
    FileStack,
    Home,
    LayoutGrid,
    Map,
    OctagonAlert,
    Stethoscope,
    UserRoundPlus,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },

    {
        title: 'Maps',
        href: '/',
        icon: Map,
        isActive: true,
        items: [
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
        ],
    },

    {
        title: 'Patients',
        href: '/',
        icon: ContactRound,
        isActive: true,
        items: [
            {
                title: 'Health Cases',
                href: '/health_cases',
                icon: Stethoscope,
            },

            {
                title: 'Patient Infos',
                href: '/patient_infos',
                icon: UserRoundPlus,
            },
        ],
    },

    {
        title: 'Utilities',
        href: '/',
        icon: Cog,
        isActive: true,
        items: [
            {
                title: 'Barangays',
                href: '/barangays',
                icon: Home,
            },
            {
                title: 'Categories',
                href: '/categories',
                icon: FileStack,
            },

            {
                title: 'Diseases',
                href: '/diseases',
                icon: Biohazard,
            },

            {
                title: 'Municipalities',
                href: '/municipalities',
                icon: Building2,
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
