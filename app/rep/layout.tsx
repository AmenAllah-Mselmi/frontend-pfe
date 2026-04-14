'use client'
import { Inter } from 'next/font/google';
import '../globals.css';
import RepresentativeSidebar from './components/app-sidebar';
import {useAuthStore} from '@/lib/authStore';
import SimpleChatbot from '@/components/chatbot/SimpleChatbot';
import ClientTeamChat from '@/components/chat/ClientTeamChat';
const inter = Inter({ subsets: ['latin'] });


export default function RepresentativeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((state) => state.user);
  return (
    <RepresentativeSidebar 
      userName={user?.name}
      companyName={user?.company}
    >
      {children}
      <ClientTeamChat />
      <SimpleChatbot />
    </RepresentativeSidebar>
  );
}