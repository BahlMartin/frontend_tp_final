import React from 'react'
import { Link } from 'react-router'
import EyeIcon from '../EyeIcon/EyeIcon.jsx'
import './PasswordStep.css'

export const PasswordStep = ({
    form,
    email,
    loading,
    error,
    showPassword,
    setShowPassword,
    goBackToEmail
}) => {
    return (
        <>
            <h2 className="login-screen__heading">Introduce tu contraseña</h2>
            <p className="login-screen__subheading">Iniciando sesión con el correo electrónico del trabajo.</p>

            <div className="login-screen__email-badge">
                <span className="login-screen__email-text">{email}</span>
                <button type="button" className="login-screen__change-link" onClick={goBackToEmail}>
                    (Cambiar)
                </button>
            </div>

            <form className="login-screen__form" onSubmit={form.handleSubmit}>
                <div className="login-screen__input-group">
                    <label className="login-screen__label" htmlFor="password">Contraseña</label>
                    <div className="login-screen__password-wrapper">
                        <input
                            className="login-screen__input login-screen__input--password"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="Tu contraseña secreta"
                            autoComplete="current-password"
                            value={form.formState.password}
                            onChange={form.handleChange}
                            required
                            autoFocus
                        />
                        <button
                            type="button"
                            className="login-screen__password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        >
                            <EyeIcon showCrossed={showPassword} className="login-screen__eye-icon" />
                        </button>
                    </div>
                </div>

                <button className="login-screen__submit-btn" type="submit" disabled={loading}>
                    {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>

                {error && <div className="login-screen__error-msg">{error.message}</div>}

                <button className="login-screen__cancel-btn" type="button" onClick={goBackToEmail}>
                    Volver al paso anterior
                </button>
            </form>

            <div className="login-screen__links">
                <Link to="/reset-password" className="login-screen__link login-screen__link--forgot">¿Olvidaste tu contraseña?</Link>
            </div>
        </>
    )
}

export default PasswordStep
