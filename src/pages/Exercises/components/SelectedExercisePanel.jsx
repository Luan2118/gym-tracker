import styles from './SelectedExercisePanel.module.css'
import { exercises, EXERCISE_BASE_PREFIX } from '../../../data/exercises'
import setPastDate from '../../../utils/setPastDate'
import formatISODate from '../../../utils/formatISODate'
import { useOutletContext } from 'react-router-dom'
import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip } from 'chart.js';
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip);
import {sortByNewest} from '../../../utils/sortDate';

export default function SelectedExercisePanel({ selectedExerciseId, }) {

  const { workoutHistory } = useOutletContext();

  const [clickedExImg, setClickedExImg] = useState(false);
  const [progressClicked, setProgressClicked] = useState(true);
  const [chartFilter, setChartFilter] = useState('last30');


  const selectedExercise = selectedExerciseId ? exercises.find((ex) => ex.id === selectedExerciseId) : '';

  const primaryMuscle = selectedExercise ? selectedExercise.primaryMuscles.map((muscle) => {
    return muscle.charAt(0).toUpperCase() + muscle.slice(1)
  }) : '';

  const secondaryMuscles = selectedExercise ?
    selectedExercise.secondaryMuscles.map((muscle) => {
      return muscle.charAt(0).toUpperCase() + muscle.slice(1)
    }) : ''


  const filteredWorkouts = [...workoutHistory].sort((a, b) => new Date(a.date) - new Date(b.date)).filter(workout =>
    workout.exercises.some(ex => ex.exerciseId === selectedExerciseId)
  );

  const filteredWorkoutsData =
    chartFilter === 'last30' ? filteredWorkouts.filter((w) => new Date(w.date) >= new Date(setPastDate(30))) :
      chartFilter === 'last60' ? filteredWorkouts.filter((w) => new Date(w.date) >= new Date(setPastDate(60))) :
        chartFilter === 'last90' ? filteredWorkouts.filter((w) => new Date(w.date) >= new Date(setPastDate(90))) : filteredWorkouts

  const data = {
    labels: filteredWorkoutsData.map((workout) =>
      formatISODate(workout.date).slice(0, 5)
    ),
    datasets: [
      {
        label: 'Heaviest Weight',
        data: filteredWorkoutsData.map((workout) => {
          const exercise = workout.exercises.find(
            (ex) => ex.exerciseId === selectedExerciseId
          );

          return Math.max(...exercise.sets.map((set) => set.weight));
        }),
        borderColor: 'rgb(200, 200, 200)',
        borderWidth: 3,
        pointBackgroundColor: 'rgb(230, 230, 230)',
        pointBorderColor: 'rgb(85, 85, 85)',
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Heaviest Weight Progress',
        color: 'rgb(238, 238, 238)',
        font: {
          size: 20,
          weight: '600',
        },
        padding: {
          bottom: 18,
        },
      },
      tooltip: {
        displayColors: false,
        backgroundColor: 'rgb(95, 95, 95)',
        titleColor: 'rgb(245, 245, 245)',
        bodyColor: 'rgb(245, 245, 245)',
        bodyFont: {
          weight: 'bold',
        },
        callbacks: {
          label: (context) => {
            return `Weight: ${context.formattedValue} kg`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'rgb(200, 200, 200)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.08)',
        },
        border: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: 'rgb(200, 200, 200)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.08)',
        },
        border: {
          display: false,
        },
      },
    },
  };

  function handleProgressBtn() {
    setProgressClicked(true);
  }

  function handleHistoryBtn() {
    setProgressClicked(false);
  }

  const bestSets = filteredWorkouts.map((w) => {
    const exercises = w.exercises.find((ex) => ex.exerciseId === selectedExerciseId)

    const result = exercises.sets.reduce((best, current) => {
      if (current.weight > best.weight) return current;
      if (current.weight === best.weight && current.reps > best.reps) return current;
      return best;
    }, exercises.sets[0]);

    return result
  })

  const latestBestSet = bestSets.at(-1);

  const firstLoggedSet = filteredWorkouts[0]?.exercises.find((ex) => ex.exerciseId === selectedExerciseId).sets[0]

  const latestSet = sortByNewest(filteredWorkouts)[0]?.exercises.find((ex) => ex.exerciseId === selectedExerciseId).sets[0]

  return (
    <div className={styles["main-content-wrapper"]}>
      {selectedExerciseId ?
        <>
          <div className={styles["selected-exercise-wrapper"]}>
            <div className={styles["selected-exercise-name"]}>{selectedExercise.name}
            </div>

            <div className={styles["selected-exercise-content"]}>
              <div className={styles["selected-exercise-primary-secondary-wrapper"]}>
                <div className={styles["selected-exercise-primary-muscle-wrapper"]}>
                  <span className={styles["selected-exercise-primary-muscle-label"]}>Primary Muscle: </span>
                  <span className={styles["selected-exercise-primary-muscle-value"]}>{primaryMuscle}</span>
                </div>
                {secondaryMuscles.length > 0 ?
                  <div className={styles["selected-exercise-secondary-muscle-wrapper"]}>
                    <span className={styles["selected-exercise-secondary-muscle-label"]}>Secondary Muscles:{' '}</span>
                    <span className={styles["selected-exercise-secondary-muscle-value"]}>{secondaryMuscles.join(', ')}</span>
                  </div> :
                  null
                }
              </div>

              <button onClick={() => setClickedExImg((prev) => !prev)} className={styles["selected-exercise-image-button"]}>
                <img src={`${EXERCISE_BASE_PREFIX}${clickedExImg ? selectedExercise.images[0] : selectedExercise.images[1]}`} alt={selectedExercise.name} className={styles["selected-exercise-image"]} />
              </button>
            </div>
          </div>

          <div className={styles["selected-exercise-statistics-wrapper"]}>
            <div>
              <button className={progressClicked ? styles["clicked-statistics-button"] : styles["selected-exercise-statistics-progress-button"]} onClick={handleProgressBtn}>Progress</button>
              <button className={!progressClicked ? styles["clicked-statistics-button"] : styles["selected-exercise-statistics-history-button"]} onClick={handleHistoryBtn}>History</button>
            </div>

            <hr className={styles["selected-exercise-statistics-hr"]} />

            {progressClicked ?
              <>

                <div className={styles["selected-exercise-buttons-wrapper"]}>
                  <button className={styles["selected-exercise-last-30-btn"]} onClick={() => setChartFilter('last30')}>Last 30 Days</button>
                  <button className={styles["selected-exercise-last-60-btn"]} onClick={() => setChartFilter('last60')}>Last 60 Days</button>
                  <button className={styles["selected-exercise-last-90-btn"]} onClick={() => setChartFilter('last90')}>Last 90 Days</button>
                  <button className={styles["selected-exercise-all-btn"]} onClick={() => setChartFilter('all')}>All</button>
                </div>
                <div className={styles["heaviest-weight-chart-wrapper"]}>
                  <Line
                    data={data} options={options}
                  />
                </div>
              </> :
              <div className={styles["selected-exercise-history-wrapper"]}>
                {latestSet && (
                  <div className={styles["history-stat-card"]}>
                    <p className={styles["history-stat-label"]}>Latest Set</p>
                    <p className={styles["history-stat-value"]}>
                      {latestSet.weight} x {latestSet.reps}
                    </p>
                  </div>
                )}

                {latestBestSet && (
                  <div className={styles["history-stat-card"]}>
                    <p className={styles["history-stat-label"]}>Best Set</p>
                    <p className={styles["history-stat-value"]}>
                      {latestBestSet.weight} x {latestBestSet.reps}
                    </p>
                  </div>
                )}

                {firstLoggedSet && (
                  <div className={styles["history-stat-card"]}>
                    <p className={styles["history-stat-label"]}>First Set</p>
                    <p className={styles["history-stat-value"]}>
                      {firstLoggedSet.weight} x {firstLoggedSet.reps}
                    </p>
                  </div>
                )}

                {filteredWorkouts.length > 0 &&
                  <div className={styles["history-stat-card"]}>
                    <p className={styles["history-stat-label"]}>Workouts</p>
                    <p className={styles["history-stat-value"]}>{filteredWorkouts?.length}</p>
                  </div>
                }
              </div>
            }

          </div>
        </>
        :
        null}

    </div>
  )
}