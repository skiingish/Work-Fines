'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { createClient } from '@/utils/supabase/client';
import { Input } from './ui/input';
import { useUserStore } from '../utils/stores/userStore';
import { AddEditStaffSheet } from './AddEditStaffSheet';

export default function StaffListEditor() {
  const supabase = createClient();
  const user = useUserStore((state) => state.user);

  const [staffData, setStaffData] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>(staffData);

  // TODO this doesn't seam to refresh the list when a new staff member is added
  const updateStaffList = (staff: Staff) => {
    setStaffData([...staffData, staff]);
    setFilteredStaff([...staffData, staff]);
  };

  useEffect(() => {
    const fetchFines = async () => {
      // Fetch staff from supabase that haven't ever been deleted
      let { data: staff, error } = await supabase
        .from('staff')
        .select(
          `
            *
          `
        )
        .eq('organisation', user?.organisation)
        .order('created_at', { ascending: false });

      console.log(staff);
      if (error) {
        console.log('error', error);
        return;
      }

      if (!staff) {
        console.log('no fines');
        return;
      }

      // remove any staff members that have been deleted
      staff = staff.filter((staffMember: Staff) => {
        return staffMember.deleted === false;
      });

      // for each staff member, calculate the total fines outstanding
      staff.forEach((staffMember: Staff) => {
        staffMember.fines_outstanding =
          staffMember.fines_owed - staffMember.fines_paid;
      });

      // then order the staff members by the fines outstanding in descending order

      // Then order the staff members by their last name in ascending order
      staff.sort((a: Staff, b: Staff) => {
        // if we can split the name into two parts, then we can compare the last names
        return a.name.localeCompare(b.name);
      });

      setStaffData(staff);
      setFilteredStaff(staff);
    };
    fetchFines();
  }, []);

  return (
    <div>
      <h2 className='w-full mb-4'>Staff List</h2>
      {/* Search box */}

      <Input
        type='search'
        className='w-full mb-4'
        placeholder='Search for a staff member'
        onChange={(e) => {
          const search = e.target.value;
          const filteredStaffList = staffData.filter((staff: Staff) => {
            return staff.name.toLowerCase().includes(search.toLowerCase());
          });
          setFilteredStaff(filteredStaffList);
        }}
      />
      {/* Add New Staff Member */}
      <div className='flex justify-center mb-6'>
        <AddEditStaffSheet user={user} updateStaffList={updateStaffList} />
      </div>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>Who</TableHead>
            <TableHead className='w-[100px]'>Total Fines Owing</TableHead>
            <TableHead>Total Fines - All Time</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredStaff.map((staff: Staff) => {
            return (
              <TableRow
                className='hover:cursor-pointer'
                key={staff.id}
                onClick={() => console.log(staff)}
              >
                <TableCell>{staff.name}</TableCell>
                <TableCell>{staff.fines_owed - staff.fines_paid}</TableCell>
                <TableCell>{staff.fines_owed}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
