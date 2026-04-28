import { WorkoutHistory, WorkoutHistoryExercise, ActiveWorkoutExercise } from "../../../types";

type WorkoutHistoryPayload = Omit<WorkoutHistory, 'id'>

type BuildWorkoutHistoryPayloadParams = Omit<WorkoutHistory, 'id' | 'exercises'>

export default function buildWorkoutHistoryPayload(workoutHistory: BuildWorkoutHistoryPayloadParams, activeExercises: ActiveWorkoutExercise[],): WorkoutHistoryPayload {
  // map workout exercises
  const workoutExercises: WorkoutHistoryExercise[] = activeExercises.map((ex) => ({
    exerciseName: ex.exerciseName,
    exerciseId: ex.exerciseId,
    images: ex.images,
    sets: ex.sets.map((set) => ({
      id: set.id,
      sessionId: set.sessionId,
      weight: Number(set.weight),
      reps: Number(set.reps),
    })),
  }));

  // new workouthistory
  const newWorkoutHistory = {
    trainingSplitName: workoutHistory.trainingSplitName,
    workoutDay: workoutHistory.workoutDay,
    date: workoutHistory.date,
    exercises: workoutExercises,
    duration: workoutHistory.duration
  }

  return newWorkoutHistory
}