import { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api/axios';

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

export default function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, colRes] = await Promise.all([
          api.get<Project[]>('/projects'),
          api.get<Column[]>('/columns'),
        ]);
        setProjects(projRes.data);
        setColumns(colRes.data);
      } catch {
        setError('Erreur chargement');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  async function addProject(name: string, color: string) {
    setError(null);
    try {
      const { data } = await api.post<Project>('/projects', { name, color });
      setProjects((prev) => [...prev, data]);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Erreur: ${err.response?.status ?? 'inconnue'}`);
      } else {
        setError('Erreur inconnue');
      }
    }
  }

  async function renameProject(id: string, newName: string) {
    const trimmed = newName.trim();
    if (!trimmed) return;

    setError(null);
    try {
      const project = projects.find((p) => p.id === id);
      if (!project) return;

      const { data } = await api.put<Project>(`/projects/${id}`, {
        ...project,
        name: trimmed,
      });

      setProjects((prev) => prev.map((p) => (p.id === data.id ? data : p)));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Erreur: ${err.response?.status ?? 'inconnue'}`);
      } else {
        setError('Erreur inconnue');
      }
    }
  }

  async function deleteProject(id: string) {
    setError(null);
    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(`Erreur: ${err.response?.status ?? 'inconnue'}`);
      } else {
        setError('Erreur inconnue');
      }
    }
  }

  return {
    projects,
    columns,
    loading,
    error,
    addProject,
    renameProject,
    deleteProject,
  };
}