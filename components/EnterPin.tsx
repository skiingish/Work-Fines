'use client';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { loginPin } from '../app/actions/loginPin';
import { useUserStore } from '../utils/stores/userStore';
import { toast } from 'sonner';

// const formSchema = z.object({
//     pin: z.number().int().min(0).max(9999).refine(value => value.toString().length === 4, {
//         message: 'Please enter a 4-digit pin',
//     }),
// });

const formSchema = z.object({
  pin: z.string().min(4).max(4, {
    message: 'pin must be 4 characters.',
  }),
});

export default function EnterPin() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: '',
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    let res = await loginPin(data);

    if (res.status === 'error') {
      console.log(res.message);
      toast.error(res.message);
      return;
    }

    if (res.status === 'success') {
      console.log(res.data);
      setUser(res.data);
      router.push('/fines');
      return;
    }
  }

  return (
    <div className='flex flex-col gap-16 items-center'>
      <p className='text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center'>
        Enter your 4-digit pin
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mt-4'>
          <FormField
            control={form.control}
            name='pin'
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Username</FormLabel> */}
                <FormControl>
                  <Input placeholder='Pin' {...field} />
                </FormControl>
                {/* <FormDescription>
                This is your organisation pin
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>Login</Button>
        </form>
      </Form>
    </div>
  );
}
