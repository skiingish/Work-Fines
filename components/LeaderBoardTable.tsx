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
import { createClient } from '@/utils/supabase/client';
import { Input } from './ui/input';
import { useUserStore } from '../utils/stores/userStore';

export default function LeaderBoardTable() {
  const supabase = createClient();
  const user = useUserStore((state) => state.user);

  const [staffData, setStaffData] = useState<Staff[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<Staff[]>(staffData);

  useEffect(() => {
    const fetchFines = async () => {
      // fetch fines from supabase and join the matching staff members from the staff table
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

      staff = staff.filter((staffMember: Staff) => {
        return staffMember.deleted === false;
      });

      // for each staff member, calculate the total fines outstanding
      staff.forEach((staffMember: Staff) => {
        staffMember.fines_outstanding =
          staffMember.fines_owed - staffMember.fines_paid;
      });

      // then order the staff members by the fines outstanding in descending order
      staff.sort((a: Staff, b: Staff) => {
        if (
          a.fines_outstanding !== undefined &&
          b.fines_outstanding !== undefined
        ) {
          return b.fines_outstanding - a.fines_outstanding;
        }
        return 0;
      });

      console.log(staff);

      // staff.sort((a: Staff, b: Staff) => {
      //     if (a.fines_outstanding && b.fines_outstanding) {
      //         return b.fines_outstanding - a.fines_outstanding;
      //     }
      //     return 0;
      // });

      setStaffData(staff);
      setFilteredStaff(staff);
    };
    fetchFines();
  }, []);

  return (
    <div>
      <h2 className='w-full mb-4'>Leaderboard</h2>
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
              <TableRow key={staff.id}>
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
