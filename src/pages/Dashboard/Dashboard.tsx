import { Link, useOutletContext } from 'react-router-dom'
import styles from './Dashboard.module.css'
import formatISODate from '../../utils/formatISODate';
import setPastDate from '../../utils/setPastDate';
import { sortByNewest } from '../../utils/sortDate';
import { LayoutContextType, HasDate } from '../../types';

type GetDashboardCardValuesParams = {
  loading: boolean
  error: string | null
  value: string | number
  additionalValue?: string
}


export default function Dashboard() {

  // Body Weight card
  const { bodyWeights, workoutHistory, isBodyWeightsLoading, bodyWeightsError, isWorkoutHistoryLoading, workoutHistoryError } = useOutletContext<LayoutContextType>();

  const sortedBodyWeights = sortByNewest(bodyWeights)

  const latestEntry = sortedBodyWeights[0] ?? null;

  const entryDate = latestEntry ? new Date(latestEntry.date) : null;
  const today = new Date();


  const diffMs = entryDate ? today.getTime() - entryDate.getTime() : null;
  const diffDays = diffMs === null ? null : Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Last Workout card
  const sortedWorkoutHistory = sortByNewest(workoutHistory);

  const lastWorkout = sortedWorkoutHistory[0] ?? null;

  const lastWorkoutDate = lastWorkout ? formatISODate(lastWorkout.date) : '-'

  // This Week workouts count
  const last7Days = new Date(setPastDate(7));
  const thisWeekWorkouts = getLast7DaysEntries(sortedWorkoutHistory);

  const subText =
    thisWeekWorkouts.length === 0 ? 'No workouts yet' :
      thisWeekWorkouts.length === 1 ? 'Needs work' :
        thisWeekWorkouts.length === 2 ? 'Getting there' : 'Good consistency'


  const totalWorkouts = workoutHistory.length;

  const totalWorkoutSubtext =
    totalWorkouts === 0 ? 'Start your first workout'
      : totalWorkouts < 10 ? 'Getting started'
        : totalWorkouts < 25 ? 'Building momentum'
          : totalWorkouts < 50 ? 'Putting in the work'
            : totalWorkouts < 100 ? 'Strong track record'
              : 'Built through consistency';


  // This Week Summary

  // total sets 
  const totalSets = thisWeekWorkouts.reduce((workoutAcc, workout) => {
    const setsInWorkout = workout.exercises.reduce((exAcc, ex) => {
      return exAcc + ex.sets.length
    }, 0)

    return workoutAcc + setsInWorkout
  }, 0)

  // total exercises

  const totalExercises = thisWeekWorkouts.reduce((workoutAcc, workout) => {
    return workoutAcc + workout.exercises.length
  }, 0)

  // total weight ins
  const thisWeekBodyWeight = getLast7DaysEntries(bodyWeights);

  // avg weight
  const totalBodyWeight = thisWeekBodyWeight.reduce((bwAcc, bw) => {
    return bwAcc + bw.bw
  }, 0)


  const avgBodyWeight =
    thisWeekBodyWeight.length > 0
      ? totalBodyWeight / thisWeekBodyWeight.length
      : null;

  //Weight summary
  const previousEntry = sortedBodyWeights[1] ?? null;


  const bwChange = previousEntry ? latestEntry.bw - previousEntry.bw : null;

  // Weigh this week
  const thisWeeksBodyWeight = getLast7DaysEntries(sortedBodyWeights);

  function getLast7DaysEntries<T extends HasDate>(data: T[]): T[] {
    return data.filter((data) => new Date(data.date) > last7Days)
  }


  function getDashboardCardValue({ loading, error, value, additionalValue }: GetDashboardCardValuesParams) {
    return (
      <>
        <p role={loading ? 'status' : error ? 'alert' : undefined}
          className={`${styles['status-message']} ${!loading && !error && styles['overview-card-value']}`}>
          {
            loading ? 'Loading...' :
              error ? 'Unavailable' :
                value
          }
        </p>

        {
          !loading && !error &&
          <div className={styles['overview-card-value-additional']}>
            {additionalValue}
          </div>
        }
      </>
    )
  }

  return (
    <>
      <header>
        <h1>Dashboard</h1>
      </header>

      <div className={styles['main-content-wrapper']}>
        <section className={styles['overview-wrapper']}>
          <h2 className={styles['sr-only']}>Overview</h2>

          {workoutHistoryError || bodyWeightsError ?
            <p role='alert' className={styles['error-message']}>
              <span aria-hidden='true'>&#10071;</span>
              Dashboard data could not be loaded
            </p> : null
          }

          <div className={styles['overview-card-wrapper']}>
            <div className={styles['overview-card']}>
              <div className={styles['overview-card-text']}>Latest Weight:</div>

              {getDashboardCardValue({
                loading: isBodyWeightsLoading,
                error: bodyWeightsError,
                value: latestEntry ? `${latestEntry.bw} kg` : '-',
                additionalValue: diffDays === null ? '-' : `Updated ${diffDays === 0 ? 'today' : diffDays === 1 ? `${diffDays} day ago` : `${diffDays} days ago`}`
              })}

            </div>

            <div className={styles['overview-card']}>
              <div className={styles['overview-card-text']}>Last Workout:</div>

              {getDashboardCardValue({
                loading: isWorkoutHistoryLoading,
                error: workoutHistoryError,
                value: lastWorkout ? `${lastWorkout.workoutDay}` : '-',
                additionalValue: lastWorkoutDate
              })}

            </div>

            <div className={styles['overview-card']}>
              <div className={styles['overview-card-text']}>This Week:</div>
              {getDashboardCardValue({
                loading: isWorkoutHistoryLoading,
                error: workoutHistoryError,
                value: `${thisWeekWorkouts.length} workouts`,
                additionalValue: subText
              })}
            </div>

            <div className={styles['overview-card']}>
              <div className={styles['overview-card-text']}>Total Workouts:</div>
              {getDashboardCardValue({
                loading: isWorkoutHistoryLoading,
                error: workoutHistoryError,
                value: workoutHistory.length,
                additionalValue: totalWorkoutSubtext
              })}
            </div>
          </div>
        </section>

        <div className={styles['panel-content-wrapper']}>
          <section className={styles['panel-wrapper']}>
            <h2 className={styles['panel-title']}>This Week Summary</h2>

            <div className={styles['week-summary-wrapper']}>
              <div className={styles['week-summary-card']}>
                <div className={styles['week-summary-title']}>Total Sets</div>
                {getDashboardCardValue({
                  loading: isWorkoutHistoryLoading,
                  error: workoutHistoryError,
                  value: totalSets
                })}
              </div>

              <div className={styles['week-summary-card']}>
                <div className={styles['week-summary-title']}>Total Exercises</div>
                {getDashboardCardValue({
                  loading: isWorkoutHistoryLoading,
                  error: workoutHistoryError,
                  value: totalExercises
                })}
              </div>

              <div className={styles['week-summary-card']}>
                <div className={styles['week-summary-title']}>Weigh-ins</div>
                {getDashboardCardValue({
                  loading: isBodyWeightsLoading,
                  error: bodyWeightsError,
                  value: thisWeekBodyWeight.length
                })}
              </div>

              <div className={styles['week-summary-card']}>
                <div className={styles['week-summary-title']}>Avg Weight</div>
                {getDashboardCardValue({
                  loading: isBodyWeightsLoading,
                  error: bodyWeightsError,
                  value: avgBodyWeight ? `${avgBodyWeight.toFixed(1)} kg` : '-'
                })}
              </div>
            </div>
          </section>


          <section className={styles['panel-wrapper']}>
            <h2 className={styles['panel-title']}>Quick actions</h2>

            <div className={styles['quick-actions-buttons-wrapper']}>
              <Link to='/active-workout?dialog=open' className={styles['start-workout-button']}>
                <span className={styles['quick-actions-title']}>Start Workout</span>
                <span className={styles['quick-actions-text']}>Begin your workout</span>
              </Link>

              <Link to="/body-weight/?log=true" className={styles['log-body-weight-button']} >
                <span className={styles['quick-actions-title']}>Log Body Weight</span>
                <span className={styles['quick-actions-text']}>Track your latest weigh-in</span>
              </Link>

              <Link to="/training-split?dialog=open" className={styles['add-training-split-button']}>
                <span className={styles['quick-actions-title']}>Add Training Split</span>
                <span className={styles['quick-actions-text']}>Create your training split</span>
              </Link>

              <Link to="/exercises" className={styles['browse-exercises-button']} >
                <span className={styles['quick-actions-title']}>Browse Exercises</span>
                <span className={styles['quick-actions-text']}>Explore your exercise history</span>
              </Link>
            </div>
          </section>

          <section className={styles['panel-wrapper']}>
            <div className={styles['panel-header']}>
              <h2 className={styles['panel-title']}>Workouts This Week</h2>
              <Link to="workout-history" className={styles['view-all-button']}>View All</Link>
            </div>

            <div className={styles['recent-workout-card-wrapper']}>

              {thisWeekWorkouts.map((w) => {
                return (
                  <div className={styles['recent-workout-card']} key={w.id}>
                    <div>
                      <div className={styles['recent-workout-workout-day-title']}>{w.workoutDay}</div>
                      <div className={styles['recent-workout-workout-day-date']}>{formatISODate(w.date)}</div>
                    </div>
                    <div className={styles['recent-workout-workout-day-exercises']}>{w.exercises.reduce((exAcc) => {
                      return exAcc + 1
                    }, 0)} exercises</div>
                  </div>
                )
              })}

            </div>

            {thisWeekWorkouts.length === 0 &&
              <div className={styles['no-workouts-this-week-text']}>No workouts this week</div>
            }
          </section>

          <section className={styles['panel-wrapper']}>
            <div className={styles['panel-header']}>
              <h2 className={styles['panel-title']}>Weight this Week</h2>
              <Link to="/body-weight" className={styles['view-all-button']}>View All</Link>
            </div>

            <div className={styles['weight-this-week-content-wrapper']} >

              <div className={styles['weight-this-week-card-wrapper']}>
                {thisWeeksBodyWeight.map((bw) => {
                  return (
                    <div className={styles['weight-this-week-card']} key={bw.id}>
                      <div className={styles['weight-this-week-date']}>{formatISODate(bw.date)}:</div>
                      <div className={styles['weight-this-week-value']}>{bw.bw} kg</div>
                    </div>
                  )
                })}

                {thisWeeksBodyWeight.length === 0 &&
                  <div className={styles['no-weight-logs-this-week-text']}>No weight logs this week</div>
                }
              </div>

              <div className={styles['weight-this-week-summary']}>
                <div className={styles['weight-summary-current-text']}>
                  Current
                </div>
                <div className={styles['weight-summary-current-weight']}>
                  {latestEntry ? `${latestEntry.bw} kg` : '-'}
                </div>

                <div className={styles['weight-summary-previous-info-wrapper']}>
                  <div className={styles['weight-summary-previous-text']}>Previous</div>
                  <div className={styles['weight-summary-previous-weight']}>{previousEntry ? `${previousEntry.bw} kg` : '-'}</div>
                </div>

                <div className={styles['weight-summary-change-info-wrapper']}>
                  <div className={styles['weight-summary-change-text']}>Change</div>
                  <div className={styles['weight-summary-change-value']}>
                    {bwChange === null ? '-' : `${bwChange > 0 ? `+${bwChange.toFixed(1)}` : bwChange.toFixed(1)} kg`}
                  </div>
                </div>
              </div>
            </div>



          </section>


        </div>
      </div>
    </>
  )
}