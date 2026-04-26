import { supabase } from "../lib/supabaseClient";
import { WorkoutHistory, WorkoutHistoryExercise } from "../types";

export async function getWorkoutHistory(): Promise<WorkoutHistory[]> {
  const { data, error } = await supabase
    .from('workout_history')
    .select('id, training_split_name, workout_day, date, exercises, duration')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) {
    throw new Error(`Failed to fetch workout history: ${error.message}`);
  }

  const mappedData: WorkoutHistory[] = data?.map((row) => {
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

type CreateWorkoutHistoryInput = {
  trainingSplitName: string
  workoutDay: string
  date: string
  exercises: WorkoutHistoryExercise[]
  duration: number
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
    throw new Error(`Failed to create workout history ${error.message}`);
  }

  if (!data) {
    throw new Error('Failed to create workout history');
  }

  const mappedData: WorkoutHistory = {
    id: data.id,
    trainingSplitName: data.training_split_name,
    workoutDay: data.workout_day,
    date: data.date,
    exercises: data.exercises,
    duration: data.duration,
  }

  return mappedData;
}