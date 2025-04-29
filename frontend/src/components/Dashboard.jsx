import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Debes iniciar sesión primero');
      navigate('/login');
      return;
    }

    // Decodificar el token para sacar el nombre del usuario (manual simple)
    const payloadBase64 = token.split('.')[1];
    const payloadDecoded = JSON.parse(atob(payloadBase64));
    
    setNombreUsuario(payloadDecoded.nombre);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Sesión cerrada correctamente');
    navigate('/login');
  };

  return (
    <div>
      {/* Barra superior */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        color: 'white',
        padding: '10px 20px'
      }}>
        <h2>Bienvenido, {nombreUsuario}</h2>
        <button 
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#E94E4E',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Cerrar Sesión
        </button>
      </header>

      {/* Contenido principal */}
      <main style={{ padding: '40px' }}>
        <h1>Dashboard principal</h1>
        {/* Aquí agregas el contenido que quieras */}
      </main>
    </div>
  );
}

export default Dashboard;
