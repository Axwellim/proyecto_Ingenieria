import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Ver_usuarios.css';

function Ver_usuarios() {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [usuIde, setUsuIde] = useState(null);
  const [menu, setMenu] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuario = JSON.parse(localStorage.getItem('usuario'));

    if (!token || !usuario) {
      alert('Acceso denegado. Debes iniciar sesión primero.');
      navigate('/login');
      return;
    }

    setNombreUsuario(usuario.nombre ?? 'Usuario');
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
            const errData = await res.json();
            if (errData.error) errorMsg = errData.error;
          } catch (_) {}
          throw new Error(errorMsg);
        }
        const data = await res.json();
        console.log('📋 Menú obtenido:', data);
        setMenu(data);
      })
      .catch(err => {
        console.error('❌ Error al obtener menú:', err.message);
        alert('❌ Error al obtener menú: ' + err.message);
      });

    // Obtener usuarios reales desde backend
    fetch('http://localhost:8000/api/usuarios', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
      },
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
          let errorMsg = 'Error al obtener usuarios';
          try {
            const errData = await res.json();
            if (errData.error) errorMsg = errData.error;
          } catch (_) {}
          throw new Error(errorMsg);
        }
        const data = await res.json();
        const usuariosBackend = data.map(u => ({
          id: u.usu_ide,
          nombre: u.usu_nombres,
          correo: u.usu_correo,
          contrasena: u.usu_contrasena, // opcional
          rol: u.rol_nombre,
        }));
        setUsuarios(usuariosBackend);
      })
      .catch(err => {
        console.error('❌ Error al obtener usuarios:', err.message);
        alert('❌ Error al obtener usuarios: ' + err.message);
        setUsuarios([]);
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
        <form className="usuarios-form">
          <h1 className="usuarios-title">Lista de Usuarios</h1>
          <table className="usuarios-tabla">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length > 0 ? (
                usuarios.map((usuario, index) => (
                  <tr key={`${usuario.id}-${index}`}>
                    <td>{index + 1}</td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.correo}</td>
                    <td>
                      <span className={`rol-badge ${usuario.rol.toLowerCase()}`}>
                        {usuario.rol}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>
                    No hay usuarios para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </form>
      </main>
    </div>
  );
}

export default Ver_usuarios;
