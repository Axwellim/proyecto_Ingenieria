import { FaUser, FaEnvelope, FaLock, FaUserShield } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Ver_datos.css';

function Ver_datos() {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [correoUsuario, setCorreoUsuario] = useState('');
  const [rolUsuario, setRolUsuario] = useState('');
  const [usuIde, setUsuIde] = useState(null);
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!token || !usuario) {
      alert('Acceso denegado. Debes iniciar sesión primero.');
      navigate('/login');
      return;
    }

    setNombreUsuario(usuario.nombre ?? '');
    setCorreoUsuario(usuario.correo ?? '');
    setRolUsuario(usuario.rol ?? '');  // Inicial
    setUsuIde(usuario.id);

    // Validar token
    fetch('http://localhost:8000/api/validate-token', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Token inválido o expirado');
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

  if (usuIde && token) {
    // Obtener menú dinámico según usuario
    fetch('http://localhost:8000/api/menu', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ usu_ide: usuIde }),
    })
      .then(async (res) => {
        if (res.status === 401) {
          alert('⚠️ Token inválido. Inicia sesión nuevamente.');
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          navigate('/login');
          return;
        }
        if (!res.ok) {
          let errorMsg = 'Error al obtener menú';
          try {
            const errorData = await res.json();
            if (errorData.error) errorMsg = errorData.error;
          } catch (_) {}
          throw new Error(errorMsg);
        }
        const data = await res.json();
        console.log('📋 Menú obtenido:', data);
        setMenu(data);
      })
      .catch((err) => {
        console.error('❌ Error al obtener menú:', err.message);
        alert('❌ Error al obtener menú: ' + err.message);
      });

    // Obtener rol desde backend vía procedimiento almacenado
    fetch('http://localhost:8000/api/ver_datos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
      body: JSON.stringify({ usu_ide: usuIde }),
    })
      .then(async (res) => {
        if (res.status === 401) {
          alert('⚠️ Token inválido. Inicia sesión nuevamente.');
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          navigate('/login');
          return;
        }
        if (!res.ok) {
          let errorMsg = 'Error al obtener rol';
          try {
            const errorData = await res.json();
            if (errorData.error) errorMsg = errorData.error;
          } catch (_) {}
          throw new Error(errorMsg);
        }
        const data = await res.json();
        console.log('🎯 Rol obtenido:', data);
        if (data.length > 0 && data[0].rol_nombre) {
          setRolUsuario(data[0].rol_nombre);
        } else {
          setRolUsuario('Sin rol asignado');
        }
      })
      .catch((err) => {
        console.error('❌ Error al obtener rol:', err.message);
        alert('❌ Error al obtener rol: ' + err.message);
        setRolUsuario('Error al cargar rol');
      });
  }
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
              {menu.length > 0 ? (
                menu.map((item, index) => (
                  <li key={index}>
                    <a href={item.rut_ruta}>{item.rut_nombre}</a>
                  </li>
                ))
              ) : (
                <></>
              )}
            </ul>
          </nav>
        </div>

        <div className="right-section">
          <span className="welcome-text">Bienvenido, {nombreUsuario}</span>
          <button className="logout-button" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <form className="user-info-container" aria-label="Formulario de datos de usuario">
          <h2 className="form-title">Mis Datos</h2>
          <div className="user-info-box">
            <div className="info-row">
              <FaUser className="icon" />
              <span className="label">Nombre:</span>
              <span className="value">{nombreUsuario}</span>
            </div>
            <div className="info-row">
              <FaEnvelope className="icon" />
              <span className="label">Correo:</span>
              <span className="value">{correoUsuario}</span>
            </div>
            <div className="info-row">
              <FaUserShield className="icon" />
              <span className="label">Rol:</span>
              <span className="value">{rolUsuario}</span>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Ver_datos;
