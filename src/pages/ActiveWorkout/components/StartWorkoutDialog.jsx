import styles from './StartWorkoutDialog.module.css'
import closeX from '../../../assets/activeWorkout/x-close.png'
import { EXERCISE_BASE_PREFIX } from '../../../data/exercises'


export default function StartWorkoutDialog({ dialogRef, handleSubmitStartWorkout, handleSelectTrainingSplit, selectedTrainingSplitId, trainingSplits, closeDialog, selectedWorkoutDayId, setSelectedWorkoutDayId, selectedWorkoutDay, handleSelectWorkoutDay }) {

  const selectedSplit = trainingSplits.find((trainingSplit) => trainingSplit.id === selectedTrainingSplitId)

  return (
    <dialog ref={dialogRef} className={styles["dialog-popup"]}>
      <form className={styles["form-wrapper"]} onSubmit={handleSubmitStartWorkout}>
        <div className={styles["form-header-wrapper"]}>
          <div>
            <label htmlFor="training-split" className={styles["training-split-text"]}>Training Split: </label>
            <select id="training-split" className={styles["select-input"]} onChange={handleSelectTrainingSplit} value={selectedTrainingSplitId}>
              <option value="" id="" disabled>Select a Split</option>
              {trainingSplits.map((trainingSplit) => {
                return (
                  <option value={trainingSplit.id} className={styles["select-option"]} key={trainingSplit.id}>{trainingSplit.name}</option>
                )
              })}
            </select>
          </div>

          <button type='button' aria-label='close dialog' className={styles["close-dialog-button"]} onClick={closeDialog}>
            <img src={closeX} alt="" className={styles["close-dialog-img"]} />
          </button>
        </div>

        {selectedSplit && selectedSplit.workoutDays.map((workoutDay) => {
          return (
            <div key={workoutDay.id}>
              <div className={styles["workout-day-button-wrapper"]}>
                <div className={styles["workout-day-text"]}>Workout Day: </div>
                <button type='button' className={selectedWorkoutDayId === workoutDay.id ? styles["workout-day-button-active"] : styles["workout-day-button"]} onClick={() => handleSelectWorkoutDay(workoutDay.id)}>{workoutDay.name}</button>
              </div>

              <div>
                {selectedWorkoutDayId === workoutDay.id ?
                  workoutDay.exercises.map((exer) => {
                    return (
                      <div key={exer.exerciseId}>
                        <div className={styles["exercise-name-img-wrapper"]}>
                          <img src={`${EXERCISE_BASE_PREFIX}${exer.images[0]}`} alt="" className={styles["exercise-img"]} />
                          <div className={styles["exercise-name"]}>{exer.exerciseName}</div>
                        </div>
                        {exer.sets.map((set, index) => {
                          return (
                            <div key={set.id} className={styles["set-wrapper"]}>
                              <fieldset className={styles["fieldset-wrapper"]}>
                                <legend className={styles["sr-only"]}>Set {index + 1}</legend>

                                <div className={styles["set-text"]}>Set {index + 1}: </div>

                                <div className={styles["set-input-wrapper"]}>
                                  <label htmlFor={`weight-${set.id}`} className={styles["sr-only"]}>Weight</label>
                                  <input type="text" id={`weight-${set.id}`} className={styles["weight-input"]} value={set.weight} readOnly />
                                  ×
                                  <label htmlFor={`reps-${set.id}`} className={styles["sr-only"]}>Reps</label>
                                  <input type="text" id={`reps-${set.id}`} className={styles["reps-input"]} value={set.reps} readOnly />
                                </div>
                              </fieldset>
                            </div>
                          )
                        })}
                      </div>
                    )
                  }) : ''
                }
              </div>
            </div>
          )
        })}

        <button type='submit' className={styles["start-workout-confirm-button"]} disabled={!selectedWorkoutDay}>Start</button>
      </form>
    </dialog>
  )
}