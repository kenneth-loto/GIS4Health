import ChatBot from '@/components/CustomComponents/ChatBot';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { MessageSquare, X } from 'lucide-react';
import { type ReactNode, useState } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    const [chatOpen, setChatOpen] = useState(false);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            <Toaster richColors position="top-right" />
            {children}

            {/* Floating Chat Toggle Button */}
            <Button
                className="fixed top-5 right-5 z-50 flex h-10 w-10 items-center justify-center rounded-full"
                onClick={() => setChatOpen(!chatOpen)}
            >
                {chatOpen ? <X /> : <MessageSquare />}
            </Button>

            {/* Chat Modal/Widget */}
            {chatOpen && <ChatBot />}
        </AppLayoutTemplate>
    );
}
