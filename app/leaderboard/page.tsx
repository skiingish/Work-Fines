'use client';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/utils/stores/userStore';
import Navbar from '@/components/Navbar';
import LeaderBoardTable from '@/components/LeaderBoardTable';
import Footer from '@/components/Footer';
import { useEffect } from 'react';

export default function Index() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    console.log(user);

    if (!user) {
      router.replace('/enter-pin');
    }
  }, []);

  return (
    <div className='flex-1 w-full flex flex-col gap-20 items-center'>
      <Navbar />
      <div className='animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-[100%] px-3'>
        <div className='text-center'>
          <LeaderBoardTable />
        </div>
      </div>

      <Footer />
    </div>
  );
}
