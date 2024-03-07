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
    fines_outstanding: z.number({ required_error: 'Please enter a number' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: staffMember.name,
      fines_outstanding: staffMember.fines_outstanding,
    },
  });

  console.log(staffMember);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      toast.info('Saving staff member');

      const newFinesOutstanding = data.fines_outstanding;
      let newFinesOwed = staffMember.fines_owed;
      let newTotalFines = staffMember.fines_owed - staffMember.fines_paid;
      let newFinesPaid = staffMember.fines_paid;

      // if fines have increased, update the fines_owed and total fines
      if (newFinesOutstanding > staffMember.fines_owed) {
        newFinesOwed =
          staffMember.fines_owed +
          (newFinesOutstanding - staffMember.fines_owed);
        newTotalFines = newFinesOwed - staffMember.fines_paid;
      } else if (newFinesOutstanding < staffMember.fines_owed) {
        newFinesOwed =
          staffMember.fines_owed -
          (staffMember.fines_owed - newFinesOutstanding);
        newTotalFines = newFinesOwed - staffMember.fines_paid;
      } else {
        newFinesPaid =
          staffMember.fines_paid + (staffMember.fines_owed - newFinesOwed);
      }

      const updateStaff = {
        ...staffMember,
        name: data.name,
        fines_owed: newFinesOwed,
        fines_paid: staffMember.fines_paid,
      };

      const { status, data: updatedStaffMember } = await editStaff(
        user,
        updateStaff
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

  async function onDelete() {
    try {
      toast.info('Deleting staff member');
      // const { status, data: updatedStaffMember } = await createStaff(user, {
      //   ...staffMember,
      //   deleted: true,
      // });

      // if (status === 'success' && updatedStaffMember?.length === 1) {
      //   form.reset();
      //   toast.success('Staff member deleted');
      //   console.log(updatedStaffMember);

      //   ///updateStaffList(updatedStaffMember[0]);
      //   setSheetOpen && setSheetOpen(false);
      // } else {
      //   toast.error('Error deleting staff member');
      // }
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
            name='fines_outstanding'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fines Outstanding</FormLabel>
                <FormControl>
                  <Input type='number' placeholder='' {...field} />
                </FormControl>
                <FormDescription>
                  How Many Fines Are They Yet To Pay Off?
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
                    onClick={onDelete}
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
