import React from 'react'
import { Link } from 'react-router'
import './ResetPasswordSuccess.css'

export const ResetPasswordSuccess = () => (
    <div className="reset-password-success">
        <div className="reset-password-success__icon">🎉</div>
        <h2 className="reset-password-success__heading">¡Cambio exitoso!</h2>
        <p className="reset-password-success__subheading">
            Tu contraseña ha sido actualizada correctamente. Ya puedes iniciar sesión con tus nuevas credenciales.
        </p>
        <Link to="/login" className="reset-password-success__submit-btn reset-password-success__submit-btn--success">
            Iniciar sesión
        </Link>
    </div>
)

export default ResetPasswordSuccess
