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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { set, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { editStaff, deleteStaff } from '@/app/actions/createEditStaff';
import { toast } from 'sonner';

interface EditStaffFormProps {
  user: BasicUser;
  updateStaffList: (staff: Staff) => void;
  staffMember: Staff;
  setSheetOpen?: (open: boolean) => void;
}

export const EditStaffForm: FC<EditStaffFormProps> = ({
  user,
  updateStaffList,
  staffMember,
  setSheetOpen,
}) => {
  const formSchema = z.object({
    name: z.string({ required_error: 'Please enter a name' }),
    fines_paid: z.coerce.number().min(0, {
      message: 'Must be a positive number',
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: staffMember.name,
      fines_paid: staffMember.fines_paid,
    },
  });

  console.log(staffMember);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      toast.info('Saving staff member');

      // console.log('outstanding' + data.fines_outstanding);

      // // give me the difference between the new fines_outstanding and the old fines_outstanding
      // const diff =
      //   data.fines_outstanding -
      //   staffMember.fines_owed -
      //   staffMember.fines_paid;
      // console.log('diff ' + diff);

      // let newFinesPaid = staffMember.fines_paid;

      // // if we're reducing then increase fines_paid
      // if (diff < 0) {
      //   newFinesPaid = staffMember.fines_paid + Math.abs(diff);
      // } else if (diff > 0) {
      //   // if we're increasing then decrease fines_paid

      //   // if this staff member is going to run into negative fines_paid then we need increase fines_owed
      //   if (staffMember.fines_paid - diff < 0) {
      //     newFinesPaid = 0;
      //     staffMember.fines_owed = staffMember.fines_owed + Math.abs(diff);
      //   } else {
      //     newFinesPaid = staffMember.fines_paid - diff;
      //   }
      // }

      // console.log('newFinesPaid ' + newFinesPaid);
      // console.log('newFinesOwed ' + staffMember.fines_owed);

      console.log(staffMember.fines_paid);

      // Create an updated staff object
      const updatedStaff = {
        ...staffMember,
        fines_owed: staffMember.fines_owed,
        fines_paid: data.fines_paid,
      };

      console.log(updatedStaff);

      const { status, data: updatedStaffMember } = await editStaff(
        user,
        updatedStaff
      );

      if (status === 'success' && updatedStaffMember?.length === 1) {
        form.reset();
        toast.success('Staff member saved');
        console.log(updatedStaffMember);

        ///updateStaffList(updatedStaffMember[0]);
        setSheetOpen && setSheetOpen(false);
      } else {
        toast.error('Error saving staff member');
      }
    } catch (error) {}
  }

  async function onDelete(staff: Staff) {
    try {
      toast.info('Deleting staff member');
      const { status, data: updatedStaffMember } = await deleteStaff(
        user,
        staff
      );

      if (status === 'success' && updatedStaffMember?.length === 1) {
        form.reset();
        toast.success('Staff member deleted');
        console.log(updatedStaffMember);

        ///updateStaffList(updatedStaffMember[0]);
        setSheetOpen && setSheetOpen(false);
      } else {
        toast.error('Error deleting staff member');
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
          <FormField
            control={form.control}
            name='fines_paid'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fines Paid</FormLabel>
                <FormControl>
                  <Input type='number' placeholder='' {...field} />
                </FormControl>
                <FormDescription>
                  How Many Fines Have They Paid Off?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex flex-1 flex-col'>
            <Button className='mb-8' type='submit'>
              Save
            </Button>
            <Popover>
              <PopoverTrigger>
                <Button
                  className='bg-red-500 text-white hover:bg-red-800 w-full'
                  type='button'
                >
                  Delete Staff Member
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className='text-center flex flex-1 flex-col gap-4'>
                  <p>Are you sure you want to delete this staff member?</p>
                  <p className='font-semibold'>{staffMember.name}</p>
                  <Button
                    className='bg-red-500 text-white hover:bg-red-800'
                    onClick={() => onDelete(staffMember)}
                  >
                    Confirm Delete
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </form>
      </Form>
    </div>
  );
};
