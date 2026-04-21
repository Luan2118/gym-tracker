import { Outlet } from "react-router-dom"
import { useState, useEffect } from "react";
import Sidebar from '../components/Sidebar/Sidebar'
import styles from './Layout.module.css'
import { TrainingSplit, WorkoutHistory, BodyWeight, LayoutContextType } from "../types";
import { readStorage, writeStorage } from "../utils/localStorage";

export default function Layout() {

  const [trainingSplits, setTrainingSplits] = useState<TrainingSplit[]>(() => {
    return readStorage<TrainingSplit>('trainingSplits', []);
  });

  useEffect(() => {
    writeStorage('trainingSplits', trainingSplits);
  }, [trainingSplits])



  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistory[]>(() => {
    return readStorage<WorkoutHistory>('workoutHistory', []);
  });

  useEffect(() => {
    writeStorage('workoutHistory', workoutHistory);
  }, [workoutHistory]);


  const [bodyWeights, setBodyWeights] = useState<BodyWeight[]>(() => {
    return readStorage<BodyWeight>('bodyWeights', []);
  });

  useEffect(() => {
    writeStorage('bodyWeights', bodyWeights);
  }, [bodyWeights])

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const layoutContext: LayoutContextType = {
    trainingSplits,
    setTrainingSplits,
    workoutHistory,
    setWorkoutHistory,
    bodyWeights,
    setBodyWeights,
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



