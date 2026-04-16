import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { logout } from '../features/auth/authSlice';
import styles from './Header.module.css';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
  userName?: string;
  onLogout?: () => void;
}

export default function Header({ title, onMenuClick, userName, onLogout }: HeaderProps) {
  const dispatch = useDispatch<AppDispatch>();
  const storeUserName = useSelector((state: RootState) => state.auth.user?.name);
  const resolvedUserName = userName ?? storeUserName;

  function handleLogout() {
    if (onLogout) {
      onLogout();
      return;
    }
    dispatch(logout());
  }

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuClick}>
          ☰
        </button>
        <h1 className={styles.logo}>{title}</h1>
      </div>

      <div className={styles.right}>
        {resolvedUserName && <span className={styles.userName}>{resolvedUserName}</span>}
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Déconnexion
        </button>
      </div>
    </header>
  );
}


