import styles from './ExerciseItem.module.css'
import { EXERCISE_BASE_PREFIX } from '../../../data/exercises'
import {ExerciseMetaData} from '../../../types'

type ExerciseItemProps = {
  filteredExercises: ExerciseMetaData[]
  handleSelectExercise: (exerciseId: string) => void
}

export default function ExerciseItem({filteredExercises, handleSelectExercise}: ExerciseItemProps) {
  return (
    <>
      {filteredExercises.map((exercise) => {
        return (
          <button key={exercise.id} className={styles["exercise-item-wrapper"]} onClick={() => (handleSelectExercise(exercise.id))}>
            <img src={`${EXERCISE_BASE_PREFIX}${exercise.images[0]}`} alt='' aria-hidden="true" className={styles["exercise-item-img"]}/>
            <span className={styles["exercise-item-name"]} id="exercise-name">{exercise.name}</span>
          </button>
        )
      })}

      {filteredExercises.length === 0 && <div className={styles["no-exercises-found-text"]} >No exercises found</div>}
    </>
  )
}