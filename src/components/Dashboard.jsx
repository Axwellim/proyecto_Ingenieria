import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [usuIde, setUsuIde] = useState(null);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!token || !usuario) {
      alert('Acceso denegado. Debes iniciar sesión primero.');
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      navigate('/login');
      return;
    }

    setNombreUsuario(usuario.nombre ?? 'Usuario');
    setUsuIde(usuario.usu_ide ?? usuario.id); // Aseguramos compatibilidad

    // Validar el token
    fetch('http://localhost:8000/api/validate-token', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Token inválido o expirado');
        }
        return res.json();
      })
      .then(data => {
        console.log('✅ Usuario autenticado:', data);
      })
      .catch(err => {
        console.error('❌ Error de autenticación:', err.message);
        alert('Sesión expirada. Por favor inicia sesión nuevamente.');
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/login');
      });
  }, [navigate]);

useEffect(() => {
  const token = localStorage.getItem('token');

  if (!usuIde || !token) return;

  fetch('http://localhost:8000/api/menu', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify({ usu_ide: usuIde })
  })
    .then(async res => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al obtener el menú');
      }
      return res.json();
    })
    .then(data => setMenu(data))
    .catch(err => alert('❌ ' + err.message));
}, [usuIde, navigate]);



  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    alert('Sesión cerrada correctamente');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="left-section">
          <h2 className="logo">Mi Panel</h2>
          <nav className="navbar">
            <ul className="nav-links">
              {menu.map((item, index) => (
                <li key={index}><a href={item.rut_ruta}>{item.rut_nombre}</a></li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="right-section">
          <span className="welcome-text">Bienvenido, {nombreUsuario}</span>
          <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      </header>
      <main className="dashboard-content">
        <h1>BIENVENIDO</h1>
      </main>
    </div>
  );
}

export default Dashboard;
