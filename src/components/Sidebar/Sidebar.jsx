import { Link, useOutletContext } from 'react-router-dom'
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
import { useRef } from 'react'


export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }) {

  const sidebarRef = useRef(null);

  function handleMenuButton() {
    setIsSidebarOpen((prev) => !prev)
  }

  console.log(isSidebarOpen)

  function handleCloseMenu() {
    setIsSidebarOpen((prev) => !prev)
  }

  return (
    <>
      <div className={styles['menu-button-wrapper']}>
        <button className={styles['menu-button']} onClick={handleMenuButton}>
          <img src={menuIcon} alt="Menu" className={styles['menu-button-icon']} />
        </button>
      </div>

      <aside className={isSidebarOpen ? styles['sidebar-is-open'] : styles['sidebar']}>

        <header className={styles['title-header']}>
          <img className={styles['title-img']} src={title} alt='' aria-hidden="true" />
          <div className={styles['title']}>Gym Tracker</div>

          <button className={styles['close-menu-btn']} onClick={handleCloseMenu}>
            <img src={closeIcon} alt="Close Menu" className={styles['close-menu-icon']} />
          </button>
        </header>
        <hr aria-hidden="true" className={styles['hr']}/>

        <nav>
          <ul className={styles['sidebar-nav-link-wrapper']}>
            <li>
              <Link to='/' className={styles['sidebar-nav-link']}>
                <img src={dashboard} alt='' aria-hidden="true" />
                <div className={styles['sidebar-nav-link-title']}>DashBoard</div>
              </Link>
            </li>

            <li>
              <Link to='/active-workout' className={styles['sidebar-nav-link']}>
                <img src={active} alt='' aria-hidden="true" />
                <div className={styles['sidebar-nav-link-title']}>Active Workout</div>
              </Link>
            </li>

            <li>
              <Link to='/workout-history' className={styles['sidebar-nav-link']}>
                <img src={history} alt='' aria-hidden="true" />
                <div className={styles['sidebar-nav-link-title']}>Workout History</div>
              </Link>
            </li>

            <li>
              <Link className={styles['sidebar-nav-link']} to="/exercises">
                <img src={exercisesPage} alt='' aria-hidden="true" />
                <div className={styles['sidebar-nav-link-title']}>Exercises</div>
              </Link>
            </li>

            <li>
              <Link className={styles['sidebar-nav-link']} to="/training-split">
                <img src={trainingSplit} alt='' aria-hidden="true" />
                <div className={styles['sidebar-nav-link-title']}>Training Split</div>
              </Link>
            </li>

            <li>
              <Link className={styles['sidebar-nav-link']} to="/body-weight">
                <img src={bodyweight} alt='' aria-hidden="true" />
                <div className={styles['sidebar-nav-link-title']}>Body Weight</div>
              </Link>
            </li>

          </ul>
        </nav>
      </aside>
    </>

  )
}