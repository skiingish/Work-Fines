'use client';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/utils/stores/userStore';
import Navbar from '@/components/Navbar';
import LeaderBoardTable from '@/components/LeaderBoardTable';
import Footer from '@/components/Footer';
import { useEffect } from 'react';
import StaffListEditor from '@/components/StaffListEditor';

export default function Index() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    console.log(user);

    // if the user is not logged in or is not an admin, redirect to the pin page
    if (!user || user.account_privilege_level < 2) {
      router.replace('/enter-pin');
    }
  }, []);

  return (
    <div className='flex-1 w-full flex flex-col gap-20 items-center'>
      <Navbar />
      <div className='animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-[100%] px-3'>
        <div className='text-center'>
          <StaffListEditor />
        </div>
      </div>

      <Footer />
    </div>
  );
}
