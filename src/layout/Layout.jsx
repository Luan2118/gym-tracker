import { Outlet } from "react-router-dom"
import { useState, useEffect } from "react";
import Sidebar from '../components/Sidebar/Sidebar'
import styles from './Layout.module.css'

export default function Layout() {

  const [trainingSplits, setTrainingSplits] = useState(() => {
      const stored = localStorage.getItem('trainingSplits');
  
      return stored ? JSON.parse(stored) : []
  });

    useEffect(() => {
    localStorage.setItem('trainingSplits', JSON.stringify(trainingSplits));
  }, [trainingSplits])



  const [workoutHistory, setWorkoutHistory] = useState(() => {
    const stored = localStorage.getItem('workoutHistory');

    return stored ? JSON.parse(stored) : [];
  });

   useEffect(() => {
    localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));
  }, [workoutHistory]);


  const [bodyWeights, setBodyWeights] = useState(() => {
    const stored = localStorage.getItem('bodyWeights');

    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('bodyWeights', JSON.stringify(bodyWeights))
  }, [bodyWeights])


  const [isSidebarOpen, setIsSidebarOpen] = useState(false);




  return (
    <div className={styles['layout']}>

      <a className={styles['skip-link']} href="#main">Skip to Content</a>

      <Sidebar 
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      />

      <main id='main' className={styles['main-content']} tabIndex={-1}>
        <Outlet context={{trainingSplits, setTrainingSplits, workoutHistory, setWorkoutHistory, bodyWeights, setBodyWeights}} />
      </main>
    </div>
  )
}