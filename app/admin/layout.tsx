'use client';
import { Inter } from 'next/font/google';
import '../globals.css';
import AdminSidebar from './components/app-sidebar';
import {useAuthStore} from '@/lib/authStore';
import ClientTeamChat from '@/components/chat/ClientTeamChat';
import SimpleChatbot from '@/components/chatbot/SimpleChatbot';
const inter = Inter({ subsets: ['latin'] });


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((state) => state.user);
  return (
    <AdminSidebar 
      userRole={user?.role}
      userName={user?.name}
      companyName={user?.company}
    >
      {children}
      <ClientTeamChat />
      <SimpleChatbot />
    </AdminSidebar>
  );
}