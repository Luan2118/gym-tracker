import styles from './AddTrainingSplitDialog.module.css'
import deleteWorkoutDayIcon from '../../../assets/training-split/delete-workout-day.png'
import close from '../../../assets/training-split/x-close.png'
import WorkoutDayExercise from './WorkoutDayExercise'


export default function AddTrainingSplitDialog({ dialogRef, submitTrainingSplit, trainingSplitInputText, setTrainingSplitInputText, addWorkoutDay, closeDialog, workoutDays, handleWorkoutDayInputText, deleteWorkoutDay, selectExerciseAgain, handleSearchExerciseText, deleteExercise, handleWeightSet, handleRepsSet, deleteSet, addSet, selectExercise, addExercise }) {
  return (
    <dialog ref={dialogRef} className={styles["add-training-split-dialog"]}>
      <form className={styles["form-wrapper"]} onSubmit={submitTrainingSplit}>
        <div className={styles["training-split-name-wrapper"]}>
          <div className={styles["training-split-name-add-workout-wrapper"]}>
            <label htmlFor="training-split-name"></label>
            <input type="text" id="training-split-name" placeholder='Training Split Name' className={styles["training-split-name-input"]} onChange={(e) => setTrainingSplitInputText(e.target.value)} value={trainingSplitInputText} />

            <button type='button' className={styles["add-workout-button"]} onClick={addWorkoutDay}>Add Workout</button>
          </div>

          <button type='button' className={styles["close-dialog-button"]} aria-label='Close dialog' onClick={closeDialog}>
            <img className={styles["close-dialog-img"]} src={close} alt='' />
          </button>
        </div>

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
                />
              )}

              <button type='button' className={styles["add-exercise-button"]} onClick={() => addExercise(workoutDay.id)}> <span className={styles["add-exercise-plus-symbol"]}>&#43;</span> Add exercise </button>

            </div>
          )
        })}

        <button type='submit' className={styles["confirm-button"]} >Confirm</button>
      </form>
    </dialog>
  )
}