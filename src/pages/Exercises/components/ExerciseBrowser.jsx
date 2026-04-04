import styles from './ExerciseBrowser.module.css';
import searchIcon from '../../../assets/searchIcon.png'
import { exercises } from '../../../data/exercises'
import { useState } from 'react';
import closeX from '../../../assets/activeWorkout/x-close.png'
import ExerciseItem from './ExerciseItem';


export default function ExerciseBrowser({ isMobile, handleSelectExercise, handleCloseDialog }) {

  const [searchText, setSearchText] = useState('');
  const [selectedMuscleOption, setSelectedMuscleOption] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [selectedUpperBodyEx, setSelectedUpperBodyEx] = useState(false);
  const [selectedLowerBodyEx, setSelectedLowerBodyEx] = useState(false);


  const muscleGroupList = [];

  exercises.forEach((ex) => {
    if (!muscleGroupList.includes(ex.muscleGroup)) {
      muscleGroupList.push(ex.muscleGroup)
    }
  })

  const equipmentList = [];

  exercises.forEach((ex) => {
    if (!equipmentList.includes(ex.equipment)) {
      equipmentList.push(ex.equipment)
    }
  })

  muscleGroupList.includes

  const filteredExercises =
    searchText ? exercises.filter((ex) => ex.name.toLowerCase().includes(searchText)) :
      selectedMuscleOption ? exercises.filter((ex) => {
        if (selectedMuscleOption.toLocaleLowerCase() === 'all muscles') {
          return ex;
        } else {
          return ex.muscleGroup === selectedMuscleOption
        }
      }) :
        selectedEquipment ? exercises.filter((ex) => {
          if (selectedEquipment.toLocaleLowerCase() === 'all equipment') {
            return ex;
          } else {
            return ex.equipment === selectedEquipment
          }
        }) :
          selectedUpperBodyEx ? exercises.filter((ex) => ex.bodyRegion === 'upper') :
            selectedLowerBodyEx ? exercises.filter((ex) => ex.bodyRegion === 'lower')
              :
              exercises


  return (
    <>
      <section className={isMobile ? styles["dialog-input-wrapper"] : styles["filter-input-wrapper"]}>
        {isMobile ?
          <div className={styles["select-exercise-title-wrapper"]}>
            <h2 className={styles["select-exercise-title"]}>Select Exercise</h2>
            <button className={styles["close-dialog-button"]} onClick={handleCloseDialog}>
              <img src={closeX} aria-label='Close dialog' className={styles["close-dialog-img"]} />
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
          <button className={selectedUpperBodyEx ? styles["clicked-filter-button"] : styles["upper-body-exercises-button"]} onClick={() => setSelectedUpperBodyEx((prev) => !prev)}>Upper Body Exercises</button>
          <button className={selectedLowerBodyEx ? styles["clicked-filter-button"] : styles["lower-body-exercises-button"]} onClick={() => setSelectedLowerBodyEx((prev) => !prev)}>Lower Body Exercises</button>
        </div>

      </section>
      <section aria-label='Exercise List' className={isMobile ? styles["dialog-exercise-list-wrapper"] : styles["exercise-list-wrapper"]}>
        <ExerciseItem filteredExercises={filteredExercises} handleSelectExercise={handleSelectExercise} />
      </section>
    </>
  )
}