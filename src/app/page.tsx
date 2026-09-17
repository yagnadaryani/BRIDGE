'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentSessionUser } from '@/lib/firebase/auth';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentSessionUser();
    if (!user) {
      router.push('/login');
    } else if (user.role === 'TEACHER') {
      router.push('/teacher');
    } else {
      router.push('/student');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
      Loading BRIDGE...
    </div>
  );
}
