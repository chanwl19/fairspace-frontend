import ReactDOM from 'react-dom/client';
//import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css';
import './satoshi.css';
import { AuthContextProvider } from './context/AuthContext';

// <React.StrictMode>
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);
