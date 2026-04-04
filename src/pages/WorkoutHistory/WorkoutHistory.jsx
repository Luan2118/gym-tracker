import styles from './WorkoutHistory.module.css'
import { useOutletContext } from 'react-router-dom'
import WorkoutHistoryItem from './components/WorkoutHistoryItem';
import { useState } from 'react';
import sortByNewest from '../../utils/sortByNewest';
import sortByOldest from '../../utils/sortByOldest';
import getPaginationData from '../../utils/getPaginationData';

export default function WorkoutHistory() {

  const { workoutHistory, setWorkoutHistory } = useOutletContext();
  const [selectedSplitName, setSelectedSplitName] = useState('');
  const [selectedWorkoutDayName, setSelectedWorkoutDayName] = useState('');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);


  // visible workout history data
  let filteredWorkoutHistory = workoutHistory.filter((w) => {

    if (selectedSplitName && selectedWorkoutDayName) {
      if (w.workoutDay !== selectedWorkoutDayName) return;
      if (w.trainingSplitName !== selectedSplitName) return;

      return w;
    } else if (selectedSplitName) {
      // if (w.workoutDay !== selectedWorkoutDayName) return;
      return w.trainingSplitName === selectedSplitName
    } else if (selectedWorkoutDayName) {
      // if (w.trainingSplitName !== selectedSplitName) return
      return (w.workoutDay === selectedWorkoutDayName)
    } else return w;

  })

  if (selectedSort === 'newest') filteredWorkoutHistory = sortByNewest(filteredWorkoutHistory)
  else filteredWorkoutHistory = sortByOldest(filteredWorkoutHistory)

  // pagination
  const itemsPerPage = 5;
  const {pageNumbers, paginatedData, totalPages} = getPaginationData(itemsPerPage, filteredWorkoutHistory, currentPage )


  // options
  const trainingSplitOptions = [];
  workoutHistory.forEach((w) => {
    if (!trainingSplitOptions.some((split) => split.trainingSplitName === w.trainingSplitName)) {
      trainingSplitOptions.push({
        trainingSplitName: w.trainingSplitName,
        id: w.id,
      });
    }
  });

  const workoutDayOptions = [];
  workoutHistory.forEach((w) => {
    if (!workoutDayOptions.some((workout) => workout.workoutDay === w.workoutDay)) {
      workoutDayOptions.push({
        workoutDay: w.workoutDay,
        id: w.id,
      });
    }
  });

  function clearFilters() {
    setSelectedSort('newest')
    setSelectedSplitName('');
    setSelectedWorkoutDayName('');
    setCurrentPage(1);
  }

  function deleteWorkoutHistoryItem(id) {
    setWorkoutHistory((prev) => {
      return prev.filter((workout) => workout.id !== id)
    })
  }
  return (
    <>
      <header>
        <h1>Workout History</h1>
      </header>

      <div className={styles["section-wrapper"]}>
        <div className={styles["filter-wrapper"]}>
          <div className={styles["filter-input-wrapper"]}>
            <label htmlFor="training-split" className={styles["sr-only"]}>Training Split</label>
            <select id="training-split" className={styles["filter-input"]} onChange={(e) => {
              setSelectedSplitName(e.target.value)
              setCurrentPage(1)
            }} value={selectedSplitName}>
              <option value="" disabled>Select Training Split</option>
              {trainingSplitOptions.map((w) => {
                return (
                  <option value={w.trainingSplitName} key={w.id}>{w.trainingSplitName}</option>
                )
              })}
            </select>

            <label htmlFor="workout-day" className={styles["sr-only"]}>Workout Day</label>
            <select id="workout-day" className={styles["filter-input"]} onChange={(e) => {
              setSelectedWorkoutDayName(e.target.value)
              setCurrentPage(1)
            }} value={selectedWorkoutDayName}>
              <option value="" disabled>Select Workout Day</option>
              {workoutDayOptions.map((w) => {
                return (
                  <option value={w.workoutDay} key={w.id}>{w.workoutDay}</option>
                )
              })}
            </select>

            <label htmlFor="sort" className={styles["sr-only"]}>Sort</label>
            <select id="sort" className={styles["filter-input"]} onChange={(e) => {
              setSelectedSort(e.target.value)
              setCurrentPage(1)
            }} value={selectedSort}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>

            <button type='button' onClick={clearFilters} className={styles["clear-button"]}>Clear</button>
          </div>

        </div>

        <div className={styles["content-main"]}>
          {
            filteredWorkoutHistory.length > 0 ?
              <>
                <WorkoutHistoryItem
                  filteredWorkoutHistory={paginatedData}
                  deleteWorkoutHistoryItem={deleteWorkoutHistoryItem}
                />
                <div className={styles["pagination-wrapper"]}>
                  <button type="button" className={styles["pagination-button"]} onClick={() => setCurrentPage((prev) => prev - 1)} disabled={currentPage === 1}>Prev</button>

                  {pageNumbers.map((page) => (
                    <button
                      key={page}
                      type="button"
                      className={
                        currentPage === page
                          ? styles["active-page-button"]
                          : styles["page-button"]
                      }
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}

                  <button type="button" className={styles["pagination-button"]} onClick={() => setCurrentPage((prev) => prev + 1)} disabled={currentPage === totalPages}>Next</button>
                </div>
              </>

              :
              <div>No matched workouts</div>
          }
        </div>
      </div>
    </>
  )
}