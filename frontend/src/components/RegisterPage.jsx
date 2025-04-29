import { useState } from 'react';
import '../styles/FormStyles.css';

function RegisterPage() {
  const [nombres, setNombres] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (contrasena !== confirmar) {
      alert('❌ Las contraseñas no coinciden');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombres, correo, contrasena }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ ' + data.message);
        window.location.href = '/login';
      } else {
        alert('❌ ' + data.message);
      }
    } catch (err) {
      alert('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="form-section">
      <div className="image-side">
        <img src="/assets/image.png" alt="Register Visual" />
      </div>
      <div className="form-container">
        <h2>Create Account</h2>
        <p>Please fill in the information below</p>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Full Name" value={nombres} onChange={(e) => setNombres(e.target.value)} required />
          <input type="email" placeholder="Email address" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
          <input type="password" placeholder="Password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
          <input type="password" placeholder="Confirm Password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} required />
          <button type="submit" className="primary-btn">Sign Up</button>
          <p className="switch-form">
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
