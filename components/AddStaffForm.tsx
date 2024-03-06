'use client';
import { FC } from 'react';
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
import { Button } from '@/components/ui/button';
import { set, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { createStaff } from '@/app/actions/createEditStaff';
import { toast } from 'sonner';

interface AddStaffFormProps {
  user: BasicUser;
  updateStaffList: (staff: Staff) => void;
}

export const AddStaffForm: FC<AddStaffFormProps> = ({
  user,
  updateStaffList,
}) => {
  const formSchema = z.object({
    name: z.string({ required_error: 'Please enter a name' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      toast.info('Adding staff member');
      const { status, data: newStaffMember } = await createStaff(user, data);

      if (status === 'success' && newStaffMember?.length === 1) {
        form.reset();
        toast.success('Staff member added');
        console.log(newStaffMember);

        updateStaffList(newStaffMember[0]);
      } else {
        toast.error('Error adding staff member');
      }
    } catch (error) {}
  }

  return (
    <div className='flex flex-col gap-16 items-center'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mt-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Staff Name</FormLabel>
                <FormControl>
                  <Input placeholder='' {...field} />
                </FormControl>
                <FormDescription>First and Last Name</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit'>Add</Button>
        </form>
      </Form>
    </div>
  );
};
