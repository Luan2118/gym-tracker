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

type CreateBodyWeightInput = {
  bw: number
  date: string
}

export async function createBodyWeight(bodyweight: CreateBodyWeightInput): Promise<BodyWeight> {
  const {data, error} = await supabase
    .from('body_weights')
    .insert(bodyweight)
    .select('id, bw, date')
    .single();
  
  if (error) {
    throw new Error(`Failed to create body weight: ${error.message}`)
  }

  if (!data) {
    throw new Error('Failed to create body weight.')
  }

  return data;
} 