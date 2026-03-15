import styles from './Sidebar.module.css';
<<<<<<< HEAD
import { NavLink } from 'react-router-dom'; 
=======
>>>>>>> 9577dd63666a96190f6e7dd8020a34f272409909
interface Project { id: string; name: string; color: string; }
interface SidebarProps { projects: Project[]; isOpen: boolean; }
export default function Sidebar({ projects, isOpen }: SidebarProps) {
 return (
 <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
 <h2 className={styles.title}>Mes Projets</h2>
 <ul className={styles.list}>
<<<<<<< HEAD
{projects.map(p => ( 
<li key={p.id}> 
<NavLink 
to={`/projects/${p.id}`} 
className={({ isActive }) => 
`${styles.item} ${isActive ? styles.active : ''}` 
} 
> 
<span className={styles.dot} style={{ background: p.color }} /> 
{p.name} 
</NavLink> 
</li> 
))} 
=======
 {projects.map(p => (
 <li key={p.id} className={styles.item}>
 <span className={styles.dot} style={{ background: p.color }} />
 {p.name}
 </li>
 ))}
>>>>>>> 9577dd63666a96190f6e7dd8020a34f272409909
 </ul>
 </aside>
 );
}