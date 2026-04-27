import { supabase } from "../lib/supabaseClient";
import { WorkoutHistory, WorkoutHistoryExercise } from "../types";

type WorkoutHistoryRow = {
  id: string
  training_split_name: string
  workout_day: string
  date: string
  exercises: WorkoutHistoryExercise[]
  duration: number
}

type CreateWorkoutHistoryInput = Pick<
  WorkoutHistory,
  'trainingSplitName' | 'workoutDay' | 'date' | 'exercises' | 'duration'
>;


function mapWorkoutHistoryRow(row: WorkoutHistoryRow): WorkoutHistory {
  return {
    id: row.id,
    trainingSplitName: row.training_split_name,
    workoutDay: row.workout_day,
    date: row.date,
    exercises: row.exercises,
    duration: row.duration,
  }
}

export async function getWorkoutHistory(): Promise<WorkoutHistory[]> {
  const { data, error } = await supabase
    .from('workosut_history')
    .select('id, training_split_name, workout_day, date, exercises, duration')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) {
    throw new Error(`Failed to fetch workout history: ${error.message}`);
  }

  const workoutHistoryRows: WorkoutHistoryRow[] = data ?? [];

  return workoutHistoryRows.map((row) => {
    return mapWorkoutHistoryRow(row);
  })

}


export async function createWorkoutHistory(workoutHistory: CreateWorkoutHistoryInput): Promise<WorkoutHistory> {
  const { data, error } = await supabase
    .from('workout_history')
    .insert({
      training_split_name: workoutHistory.trainingSplitName,
      workout_day: workoutHistory.workoutDay,
      date: workoutHistory.date,
      exercises: workoutHistory.exercises,
      duration: workoutHistory.duration
    })
    .select('id, training_split_name, workout_day, date, exercises, duration')
    .single();

  if (error) {
    throw new Error(`Failed to create workout history: ${error.message}`);
  }

  if (!data) {
    throw new Error('Failed to create workout history');
  }

  const savedWorkoutHistory = mapWorkoutHistoryRow(data);

  return savedWorkoutHistory;
}


export async function deleteWorkoutHistoryItemById(id: string): Promise<void> {
  const { error } = await supabase
    .from('workout_history')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Failed to delete workout history card: ${error.message}`)
  }
}