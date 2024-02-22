"use client"
import { useRouter } from 'next/navigation';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from 'react';
import { CheckIcon, CaretSortIcon } from '@radix-ui/react-icons'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
  } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { cn } from '@/lib/utils';
import { submitFine } from '@/app/actions/submitFine';
import { useUserStore } from "../utils/stores/userStore"
import { createClient } from "@/utils/supabase/client";


// const formSchema = z.object({
//     pin: z.number().int().min(0).max(9999).refine(value => value.toString().length === 4, {
//         message: 'Please enter a 4-digit pin',
//     }),
// });

const MAX_FILE_SIZE = 500000;
const ACCEPTED_MEDIA_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];



const formSchema = z.object({
    reported_by: z.string().min(2).max(30, {
      message: "name must be at least 2 characters.",
    }),
    who: z.string().min(2).max(30, {
        message: "name must be at least 2 characters.",
    }),
    what: z.string().min(2).max(100, {
        message: "fine must be at least 2 characters.",
    }),
    penalty_amount: z.coerce.number().min(1 ,{
        message: "name must be at least 2 characters.",
    }),
    media: z.instanceof(FileList).optional(),
  })


  //media: z.custom<File>(),
//   media: z
//     .any()
//     .refine((files) => files?.length == 1, "Image is required.")
//     .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
//     .refine(
//       (files) => ACCEPTED_MEDIA_TYPES.includes(files?.[0]?.type),
//       ".jpg, .jpeg, .png and .webp files are accepted."
//     ),

export default function SubmitFine() {
    const router = useRouter();
    const supabase = createClient();
    const user = useUserStore((state) => state.user);

    const [loading, setLoading] = useState(false);
    const [staffList, setStaffList] = useState<any[]>([]);
    const [fineTypesList, setFineTypesList] = useState<any[]>([]);


    useEffect(() => {
        async function fetchStaff() {
            const { data: staff, error } = await supabase.from('staff').select('*').eq('organisation', user?.organisation);
            
            if (error) {
                console.log(error);
                return;
            }

            if (!staff) {
                console.log('No staff found');
                return;
            }

            console.log(staff)

            setStaffList(staff);
        }

        async function fetchFineTypes() {
            const { data: fineTypes, error } = await supabase.from('fine_types').select('*').eq('organisation', user?.organisation);
            
            if (error) {
                console.log(error);
                return;
            }

            if (!fineTypes) {
                console.log('No fine types found');
                return;
            }

            console.log(fineTypes)
            setFineTypesList(fineTypes);
        }

        fetchStaff();
        fetchFineTypes();
    }, []);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          reported_by: "",
            who: "",
            what: "",
            penalty_amount: 0,
            
        },
      })

      const fileRef = form.register("media");

    async function onSubmit(data: z.infer<typeof formSchema>) {
        console.log(data);

        const dataPackage = {
            ...data,
            media: data?.media ? [data?.media[0]] : undefined,
        };

        

        const { data: result, error } = await supabase.from('basic_users').select('*').eq('pin', user?.pin);
        
        if (error) {
            console.log(error);
            return;
        }

        if (!result || result.length === 0) {
            console.log('Invalid User');
            return;
        }

        // Upload image first (if exists)
        if (dataPackage.media) {

            const fileType = dataPackage.media[0].type.split('/')[1];

            const filePath = `${user?.organisation}/${Date.now()}_${dataPackage.who}.${fileType}`;

            const { data: file, error: fileError } = await supabase.storage.from('fines').upload(filePath, dataPackage.media[0]);
            
            if (fileError) {
                console.log(fileError);
                return;
            }

            // Create a new fine in the fines table
            const { data: fine, error: fineError } = await supabase.from('fines').insert({
                reported_by: dataPackage.reported_by,
                who: dataPackage.who,
                what: dataPackage.what,
                penalty_amount: dataPackage.penalty_amount,
                media_url: filePath,
                organisation_id: user?.organisation,
                staff_id: 1
            });
        }
        
        console.log(result, error)

        // let res = await submitFine(user?.pin, dataPackage);

        // if (res.status === "error") {
        //   console.log(res.message);
        //   return;
        // }

        // if (res.status === "success") {
        //   console.log(res.data);
        
        //   return;
        // }
    }

    return (
      <div className='flex flex-col gap-16 items-center'>
        {/* <p className='text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center'>
        Enter your 4-digit pin
        </p> */}
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
        <FormField
          control={form.control}
          name="reported_by"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Reported By</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? staffList.find(
                            (staff) => staff.value === field.value
                          )?.name
                        : "Select Yourself"}
                      {/* <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search Staff"
                      className="h-9"
                    />
                    <CommandEmpty>No matching person found</CommandEmpty>
                    <CommandGroup>
                      {staffList.map((staff) => (
                        <CommandItem
                          value={staff.name}
                          key={staff.id}
                          onSelect={() => {
                            form.setValue("reported_by", staff.id)
                          }}
                        >
                          {staff.name}
                          {/* <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              language.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          /> */}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Whats your name?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="who"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Who</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? staffList.find(
                            (staff) => staff.value === field.value
                          )?.name
                        : "Select Person"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search Staff"
                      className="h-9"
                    />
                    <CommandEmpty>No matching person found</CommandEmpty>
                    <CommandGroup>
                      {staffList.map((staff) => (
                        <CommandItem
                          value={staff.name}
                          key={staff.id}
                          onSelect={() => {
                            form.setValue("who", staff.id)
                          }}
                        >
                          {staff.name}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              staff.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Who are you fining?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="what"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>What For</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? fineTypesList.find(
                            (fine) => fine.value === field.value
                          )?.name
                        : "Select Fine"}
                      {/* <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search fines"
                      className="h-9"
                    />
                    <CommandEmpty>No matching fine found</CommandEmpty>
                    <CommandGroup>
                      {fineTypesList.map((fine) => (
                        <CommandItem
                          value={fine.name}
                          key={fine.id}
                          onSelect={() => {
                            form.setValue("what", fine.id)
                          }}
                        >
                          {fine.name}
                          {/* <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              language.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          /> */}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                What did they do?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="penalty_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input placeholder="1" type='number' {...field} />
              </FormControl>
              <FormDescription>
                How many?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="media"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Evidence</FormLabel>
              <FormControl>
                <Input type="file" accept=".jpg, .jpeg, .png, .svg, .gif, .mp4" placeholder="shadcn" {...fileRef} />
              </FormControl>
              <FormDescription>
                Got a picture to upload?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
      </div>
    );
  }