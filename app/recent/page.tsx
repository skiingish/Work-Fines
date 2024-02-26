'use client'
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useUserStore } from '@/utils/stores/userStore';
import RecentFinesTable from '@/components/RecentFinesTable';
import Navbar from '@/components/Navbar';


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
      <div className='animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3'>
        <main className='flex-1 flex flex-col'>
          <div className='text-center'>
            <RecentFinesTable />
          </div>
        </main>
      </div>

      <footer className='w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs'>
        <p>By Sean Builds Things.</p>
      </footer>
    </div>
  );
}