import React from 'react'
import { Link } from 'react-router'
import './ForgotPasswordRequestForm.css'

export const ForgotPasswordRequestForm = ({ forgotForm, forgotLoading, forgotError }) => (
    <div className="forgot-password-request-form">
        <h2 className="forgot-password-request-form__heading">Restablece tu contraseña</h2>
        <p className="forgot-password-request-form__subheading">
            Escribe la dirección de correo electrónico con la que te registraste y te enviaremos un token temporal.
        </p>

        <form className="forgot-password-request-form__form" onSubmit={forgotForm.handleSubmit}>
            <div className="forgot-password-request-form__input-group">
                <label className="forgot-password-request-form__label" htmlFor="email">Dirección de correo</label>
                <input
                    className="forgot-password-request-form__input"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="nombre@trabajo.com"
                    value={forgotForm.formState.email}
                    onChange={forgotForm.handleChange}
                    required
                />
            </div>

            <button
                className="forgot-password-request-form__submit-btn"
                type="submit"
                disabled={forgotLoading}
            >
                {forgotLoading ? 'Enviando...' : 'Obtener enlace de recuperación'}
            </button>

            {forgotError && (
                <div className="forgot-password-request-form__error-msg">
                    {forgotError.message}
                </div>
            )}
        </form>

        <div className="forgot-password-request-form__links">
            <Link to="/login" className="forgot-password-request-form__link">Volver al inicio de sesión</Link>
        </div>
    </div>
)

export default ForgotPasswordRequestForm
