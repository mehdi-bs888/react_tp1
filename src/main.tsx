import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
<<<<<<< HEAD
import { BrowserRouter } from 'react-router-dom'; 
import { AuthProvider } from './features/auth/AuthContext';
  
createRoot(document.getElementById('root')!).render( 
  <StrictMode> 
    <BrowserRouter> 
      <AuthProvider> 
        <App /> 
      </AuthProvider> 
    </BrowserRouter> 
  </StrictMode> 
); 

=======

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
>>>>>>> 9577dd63666a96190f6e7dd8020a34f272409909
