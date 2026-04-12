// BodyWeight type
export type BodyWeight = {
  bw: number
  id: string
  date: string
}

// Base types
export type BaseSet = {
  id: string
  weight: number
  reps: number
}

export type BaseExercise<TSet> = {
  exerciseName: string
  exerciseId: string
  images: string[]
  sets: TSet[]
}

// WorkoutHistory types
export type WorkoutHistorySet = BaseSet & {
  sessionId: string
}

export type WorkoutHistoryExercise = BaseExercise<WorkoutHistorySet>

export type WorkoutHistory = {
  id: string
  trainingSplitName: string
  workoutDay: string
  date: string
  exercises: WorkoutHistoryExercise[]
  duration: number
}

// TrainingSplit types
export type TrainingSplitSet = BaseSet

export type TrainingSplitExercise = BaseExercise<TrainingSplitSet> & {
  rowId: string
  searchText: string
}

export type TrainingSplitWorkoutDay = {
  id: string
  name: string
  confirm: boolean
  exercises: TrainingSplitExercise[]
}

export type TrainingSplit = {
  id: string
  name: string
  workoutDays: TrainingSplitWorkoutDay[]
}


// Metadata Exercise
export type ExerciseMetaData = {
  id: string
  name: string
  video: string
  images: string[]
  muscleGroup: string
  bodyRegion: string
  equipment: string
  primaryMuscles: string[]
  secondaryMuscles: string[]
  instructions: string[]
}