'use client';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import { useUserStore } from '@/utils/stores/userStore';
import RecentFinesTable from '@/components/RecentFinesTable';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Index() {
  const user = useUserStore((state) => state.user);
  console.log(user);

  if (!user) {
    const router = useRouter();
    router.push('/enter-pin');
  }

  return (
    <div className='flex-1 w-full flex flex-col gap-20 items-center'>
      <Navbar />
      <div className='animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-[100%] px-3'>
        <div className='text-center'>
          <RecentFinesTable />
        </div>
      </div>

      <Footer />
    </div>
  );
}
