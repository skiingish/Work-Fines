'use server'
import { calculateHMAC } from "@/utils/hmac";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export async function loginPin(data: any) {

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    try {
        const pin = parseInt(data.pin);

    // Hash the pin to search the supabase database
    const hashedPin = calculateHMAC(pin.toString());

    //console.log('hashedPin', hashedPin)

    // look for has pin in the database 
    const { data: user, error } = await supabase.from('basic_users').select('*').eq('pin', hashedPin);

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