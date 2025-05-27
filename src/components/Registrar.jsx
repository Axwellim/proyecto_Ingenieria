import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Registrar.css';

function Registrar() {
  const navigate = useNavigate();

  // Estado para usuario y menú
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [usuIde, setUsuIde] = useState(null);
  const [menu, setMenu] = useState([]);
  const [rolesDisponibles, setRolesDisponibles] = useState([]);

  // Formulario registro
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('');

  // Validar sesión y token al cargar el componente
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

    // Validar token en backend
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

  // Cargar menú dinámico según usuario
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


  // Cargar roles desde backend
  useEffect(() => {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('⚠️ No hay token disponible. Por favor, inicia sesión.');
    navigate('/login');
    return;
  }

  fetch('http://localhost:8000/api/roles', {
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    }
  })
    .then(async res => {
      if (res.status === 401) {
        alert('⚠️ Token inválido o expirado. Por favor, inicia sesión nuevamente.');
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        navigate('/login');
        return;
      }
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al obtener roles');
      }
      return res.json();
    })
    .then(data => {
      console.log('🎭 Roles disponibles:', data);
      setRolesDisponibles(data);
    })
    .catch(err => {
      alert('❌ ' + err.message);
      console.error('❌ Error al cargar roles:', err.message);
    });
}, [navigate]);

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    alert('Sesión cerrada correctamente');
    navigate('/login');
  };

  // Registrar usuario llamando API
  const handleRegister = (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    fetch('http://localhost:8000/api/registrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        nombre,
        correo,
        contrasena,
        rol,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al registrar usuario');
        return res.json();
      })
      .then(data => {
        alert('Usuario registrado correctamente');
        setNombre('');
        setCorreo('');
        setContrasena('');
        setRol('');
      })
      .catch(err => {
        console.error('❌ Error al registrar usuario:', err.message);
        alert('Error al registrar usuario: ' + err.message);
      });
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="left-section">
          <h2 className="logo">Mi Panel</h2>
          <nav className="navbar">
            <ul className="nav-links">
              {menu.map((item, index) => (
                <li key={index}>
                  <a href={item.rut_ruta}>{item.rut_nombre}</a>
                </li>
              ))}
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
        <div className="registro-formulario">
          <h1>Registrar Nuevo Usuario</h1>
          <form className="register-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingrese su nombre"
                required
              />
            </div>

            <div className="form-group">
              <label>Correo</label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="usuario@correo.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                placeholder="Ingrese una contraseña segura"
                required
              />
            </div>

            <div className="form-group">
              <label>Rol</label>
              <select
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                required
              >
                <option value="">Seleccione un rol</option>
                {rolesDisponibles.map((r) => (
                  <option key={r.ro_ide} value={r.ro_ide}>
                    {r.rol_nombre}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="register-button">
              Registrar
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Registrar;
