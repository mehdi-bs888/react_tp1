import styles from './Header.module.css';
<<<<<<< HEAD
// Modifier l'interface HeaderProps :
interface HeaderProps {
 title: string;
 onMenuClick: () => void;
 userName?: string;
 onLogout?: () => void;
}
export default function Header({ title, onMenuClick, userName, onLogout }: HeaderProps) {
=======
interface HeaderProps { title: string; onMenuClick: () => void; }
export default function Header({ title, onMenuClick }: HeaderProps) {
>>>>>>> 9577dd63666a96190f6e7dd8020a34f272409909
 return (
 <header className={styles.header}>
 <div className={styles.left}>
 <button className={styles.menuBtn} onClick={onMenuClick}>☰</button>
 <h1 className={styles.logo}>{title}</h1>
 </div>
<<<<<<< HEAD
 <div className={styles.right}>
 {userName && <span className={styles.userName}>{userName}</span>}
 {onLogout && (
 <button className={styles.logoutBtn} onClick={onLogout}>
 Déconnexion
 </button>
 )}
 </div>
 </header>
 );
}

=======
 <span className={styles.avatar}>JD</span>
 </header>
 );
}
>>>>>>> 9577dd63666a96190f6e7dd8020a34f272409909
