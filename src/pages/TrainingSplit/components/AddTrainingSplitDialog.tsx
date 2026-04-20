import styles from './AddTrainingSplitDialog.module.css'
import deleteWorkoutDayIcon from '../../../assets/training-split/delete-workout-day.png'
import close from '../../../assets/training-split/x-close.png'
import WorkoutDayExercise from './WorkoutDayExercise'
import { TrainingSplitWorkoutDay } from '../../../types'


type AddTrainingSplitDialogProps = {
  dialogRef: React.RefObject<HTMLDialogElement | null>
  submitTrainingSplit: (e: React.SubmitEvent<HTMLFormElement>) => void
  trainingSplitInputText: string
  setTrainingSplitInputText: React.Dispatch<React.SetStateAction<string>>
  addWorkoutDay: () => void
  closeDialog: () => void
  workoutDays: TrainingSplitWorkoutDay[]
  handleWorkoutDayInputText: (id: string, e: React.ChangeEvent<HTMLInputElement>) => void
  deleteWorkoutDay: (id: string) => void
  selectExerciseAgain: (rowId: string, workoutDayId: string) => void
  handleSearchExerciseText: (e: React.ChangeEvent<HTMLInputElement>, workoutDayId: string, addedExerciseRowId: string) => void
  deleteExercise: (workoutDayId: string, addedExerciseRowId: string) => void
  handleWeightSet: (e: React.ChangeEvent<HTMLInputElement>, workoutDayId: string, addedExerciseRowId: string, setId: string) => void
  handleRepsSet: (e: React.ChangeEvent<HTMLInputElement>, workoutDayId: string, addedExerciseRowId: string, setId: string) => void
  deleteSet: (setId: string) => void
  addSet: (workoutDayId: string, addedExerciseRowId: string) => void
  selectExercise: (workoutDayId: string, selectedExerciseId: string, addedExerciseRowId: string) => void
  addExercise: (id: string) => void
  duplicatedExerciseId: string
  emptyTrainingSplitName: boolean
  emptyWorkoutDayName: TrainingSplitWorkoutDay[]
  hasSubmitted: boolean
}

export default function AddTrainingSplitDialog({ dialogRef, submitTrainingSplit, trainingSplitInputText, setTrainingSplitInputText, addWorkoutDay, closeDialog, workoutDays, handleWorkoutDayInputText, deleteWorkoutDay, selectExerciseAgain, handleSearchExerciseText, deleteExercise, handleWeightSet, handleRepsSet, deleteSet, addSet, selectExercise, addExercise, duplicatedExerciseId, emptyTrainingSplitName, emptyWorkoutDayName, hasSubmitted }: AddTrainingSplitDialogProps) {

  return (
    <dialog id='training-split-dialog' ref={dialogRef} className={styles["add-training-split-dialog"]} aria-label='Training split dialog'>
      <form className={styles["form-wrapper"]} onSubmit={submitTrainingSplit}>
        <div className={styles["training-split-name-wrapper"]}>
          <div className={styles["training-split-name-add-workout-wrapper"]}>
            <label htmlFor="training-split-name" className={styles["sr-only"]}>Training split name</label>
            <input type="text" id="training-split-name" placeholder='Training Split Name' className={styles["training-split-name-input"]} onChange={(e) => setTrainingSplitInputText(e.target.value)} value={trainingSplitInputText} />

            <button type='button' className={styles["add-workout-button"]} onClick={addWorkoutDay}>Add Workout</button>
          </div>

          <button type='button' className={styles["close-dialog-button"]} aria-label='Close dialog' onClick={closeDialog}>
            <img className={styles["close-dialog-img"]} src={close} alt='' />
          </button>
        </div>
        {emptyTrainingSplitName && <div role='alert' className={styles["title-validation"]}>Enter a split name</div>}

        <hr aria-hidden="true" />

        {workoutDays.map((workoutDay, i) => {
          return (
            <div key={workoutDay.id} className={styles["workout-day-wrapper"]} >
              <div className={styles["workout-day-inner-wrapper"]} >
                {
                  workoutDay.confirm ?
                    <div className={styles["workout-day-name-text"]}>{workoutDay.name}</div> :
                    <>
                      <label htmlFor={workoutDay.id} className={styles["sr-only"]}>Workout day</label>
                      <input type="text" id={workoutDay.id} placeholder='Upper, Push, Legs' className={styles["workout-day-input"]} onChange={(e) => handleWorkoutDayInputText(workoutDay.id, e)} value={workoutDay.name} />

                    </>
                }

                <button type='button' className={styles["delete-workout-day-button"]} aria-label='Delete Workout Day' onClick={() => deleteWorkoutDay(workoutDay.id)}>
                  <img className={styles["delete-workout-day-icon"]} src={deleteWorkoutDayIcon} alt='' />
                </button>
              </div>
              {emptyWorkoutDayName.some((day) => day.id === workoutDay.id) ? <div className={styles["title-validation"]}>Enter workout day name</div> : null}

              <ul>
                {workoutDay.exercises.map((addedExercise) =>
                  <WorkoutDayExercise
                    key={addedExercise.rowId}
                    addedExercise={addedExercise}
                    workoutDayId={workoutDay.id}
                    selectExerciseAgain={selectExerciseAgain}
                    handleSearchExerciseText={handleSearchExerciseText}
                    deleteExercise={deleteExercise}
                    handleWeightSet={handleWeightSet}
                    handleRepsSet={handleRepsSet}
                    deleteSet={deleteSet}
                    addSet={addSet}
                    selectExercise={selectExercise}
                    duplicatedExerciseId={duplicatedExerciseId}
                  />
                )}
              </ul>

              <button type='button' className={styles["add-exercise-button"]} onClick={() => addExercise(workoutDay.id)}> <span className={styles["add-exercise-plus-symbol"]}>&#43;</span> Add exercise </button>

            </div>
          )
        })}

        {hasSubmitted && workoutDays.length === 0 && <div role='alert' className={styles["workout-day-required-text"]}>Add a workout day</div>}

        <button type='submit' className={styles["confirm-button"]}>Confirm</button>
      </form>
    </dialog>
  )
}