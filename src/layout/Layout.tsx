import { Outlet } from "react-router-dom"
import { useState, useEffect } from "react";
import Sidebar from '../components/Sidebar/Sidebar'
import styles from './Layout.module.css'
import { TrainingSplit, WorkoutHistory, BodyWeight, LayoutContextType } from "../types";
import { readStorage, writeStorage } from "../utils/localStorage";
import { getBodyWeights } from "../api/bodyWeightsApi";
import { getTrainingSplits } from "../api/trainingSplitsApi";

export default function Layout() {

  const [trainingSplits, setTrainingSplits] = useState<TrainingSplit[]>([]);
  const [isTrainingSplitsLoading, setIsTrainingSplitsLoading] = useState(true);
  const [trainingSplitsError, setTrainingSplitsError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTrainingSplits() {
      try {
        setIsTrainingSplitsLoading(true);
        setTrainingSplitsError(null);

        const rows = await getTrainingSplits();

        setTrainingSplits(rows)
      } catch (error) {
        console.error(error)
        setTrainingSplitsError('Failed to load training splits.')
      } finally {
        setIsTrainingSplitsLoading(false)
      }
    }

    loadTrainingSplits();
  }, [])



  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory[]>(() => {
    return readStorage<WorkoutHistory>('workoutHistory', []);
  });

  useEffect(() => {
    writeStorage('workoutHistory', workoutHistory);
  }, [workoutHistory]);


  const [bodyWeights, setBodyWeights] = useState<BodyWeight[]>([]);
  const [isBodyWeightsLoading, setIsBodyWeightsLoading] = useState(true);
  const [bodyWeightsError, setBodyWeightsError] = useState<string | null>(null);

  useEffect(() => {
    async function loadBodyWeights() {
      try {
        setIsBodyWeightsLoading(true);
        setBodyWeightsError(null);

        const rows = await getBodyWeights();
        setBodyWeights(rows)

      } catch (error) {
        setBodyWeightsError('Failed to load body weights.')
        console.error(error)
      } finally {
        setIsBodyWeightsLoading(false);
      }
    }

    loadBodyWeights();
  }, [])

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const layoutContext: LayoutContextType = {
    trainingSplits,
    setTrainingSplits,
    workoutHistory,
    setWorkoutHistory,
    bodyWeights,
    setBodyWeights,
    isBodyWeightsLoading,
    bodyWeightsError,
    isTrainingSplitsLoading,
    trainingSplitsError
  };

  return (
    <div className={styles['layout']}>

      <a className={styles['skip-link']} href="#main">Skip to Content</a>

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main id='main' className={styles['main-content']} tabIndex={-1}>
        <Outlet context={layoutContext} />
      </main>
    </div>
  )
}



