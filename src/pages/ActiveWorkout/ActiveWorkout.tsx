import { useEffect, useRef, useState } from 'react'
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom'
import styles from './ActiveWorkout.module.css'
import ActiveExerciseCard from './components/ActiveExerciseCard/ActiveExerciseCard'
import StartWorkoutDialog from './components/StartWorkoutDialog/StartWorkoutDialog'
import formatTimer from '../../utils/formatTimer'
import { LayoutContextType, WorkoutHistoryExercise, ActiveWorkoutExercise, TrainingSplit } from '../../types'
import { createWorkoutHistory } from '../../api/workoutHistoryApi'
import { updateTrainingSplitById } from '../../api/trainingSplitsApi'

export default function ActiveWorkout() {

  const { trainingSplits, setTrainingSplits, workoutHistory, setWorkoutHistory } = useOutletContext<LayoutContextType>();

  const [activeWorkout, setActiveWorkout] = useState(false);
  const [selectedTrainingSplitId, setSelectedTrainingSplitId] = useState('');
  const [selectedWorkoutDayId, setSelectedWorkoutDayId] = useState('');
  const [activeExercises, setActiveExercises] = useState<ActiveWorkoutExercise[]>([]);
  const [hasIncompleteSet, setHasIncompleteSet] = useState(false);


  const [isFinishingWorkout, setIsFinishingWorkout] = useState(false);
  const [finishWorkoutError, setFinishWorkoutError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('dialog') === 'open') {
      dialogRef.current?.showModal()
    }
  }, [searchParams])

  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const selectedTrainingSplit = trainingSplits
    .find((split) => split.id === selectedTrainingSplitId)

  const selectedWorkoutDay = selectedTrainingSplit?.workoutDays.find((workoutday) => workoutday.id === selectedWorkoutDayId)

  const activeExercisesData =
    selectedWorkoutDay
      ?.exercises ?? [];


  const activeExIds: Set<string> = new Set(activeExercises.map(e => e.exerciseId));

  const [timerRunning, setTimerRunning] = useState(false);
  const startTimeRef = useRef(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalIdRef = useRef<number | undefined>(undefined);

  function handleStartWorkout() {
    openDialog();
    setSelectedTrainingSplitId('');
    setSelectedWorkoutDayId('');
    setActiveWorkout(false);
  }

  function handleCancelWorkout() {
    setActiveWorkout(false);
    setActiveExercises([]);
    setTimerRunning(false);
    setElapsedTime(0);
    setHasIncompleteSet(false);
  }


  function openDialog() {
    dialogRef.current?.showModal()
  }

  function closeDialog() {
    navigate('');
    setHasIncompleteSet(false);
    dialogRef.current?.close()
  }

  function handleSelectTrainingSplit(e: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedTrainingSplitId(e.target.value)
  }


  function handleSubmitStartWorkout(e: React.SubmitEvent<HTMLFormElement>) {
    startTimeRef.current = Date.now() - elapsedTime;
    setTimerRunning(true);
    e.preventDefault();
    setActiveWorkout(true)
    setActiveExercises(activeExercisesData.map((ex) => {
      return {
        exerciseName: ex.exerciseName,
        exerciseId: ex.exerciseId,
        images: ex.images,
        sets: ex.sets.map((set) => {
          return {
            id: set.id,
            sessionId: crypto.randomUUID(),
            weight: '',
            reps: ''
          }
        })
      }
    }));
    closeDialog();
  }

  function handleSelectWorkoutDay(id: string) {
    setSelectedWorkoutDayId((prev) => {
      return prev === id ? '' : id;
    });
  }

  function handleWeightSet(e: React.ChangeEvent<HTMLInputElement>, setId: string, exerciseId: string) {
    const weightInputValue: number | '' = e.target.value === '' ? '' : Number(e.target.value);

    const newExerciseList = activeExercises.map((ex) => {
      if (ex.exerciseId !== exerciseId) return ex;

      const newSetList = ex.sets.map((set) => {
        if (set.id !== setId) return set;

        return {
          ...set,
          weight: weightInputValue
        }
      })

      return {
        ...ex,
        sets: newSetList
      }
    })


    setActiveExercises(newExerciseList)
  }

  function handleRepsSet(e: React.ChangeEvent<HTMLInputElement>, setId: string, exerciseId: string) {
    const repstInputValue: number | '' = e.target.value === '' ? '' : Number(e.target.value);
    const newExerciseList = activeExercises.map((ex) => {
      if (ex.exerciseId !== exerciseId) return ex;

      const newSetList = ex.sets.map((set) => {
        if (set.id !== setId) return set;

        return {
          ...set,
          reps: repstInputValue
        }
      })

      return {
        ...ex,
        sets: newSetList
      }
    })

    setActiveExercises(newExerciseList)
  }

  async function handleFinishworkout() {

    // check for incomplete sets
    const incompleteSet = activeExercises.some((ex) =>
      ex.sets.some((set) =>
        (set.weight === '' && set.reps !== '') ||
        (set.weight !== '' && set.reps === '') ||
        (set.weight === '' && set.reps === '')
      )
    );

    if (incompleteSet) {
      setHasIncompleteSet(true);
      return;
    }

    setHasIncompleteSet(false);



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
      trainingSplitName: selectedTrainingSplit ? selectedTrainingSplit.name : '',
      workoutDay: selectedWorkoutDay ? selectedWorkoutDay.name : '',
      date: new Date().toISOString(),
      exercises: workoutExercises,
      duration: elapsedTime
    }

    // check for the correct split
    const selectedSplit = trainingSplits.find((split) => split.id === selectedTrainingSplitId);

    if (!selectedSplit) return;

    setFinishWorkoutError(null);
    setIsFinishingWorkout(true);

    // updated split
    const updatedSplit: TrainingSplit = {
      id: selectedSplit.id,
      name: selectedSplit.name,
      workoutDays: selectedSplit.workoutDays.map((workoutDay) => {
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

    // create new workout history and update the split
    try {
      const savedWorkoutHistory = await createWorkoutHistory(newWorkoutHistory);

      setWorkoutHistory((prev) => {
        return [
          savedWorkoutHistory,
          ...prev,
        ]
      });

      const savedUpdatedSplit = await updateTrainingSplitById(updatedSplit)
      setTrainingSplits((prev) =>
        prev.map((split) => {
          if (split.id !== selectedTrainingSplitId) return split;
          return savedUpdatedSplit;
        })
      )

      setActiveWorkout(false);
      setTimerRunning(false);
      setElapsedTime(0);
    } catch (error) {
      console.error(error)
      setFinishWorkoutError('Failed to finish workout')

    } finally {
      setIsFinishingWorkout(false);
    }

  }

  useEffect(() => {

    if (timerRunning) {
      intervalIdRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current)
      }, 10)
    }

    return () => {
      clearInterval(intervalIdRef.current)
    }
  }, [timerRunning])


  function handleToggleTimer() {
    if (timerRunning) {
      setTimerRunning(false);
    } else {
      startTimeRef.current = Date.now() - elapsedTime;
      setTimerRunning(true);
    }
  }

  function resetTimer() {
    setElapsedTime(0);
    setTimerRunning(false);
    startTimeRef.current = 0;
  }

  return (
    <>
      <header>
        <h1>Active Workout</h1>
      </header>

      <div className={styles["content-wrapper"]}>

        <section className={styles["content-main"]}>
          {activeWorkout ?
            <>
              <div className={styles["active-workout-header"]}>
                <div className={styles["active-workout-split"]}>Split: {selectedTrainingSplit?.name}</div>
                <div className={styles["active-workout-workout-day"]}>{selectedWorkoutDay?.name ?? '-'}</div>
                <div className={styles["active-workout-timer"]}>
                  <div className={styles["active-workout-timer-text"]}>{formatTimer(elapsedTime)}</div>
                  <div className={styles["active-workout-timer-buttons-wrapper"]}>
                    <button type="button" className={styles["active-workout-timer-reset-button"]} onClick={resetTimer} >Reset</button>
                    <button type="button" className={styles["active-workout-timer-toggle-button"]} onClick={handleToggleTimer}>{timerRunning ? 'Stop' : 'Start'}</button>
                  </div>
                </div>
              </div>

              {activeExercises.map((ex) =>
                <ActiveExerciseCard
                  key={ex.exerciseId}
                  ex={ex}
                  exerciseId={ex.exerciseId}
                  workoutHistory={workoutHistory}
                  handleWeightSet={handleWeightSet}
                  handleRepsSet={handleRepsSet}
                  activeExIds={activeExIds}
                  activeExercisesData={activeExercisesData}
                />
              )}

              <div className={styles["finish-section-wrapper"]}>
                <button type='button' onClick={() => handleFinishworkout()} className={styles["finish-workout-button"]} disabled={isFinishingWorkout}>Finish Workout</button>

                {hasIncompleteSet && <p id='incomplete-sets' role='alert' className={styles["error-message"]}>
                  <span aria-hidden='true'>&#10071;</span>
                  Incomplete sets.</p>}

                {finishWorkoutError &&
                  <p
                    role='alert'
                    className={styles["error-message"]}
                  >
                    <span aria-hidden='true'>&#10071;</span>
                    {finishWorkoutError}
                  </p>
                }
              </div>
            </>
            : <h2 className={styles["no-active-workout-text"]}>No Active Workout</h2>}
        </section>

        <div className={styles["start-workout-wrapper"]}>
          {!activeWorkout ?
            <button aria-controls='start-workout-dialog' aria-haspopup="dialog" type='button' className={styles["start-workout-button"]} onClick={handleStartWorkout}>
              Start Workout
            </button> :
            <button type='button' className={styles["cancel-workout-button"]} onClick={handleCancelWorkout}>Cancel Workout</button>
          }

          <StartWorkoutDialog
            dialogRef={dialogRef}
            handleSubmitStartWorkout={handleSubmitStartWorkout}
            handleSelectTrainingSplit={handleSelectTrainingSplit}
            selectedTrainingSplitId={selectedTrainingSplitId}
            trainingSplits={trainingSplits}
            closeDialog={closeDialog}
            selectedWorkoutDayId={selectedWorkoutDayId}
            selectedWorkoutDay={selectedWorkoutDay}
            handleSelectWorkoutDay={handleSelectWorkoutDay}
          />
        </div>
      </div>
    </>


  )
}
