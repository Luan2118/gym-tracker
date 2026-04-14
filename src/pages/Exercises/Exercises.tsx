import styles from './Exercises.module.css'
import { useEffect, useRef, useState } from 'react'

import ExerciseBrowser from './components/ExerciseBrowser'
import SelectedExercisePanel from './components/SelectedExercisePanel';


export default function Exercises() {

  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);

  useEffect(() => {

    function handleResize() {
      setIsMobile(window.innerWidth <= 900);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  function handleSelectExercise(exerciseId: string) {
    setSelectedExerciseId(exerciseId)

    if (isMobile) dialogRef.current?.close();
  }

  const dialogRef = useRef<HTMLDialogElement | null>(null);

  function handleExercisesList() {
    dialogRef.current?.showModal();
  }

  function handleCloseDialog() {
    dialogRef.current?.close();
  }

  return (
    <div className={styles["exercise-page"]}>
      <header>
        <h1>Exercise</h1>
      </header>

      {isMobile ?
        <div className={styles["select-exercise-content-wrapper"]}>
          <div className={styles["select-exercise-wrapper"]}>
            <button onClick={handleExercisesList} className={styles["select-exercise-button"]}>Select Exercise</button>

            <dialog ref={dialogRef} className={styles["dialog-popup"]}>
              <ExerciseBrowser
                isMobile={isMobile}
                handleSelectExercise={handleSelectExercise}
                handleCloseDialog={handleCloseDialog}
              />
            </dialog>
          </div>

          <SelectedExercisePanel
            selectedExerciseId={selectedExerciseId}
          />
        </div>
        :

        <div className={styles["content-wrapper"]}>

          <SelectedExercisePanel
            selectedExerciseId={selectedExerciseId}
          />

          <div className={styles["filter-exercises-wrapper"]}>
            <ExerciseBrowser
              isMobile={isMobile}
              handleSelectExercise={handleSelectExercise}
              handleCloseDialog={handleCloseDialog}
            />
          </div>

        </div>
      }
    </div>
  )
}