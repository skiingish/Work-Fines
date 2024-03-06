'use client';

import { FC, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { AddStaffForm } from './AddStaffForm';

interface AddEditStaffSheetProps {
  staffmember?: Staff;
  user: BasicUser | null;
  updateStaffList: (staff: Staff) => void;
}

export const AddEditStaffSheet: FC<AddEditStaffSheetProps> = ({
  staffmember,
  user,
  updateStaffList,
}) => {
  // set staff member to the staff member passed in or null
  const [staffMember, setStaffMember] = useState<Staff | null>(
    staffmember || null
  );

  if (!user) return null;

  return (
    <Sheet>
      <SheetTrigger className='border border-r p-2 rounded-md'>
        Add New Staff Member +
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Staff Member</SheetTitle>
          <SheetDescription>
            <AddStaffForm user={user} updateStaffList={updateStaffList} />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
