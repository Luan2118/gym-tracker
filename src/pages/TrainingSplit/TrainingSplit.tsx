import { useState, useRef, useEffect } from 'react'
import { exercises } from '../../data/exercises'
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom'
import styles from './TrainingSplit.module.css'
import AddTrainingSplitDialog from './components/AddTrainingSplitDialog'
import TrainingSplitItem from './components/TrainingSplitItem'
import { LayoutContextType, TrainingSplitWorkoutDay } from '../../types'
import { createTrainingSplit, deleteTrainingSplitById } from '../../api/trainingSplitsApi'

export default function TrainingSplit() {

  const { trainingSplits, setTrainingSplits, isTrainingSplitsLoading, trainingSplitsError } = useOutletContext<LayoutContextType>();

  const [trainingSplitInputText, setTrainingSplitInputText] = useState('')
  const [workoutDays, setWorkoutDays] = useState<TrainingSplitWorkoutDay[]>([]);
  const [editingSplitId, setEditingSplitId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [duplicatedExerciseId, setDuplicatedExercise] = useState('');
  const [emptyTrainingSplitName, setEmptyTrainingSplitName] = useState(false);
  const [emptyWorkoutDayName, setEmptyWorkoutDayName] = useState<TrainingSplitWorkoutDay[]>([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [deleteTrainingSplitErrorId, setDeleteTrainingSplitErrorId] = useState<string | null>(null);


  const [isAddingTrainingSplit, setIsAddingTrainingSplit] = useState(false);
  const [addTrainingSplitError, setAddTrainingSplitError] = useState<string | null>(null);
  const [isDeletingTrainingSplitId, setIsDeletingTrainingSplitId] = useState<string | null>(null);
  const [deleteTrainingSplitError, setDeleteTrainingSplitError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('dialog') === 'open') {
      dialogRef.current?.showModal();
    }
  }, [searchParams])

  function openDialog() {
    resetStates();
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    resetStates()
    dialogRef.current?.close();
    navigate('')
  }

  function resetStates() {
    setEditingSplitId(null);
    setWorkoutDays([]);
    setTrainingSplitInputText('');
    setEmptyTrainingSplitName(false);
    setEmptyWorkoutDayName([])
    setHasSubmitted(false);
    setDuplicatedExercise('')
  }

  function addWorkoutDay() {
    setWorkoutDays(prev => [
      ...prev,
      { name: '', id: crypto.randomUUID(), confirm: false, exercises: [] }
    ])
  }

  function deleteWorkoutDay(id: string) {
    const newArray = workoutDays.filter((workoutDay) => workoutDay.id !== id)
    setWorkoutDays(newArray)
  }

  function handleWorkoutDayInputText(workoutDayId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const value = (e.target.value);

    updateWorkoutDay(workoutDayId, (workoutDay) => {
      return {
        ...workoutDay,
        name: value
      }
    })

  }



  function addExercise(workoutDayId: string) {
    updateWorkoutDay(workoutDayId, (workoutDay) => {
      return {
        ...workoutDay,
        exercises: [
          ...workoutDay.exercises,
          {
            exerciseName: '', rowId: crypto.randomUUID(), exerciseId: '', sets: [], confirm: false, searchText: '', images: []
          }]
      }
    })
  }

  function updateWorkoutDay(workoutDayId: string, updater: (workoutDay: TrainingSplitWorkoutDay) => TrainingSplitWorkoutDay) {
    setWorkoutDays((prev) =>
      prev.map((workoutDay) => workoutDay.id === workoutDayId ? updater(workoutDay) : workoutDay)
    )
  }

  function handleSearchExerciseText(e: React.ChangeEvent<HTMLInputElement>, workoutDayId: string, addedExerciseRowId: string) {
    const value = e.target.value

    setWorkoutDays((prev) =>
      prev.map((workoutday) => {
        if (workoutday.id !== workoutDayId) return workoutday;

        const newExercisesArray = workoutday.exercises.map((exercise) => {
          if (exercise.rowId !== addedExerciseRowId) return exercise;

          return {
            ...exercise,
            searchText: value
          }
        })

        return {
          ...workoutday,
          exercises: newExercisesArray
        }
      })
    )
  }


  function deleteExercise(workoutDayId: string, addedExerciseRowId: string) {
    setWorkoutDays((prev) =>
      prev.map((workoutday) => {
        if (workoutDayId !== workoutday.id) return workoutday;

        const newExercisesArray = workoutday.exercises.filter((ex) => ex.rowId !== addedExerciseRowId)

        return {
          ...workoutday,
          exercises: newExercisesArray
        }
      })

    )
  }

  function selectExercise(workoutDayId: string, selectedExerciseId: string, addedExerciseRowId: string) {
    const selectedExercise = exercises.find((exercise) => exercise.id === selectedExerciseId);
    if (!selectedExercise) return;

    setDuplicatedExercise('');

    const selectedWorkoutDay = workoutDays.find((workoutDay) => workoutDay.id === workoutDayId);

    if (!selectedWorkoutDay) return;
    const isDuplicate = selectedWorkoutDay.exercises.some((ex) => {
      return ex.exerciseId === selectedExerciseId;
    });

    if (isDuplicate) {
      setDuplicatedExercise(addedExerciseRowId);
      return;
    }
    setWorkoutDays((prev) => {
      return prev.map((workoutDay) => {
        if (workoutDay.id !== workoutDayId) return workoutDay;

        const newExercisesArray = workoutDay.exercises.map((ex) => {

          if (ex.rowId !== addedExerciseRowId) return ex
          return {
            ...ex,
            exerciseName: selectedExercise.name,
            exerciseId: selectedExercise.id,
            images: selectedExercise.images,
            confirm: true
          }
        })

        return {
          ...workoutDay,
          exercises: newExercisesArray
        }
      })
    }

    )

  }


  function selectExerciseAgain(rowId: string, workoutDayId: string) {
    setWorkoutDays((prev) =>
      prev.map((workoutday) => {
        if (workoutday.id !== workoutDayId) return workoutday;

        const newExercisesArray = workoutday.exercises.map((ex) => {
          if (ex.rowId !== rowId) return ex;

          return {
            ...ex,
            exerciseName: '',
            searchText: '',
            exerciseId: '',
            confirm: false
          }
        })

        return {
          ...workoutday,
          exercises: newExercisesArray
        }
      })
    )
  }

  function addSet(workoutDayId: string, addedExerciseRowId: string) {

    setWorkoutDays((prev) =>
      prev.map((workoutday) => {
        if (workoutday.id !== workoutDayId) return workoutday;

        const newExercisesArray = workoutday.exercises.map((ex) => {
          if (ex.rowId !== addedExerciseRowId) return ex;
          const weightValue: number | '' = ''
          const repsValue: number | '' = ''

          return {
            ...ex,
            sets: [
              ...ex.sets,
              { id: crypto.randomUUID(), weight: weightValue, reps: repsValue }
            ],
          }
        })

        return {
          ...workoutday,
          exercises: newExercisesArray
        }
      })
    )
  }

  function deleteSet(setId: string) {

    setWorkoutDays((prev) =>
      prev.map((workouday) => {

        const exercisesArray = workouday.exercises.map((ex) => {
          const newSetArray = ex.sets.filter((set) => set.id !== setId)

          return {
            ...ex,
            sets: newSetArray
          }
        })

        return {
          ...workouday,
          exercises: exercisesArray
        }

      })
    )
  }

  async function submitTrainingSplit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setHasSubmitted(true);

    const name = trainingSplitInputText.trim();
    const snapshotWorkoutDays = structuredClone(workoutDays);
    const hasEmptyWorkoutDayName = snapshotWorkoutDays.filter((workoutDay) => workoutDay.name.trim() === '')

    if (!name) {
      setEmptyTrainingSplitName(true);
      return;
    }
    setEmptyTrainingSplitName(false);

    if (hasEmptyWorkoutDayName.length > 0) {
      setEmptyWorkoutDayName(hasEmptyWorkoutDayName)
      return;
    }
    setEmptyWorkoutDayName([])


    if (snapshotWorkoutDays.length === 0) return;

    setAddTrainingSplitError(null);


    if (editingSplitId === null) {
      try {
        setIsAddingTrainingSplit(true);
        const savedTrainingSplit = await createTrainingSplit({
          name,
          workoutDays: snapshotWorkoutDays
        })

        setTrainingSplits((prev) => {
          return [
            savedTrainingSplit,
            ...prev
          ]
        })

        closeDialog();
        setHasSubmitted(false);
      } catch (error) {
        console.error(error)
        setAddTrainingSplitError('Failed to add training split');
      } finally {
        setIsAddingTrainingSplit(false);
      }

    } else {
      setTrainingSplits((prev) => {
        return prev.map((trainingSplit) => {
          if (trainingSplit.id !== editingSplitId) return trainingSplit;

          return {
            ...trainingSplit,
            name,
            workoutDays: snapshotWorkoutDays
          }
        })

      })
      closeDialog();
      setHasSubmitted(false);
    }

  }

  function editTrainingSplit(id: string) {
    setEmptyTrainingSplitName(false);
    setEmptyWorkoutDayName([]);
    setHasSubmitted(false);
    setDuplicatedExercise('')
    const selectedSplit = trainingSplits.find((split) => split.id === id);
    if (!selectedSplit) return;
    const selectedSplitCopy = structuredClone(selectedSplit);

    setEditingSplitId(selectedSplitCopy.id);
    setWorkoutDays(selectedSplitCopy.workoutDays);
    setTrainingSplitInputText(selectedSplitCopy.name);
    dialogRef.current?.showModal();
  }



  async function deleteTrainingSplit(id: string) {
    setDeleteTrainingSplitErrorId(id);
    setDeleteTrainingSplitError(null);
    setIsDeletingTrainingSplitId(id);
    try {
      await deleteTrainingSplitById(id)
      setTrainingSplits((prev) => prev.filter((trainingsplit) => trainingsplit.id !== id))
    } catch (error) {
      console.error(error)
      setDeleteTrainingSplitError('Failed to delete training split')
    } finally {
      setIsDeletingTrainingSplitId(null);
    }
  }

  function handleSet(e: React.ChangeEvent<HTMLInputElement>, workoutDayId: string, addedExerciseRowId: string, setId: string, property: 'weight' | 'reps') {
    const value: number | '' = e.target.value === '' ? '' : Number(e.target.value)


    const newArray = workoutDays.map((workoutday) => {
      if (workoutday.id !== workoutDayId) return workoutday;

      const newExerciseArray = workoutday.exercises.map((exercise) => {
        if (exercise.rowId !== addedExerciseRowId) return exercise;

        const newSetArray = exercise.sets.map((set) => {
          if (set.id !== setId) return set;

          return {
            ...set,
            [property]: value
          }
        })

        return {
          ...exercise,
          sets: newSetArray
        }
      })

      return {
        ...workoutday,
        exercises: newExerciseArray
      }
    })

    setWorkoutDays(newArray);
  }

  function handleWeightSet(e: React.ChangeEvent<HTMLInputElement>, workoutDayId: string, addedExerciseRowId: string, setId: string) {
    handleSet(e, workoutDayId, addedExerciseRowId, setId, 'weight')
  }

  function handleRepsSet(e: React.ChangeEvent<HTMLInputElement>, workoutDayId: string, addedExerciseRowId: string, setId: string) {
    handleSet(e, workoutDayId, addedExerciseRowId, setId, 'reps')
  }


  return (
    <>
      <header>
        <h1>All Training Splits</h1>
      </header>

      <div className={styles["content-wrapper"]}>

        <AddTrainingSplitDialog
          dialogRef={dialogRef}
          submitTrainingSplit={submitTrainingSplit}
          trainingSplitInputText={trainingSplitInputText}
          setTrainingSplitInputText={setTrainingSplitInputText}
          addWorkoutDay={addWorkoutDay}
          closeDialog={closeDialog}
          workoutDays={workoutDays}
          handleWorkoutDayInputText={handleWorkoutDayInputText}
          deleteWorkoutDay={deleteWorkoutDay}
          selectExerciseAgain={selectExerciseAgain}
          handleSearchExerciseText={handleSearchExerciseText}
          deleteExercise={deleteExercise}
          handleWeightSet={handleWeightSet}
          handleRepsSet={handleRepsSet}
          deleteSet={deleteSet}
          addSet={addSet}
          selectExercise={selectExercise}
          addExercise={addExercise}
          duplicatedExerciseId={duplicatedExerciseId}
          emptyTrainingSplitName={emptyTrainingSplitName}
          emptyWorkoutDayName={emptyWorkoutDayName}
          hasSubmitted={hasSubmitted}
          isAddingTrainingSplit={isAddingTrainingSplit}
          addTrainingSplitError={addTrainingSplitError}
        />

        <section className={styles["content-main"]}>
          {isTrainingSplitsLoading ? (
            <h2
              role='status'
              className={`${styles['status-message']} ${styles['loading-message']}`}
            >
              Loading training splits...
            </h2>
          ) : trainingSplitsError ? (
            <h2 role='alert'
              className={`${styles['status-message']} ${styles['error-message']}`}>
              {trainingSplitsError}
            </h2>
          ) : trainingSplits.length > 0 ? (

            <TrainingSplitItem
              trainingSplits={trainingSplits}
              editTrainingSplit={editTrainingSplit}
              deleteTrainingSplit={deleteTrainingSplit}
              isDeletingTrainingSplitId={isDeletingTrainingSplitId}
              deleteTrainingSplitError={deleteTrainingSplitError}
              deleteTrainingSplitErrorId={deleteTrainingSplitErrorId}
            />)
            :
            (<h2 role='status' className={`${styles['status-message']} ${styles['no-split-yet-message']}`}>No training split yet</h2>
            )}
        </section>
        <div className={styles["add-training-wrapper"]}>
          <button aria-controls='training-split-dialog' aria-haspopup='dialog' type="button" className={styles["add-training-button"]} onClick={openDialog}>Add Training Split</button>
        </div>
      </div>
    </>
  )
}