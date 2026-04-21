import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <section className={styles['not-found']}>
      <p className={styles['not-found-code']}>404</p>
      <h1 className={styles['not-found-title']}>Page not found</h1>
      <p className={styles['not-found-text']}>
        The page you are trying to visit does not exist.
      </p>

    </section>
  );
}