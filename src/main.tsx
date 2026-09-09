import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/theme.css' // Lockated Brand Theme - edit this file for global color changes

createRoot(document.getElementById("root")!).render(<App />);
