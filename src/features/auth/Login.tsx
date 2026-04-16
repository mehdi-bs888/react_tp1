import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';
import { loginStart, loginSuccess, loginFailure } from './authSlice';
import styles from './Login.module.css';

interface ApiUser {
  id: string;
  email: string;
  name: string;
  password: string;
}

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const res = await fetch(
        `http://localhost:4000/users?email=${encodeURIComponent(email)}`
      );
      const users: ApiUser[] = await res.json();

      if (users.length === 0 || users[0].password !== password) {
        dispatch(loginFailure('Email ou mot de passe incorrect'));
        return;
      }

      const user = {
        id: users[0].id,
        email: users[0].email,
        name: users[0].name,
      };

      const fakeToken = btoa(
        JSON.stringify({
          userId: user.id,
          email: user.email,
          role: 'admin',
          exp: Date.now() + 3600000, // 1h
        })
      );

      dispatch(loginSuccess({ user, token: fakeToken }));
      navigate('/dashboard', { replace: true });
    } catch {
      dispatch(loginFailure('Erreur de connexion au serveur'));
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.title}>TaskFlow</h1>
        <p className={styles.subtitle}>Connectez-vous pour continuer</p>

        {error && <div className={styles.error}>{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />

        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}