import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

export interface Donor {
  id: string;
  name: string;
  age: number;
  gender: string;
  blood_group: string;
  phone: string;
  email: string;
  city: string;
  last_donation: string | null;
  availability: boolean;
  created_at: string;
}

export interface BloodRequest {
  id: string;
  patient_name: string;
  blood_group: string;
  hospital: string;
  city: string;
  contact: string;
  urgency: 'normal' | 'urgent';
  status: 'pending' | 'completed';
  created_at: string;
}

export interface Admin {
  id: string;
  username: string;
  password_hash: string;
}

export const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
