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
import { PhotoProvider, PhotoView } from 'react-photo-view';

const supabaseMediaUrlBuilder = (bucket: string, filename: string) => {
  const supbaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${supbaseUrl}/storage/v1/object/public/${bucket}/${filename}`;
};

export default function RecentFinesTable() {
  const supabase = createClient();

  const [finesData, setFinesData] = useState<Fine[]>([]);

  const showEvidence = (mediaUrl: string | undefined) => {
    if (!mediaUrl) {
      return;
    }

    console.log(mediaUrl);
  };

  useEffect(() => {
    const fetchFines = async () => {
      // fetch fines from supabase and join the matching staff members from the staff table
      const { data: fines, error } = await supabase
        .from('fines')
        .select(
          `
            *, 
            staff!public_fines_reported_by_fkey ( name )
          `
        )
        .order('created_at', { ascending: false });
      console.log(fines);
      if (error) {
        console.log('error', error);
        return;
      }

      if (!fines) {
        console.log('no fines');
        return;
      }

      setFinesData(fines);
    };
    fetchFines();
  }, []);

  return (
    <div>
      <Table>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>When</TableHead>
            <TableHead className='w-[100px]'>Reported By</TableHead>
            <TableHead>Who</TableHead>
            <TableHead>For What</TableHead>
            <TableHead>Owing</TableHead>
            <TableHead className='text-right'>Evidence</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {finesData.map((fine: Fine) => {
            return (
              <TableRow key={fine.id}>
                <TableCell>
                  {new Date(fine.created_at).toDateString()}
                </TableCell>{' '}
                {/* Use new Date() to convert the date */}
                <TableCell>{fine.staff?.name}</TableCell>
                <TableCell>{fine.who}</TableCell>
                <TableCell>{fine.what}</TableCell>
                <TableCell>{fine.penalty_amount}</TableCell>
                <TableCell>
                  {fine.media_url && (
                    <PhotoProvider>
                      <PhotoView
                        src={supabaseMediaUrlBuilder('fines', fine.media_url)}
                      >
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                          View
                        </button>
                      </PhotoView>
                    </PhotoProvider>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
