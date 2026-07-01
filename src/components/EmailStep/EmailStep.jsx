import React from 'react'
import { Link } from 'react-router'
import './EmailStep.css'

export const EmailStep = ({ form, loading, error }) => {
    return (
        <>
            <h2 className="login-screen__heading">Inicia sesión en tu espacio</h2>
            <p className="login-screen__subheading">Te recomendamos usar el <strong>correo electrónico del trabajo</strong>.</p>
            
            <form className="login-screen__form" onSubmit={form.handleSubmit}>
                <div className="login-screen__input-group">
                    <label className="login-screen__label" htmlFor="email">Dirección de correo</label>
                    <input
                        className="login-screen__input"
                        type="email"
                        id="email"
                        name="email"
                        placeholder="nombre@trabajo.com"
                        autoComplete="email"
                        value={form.formState.email}
                        onChange={form.handleChange}
                        required
                    />
                </div>

                <button className="login-screen__submit-btn" type="submit" disabled={loading}>
                    {loading ? 'Verificando...' : 'Continuar'}
                </button>

                {error && <div className="login-screen__error-msg">{error.message}</div>}
            </form>

            <div className="login-screen__links">
                <span>¿Nuevo en Slucky? <Link to="/register" className="login-screen__link">Crea una cuenta</Link></span>
            </div>
        </>
    )
}

export default EmailStep
