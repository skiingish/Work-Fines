'use server'
import { calculateHMAC } from "@/utils/hmac";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function submitFine(id: string | undefined, data: any) {

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    try {
        
    // look for id in the database, to make sure it exists. 
    const { data: user, error } = await supabase.from('basic_users').select('*').eq('pin', id);
    
    console.log(user)

    if (error) {
      return {
        status: "error",
        message: `Error: ${error.message}`,
      };
    }

    if (!user || user.length === 0) {
      return {
        status: "error",
        message: `Invalid pin`,
      };
    } 
    
    if (user.length > 1) {
        return {
            status: "error",
            message: `Multiple users found with the same pin`,
            };
    }

    console.log(user)
    
    return {
        status: "success",
        data: user[0],
    };
    
    } catch (error ) {
        return {
            status: "error",
            message: `Error: ${error}`,
          };
    }
    
  }