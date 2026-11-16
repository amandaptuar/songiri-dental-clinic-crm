import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables or fallback from local storage
const storedUrl = localStorage.getItem('dentacare_supabase_url') || '';
const storedKey = localStorage.getItem('dentacare_supabase_anon_key') || '';

const defaultUrl = (import.meta as any).env?.VITE_SUPABASE_URL || storedUrl || '';
const defaultKey = (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || storedKey || '';

export let supabase: SupabaseClient | null = null;

if (defaultUrl && defaultKey && defaultUrl.startsWith('http')) {
  try {
    supabase = createClient(defaultUrl, defaultKey);
  } catch (err) {
    console.warn('Supabase initialization failed, running in local-first mode:', err);
    supabase = null;
  }
}

export const initSupabaseClient = (url: string, key: string): SupabaseClient | null => {
  if (!url || !key || !url.startsWith('http')) {
    supabase = null;
    return null;
  }
  try {
    supabase = createClient(url, key);
    localStorage.setItem('dentacare_supabase_url', url);
    localStorage.setItem('dentacare_supabase_anon_key', key);
    return supabase;
  } catch (err) {
    console.error('Failed to init Supabase:', err);
    return null;
  }
};

export const testSupabaseConnection = async (client: SupabaseClient | null): Promise<{ success: boolean; message: string }> => {
  if (!client) {
    return { success: false, message: 'Supabase URL and Anon Key are missing or invalid.' };
  }
  try {
    const { error } = await client.from('clinic_settings').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      return { 
        success: false, 
        message: `Connection failed: ${error.message}. Please make sure you have executed the schema.sql in your Supabase SQL Editor.` 
      };
    }
    return { success: true, message: 'Successfully connected to Supabase database!' };
  } catch (err: any) {
    return { success: false, message: `Connection error: ${err?.message || 'Network error'}` };
  }
};
