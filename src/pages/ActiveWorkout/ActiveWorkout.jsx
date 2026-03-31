import { useEffect, useRef, useState } from 'react'
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom'
import styles from './ActiveWorkout.module.css'
import ActiveExerciseCard from './components/ActiveExerciseCard'
import StartWorkoutDialog from './components/StartWorkoutDialog'

export default function ActiveWorkout() {

  const { trainingSplits, workoutHistory, setWorkoutHistory } = useOutletContext();

  const [activeWorkout, setActiveWorkout] = useState(false);
  const [selectedTrainingSplitId, setSelectedTrainingSplitId] = useState('');
  const [selectedWorkoutDayId, setSelectedWorkoutDayId] = useState('');
  const [activeExercises, setActiveExercises] = useState([]);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const dialogRef = useRef(null);

  useEffect(() => {
    if (searchParams.get('dialog') === 'open') {
      dialogRef.current.showModal()
    }
  }, [searchParams])

  function handleStartWorkout() {
    openDialog();
    setSelectedTrainingSplitId('');
    setSelectedWorkoutDayId('')
    setActiveWorkout(false);
  }

  function handleCancelWorkout() {
    setActiveWorkout(false);
    setActiveExercises([]);
  }

  const selectedTrainingSplit = trainingSplits
    .find((split) => split.id === selectedTrainingSplitId)

  const selectedWorkoutDay = selectedTrainingSplit?.workoutDays.find((workoutday) => workoutday.id === selectedWorkoutDayId)

  const activeWorkoutData =
    selectedWorkoutDay
      ?.exercises ?? [];

  function openDialog() {
    dialogRef.current.showModal()
  }

  function closeDialog() {
    navigate('');
    dialogRef.current.close()
  }

  function handleSelectTrainingSplit(e) {
    setSelectedTrainingSplitId(e.target.value)
  }

  function handleSubmitStartWorkout(e) {
    e.preventDefault();
    setActiveWorkout(true)
    setActiveExercises(activeWorkoutData.map((ex) => {
      return {
        exerciseName: ex.exerciseName,
        exerciseId: ex.exerciseId,
        images: ex.images,
        sets: ex.sets.map((set) => {
          return {
            id: set.id,
            sessionId: crypto.randomUUID()
          }
        })
      }
    }));
    closeDialog();
  }

  function handleWeightSet(e, setId, exerciseId) {
    const weightInputValue = e.target.value === '' ? '' : Number(e.target.value);

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

  function handleRepsSet(e, setId, exerciseId) {
    const repstInputValue = e.target.value === '' ? '' : Number(e.target.value);
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

  function handleFinishworkout() {
    setActiveWorkout(false)

    const newWorkoutHistory = {
      id: crypto.randomUUID(),
      trainingSplitName: selectedTrainingSplit.name,
      workoutDay: selectedWorkoutDay.name,
      date: new Date().toISOString(),
      exercises: activeExercises
    }


    setWorkoutHistory((prev) => {
      return [
        ...prev,
        newWorkoutHistory
      ]
    });
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
                <div className={styles["active-workout-timer"]}>Timer: 00:00</div>
              </div>

              {activeWorkoutData.map((ex) =>
                <ActiveExerciseCard
                  key={ex.exerciseId}
                  ex={ex}
                  activeExercises={activeExercises}
                  workoutHistory={workoutHistory}
                  handleWeightSet={handleWeightSet}
                  handleRepsSet={handleRepsSet}
                />
              )}

              <button type='button' onClick={() => handleFinishworkout()} className={styles["finish-workout-button"]} >Finish Workout</button>
            </>
            : <h2 className={styles["no-active-workout-text"]}>No Active Workout</h2>}
        </section>

        <div className={styles["start-workout-wrapper"]}>
          {!activeWorkout ?
            <button type='button' className={styles["start-workout-button"]} onClick={handleStartWorkout}>
              Start Workout
            </button> :
            <button className={styles["cancel-workout-button"]} onClick={handleCancelWorkout}>Cancel Workout</button>
          }

          <StartWorkoutDialog
            dialogRef={dialogRef}
            handleSubmitStartWorkout={handleSubmitStartWorkout}
            handleSelectTrainingSplit={handleSelectTrainingSplit}
            selectedTrainingSplitId={selectedTrainingSplitId}
            trainingSplits={trainingSplits}
            closeDialog={closeDialog}
            selectedWorkoutDayId={selectedWorkoutDayId}
            setSelectedWorkoutDayId={setSelectedWorkoutDayId}
          />
        </div>
      </div>
    </>


  )
}
