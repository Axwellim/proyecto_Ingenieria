import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FormStyles.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch('http://localhost:8000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const text = await res.text();
    let data;

    try {
      data = JSON.parse(text);
      console.log('Respuesta completa recibida:', data);  // <-- Aquí muestra todo
      console.log('Mensaje:', data.message);
      console.log('Token:', data.token);
      console.log('Usuario completo:', data.usuario);
      if (data.usuario) {
        console.log('ID usuario:', data.usuario.id);
        console.log('Nombre usuario:', data.usuario.nombre);
        console.log('Correo usuario:', data.usuario.correo);
        console.log('Correo usuario:', data.usuario.estado);
      }
    } catch {
      console.error('Respuesta no es JSON:', text);
      alert('Error inesperado del servidor. Revisa la consola.');
      return;
    }

    if (res.ok) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('usuario', JSON.stringify(data.usuario));
  alert('✅ ' + data.message);
  navigate('/dashboard'); // Redirige a Dashboard
}
 else {
      alert('❌ ' + data.message);
    }
  } catch (err) {
    console.error('❌ Error de conexión con el servidor:', err);
    alert('Error de conexión con el servidor.');
  }
};

  return (
    <div className="login-box">
      <div className="form-container">
        <h2>Welcome Back!</h2>
        <p>Please login to your account</p>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="primary-btn">Login</button>
        </form>
      </div>

      <div className="image-container">
        <img src="/assets/image.png" alt="Login Visual" />
      </div>
    </div>
  );
}

export default LoginPage;
