import {ModeToggle}from '@/components/ui/ModeToggle';
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className='w-full flex justify-center border-b border-b-foreground/10 h-16'>
        <div className='w-full max-w-4xl flex justify-between items-center p-3 text-sm'>
        <ModeToggle />
        {/* <AuthButton /> */}
        <Link href='/fines'>Submit Fine</Link>
        <Link href='/recent'>Recent Fines</Link>
        </div>
    </nav>
    )
}