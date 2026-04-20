import styles from './WorkoutDayExercise.module.css'
import plusIcon from '../../../assets/training-split/plus-icon.png'
import deleteWorkoutDayIcon from '../../../assets/training-split/delete-workout-day.png'
import { exercises, EXERCISE_BASE_PREFIX } from '../../../data/exercises'
import { TrainingSplitExercise } from '../../../types'

type WorkoutDayExerciseProps = {
  addedExercise: TrainingSplitExercise
  workoutDayId: string
  selectExerciseAgain: (rowId: string, workoutDayId: string) => void
  handleSearchExerciseText: (e: React.ChangeEvent<HTMLInputElement>, workoutDayId: string, addedExerciseRowId: string) => void
  deleteExercise: (workoutDayId: string, addedExerciseRowId: string) => void
  handleWeightSet: (e: React.ChangeEvent<HTMLInputElement>, workoutDayId: string, addedExerciseRowId: string, setId: string) => void
  handleRepsSet: (e: React.ChangeEvent<HTMLInputElement>, workoutDayId: string, addedExerciseRowId: string, setId: string) => void
  deleteSet: (setId: string) => void
  addSet: (workoutDayId: string, addedExerciseRowId: string) => void
  selectExercise: (workoutDayId: string, selectedExerciseId: string, addedExerciseRowId: string) => void
  duplicatedExerciseId: string
}

export default function WorkoutDayExercise({ addedExercise, workoutDayId, selectExerciseAgain, handleSearchExerciseText, deleteExercise, handleWeightSet, handleRepsSet, deleteSet, addSet, selectExercise, duplicatedExerciseId }: WorkoutDayExerciseProps) {
  return (
    <li className={styles["search-exercise-wrapper"]}>

      <div className={styles["search-exercise-input-wrapper"]}>
        {addedExercise.confirm ?
          <button type='button' className={styles["added-exercise-button"]} onClick={() => selectExerciseAgain(addedExercise.rowId, workoutDayId)}>
            <img className={styles["added-exercise-icon"]} src={`${EXERCISE_BASE_PREFIX}${addedExercise.images[0]}`} alt="" />
            <span className={styles["added-exercise-name"]}>{addedExercise.exerciseName}</span>
          </button> :

          <div className={styles["search-exercise-input-wrapper-inner"]}>
            <label htmlFor={addedExercise.rowId} className={styles["sr-only"]}>Search exercise</label>
            <input className={styles["search-exercise-input"]} type="text" id={addedExercise.rowId} placeholder='Search exercise' onChange={(e) => handleSearchExerciseText(e, workoutDayId, addedExercise.rowId)} value={addedExercise.searchText} />
          </div>
        }

        <button type='button' className={styles["search-exercise-delete-button"]} aria-label='Delete Exercise' onClick={() => deleteExercise(workoutDayId, addedExercise.rowId)} >
          <img className={styles["search-exercise-delete-icon"]} src={deleteWorkoutDayIcon} alt='' />
        </button>

      </div>
      {addedExercise.rowId === duplicatedExerciseId ? <div role='alert' className={styles["duplicated-exercise-text"]}>Already added</div> : null}

      {addedExercise.sets.map((set, index) => {
        return (
          <div key={set.id} className={styles["set-wrapper"]}>

            <fieldset className={styles["fieldset-wrapper"]}>
              <legend className={styles["sr-only"]}>Set {index + 1}</legend>

              <div className={styles["set-title"]}>Set {index + 1}</div>

              <div className={styles["reps-input-wrapper"]}>
                <label htmlFor={`weight-${set.id}`} className={styles["sr-only"]}>Weight</label>
                <input type="number" id={`weight-${set.id}`} className={styles["reps-input"]} onChange={e => handleWeightSet(e, workoutDayId, addedExercise.rowId, set.id)} value={set.weight} />
                x
                <label htmlFor={`reps-${set.id}`} className={styles["sr-only"]}>Reps</label>
                <input type="number" id={`reps-${set.id}`} className={styles["reps-input-2"]} onChange={e => handleRepsSet(e, workoutDayId, addedExercise.rowId, set.id)} value={set.reps} />
              </div>
            </fieldset>

            <button type='button' className={styles["delete-set-button"]} aria-label='Delete set' onClick={() => deleteSet(set.id)}>
              <img className={styles["delete-set-icon"]} src={deleteWorkoutDayIcon} alt='' />
            </button>
          </div>
        )
      })}
      {addedExercise.confirm && <button type='button' className={styles["add-set-button"]} aria-label='Add set' onClick={() => addSet(workoutDayId, addedExercise.rowId)}>
        <img className={styles["add-set-icon"]} src={plusIcon} alt='' />
        <span className={styles["add-set-text"]}>Add set</span>
      </button>}

      {addedExercise.confirm ? null :
        <ul className={styles["search-exercise-list-wrapper"]}>
          {
            exercises.filter((exercise) => exercise.name.toLowerCase().includes(addedExercise.searchText.toLowerCase()))
              .map((exer) => {
                if (addedExercise.searchText.length === 0) return;
                return (
                  <li key={exer.id} className={styles["search-exercise-list"]}>
                    <button type='button' className={styles["search-exercise-list-button"]} onClick={() => selectExercise(workoutDayId, exer.id, addedExercise.rowId)}>
                      <img className={styles["search-exercise-icon"]} src={`${EXERCISE_BASE_PREFIX}${exer.images[0]}`} alt='' />
                      <span className={styles["search-exercise-name"]}>{exer.name}</span>
                    </button>
                  </li>
                )
              })
          }

        </ul>
      }
    </li>
  )
}