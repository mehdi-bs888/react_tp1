import { useState, useEffect } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import api from '../api/axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import ProjectForm from '../components/ProjectForm';
import styles from './Dashboard.module.css';
import axios from 'axios'; 

interface Project {
  id: string;
  name: string;
  color: string;
}

interface Column {
  id: string;
  title: string;
  tasks: string[];
}

export default function Dashboard() {
  const { state: authState, dispatch } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null); 
  const [saving, setSaving] = useState(false); 

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, colRes] = await Promise.all([
          api.get('/projects'),
          api.get('/columns'),
        ]);
        setProjects(projRes.data);
        setColumns(colRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function addProject(name: string, color: string) { 
  setSaving(true); 
  setError(null); 
  try { 
    const { data } = await api.post('/projects', { name, color }); 
    setProjects(prev => [...prev, data]); 
  } catch (err) { 
    if (axios.isAxiosError(err)) { 
      setError(err.response?.data?.message || `Erreur ${err.response?.status}`); 
    } else { 
      setError('Erreur inconnue'); 
    } 
  } finally { 
    setSaving(false); 
  } 
} 
  async function renameProject(id: string, newName: string) {
    if (newName.trim().length === 0) return;
    await api.put(`/projects/${id}`, { name: newName });
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, name: newName } : p
      )
    );
  }

  async function deleteProject(id: string) {
    await api.delete(`/projects/${id}`);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) return <div className={styles.loading}>Chargement...</div>;

  return (
    <div className={styles.layout}>
      <Header
        title="TaskFlow"
        onMenuClick={() => setSidebarOpen((p) => !p)}
        userName={authState.user?.name}
        onLogout={() => dispatch({ type: 'LOGOUT' })}
      />
      <div className={styles.body}>
        <Sidebar projects={projects} isOpen={sidebarOpen} />
        <div className={styles.content}>
          <div className={styles.toolbar}>
  {!showForm ? (
    <button
      className={styles.addBtn}
      disabled={saving}
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
                    <span
                      className={styles.projectDot}
                      style={{ background: project.color }}
                    />
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
                        const confirmed = window.confirm(
                          `Supprimer le projet "${project.name}" ?`
                        );
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