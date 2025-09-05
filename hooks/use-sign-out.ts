'use client';

import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export const useSignOut = () => {
  const router = useRouter();

  const handleSignOut = async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('Successfully signed out!');
          router.push('/login');
        },
        onError: () => {
          toast.error('Failed to signed out');
        },
      },
    });
  };

  return handleSignOut;
};
