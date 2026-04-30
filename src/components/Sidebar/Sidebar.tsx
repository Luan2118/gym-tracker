import { NavLink } from 'react-router-dom'
import dashboard from '../../assets/dashboard.png'
import title from '../../assets/title.png'
import active from '../../assets/active-workout.png'
import history from '../../assets/history.png'
import exercisesPage from '../../assets/exercises.png'
import bodyweight from '../../assets/bodyweight.png'
import trainingSplit from '../../assets/trainingSplit.png'
import menuIcon from '../../assets/menu-icon.png'
import closeIcon from '../../assets/x-close.png'
import styles from './Sidebar.module.css'

type SidebarProps = {
  isSidebarOpen: boolean
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {

  function handleOpenSidebar() {
    setIsSidebarOpen(true)
  }

  function handleCloseSidebar() {
    setIsSidebarOpen(false);
  }


  return (
    <>
      <div className={styles['menu-button-wrapper']}>
        <button aria-label='Open Menu' type="button" aria-controls='sidebar' aria-expanded={isSidebarOpen} className={styles['menu-button']} onClick={handleOpenSidebar}>
          <img src={menuIcon} alt="" className={styles['menu-button-icon']} />
        </button>
      </div>

      

      <aside id='sidebar' className={isSidebarOpen ? styles['sidebar-is-open'] : styles['sidebar']}>

        <header className={styles['title-header']}>
          <img className={styles['title-img']} src={title} alt='' aria-hidden="true" />
          <h2 className={styles['title']}>Gym Tracker</h2>

          <button type="button" aria-label='Close menu' aria-controls='sidebar' aria-expanded={isSidebarOpen} className={styles['close-menu-btn']} onClick={handleCloseSidebar}>
            <img src={closeIcon} alt="" className={styles['close-menu-icon']} />
          </button>
        </header>
        <hr aria-hidden="true" className={styles['hr']} />

        <nav aria-label='Primary navigation'>
          <ul className={styles['sidebar-nav-link-wrapper']}>
            <li>
              <NavLink to='/' end className={( {isActive }) => 
                isActive ? styles['sidebar-nav-link-active'] : styles['sidebar-nav-link']
              } onClick={handleCloseSidebar}>
                <img className={styles['sidebar-nav-link-img']} src={dashboard} alt='' aria-hidden="true" />
                <div className={styles['sidebar-nav-link-title']}>DashBoard</div>
              </NavLink>
            </li>

            <li>
              <NavLink to='/active-workout' className={( {isActive }) => 
                isActive ? styles['sidebar-nav-link-active'] : styles['sidebar-nav-link']
              } onClick={handleCloseSidebar}>
                <img className={styles['sidebar-nav-link-img']} src={active} alt='' aria-hidden="true" />
                <div className={styles['sidebar-nav-link-title']}>Active Workout</div>
              </NavLink>
            </li>

            <li>
              <NavLink to='/workout-history' className={( {isActive }) => 
                isActive ? styles['sidebar-nav-link-active'] : styles['sidebar-nav-link']
              } onClick={handleCloseSidebar}>
                <img className={styles['sidebar-nav-link-img']} src={history} alt='' aria-hidden="true" />
                <div className={styles['sidebar-nav-link-title']}>Workout History</div>
              </NavLink>
            </li>

            <li>
              <NavLink className={( {isActive }) => 
                isActive ? styles['sidebar-nav-link-active'] : styles['sidebar-nav-link']
              } to="/exercises" onClick={handleCloseSidebar}>
                <img className={styles['sidebar-nav-link-img']} src={exercisesPage} alt='' aria-hidden="true" />
                <div className={styles['sidebar-nav-link-title']}>Exercises</div>
              </NavLink>
            </li>

            <li>
              <NavLink className={( {isActive }) => 
                isActive ? styles['sidebar-nav-link-active'] : styles['sidebar-nav-link']
              } to="/training-split" onClick={handleCloseSidebar}>
                <img className={styles['sidebar-nav-link-img']} src={trainingSplit} alt='' aria-hidden="true" />
                <div className={styles['sidebar-nav-link-title']}>Training Split</div>
              </NavLink>
            </li>

            <li>
              <NavLink className={( {isActive }) => 
                isActive ? styles['sidebar-nav-link-active'] : styles['sidebar-nav-link']
              } to="/body-weight" onClick={handleCloseSidebar}>
                <img className={styles['sidebar-nav-link-img']} src={bodyweight} alt='' aria-hidden="true" />
                <div className={styles['sidebar-nav-link-title']}>Body Weight</div>
              </NavLink>
            </li>

          </ul>
        </nav>
      </aside>
    </>

  )
}