'use client'

import { useState, useEffect } from "react"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { createClient } from "@/utils/supabase/client";


export default function LeaderBoardTable() {
    const supabase = createClient();

    const [staffData, setStaffData] = useState<Staff[]>([])

    useEffect(() => {
        const fetchFines = async () => {
            // fetch fines from supabase and join the matching staff members from the staff table
            const {data: staff, error} = await supabase.from('staff').select(`
            *
          `).order('created_at', {ascending: false});
            console.log(staff);
            if (error) {
                console.log('error', error)
                return
            }

            if (!staff) {
                console.log('no fines')
                return
            }

            // for each staff member, calculate the total fines outstanding
            staff.forEach((staffMember: Staff) => {
                staffMember.fines_outstanding = staffMember.fines_owed - staffMember.fines_paid
            })

            // then order the staff members by the fines outstanding
            staff.sort((a: Staff, b: Staff) => {
                if (a.fines_outstanding && b.fines_outstanding) {
                    return b.fines_outstanding - a.fines_outstanding;
                }
                return 0;
            });

            setStaffData(staff);
        }
        fetchFines()
    }, [])
    
    return (
        <div>
            <Table>
  {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Who</TableHead>
      <TableHead className="w-[100px]">Total Fines Owing</TableHead>
      <TableHead>Total Fines - All Time</TableHead>
    </TableRow>
  </TableHeader>

<TableBody>
    {staffData.map((staff: Staff) => {
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
    )
}