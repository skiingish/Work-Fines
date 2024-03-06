'use server'
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

interface NewStaff {
  name: string;
  organisation?: number;
  fines_owed?: 0;
  fines_paid?: 0;
}

export async function fetchStaff(user: BasicUser) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { data: staff, error } = await supabase
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
      return {
        status: "error",
        message: `Error: ${error.message}`,
      };
    }

    if (!staff) {
      console.log('no fines');
      return {
        status: "error",
        message: `No fines`,
      };
    }

    staff.forEach((staffMember: Staff) => {
      staffMember.fines_outstanding =
        staffMember.fines_owed - staffMember.fines_paid;
    });

    staff.sort((a: Staff, b: Staff) => {
      return a.name.localeCompare(b.name);
    });

    return {
      status: "success",
      data: staff,
    };
  } catch (error) {
    return {
      status: "error",
      message: `Error: ${error}`,
    };
  }
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

export async function editStaff(user: BasicUser, staff: Staff) {

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

    // update the staff member in the database, and return the updated staff member
      const { data: staffData, error: staffError } = await supabase.from('staff').update({
        name: staff.name,
        fines_owed: staff.fines_owed,
        fines_paid: staff.fines_paid
      }).eq('id', staff.id).select();

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

export async function deleteStaff(user: BasicUser, staff: Staff) {

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

    // delete the staff member from the database
      const { data: staffData, error: staffError } = await supabase.from('staff').update({
        deleted: true,
        deleted_at: new Date()
      }).eq('id', staff.id).select();

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


