import React from 'react'
import { Link } from 'react-router'
import useVerifyEmail from '../../hooks/useVerifyEmail.js'
import Logo from '../../components/Logo/Logo.jsx'
import './VerifyEmailScreen.css'

export const VerifyEmailScreen = () => {
    const { token, loading, error, isSuccess } = useVerifyEmail()

    return (
        <div className="verify-email-screen">
            <div className="verify-email-screen__container">
                <Logo
                    containerClassName="verify-email-screen__logo-container"
                    svgClassName="verify-email-screen__logo"
                    textClassName="verify-email-screen__logo-text"
                />

                <div className="verify-email-screen__card">
                    {loading && (
                        <div className="verify-email-screen__status verify-email-screen__status--loading">
                            <div className="verify-email-screen__spinner"></div>
                            <h2 className="verify-email-screen__heading">Verificando tu correo...</h2>
                            <p className="verify-email-screen__subheading">Por favor espera un momento mientras validamos tu token de seguridad.</p>
                        </div>
                    )}

                    {isSuccess && (
                        <div className="verify-email-screen__status verify-email-screen__status--success">
                            <div className="verify-email-screen__icon">✅</div>
                            <h2 className="verify-email-screen__heading">¡Email verificado con éxito!</h2>
                            <p className="verify-email-screen__subheading">Tu cuenta ha sido activada correctamente. Ya puedes iniciar sesión y unirte a tu equipo de trabajo.</p>
                            <Link to="/login" className="verify-email-screen__action-btn verify-email-screen__action-btn--primary">
                                Iniciar sesión
                            </Link>
                        </div>
                    )}

                    {error && (
                        <div className="verify-email-screen__status verify-email-screen__status--error">
                            <div className="verify-email-screen__icon">❌</div>
                            <h2 className="verify-email-screen__heading">Error de verificación</h2>
                            <p className="verify-email-screen__subheading">El token provisto es inválido, ha expirado o ya fue utilizado.</p>
                            <div className="verify-email-screen__error-detail">
                                {error.message || String(error)}
                            </div>
                            <Link to="/register" className="verify-email-screen__action-btn verify-email-screen__action-btn--secondary">
                                Crear una nueva cuenta
                            </Link>
                        </div>
                    )}

                    {!token && !loading && !isSuccess && !error && (
                        <div className="verify-email-screen__status verify-email-screen__status--warning">
                            <div className="verify-email-screen__icon">⚠️</div>
                            <h2 className="verify-email-screen__heading">Falta token de verificación</h2>
                            <p className="verify-email-screen__subheading">Para verificar tu dirección de correo, debes ingresar a esta URL utilizando el enlace enviado a tu email.</p>
                            <Link to="/login" className="verify-email-screen__action-btn verify-email-screen__action-btn--primary">
                                Volver al inicio
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default VerifyEmailScreen
