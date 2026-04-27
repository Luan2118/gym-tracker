import { supabase } from '../lib/supabaseClient';
import { BodyWeight } from '../types';

type BodyWeightRow = BodyWeight;


type CreateBodyWeightInput = Pick<BodyWeight, 'bw' | 'date'>

export async function getBodyWeights(): Promise<BodyWeight[]> {
  const { data, error } = await supabase
    .from('bodys_weights')
    .select('id, bw, date')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch body weights: ${error.message}`)
  }

  const bodyWeights: BodyWeightRow[] = data ?? [];

  return bodyWeights;
}

export async function createBodyWeight(bodyWeight: CreateBodyWeightInput): Promise<BodyWeight> {
  const { data, error } = await supabase
    .from('body_weights')
    .insert(bodyWeight)
    .select('id, bw, date')
    .single();

  if (error) {
    throw new Error(`Failed to create body weight: ${error.message}`)
  }

  if (!data) {
    throw new Error('Failed to create body weight.')
  }

  const bodyWeights: BodyWeightRow = data;

  return bodyWeights;
}

export async function deleteBodyWeightById(id: string): Promise<void> {
  const { error } = await supabase
    .from('body_weights')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete body weight: ${error.message}`)
  }
}


export async function updateBodyWeightById(id: string, bw: number): Promise<BodyWeight> {
  const { data, error } = await supabase
    .from('body_weights')
    .update({ bw })
    .eq('id', id)
    .select('id, bw, date')
    .single()

  if (error) {
    throw new Error(`Failed to update body weight: ${error.message}`);
  }

  if (!data) {
    throw new Error('Failed to update body weight.');
  }

  const bodyWeights: BodyWeightRow = data;

  return bodyWeights;
}