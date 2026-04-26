import { supabase } from "../lib/supabaseClient";
import { WorkoutHistory } from "../types";

export async function getWorkoutHistory(): Promise<WorkoutHistory[]> {
  const { data, error } = await supabase
    .from('workout_history')
    .select('id, training_split_name, workout_day, date, exercises, duration')
    .order('date', {ascending: false})
    .order('created_at', {ascending: false});
  if (error) {
    throw new Error(`Failed to fetch workout history: ${error.message}`);
  }

  const mappedData = data?.map((row) => {
    return {
      id: row.id,
      trainingSplitName: row.training_split_name,
      workoutDay: row.workout_day,
      date: row.date,
      exercises: row.exercises,
      duration: row.duration,
    }
  })

  return mappedData ?? [];
}
