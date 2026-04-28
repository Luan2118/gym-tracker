import { TrainingSplit, ActiveWorkoutExercise } from "../../../types";


export default function buildUpdatedTrainingSplit(selectedTrainingSplit: TrainingSplit, selectedWorkoutDayId: string, activeExercises: ActiveWorkoutExercise[]): TrainingSplit {
  return {
    id: selectedTrainingSplit.id,
    name: selectedTrainingSplit.name,
    workoutDays: selectedTrainingSplit.workoutDays.map((workoutDay) => {
      if (workoutDay.id !== selectedWorkoutDayId) return workoutDay;

      return {
        ...workoutDay,
        exercises: workoutDay.exercises.map((ex) => {
          const activeExercise = activeExercises.find((activeEx) => activeEx.exerciseId === ex.exerciseId)

          if (!activeExercise) return ex;

          return {
            ...ex,
            sets: ex.sets.map((set) => {
              const activeSet = activeExercise.sets.find((activeSet) => activeSet.id === set.id);

              if (!activeSet) return set

              return {
                ...set,
                weight: activeSet.weight,
                reps: activeSet.reps
              }
            })
          }
        })
      }
    })
  }
}