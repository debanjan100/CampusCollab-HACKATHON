import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  full_name: string;
  department: string;
  year: string;
  bio: string;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  user_id: string;
  skill_name: string;
  skill_type: "have" | "want";
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  title: string;
  description: string;
  required_skills: string[];
  status: "open" | "in_progress" | "completed" | "closed";
  created_at: string;
  updated_at: string;
}
