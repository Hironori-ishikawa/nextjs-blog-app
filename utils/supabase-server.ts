// Supabase Client
import { headers, cookies } from "next/headers";
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from "./database.types";

export const createClient = () =>
  createServerComponentClient<Database>({

    cookies,
  })
