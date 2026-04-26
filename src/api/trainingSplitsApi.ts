import { supabase } from "../lib/supabaseClient";
import { TrainingSplit, TrainingSplitWorkoutDay } from "../types";


export async function getTrainingSplits(): Promise<TrainingSplit[]> {
  const { data, error } = await supabase
    .from('traininsg_splits')
    .select('id, name, workout_days')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch training splits, ${error.message}`)
  }



  const mappedData = data?.map((trainingSplit) => {
    return {
      id: trainingSplit.id,
      name: trainingSplit.name,
      workoutDays: trainingSplit.workout_days
    }
  })


  return mappedData ?? [];
}

type CreateTrainingSplitInput = {
  name: string
  workoutDays: TrainingSplitWorkoutDay[]
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

  const mappedData = {
    id: data.id,
    name: data.name,
    workoutDays: data.workout_days
  }

  return mappedData;
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

type UpdateTrainingSplitByIdInput = {
  id: string
  name: string
  workoutDays: TrainingSplitWorkoutDay[]
}

export async function updateTrainingSplitById( trainingSplit: UpdateTrainingSplitByIdInput): Promise<TrainingSplit> {
  const { data, error } = await supabase
    .from('training_splits')
    .update({
      name: trainingSplit.name,
      workout_days: trainingSplit.workoutDays
    })
    .eq('id', trainingSplit.id)
    .select('name,id, workout_days')
    .single();


  if (error) {
    throw new Error(`Failed to update training split: ${error.message}`);
  }

  if (!data) {
    throw new Error(`Failed to update training split`);
  }

  const mappedData = {
    id: data.id,
    name: data.name,
    workoutDays: data.workout_days
  }

  return mappedData;
}