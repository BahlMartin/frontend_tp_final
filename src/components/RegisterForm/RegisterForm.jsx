import React from 'react'
import { Link } from 'react-router'
import './RegisterForm.css'

export const RegisterForm = ({ form, showPassword, toggleShowPassword, loading, error }) => {
    const { formState, handleChange, handleSubmit } = form

    return (
        <>
            <h2 className="register-screen__heading">Crea tu cuenta de Slucky</h2>
            <p className="register-screen__subheading">Comienza a comunicarte de manera ágil con tu equipo de desarrollo.</p>

            <form className="register-form" onSubmit={handleSubmit}>
                <div className="register-form__row">
                    <div className="register-form__input-group">
                        <label className="register-form__label" htmlFor="first_name">Nombre</label>
                        <input
                            className="register-form__input"
                            type="text"
                            id="first_name"
                            name="first_name"
                            placeholder="Ej. Juan"
                            value={formState.first_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="register-form__input-group">
                        <label className="register-form__label" htmlFor="last_name">Apellido</label>
                        <input
                            className="register-form__input"
                            type="text"
                            id="last_name"
                            name="last_name"
                            placeholder="Ej. Gómez"
                            value={formState.last_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="register-form__input-group">
                    <label className="register-form__label" htmlFor="user_name">Nombre de usuario</label>
                    <input
                        className="register-form__input"
                        type="text"
                        id="user_name"
                        name="user_name"
                        placeholder="Ej. juansito"
                        value={formState.user_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="register-form__input-group">
                    <label className="register-form__label" htmlFor="email">Correo electrónico</label>
                    <input
                        className="register-form__input"
                        type="email"
                        id="email"
                        name="email"
                        placeholder="nombre@trabajo.com"
                        value={formState.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="register-form__input-group">
                    <label className="register-form__label" htmlFor="password">Contraseña</label>
                    <div className="register-form__password-wrapper">
                        <input
                            className="register-form__input register-form__input--password"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            placeholder="Mínimo 8 caracteres, mayúscula, minúscula y número"
                            value={formState.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="register-form__password-toggle"
                            onClick={toggleShowPassword}
                        >
                            {showPassword ? 'Ocultar' : 'Mostrar'}
                        </button>
                    </div>
                </div>

                <button
                    className="register-form__submit-btn"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Creando cuenta...' : 'Registrarse'}
                </button>

                {error && (
                    <div className="register-form__error-msg">
                        {error.message}
                    </div>
                )}
            </form>

            <div className="register-form__links">
                <span>¿Ya tienes cuenta? <Link to="/login" className="register-form__link">Inicia sesión aquí</Link></span>
            </div>
        </>
    )
}

export default RegisterForm
