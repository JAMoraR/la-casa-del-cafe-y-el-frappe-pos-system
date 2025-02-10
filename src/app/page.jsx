"use client";

import React from 'react'
import '@/styles/form.css'

function Login() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    if (username === 'admin' && password === 'admin') {
      window.location.href= 'https://la-casa-del-cafe-y-el-frappe-admin.vercel.app/'
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="container h-screen w-screen">
        <div className="heading">Inicia Sesión</div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-field">
            <input required autoComplete="off" type="text" name="text" id="username" />
            <label htmlFor="username">Nombre Completo</label>
          </div>
          <div className="input-field">
            <input required autoComplete="off" type="password" name="text" id="password" />
            <label htmlFor="username">Contraseña</label>
          </div>
          <div className="btn-container">
            <button className="btn" type="submit">Submit</button>
          </div>
        </form>
      </div>
  )
}

export default Login