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


export default function RecentFinesTable() {
    const supabase = createClient();

    const [finesData, setFinesData] = useState<Fine[]>([])

    useEffect(() => {
        const fetchFines = async () => {
            // fetch fines from supabase and join the matching staff members
            const {data: fines, error} = await supabase.from('fines').select('*').order('created_at', {ascending: false});
            console.log(fines);
            if (error) {
                console.log('error', error)
                return
            }

            if (!fines) {
                console.log('no fines')
                return
            }

            setFinesData(fines)
        }
        fetchFines()
    }, [])
    
    return (
        <div>
            <Table>
  {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">When</TableHead>
      <TableHead className="w-[100px]">Reported By</TableHead>
      <TableHead>Who</TableHead>
      <TableHead>For What</TableHead>
      <TableHead>Owing</TableHead>
      <TableHead className="text-right">Evidence</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {finesData.map((fine: Fine) => {
        return (
            <TableRow key={fine.id}>
                <TableCell>{fine.created_at}</TableCell>
                <TableCell>{fine.reported_by}</TableCell>
                <TableCell>{fine.who}</TableCell>
                <TableCell>{fine.what}</TableCell>
                <TableCell>{fine.penalty_amount}</TableCell>
                <TableCell className="text-right">{fine.media_url}</TableCell>
            </TableRow>
        )
    })}
  </TableBody>
</Table>
        </div>
    )
}