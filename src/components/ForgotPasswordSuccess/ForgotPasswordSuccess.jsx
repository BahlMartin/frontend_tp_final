import React from 'react'
import { Link } from 'react-router'
import './ForgotPasswordSuccess.css'

export const ForgotPasswordSuccess = () => (
    <div className="forgot-password-success">
        <div className="forgot-password-success__icon">✉️</div>
        <h2 className="forgot-password-success__heading">Revisa tu correo</h2>
        <p className="forgot-password-success__subheading">
            Si el correo se encuentra registrado en nuestra plataforma, habrás recibido las instrucciones y el token para configurar tu contraseña.
        </p>
        <p className="forgot-password-success__spam-warning">
            ¿No encuentras el correo? Recuerda revisar tu bandeja de correo no deseado o spam.
        </p>
        <Link to="/login" className="forgot-password-success__submit-btn forgot-password-success__submit-btn--success">
            Entendido
        </Link>
    </div>
)

export default ForgotPasswordSuccess
