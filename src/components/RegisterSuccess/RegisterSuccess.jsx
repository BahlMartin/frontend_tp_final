import React from 'react'
import { Link } from 'react-router'
import './RegisterSuccess.css'

export const RegisterSuccess = ({ registeredEmail }) => {
    return (
        <div className="register-success">
            <div className="register-success__icon">✉️</div>
            <h2 className="register-screen__heading">¡Registro casi completo!</h2>
            <p className="register-screen__subheading">
                Hemos enviado un enlace de verificación a <strong>{registeredEmail}</strong>.<br />
                Por favor, revisa tu casilla de correo y haz clic en el botón para activar tu cuenta.
            </p>
            <Link to="/login" className="register-success__submit-btn">
                Ir a Iniciar Sesión
            </Link>
        </div>
    )
}

export default RegisterSuccess
