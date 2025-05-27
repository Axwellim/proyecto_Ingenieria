import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Ver_datos from './components/Ver_datos';
import Registrar from './components/Registrar';
import Ver_usuarios from './components/Ver_usuarios';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/Ver_datos" element={<Ver_datos />} />
        <Route path="/Registrar" element={<Registrar />} />
        <Route path="/Ver_usuarios" element={<Ver_usuarios />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
