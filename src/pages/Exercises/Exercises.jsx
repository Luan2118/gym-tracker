import styles from './Exercises.module.css'
import { useEffect, useRef, useState } from 'react'

import ExerciseBrowser from './components/ExerciseBrowser'
import SelectedExercisePanel from './components/SelectedExercisePanel';


export default function Exercises() {

  const [selectedExerciseId, setSelectedExerciseId] = useState('');

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

  console.log(isMobile)

  function handleSelectExercise(exerciseId) {
    setSelectedExerciseId(exerciseId)
    
    if (isMobile) dialogRef.current.close();
  }

  const dialogRef = useRef(null);

  function handleExercisesList() {
    dialogRef.current.showModal();
  }

  function handleCloseDialog() {
    dialogRef.current.close();
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
            isMobile={isMobile}
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
              handleSelectExercise={handleSelectExercise}
            />
          </div>

        </div>
      }
    </div>
  )
}