import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard/Dashboard'
import Layout from './layout/Layout'
import ActiveWorkout from './pages/ActiveWorkout/ActiveWorkout'
import TrainingSplit from './pages/TrainingSplit/TrainingSplit'
import Exercises from './pages/Exercises/Exercises'
import BodyWeight from './pages/BodyWeight/BodyWeight'
import WorkoutHistory from './pages/WorkoutHistory/WorkoutHistory'
import './App.css'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index  element={<Dashboard />}/>
        <Route path='active-workout' element={<ActiveWorkout />} />
        <Route path='training-split' element={<TrainingSplit />} />
        <Route path='exercises' element={<Exercises/>} />
        <Route path='body-weight' element={<BodyWeight/>} />
        <Route path='workout-history' element={<WorkoutHistory />} />
      </Route>
    </Routes>
  )
}

export default App
