import { useState, useRef, useEffect } from 'react'
import { exercises } from '../../data/exercises'
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom'
import styles from './TrainingSplit.module.css'
import AddTrainingSplitDialog from './components/AddTrainingSplitDialog'
import TrainingSplitItem from './components/TrainingSplitItem'
import { LayoutContextType, TrainingSplitWorkoutDay } from '../../types'

export default function TrainingSplit() {

  const { trainingSplits, setTrainingSplits } = useOutletContext<LayoutContextType>();

  const [trainingSplitInputText, setTrainingSplitInputText] = useState('')
  const [workoutDays, setWorkoutDays] = useState<TrainingSplitWorkoutDay[]>([]);
  const [editingSplitId, setEditingSplitId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [duplicatedExerciseId, setDuplicatedExercise] = useState('');

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('dialog') === 'open') {
      dialogRef.current?.showModal();
    }
  }, [searchParams])

  function openDialog() {
    setEditingSplitId(null);
    setTrainingSplitInputText('');
    setWorkoutDays([]);
    dialogRef.current?.showModal();

  }

  function closeDialog() {
    setEditingSplitId(null);
    setTrainingSplitInputText('');
    setWorkoutDays([]);
    dialogRef.current?.close();
    navigate('')
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

  function handleWorkoutDayInputText(id: string, e: React.ChangeEvent<HTMLInputElement>) {
    const value = (e.target.value);

    setWorkoutDays(prev =>
      prev.map((workoutDay => {
        if (workoutDay.id === id) {
          return {
            ...workoutDay,
            name: value
          }
        }
        return workoutDay
      }))
    )
  }

  function addExercise(id: string) {
    setWorkoutDays((prev) =>
      prev.map((workoutDay) => {
        if (workoutDay.id !== id) return workoutDay;

        return {
          ...workoutDay,
          exercises: [
            ...workoutDay.exercises,
            {
              exerciseName: '', rowId: crypto.randomUUID(), exerciseId: '', sets: [], confirm: false, searchText: '', images: []
            }]
        }
      }))

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

    setWorkoutDays((prev) => {
      setDuplicatedExercise('');
      const selectedWorkoutDay = prev.find((workoutDay) => workoutDay.id === workoutDayId);
      if (!selectedWorkoutDay) return prev;

      const isDuplicate = selectedWorkoutDay.exercises.some((ex) => {
       return  ex.exerciseId === selectedExerciseId;
      });

      if (isDuplicate) {
        setDuplicatedExercise(addedExerciseRowId);
        return prev;
      }
      return prev.map((workoutDay) => {

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

  function submitTrainingSplit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const name = trainingSplitInputText.trim();

    if (!name) return;

    const snapshotWorkoutDays = structuredClone(workoutDays);

    setTrainingSplits((prev) => {
      if (editingSplitId === null) {
        return [
          ...prev,
          { name, id: crypto.randomUUID(), workoutDays: snapshotWorkoutDays }
        ]
      }

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
  }

  function editTrainingSplit(id: string) {
    const selectedSplit = trainingSplits.find((split) => split.id === id);
    if (!selectedSplit) return;
    const selectedSplitCopy = structuredClone(selectedSplit);

    setEditingSplitId(selectedSplitCopy.id);
    setWorkoutDays(selectedSplitCopy.workoutDays);
    setTrainingSplitInputText(selectedSplitCopy.name);


    dialogRef.current?.showModal();
  }

  function deleteTrainingSplit(id: string) {
    setTrainingSplits((prev) => prev.filter((trainingsplit) => trainingsplit.id !== id))
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
        />

        <section className={styles["content-main"]}>
          {trainingSplits.length > 0 ?

            <TrainingSplitItem trainingSplits={trainingSplits} editTrainingSplit={editTrainingSplit} deleteTrainingSplit={deleteTrainingSplit} />
            :
            <h2 className={styles["content-main-no-split-text"]}>No training split yet</h2>
          }
        </section>
        <div className={styles["add-training-wrapper"]}>
          <button className={styles["add-training-button"]} onClick={openDialog}>Add Training Split</button>
        </div>
      </div>
    </>
  )
}