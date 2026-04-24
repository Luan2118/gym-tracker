import { supabase } from '../lib/supabaseClient';
import { BodyWeight } from '../types';

export async function getBodyWeights(): Promise<BodyWeight[]> {
  const { data, error } = await supabase
    .from('body_weights')
    .select('id, bw, date')
    .order('date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch body weights: ${error.message}`)
  }

  return data ?? [];
}