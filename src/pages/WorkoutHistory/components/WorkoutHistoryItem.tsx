import styles from './WorkoutHistoryItem.module.css'
import arrowDown from '../../../assets/workout-history/arrow-down.png'
import formatISODate from '../../../utils/formatISODate';
import { useState } from 'react';
import { EXERCISE_BASE_PREFIX } from '../../../data/exercises';
import formatTimer from '../../../utils/formatTimer';
import closeIcon from '../../../assets/training-split/delete-workout-day.png'
import { WorkoutHistory } from '../../../types';

type WorkoutHistoryItemProps = {
  filteredWorkoutHistory: WorkoutHistory[]
  deleteWorkoutHistoryItem: (id: string) => void
}

export default function WorkoutHistoryItem({ filteredWorkoutHistory, deleteWorkoutHistoryItem }: WorkoutHistoryItemProps) {

  const [selectedWorkoutHisId, setSelectedWorkoutHisId] = useState('');

  const selectedWorkoutHistItem = filteredWorkoutHistory.find((w) => w.id === selectedWorkoutHisId)

  function displaySelectedWorkoutHist(workoutId: string) {
    if (selectedWorkoutHisId === workoutId) setSelectedWorkoutHisId('')
    else setSelectedWorkoutHisId(workoutId)
  }

  return (
    filteredWorkoutHistory.map((workout) => {
      return (
        <li key={workout.id} className={styles["workout-history-item-wrapper"]}>
          <div className={styles["workout-history-item-inner-wrapper"]}>
            <button aria-controls={`workout-history-item-card-${workout.id}`} aria-expanded={workout.id === selectedWorkoutHisId } type='button' className={styles["workout-history-item-button"]} onClick={() => displaySelectedWorkoutHist(workout.id)}>
              <div className={styles["workout-history-item-names"]}>

                <div className={styles["workout-history-item-training-split-wrapper"]}>
                  <div className={styles["workout-history-item-training-split-title"]}>Split: </div>
                  <div className={styles["workout-history-item-training-split-value"]}>{workout.trainingSplitName}</div>
                </div>

                <div className={styles["workout-history-item-workout-day-wrapper"]}>
                  <div className={styles["workout-history-item-workout-day-title"]}>Workout Day: </div>
                  <div className={styles["workout-history-item-workout-day-value"]}> {workout.workoutDay}</div>
                </div>

                <div className={styles["workout-history-item-day-wrapper"]}>
                  <div className={styles["workout-history-item-day-title"]}>Date:</div>
                  <div className={styles["workout-history-item-day-value"]}> {formatISODate(workout.date)}</div>
                </div>
              </div>

              <img src={arrowDown} alt="" className={workout.id === selectedWorkoutHisId ? styles["arrow-up-icon"] : styles["arrow-down-icon"]} />

            </button>
            <button type='button' aria-label='Delete workout history item' onClick={() => deleteWorkoutHistoryItem(workout.id)} className={styles["workout-history-item-delete-button"]}>
              <img src={closeIcon} alt="" className={styles["workout-history-item-delete-button-icon"]} />
            </button>
          </div>
          {workout.id === selectedWorkoutHisId ?
            <div id={`workout-history-item-card-${workout.id}`} className={styles["workout-history-item-card"]}>
              <div className={styles["workout-history-duration-wrapper"]}>
                <div className={styles["workout-history-duration-title"]}>
                  Duration:
                </div>
                <div className={styles["workout-history-duration-value"]}>
                  {formatTimer(workout.duration)}
                </div>
              </div>

              <div className={styles["selected-workout-history-wrapper"]}>
                {selectedWorkoutHistItem?.exercises.map((ex) => {
                  return (
                    <div key={ex.exerciseId} className={styles["selected-workout-history-exercise-row"]}>
                      <div className={styles["selected-workout-history-left"]}>
                        <img
                          src={`${EXERCISE_BASE_PREFIX}${ex.images[0]}`}
                          alt=""
                          className={styles["selected-workout-history-ex-icon"]}
                        />

                        <div className={styles["selected-workout-history-ex-name"]}>
                          {ex.exerciseName}
                        </div>
                      </div>

                      <div className={styles["selected-workout-history-sets-column"]}>
                        {ex.sets.map((set, i) => {
                          return (
                            <div key={set.id} className={styles["selected-workout-history-set-pill"]}>
                              <span className={styles["selected-workout-history-set-label"]}>
                                Set {i + 1}:
                              </span>
                              <span className={styles["selected-workout-history-set-value"]}>
                                {set.weight} × {set.reps}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )
                }
                )}
              </div>
            </div>
            : null}
        </li>
      )
    })
  )
}

