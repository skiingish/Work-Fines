'use client';

import { FC, use, useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { AddStaffForm } from './AddStaffForm';
import { set } from 'zod';
import { EditStaffForm } from './EditStaffForm';

interface AddEditStaffSheetProps {
  staffmember?: Staff | null | undefined;
  user: BasicUser | null;
  updateStaffList: (staff: Staff) => void;
  sheetOpen?: boolean;
  setSheetOpen?: (open: boolean) => void;
  isEdit?: boolean;
}

export const AddEditStaffSheet: FC<AddEditStaffSheetProps> = ({
  staffmember,
  user,
  updateStaffList,
  sheetOpen,
  setSheetOpen,
  isEdit,
}) => {
  // set staff member to the staff member passed in or null
  const [staffMember, setStaffMember] = useState<Staff | null | undefined>(
    staffmember
  );

  useEffect(() => {
    setStaffMember(staffmember);
  }, [staffmember]);

  if (!user) return null;

  if (isEdit && !staffMember) {
    return null;
  }

  if (staffMember) {
    return (
      <Sheet
        open={sheetOpen}
        onOpenChange={(open) => setSheetOpen && setSheetOpen(open)}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit Staff Member</SheetTitle>
            <SheetDescription>
              <EditStaffForm
                user={user}
                staffMember={staffMember}
                updateStaffList={updateStaffList}
                setSheetOpen={setSheetOpen}
              />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }

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
