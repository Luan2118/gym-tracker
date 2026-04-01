import { useState, useRef, useEffect } from 'react'
import { exercises } from '../../data/exercises'
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom'
import styles from './TrainingSplit.module.css'
import AddTrainingSplitDialog from './components/AddTrainingSplitDialog'
import TrainingSplitItem from './components/TrainingSplitItem'

export default function TrainingSplit() {

  const { trainingSplits, setTrainingSplits } = useOutletContext();

  const [trainingSplitInputText, setTrainingSplitInputText] = useState('')
  const [workoutDays, setWorkoutDays] = useState([]);
  const [editingSplitId, setEditingSplitId] = useState(null);
  const dialogRef = useRef(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('dialog') === 'open') {
      dialogRef.current.showModal();
    }
  }, [searchParams])

  function openDialog() {
    setEditingSplitId(null);
    setTrainingSplitInputText('');
    setWorkoutDays([]);
    dialogRef.current.showModal();

  }

  function closeDialog() {
    setEditingSplitId(null);
    setTrainingSplitInputText('');
    setWorkoutDays([]);
    dialogRef.current.close();
    navigate('')
  }

  function addWorkoutDay() {
    setWorkoutDays(prev => [
      ...prev,
      { name: '', id: crypto.randomUUID(), confirm: false, exercises: [] }
    ])
  }

  function deleteWorkoutDay(id) {
    const newArray = workoutDays.filter((workoutDay) => workoutDay.id !== id)
    setWorkoutDays(newArray)
  }

  function handleWorkoutDayInputText(id, e) {
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

  function addExercise(id) {
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

  function handleSearchExerciseText(e, workoutDayID, addedExerciseRowId) {
    const value = e.target.value

    setWorkoutDays((prev) =>
      prev.map((workoutday) => {
        if (workoutday.id !== workoutDayID) return workoutday;

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


  function deleteExercise(workoutDayId, excerciseId) {
    setWorkoutDays((prev) =>
      prev.map((workoutday) => {
        if (workoutDayId !== workoutday.id) return workoutday;

        const newExercisesArray = workoutday.exercises.filter((ex) => ex.rowId !== excerciseId)

        return {
          ...workoutday,
          exercises: newExercisesArray
        }
      })

    )
  }

  function selectExercise(workoutDayID, selectedExerciseId, addedExerciseRowId) {
    const selectedExercise = exercises.find((exercise) => exercise.id === selectedExerciseId);

    setWorkoutDays((prev) =>
      prev.map((workoutday) => {
        if (workoutday.id !== workoutDayID) return workoutday;

        const newExercisesArray = workoutday.exercises.map((ex) => {
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
          ...workoutday,
          exercises: newExercisesArray
        }
      })
    )

  }

  function selectExerciseAgain(rowId, workoutdayId) {
    setWorkoutDays((prev) =>
      prev.map((workoutday) => {
        if (workoutday.id !== workoutdayId) return workoutday;

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

  function addSet(workoutdayId, addedExerciseRowId) {

    setWorkoutDays((prev) =>
      prev.map((workoutday) => {
        if (workoutday.id !== workoutdayId) return workoutday;

        const newExercisesArray = workoutday.exercises.map((ex) => {
          if (ex.rowId !== addedExerciseRowId) return ex;



          return {
            ...ex,
            sets: [
              ...ex.sets,
              { id: crypto.randomUUID(), reps: '', weight: '' }
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

  function deleteSet(setId) {

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

  function submitTrainingSplit(e) {
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

  function editTrainingSplit(id) {
    const selectedSplit = trainingSplits.find((split) => split.id === id);
    if (!selectedSplit) return;
    const selectedSplitCopy = structuredClone(selectedSplit);

    setEditingSplitId(selectedSplitCopy.id);
    setWorkoutDays(selectedSplitCopy.workoutDays);
    setTrainingSplitInputText(selectedSplitCopy.name);


    dialogRef.current.showModal();
  }

  function deleteTrainingSplit(id) {
    setTrainingSplits((prev) => prev.filter((trainingsplit) => trainingsplit.id !== id))
  }

  function handleWeightSet(e, workoutDayId, addedExerciseRowId, setId) {
    const value = (e.target.value);

    const newArray = workoutDays.map((workoutday) => {
      if (workoutday.id !== workoutDayId) return workoutday;

      const newExerciseArray = workoutday.exercises.map((exercise) => {
        if (exercise.rowId !== addedExerciseRowId) return exercise;

        const newSetArray = exercise.sets.map((set) => {
          if (set.id !== setId) return set;

          return {
            ...set,
            weight: value
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

  function handleRepsSet(e, workoutDayId, addedExerciseRowId, setId) {
    const value = (e.target.value);

    const newArray = workoutDays.map((workoutday) => {
      if (workoutday.id !== workoutDayId) return workoutday;

      const newExerciseArray = workoutday.exercises.map((exercise) => {
        if (exercise.rowId !== addedExerciseRowId) return exercise;

        const newSetArray = exercise.sets.map((set) => {
          if (set.id !== setId) return set;

          return {
            ...set,
            reps: value
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
          />

        <section className={styles["content-main"]}>

          <TrainingSplitItem trainingSplits={trainingSplits.map((trainingsplit) => ({ name: trainingsplit.name, id: trainingsplit.id }))} editTrainingSplit={editTrainingSplit} deleteTrainingSplit={deleteTrainingSplit} />

        </section>

        <div className={styles["add-training-wrapper"]}>
          <button className={styles["add-training-button"]} onClick={openDialog}>Add Training Split</button>
        </div>
      </div>
    </>
  )
}