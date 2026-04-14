'use client';
import { useState, useEffect } from 'react';
import TeamChat from './TeamChat';
import { useUserStore } from '@/lib/userStore';
import { useAuthStore } from '@/lib/authStore';

export default function ClientTeamChat() {
  const { users, loadUsers } = useUserStore();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState(users);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    setTeamMembers(users);
  }, [users]);

  useEffect(() => {
    // Only use the user from authStore if fully authenticated
    if (isAuthenticated && user && user.id) {
      setCurrentUser({
        id: user.id,
        name: user.name,
        role: user.role,
        avatar: (user as any).avatar || user.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        online: true
      });
      setIsLoading(false);
    } else {
      setCurrentUser(null);
      // Wait for authentication resolution if neither authenticated nor empty out
      if (isAuthenticated === false && user === null) {
        setIsLoading(false); 
      }
    }
  }, [user, isAuthenticated]);

  // If there's no user, don't try to render the chat (prevents sending 400 Bad Request to API)
  if (isLoading || !currentUser) {
    return (
      <div className="fixed right-6 bottom-28 z-50">
        <div className="bg-white rounded-full p-4 shadow-lg">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return <TeamChat currentUser={currentUser} teamMembers={teamMembers} position="top" />;
}