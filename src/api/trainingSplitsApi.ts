import { supabase } from "../lib/supabaseClient";
import { TrainingSplit } from "../types";


export async function getTrainingSplits(): Promise<TrainingSplit[]> {
  const {data, error} = await supabase
  .from('trainings_splits')
  .select('id, name, workout_days')
  .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch training splits, ${error.message}`)
  }



  const mappedData = data?.map((trainingSplit) => {
   return {
    id: trainingSplit.id,
    name: trainingSplit.name,
    workoutDays:  trainingSplit.workout_days
   } 
  })


  return mappedData ?? [];
}