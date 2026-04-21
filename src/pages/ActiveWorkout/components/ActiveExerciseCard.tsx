import styles from './ActiveExerciseCard.module.css'
import { EXERCISE_BASE_PREFIX } from '../../../data/exercises';
import { WorkoutHistory, WorkoutHistorySet, ActiveWorkoutExercise, TrainingSplit } from '../../../types';

type ActiveExerciseCardProps = {
  ex: ActiveWorkoutExercise
  exerciseId: string
  activeExercises: ActiveWorkoutExercise[]
  workoutHistory: WorkoutHistory[]
  handleWeightSet: (e: React.ChangeEvent<HTMLInputElement>, setId: string, exerciseId: string) => void
  handleRepsSet: (e: React.ChangeEvent<HTMLInputElement>, setId: string, exerciseId: string) => void
}

export default function ActiveExerciseCard({ ex, exerciseId, activeExercises, workoutHistory, handleWeightSet, handleRepsSet}: ActiveExerciseCardProps) {

  const activeExIds: Set<string> = new Set(activeExercises.map(e => e.exerciseId));

  const lastWorkout: WorkoutHistory | undefined = [...workoutHistory]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .find(w => w.exercises?.some(ex => activeExIds.has(ex.exerciseId)));

  function getBestSet(exerciseId: string, setId: string, activeExIds: Set<string>, workoutHistory: WorkoutHistory[]): WorkoutHistorySet | undefined {

    const filteredHisWorkoutDays = workoutHistory?.filter((w) => w.exercises.some(ex => activeExIds.has(ex.exerciseId)))

    const filteredExSets: WorkoutHistorySet[] = []
    let bestWeightNum = 0;
    let bestRepsNum = 0;

    for (let i = 0; i < filteredHisWorkoutDays.length; i++) {
      const filteredExercises =
        filteredHisWorkoutDays[i]?.exercises?.find((hisEx) => hisEx.exerciseId === exerciseId)
          ?.sets?.find((filteredSet) => filteredSet.id === setId)

      if (filteredExercises) filteredExSets.push(filteredExercises)
    }

    filteredExSets.forEach((set) => {
      if (set.weight > bestWeightNum) {
        bestWeightNum = set.weight
      }
    })

    const filteredBestSet =
      filteredExSets.filter((set) => set.weight === bestWeightNum)


    filteredBestSet.forEach((set) => {
      if (set.reps > bestRepsNum) {
        bestRepsNum = set.reps
      }
    })

    return filteredBestSet.find((set) => set.reps === bestRepsNum)
  }


  function getPrevSet(exerciseId: string, setId: string, lastWorkout: WorkoutHistory | undefined): WorkoutHistorySet | undefined {

    const prevExercise = lastWorkout?.exercises?.find(hEx => hEx.exerciseId === exerciseId);


    return prevExercise?.sets?.find(s => s.id === setId);
  }

  return (
    <div className={styles["active-workout-wrapper"]}>
      <div className={styles["active-workout-wrapper-outer"]}>
        <div className={styles["active-workout-name-wrapper"]}>
          <img src={`${EXERCISE_BASE_PREFIX}${ex.images[0]}`} alt="" className={styles["active-workout-ex-icon"]} />
          <div className={styles["active-workout-ex-name"]}>{ex.exerciseName}</div>
        </div>

        <div className={styles["active-workout-best-previous-set-wrapper"]}>
          <div className={styles["active-workout-best-set-wrapper"]}>
            <div className={styles["active-workout-best-set-title"]}> Best set</div>
            {ex.sets.map((set, index) => {

              const bestSet = getBestSet(exerciseId, set.id, activeExIds, workoutHistory)

              return (
                <div key={set.id} className={styles["active-workout-b-p-set-wrapper"]}>
                  <div className={styles["active-workout-b-p-set"]}>Set {index + 1}:</div>
                  <span className={styles["active-workout-b-p-set-value"]}>{bestSet ? `${bestSet.weight} × ${bestSet.reps}` : "-"}</span>
                </div>
              )
            })}
          </div>

          <div className={styles["active-workout-wrapper-previous-set-wrapper"]}>
            <div className={styles["active-workout-previous-set-title"]}>Previous set</div>
            {ex.sets.map((set, index) => {
              const prevSet = getPrevSet(exerciseId, set.id, lastWorkout)
              return (
                <div key={set.id} className={styles["active-workout-b-p-set-wrapper"]}>
                  <div className={styles["active-workout-b-p-set"]}>Set {index + 1}:</div>
                  <span className={styles["active-workout-b-p-set-value"]}>{prevSet ? `${prevSet.weight} × ${prevSet.reps}` :  `${set.weight} × ${set.reps}`}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className={styles["active-workout-set-wrapper"]}>
        <div className={styles["active-workout-current-set-text"]}>Current set:</div>
        {ex.sets.map((set, index) => {
          return (
            <div key={set.id} className={styles["active-workout-set-wrapper"]}>
              <fieldset className={styles["fieldset-wrapper"]} >
                <legend className={styles["sr-only"]}>Set {index + 1}:</legend>

                <div className={styles["active-workout-set-inner-wrapper"]}>
                  <div className={styles["set-text"]}>Set {index + 1}:</div>

                  <div className={styles["active-workout-set-input-wrapper"]}>
                    <label htmlFor={`weight-${ex.exerciseId}-${set.id}`} className={styles["sr-only"]}>Weight</label>
                    <input type="number" id={`weight-${ex.exerciseId}-${set.id}`} className={styles["active-workout-weight-input"]} onChange={(e) => handleWeightSet(e, set.id, ex.exerciseId)} value={set.weight}/>
                    ×
                    <label htmlFor={`reps-${ex.exerciseId}-${set.id}`} className={styles["sr-only"]}>Reps</label>
                    <input type="number" id={`reps-${ex.exerciseId}-${set.id}`} className={styles["active-workout-reps-input"]} onChange={(e) => handleRepsSet(e, set.id, ex.exerciseId)} value={set.reps}/>
                  </div>
                </div>
              </fieldset>
            </div>
          )
        })}
      </div>
    </div>
  )
}