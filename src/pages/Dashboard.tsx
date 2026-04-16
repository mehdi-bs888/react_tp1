import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { logout } from '../features/auth/authSlice';
import useProjects from '../hooks/useProjects';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import ProjectForm from '../components/ProjectForm';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const userName = useSelector((state: RootState) => state.auth.user?.name);

  const { projects, columns, loading, error, addProject, renameProject, deleteProject } =
    useProjects();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<{
    id: string;
    name: string;
    color: string;
  } | null>(null);

  if (loading) return <div className={styles.loading}>Chargement...</div>;

  return (
    <div className={styles.layout}>
      <Header
        title="TaskFlow"
        onMenuClick={() => setSidebarOpen((p) => !p)}
        userName={userName}
        onLogout={() => dispatch(logout())}
      />

      <div className={styles.body}>
        <Sidebar projects={projects} isOpen={sidebarOpen} />

        <div className={styles.content}>
          <div className={styles.toolbar}>
            {!showForm ? (
              <button
                className={styles.addBtn}
                onClick={() => {
                  setEditingProject(null);
                  setShowForm(true);
                }}
              >
                + Nouveau projet
              </button>
            ) : (
              <ProjectForm
                submitLabel="Creer"
                onSubmit={async (name, color) => {
                  await addProject(name, color);
                  setShowForm(false);
                }}
                onCancel={() => setShowForm(false)}
              />
            )}
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <section className={styles.projectManager}>
            <h3 className={styles.projectManagerTitle}>Gerer les projets</h3>

            {editingProject && (
              <ProjectForm
                initialName={editingProject.name}
                initialColor={editingProject.color}
                submitLabel="Enregistrer"
                onSubmit={async (name) => {
                  await renameProject(editingProject.id, name);
                  setEditingProject(null);
                }}
                onCancel={() => setEditingProject(null)}
              />
            )}

            <ul className={styles.projectList}>
              {projects.map((project) => (
                <li key={project.id} className={styles.projectItem}>
                  <div className={styles.projectInfo}>
                    <span className={styles.projectDot} style={{ background: project.color }} />
                    <span>{project.name}</span>
                  </div>

                  <div className={styles.projectActions}>
                    <button
                      type="button"
                      className={styles.editBtn}
                      onClick={() => {
                        setShowForm(false);
                        setEditingProject(project);
                      }}
                    >
                      Renommer
                    </button>

                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={async () => {
                        const confirmed = window.confirm(`Supprimer le projet "${project.name}" ?`);
                        if (!confirmed) return;

                        await deleteProject(project.id);
                        if (editingProject?.id === project.id) {
                          setEditingProject(null);
                        }
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <MainContent columns={columns} />
        </div>
      </div>
    </div>
  );
}