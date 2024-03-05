'use server'
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function updateFinesOwed(staff_id: string, update_amount: number) {

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    try {

      const { data: staff, error: staffError } = await supabase
      .from('staff')
      .select('*')
      .eq('id', parseInt(staff_id));

    if (staffError) {
      throw staffError;
    }

    if (!staff || staff.length === 0) {
      throw new Error('Staff member not found');
    }

    const newFinesOwed = staff[0].fines_owed + update_amount;

    console.log(newFinesOwed, staff[0].fines_owed, update_amount);

    const { data: updatedStaff, error: updatedStaffError } = await supabase
      .from('staff')
      .update({ fines_owed: newFinesOwed })
      .eq('id', parseInt(staff_id));

    if (updatedStaffError) {
      throw updatedStaffError;
    } 
      
    console.log(updatedStaff);

    if (updatedStaffError) {
      throw updatedStaffError;
    }
    
    return {
        status: "success",
    };
    
    } catch (error ) {
        return {
            status: "error",
            message: `Error: ${error}`,
          };
    }
    
  }