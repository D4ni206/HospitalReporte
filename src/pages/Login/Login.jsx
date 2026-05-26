import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ← AGREGAR
import './Login.css';
import logoHospital from '../../assets/logo.png';

const Login = () => {

  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');

  const navigate = useNavigate(); // ← AGREGAR


  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(
      'Iniciando sesión con:',
      { usuario, contrasena }
    );

    // Login temporal
    if (
      usuario === "admin" &&
      contrasena === "Inicio123"
    ) {

      navigate("/dashboard");

    } else {

      alert(
        "Usuario o contraseña incorrectos"
      );

    }

  };


  return (
    <div className="split-login-screen">

      {/* SECCIÓN IZQUIERDA: Identidad Visual y Marca */}
      <div className="split-login-left">
        <div className="left-content">
          <div className="hospital-logo-container">

            <img
              src={logoHospital}
              alt="Hospital San Juan de Dios de Pisco"
              className="hospital-logo-web"
            />

          </div>

          <div className="left-text-footer">

            <span className="app-badge">
              HospitalApp
            </span>

            <h1>
              Sistema de Emergencia local y gestión hospitalaria.
            </h1>

          </div>

        </div>
      </div>


      {/* SECCIÓN DERECHA */}
      <div className="split-login-right">

        <div className="right-content">

          <div className="login-form-header">

            <h2>
              Iniciar sesion
            </h2>

            <p className="form-subtitle">

              Ingresa tus credenciales para acceder al sistema.

            </p>

          </div>


          <form
            onSubmit={handleSubmit}
            className="hospital-form-split"
          >

            <div className="form-input-wrapper">

              <label htmlFor="usuario">
                Usuario
              </label>

              <input
                type="text"
                id="usuario"
                placeholder="Ingresa tu usuario"
                value={usuario}
                onChange={(e)=>
                  setUsuario(e.target.value)
                }
                required
              />

            </div>


            <div className="form-input-wrapper">

              <label htmlFor="contrasena">
                Contrasena
              </label>

              <input
                type="password"
                id="contrasena"
                placeholder="Ingresa tu contrasena"
                value={contrasena}
                onChange={(e)=>
                  setContrasena(e.target.value)
                }
                required
              />

            </div>


            <button
              type="submit"
              className="btn-submit-split"
            >

              Ingresar al sistema

            </button>

          </form>


          <p className="footer-text-split">

            Mantene la calma. Cada segundo cuenta.

          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;