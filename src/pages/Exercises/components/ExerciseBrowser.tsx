import styles from './ExerciseBrowser.module.css';
import searchIcon from '../../../assets/searchIcon.png'
import { exercises } from '../../../data/exercises'
import { useState } from 'react';
import closeX from '../../../assets/activeWorkout/x-close.png'
import ExerciseItem from './ExerciseItem';

type ExerciseBrowserProps = {
  isMobile: boolean
  handleSelectExercise: (exerciseId: string) => void
  handleCloseDialog: () => void
}

type Exercise = {
  id: string;
  name: string;
  video: string;
  images: string[];
  muscleGroup: string;
  bodyRegion: string;
  equipment: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
}



export default function ExerciseBrowser({ isMobile, handleSelectExercise, handleCloseDialog }: ExerciseBrowserProps) {

  const [searchText, setSearchText] = useState('');
  const [selectedMuscleOption, setSelectedMuscleOption] = useState('all muscles');
  const [selectedEquipment, setSelectedEquipment] = useState('all equipment');
  const [selectedUpperBodyEx, setSelectedUpperBodyEx] = useState(false);
  const [selectedLowerBodyEx, setSelectedLowerBodyEx] = useState(false);

  const muscleGroupList: string[] = [];

  
  exercises.forEach((ex) => {
    if (!muscleGroupList.includes(ex.muscleGroup)) {
      muscleGroupList.push(ex.muscleGroup)
    }
  })
  
  const equipmentList: string[] = [];

  exercises.forEach((ex) => {
    if (!equipmentList.includes(ex.equipment)) {
      equipmentList.push(ex.equipment)
    }
  })

  const filteredExercises =
    exercises.filter((ex) => {

      // upper body filter logic  
      if (selectedUpperBodyEx) {
        return muscleGroupEquipmentFilter(ex, 'upper')
      }

      // lower body filter logic
      if (selectedLowerBodyEx) {
        return muscleGroupEquipmentFilter(ex, 'lower')
      }

      return muscleGroupEquipmentFilter(ex)
    })

  function muscleGroupEquipmentFilter(ex: Exercise, bodyPart?: string) {

    // all muscle group and all equipment
    if (selectedMuscleOption.toLocaleLowerCase() === 'all muscles' && selectedEquipment.toLocaleLowerCase() === 'all equipment') {
      if (bodyPart) {
        return ex.name.toLowerCase().includes(searchText) && ex.bodyRegion === bodyPart
      }

      return ex.name.toLowerCase().includes(searchText)
    }

    // selected muscle group & all equipment
    if (selectedMuscleOption.toLocaleLowerCase() !== 'all muscles' && selectedEquipment.toLocaleLowerCase() === 'all equipment') {
      if (bodyPart) {
        return ex.muscleGroup === selectedMuscleOption && ex.name.toLowerCase().includes(searchText) && ex.bodyRegion === bodyPart
      }
      return ex.muscleGroup === selectedMuscleOption && ex.name.toLowerCase().includes(searchText)

    }

    // selected equipment & all muscle group
    if (selectedMuscleOption.toLocaleLowerCase() === 'all muscles' && selectedEquipment.toLocaleLowerCase() !== 'all equipment') {
      if (bodyPart) {
        return ex.equipment === selectedEquipment && ex.name.toLowerCase().includes(searchText) && ex.bodyRegion === bodyPart
      }
      return ex.equipment === selectedEquipment && ex.name.toLowerCase().includes(searchText)
    }

    // selected equipment & selected muscle group
    if (selectedMuscleOption.toLocaleLowerCase() !== 'all muscles' && selectedEquipment.toLocaleLowerCase() !== 'all equipment') {
      if (bodyPart) {
        return ex.muscleGroup === selectedMuscleOption && ex.name.toLowerCase().includes(searchText) && ex.equipment === selectedEquipment && ex.bodyRegion === bodyPart
      }
        return ex.muscleGroup === selectedMuscleOption && ex.name.toLowerCase().includes(searchText) && ex.equipment === selectedEquipment
    }

    if (bodyPart) return ex.bodyRegion === bodyPart

  }

  return (
    <>
      <section className={isMobile ? styles["dialog-input-wrapper"] : styles["filter-input-wrapper"]}>
        {isMobile ?
          <div className={styles["select-exercise-title-wrapper"]}>
            <h2 className={styles["select-exercise-title"]}>Select Exercise</h2>
            <button type="button" aria-label='Close dialog' className={styles["close-dialog-button"]} onClick={handleCloseDialog}>
              <img src={closeX} aria-label='Close dialog' className={styles["close-dialog-img"]} alt=''/>
            </button>
          </div> :
          ''
        }
        <div className={styles["filter-search-wrapper"]}>
          <label htmlFor='search-exercise' />
          <img src={searchIcon} alt="" className={styles["search-icon"]} />
          <input type="text" id="search-exercise" className={styles["search-exercise-input"]} onChange={(e) => setSearchText(e.target.value.toLowerCase())} value={searchText} placeholder='Search...' />

        </div>


        <label htmlFor="exercise-category" className={styles["sr-only"]}>Category</label>
        <select id="exercise-category" className={styles["exercise-category-select"]} onChange={(e) => setSelectedMuscleOption(e.target.value)} value={selectedMuscleOption}>
          <option value="All Muscles">All Muscles</option>
          {
            muscleGroupList.map((muscleGroup) => {
              return (
                <option value={muscleGroup} key={muscleGroup}>
                  {muscleGroup.charAt(0).toUpperCase() + muscleGroup.slice(1)}
                </option>
              )
            })
          }
        </select>

        <label htmlFor="equipment-category" className={styles["sr-only"]}>Category</label>
        <select id="equipment-category" className={styles["equipment-category-select"]} onChange={(e) => setSelectedEquipment(e.target.value)} value={selectedEquipment}>
          <option value="All Equipment">All Equipment</option>
          {
            equipmentList.map((equipment) => {
              return (
                <option value={equipment} key={equipment}>
                  {equipment.charAt(0).toUpperCase() + equipment.slice(1)}
                </option>
              )
            })
          }
        </select>

        <div className={styles["filter-upper-lower-wrapper"]}>
          <button type="button" className={selectedUpperBodyEx ? styles["clicked-filter-button"] : styles["upper-body-exercises-button"]} onClick={() => setSelectedUpperBodyEx((prev) => !prev)} disabled={selectedLowerBodyEx}>Upper Body Exercises</button>
          <button type="button" className={selectedLowerBodyEx ? styles["clicked-filter-button"] : styles["lower-body-exercises-button"]} onClick={() => setSelectedLowerBodyEx((prev) => !prev)} disabled={selectedUpperBodyEx}>Lower Body Exercises</button>
        </div>

      </section>
      <section aria-label='Exercise List' className={isMobile ? styles["dialog-exercise-list-wrapper"] : styles["exercise-list-wrapper"]}>
        <ExerciseItem filteredExercises={filteredExercises} handleSelectExercise={handleSelectExercise} />
      </section>
    </>
  )
}