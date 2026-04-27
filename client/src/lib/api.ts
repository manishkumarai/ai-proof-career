import { localApi } from "./localData";
import { hasSupabaseConfig } from "./supabase";
import { supabaseApi } from "./supabaseData";

export const api = hasSupabaseConfig ? supabaseApi : localApi;
