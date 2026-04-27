import { supabase } from "../lib/supabaseClient";
import { TrainingSplit, TrainingSplitWorkoutDay } from "../types";

type TrainingSplitRow = {
  id: string
  name: string
  workout_days: TrainingSplitWorkoutDay[]
}

type CreateTrainingSplitInput = Pick<TrainingSplit, 'name' | 'workoutDays'>;

function mapTrainingSplitRow(row: TrainingSplitRow): TrainingSplit {
  return {
    id: row.id,
    name: row.name,
    workoutDays: row.workout_days
  }
}


export async function getTrainingSplits(): Promise<TrainingSplit[]> {
  const { data, error } = await supabase
    .from('training_splits')
    .select('id, name, workout_days')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch training splits, ${error.message}`)
  }

  const trainingSplitRows: TrainingSplitRow[] = data ?? [];

  return trainingSplitRows.map((row) => {
    return mapTrainingSplitRow(row);
  })
}



export async function createTrainingSplit(trainingSplit: CreateTrainingSplitInput): Promise<TrainingSplit> {
  const { data, error } = await supabase
    .from('training_splits')
    .insert({
      name: trainingSplit.name,
      workout_days: trainingSplit.workoutDays
    })
    .select('name, id, workout_days')
    .single();

  if (error) {
    throw new Error(`Failed to add training split: ${error.message}`);
  }

  if (!data) {
    throw new Error('Failed to add training split');
  }

  const savedTrainingSplit  = mapTrainingSplitRow(data);

  return savedTrainingSplit ;
}

export async function deleteTrainingSplitById(id: string): Promise<void> {
  const { error } = await supabase
    .from('training_splits')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete training split: ${error.message}`)
  }
}


export async function updateTrainingSplitById(trainingSplit: TrainingSplit): Promise<TrainingSplit> {
  const { data, error } = await supabase
    .from('training_splits')
    .update({
      name: trainingSplit.name,
      workout_days: trainingSplit.workoutDays
    })
    .eq('id', trainingSplit.id)
    .select('name, id, workout_days')
    .single();


  if (error) {
    throw new Error(`Failed to update training split: ${error.message}`);
  }

  if (!data) {
    throw new Error(`Failed to update training split`);
  }

  const updatedTrainingSplit   = mapTrainingSplitRow(data);

  return updatedTrainingSplit  ;
}