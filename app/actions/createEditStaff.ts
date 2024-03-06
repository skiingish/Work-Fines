'use server'
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

interface NewStaff {
  name: string;
  organisation?: number;
  fines_owed?: 0;
  fines_paid?: 0;
} 

export async function createStaff(user: BasicUser, staff: NewStaff) {

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    try {
        
    // look for user in the database, to make sure it exists. 
    const { data: userData, error } = await supabase.from('basic_users').select('*').eq('pin', user.pin);
    
    if (error) {
      throw new Error(`Error: ${error.message}`);
    }

    if (!userData || userData.length === 0) {
      throw new Error(`Invalid pin`);
    } 
    
    if (userData.length > 1) {
       throw new Error(`Multiple users found with the same pin`);
    }

    if (userData[0].account_privilege_level < 2) {
        throw new Error(`User is not an admin`);
    }

    // insert the staff member into the database, and return the newly created staff member
      const { data: staffData, error: staffError } = await supabase.from('staff').insert([
        {
            name: staff.name,
            organisation: userData[0].organisation,
            fines_owed: 0,
            fines_paid: 0
        }
    ]).select();

    if (staffError) {
        throw new Error(`Error: ${staffError.message}`);
    }
    
    return {
        status: "success",
        data: staffData as Staff[],
    };
    
    } catch (error ) {
       console.log(error)
        return {
            status: "error",
            message: `Error: ${error}`,
          };
    }
    
  }


