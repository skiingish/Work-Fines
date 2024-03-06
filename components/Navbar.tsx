'use client';
import { ModeToggle } from '@/components/ui/ModeToggle';
import Link from 'next/link';
import { useUserStore } from '@/utils/stores/userStore';

export default function Navbar() {
  const user = useUserStore((state) => state.user);

  if (user && user.account_privilege_level > 1) {
    return (
      <nav className='w-full flex justify-center border-b border-b-foreground/10 h-16'>
        <div className='w-full max-w-4xl flex justify-between items-center p-3 text-sm'>
          <ModeToggle />
          {/* <AuthButton /> */}
          <Link href='/fines'>Submit Fine</Link>
          <Link href='/recent'>Recent Fines</Link>
          <Link href='/leaderboard'>Leaderboard</Link>
          <Link href='/staff'>Staff</Link>
          <Link href='/fine-types'>Fine Types</Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className='w-full flex justify-center border-b border-b-foreground/10 h-16'>
      <div className='w-full max-w-4xl flex justify-between items-center p-3 text-sm'>
        <ModeToggle />
        {/* <AuthButton /> */}
        <Link href='/fines'>Submit Fine</Link>
        <Link href='/recent'>Recent Fines</Link>
        <Link href='/leaderboard'>Leaderboard</Link>
      </div>
    </nav>
  );
}
