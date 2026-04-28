import styles from './AddTrainingSplitDialog.module.css'
import deleteWorkoutDayIcon from '../../../../assets/training-split/delete-workout-day.png'
import close from '../../../../assets/training-split/x-close.png'
import WorkoutDayExercise from '../WorkoutDayExercise/WorkoutDayExercise'
import { TrainingSplitWorkoutDay } from '../../../../types'


type AddTrainingSplitDialogProps = {
  dialogRef: React.RefObject<HTMLDialogElement | null>
  submitTrainingSplit: (e: React.SubmitEvent<HTMLFormElement>) => Promise<void>
  trainingSplitInputText: string
  setTrainingSplitInputText: React.Dispatch<React.SetStateAction<string>>
  addWorkoutDay: () => void
  closeDialog: () => void
  workoutDays: TrainingSplitWorkoutDay[]
  handleWorkoutDayInputText: (workoutDayId: string, e: React.ChangeEvent<HTMLInputElement>) => void
  deleteWorkoutDay: (id: string) => void
  selectExerciseAgain: (rowId: string, workoutDayId: string) => void
  handleSearchExerciseText: (e: React.ChangeEvent<HTMLInputElement>, workoutDayId: string, addedExerciseRowId: string) => void
  deleteExercise: (workoutDayId: string, addedExerciseRowId: string) => void
  handleWeightSet: (e: React.ChangeEvent<HTMLInputElement>, workoutDayId: string, addedExerciseRowId: string, setId: string) => void
  handleRepsSet: (e: React.ChangeEvent<HTMLInputElement>, workoutDayId: string, addedExerciseRowId: string, setId: string) => void
  deleteSet: (setId: string) => void
  addSet: (workoutDayId: string, addedExerciseRowId: string) => void
  selectExercise: (workoutDayId: string, selectedExerciseId: string, addedExerciseRowId: string) => void
  addExercise: (workoutDayId: string) => void
  duplicatedExerciseId: string
  emptyTrainingSplitName: boolean
  emptyWorkoutDayName: TrainingSplitWorkoutDay[]
  hasSubmitted: boolean
  isAddingTrainingSplit: boolean
  addTrainingSplitError: string | null
  isUpdatingTrainingSplit: boolean
  updateTrainingSplitError: string | null
  showMissingExercisesError: boolean
  showUnselectedExerciseError: boolean
  notAddedSetRowId: string | undefined
}

export default function AddTrainingSplitDialog({ dialogRef, submitTrainingSplit, trainingSplitInputText, setTrainingSplitInputText, addWorkoutDay, closeDialog, workoutDays, handleWorkoutDayInputText, deleteWorkoutDay, selectExerciseAgain, handleSearchExerciseText, deleteExercise, handleWeightSet, handleRepsSet, deleteSet, addSet, selectExercise, addExercise, duplicatedExerciseId, emptyTrainingSplitName, emptyWorkoutDayName, hasSubmitted, isAddingTrainingSplit, addTrainingSplitError, isUpdatingTrainingSplit, updateTrainingSplitError, showMissingExercisesError, showUnselectedExerciseError, notAddedSetRowId }: AddTrainingSplitDialogProps) {

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
        {emptyTrainingSplitName && <div role='alert' className={`${styles["error-message"]} ${styles["split-name-message"]}`}>
          <span aria-hidden='true'>&#10071;</span>
          Enter a split name
        </div>}

        <hr aria-hidden="true" />

        {workoutDays.map((workoutDay) => {
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
              {emptyWorkoutDayName.some((day) => day.id === workoutDay.id) &&
                <p role='alert' className={`${styles["error-message"]} ${styles["workout-day-name-message"]}`}>
                  <span aria-hidden='true'>&#10071;</span>
                  Enter workout day name
                </p>}

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
                    notAddedSetRowId={notAddedSetRowId}
                  />
                )}
              </ul>

              <button type='button' className={styles["add-exercise-button"]} onClick={() => addExercise(workoutDay.id)}> <span className={styles["add-exercise-plus-symbol"]}>&#43;</span> Add exercise </button>

            </div>
          )
        })}

        {hasSubmitted && workoutDays.length === 0 &&
          <p role='alert' className={`${styles["error-message"]} ${styles["form-error-message"]}`}>
            <span aria-hidden='true'>&#10071;</span>
            Add a workout day
          </p>}

        {addTrainingSplitError &&
          <p role='alert' className={`${styles["error-message"]} ${styles["form-error-message"]}`}>
            <span aria-hidden='true'>&#10071;</span>
            {addTrainingSplitError}
          </p>
        }

        {updateTrainingSplitError &&
          <p role='alert' className={`${styles["error-message"]} ${styles["form-error-message"]}`}>
            <span aria-hidden='true'>&#10071;</span>
            {updateTrainingSplitError}
          </p>
        }

        {showMissingExercisesError &&
          <p role='alert' className={`${styles["error-message"]} ${styles["form-error-message"]}`}>
            <span aria-hidden='true'>&#10071;</span>
            Add at least one exercise to every workout day
          </p>}

        {showUnselectedExerciseError &&
          <p role='alert' className={`${styles["error-message"]} ${styles["form-error-message"]}`}>
            <span aria-hidden='true'>&#10071;</span>
           Select an exercise for every added exercise row
          </p>}

     
        <button type='submit' className={styles["confirm-button"]} disabled={isAddingTrainingSplit || isUpdatingTrainingSplit}>Confirm</button>
      </form>
    </dialog>
  )
}