import React, { useState } from 'react'
import { Link } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { register } from '../../services/authService'
import './RegisterScreen.css'

export const RegisterScreen = () => {
    const [registered, setRegistered] = useState(false)
    const [registeredEmail, setRegisteredEmail] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const {
        sendRequest: sendRegisterReq,
        loading,
        error
    } = useRequest()

    const initialFormState = {
        first_name: '',
        last_name: '',
        user_name: '',
        email: '',
        password: ''
    }

    const onSubmit = async (formData) => {
        try {
            setRegisteredEmail(formData.email)
            const res = await sendRegisterReq(() => register(formData))
            if (res.ok) {
                setRegistered(true)
            }
        } catch (err) {
            console.error("Error al registrar:", err)
        }
    }

    const { formState, handleChange, handleSubmit } = useForm(initialFormState, onSubmit)

    return (
        <div className="register-screen">
            <div className="register-screen__container">
                <div className="register-screen__logo-container">
                    <svg className="register-screen__logo" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                        <path d="M26.2,74.9 C26.2,80.7 21.5,85.4 15.7,85.4 C9.9,85.4 5.2,80.7 5.2,74.9 C5.2,69.1 9.9,64.4 15.7,64.4 L26.2,64.4 L26.2,74.9 Z" fill="#E01E5A"/>
                        <path d="M31.4,74.9 C31.4,69.1 36.1,64.4 41.9,64.4 C47.7,64.4 52.4,69.1 52.4,74.9 L52.4,106.3 C52.4,112.1 47.7,116.8 41.9,116.8 C36.1,116.8 31.4,112.1 31.4,106.3 L31.4,74.9 Z" fill="#E01E5A"/>
                        <path d="M41.9,26.2 C36.1,26.2 31.4,21.5 31.4,15.7 C31.4,9.9 36.1,5.2 41.9,5.2 C47.7,5.2 52.4,9.9 52.4,15.7 L52.4,26.2 L41.9,26.2 Z" fill="#36C5F0"/>
                        <path d="M41.9,31.4 C47.7,31.4 52.4,36.1 52.4,41.9 C52.4,47.7 47.7,52.4 41.9,52.4 L10.5,52.4 C4.7,52.4 0,47.7 0,41.9 C0,36.1 4.7,31.4 10.5,31.4 L41.9,31.4 Z" fill="#36C5F0"/>
                        <path d="M93.8,41.9 C93.8,36.1 98.5,31.4 104.3,31.4 C110.1,31.4 114.8,36.1 114.8,41.9 C114.8,47.7 110.1,52.4 104.3,52.4 L93.8,52.4 L93.8,41.9 Z" fill="#2EB67D"/>
                        <path d="M88.6,41.9 C88.6,47.7 83.9,52.4 78.1,52.4 C72.3,52.4 67.6,47.7 67.6,41.9 L67.6,10.5 C67.6,4.7 72.3,0 78.1,0 C83.9,0 88.6,4.7 88.6,10.5 L88.6,41.9 Z" fill="#2EB67D"/>
                        <path d="M78.1,93.8 C83.9,93.8 88.6,98.5 88.6,104.3 C88.6,110.1 83.9,114.8 78.1,114.8 C72.3,114.8 67.6,110.1 67.6,104.3 L67.6,93.8 L78.1,93.8 Z" fill="#ECB22E"/>
                        <path d="M78.1,88.6 C72.3,88.6 67.6,83.9 67.6,78.1 C67.6,73.3 72.3,68.6 78.1,68.6 L109.5,68.6 C115.3,68.6 120,73.3 120,78.1 C120,83.9 115.3,88.6 109.5,88.6 L78.1,88.6 Z" fill="#ECB22E"/>
                    </svg>
                    <span className="register-screen__logo-text">slack</span>
                </div>

                {!registered ? (
                    <>
                        <h2 className="register-screen__heading">Crea tu cuenta de Slack</h2>
                        <p className="register-screen__subheading">Comienza a comunicarte de manera ágil con tu equipo de desarrollo.</p>

                        <form className="register-screen__form" onSubmit={handleSubmit}>
                            <div className="register-screen__row">
                                <div className="register-screen__input-group">
                                    <label className="register-screen__label" htmlFor="first_name">Nombre</label>
                                    <input
                                        className="register-screen__input"
                                        type="text"
                                        id="first_name"
                                        name="first_name"
                                        placeholder="Ej. Juan"
                                        value={formState.first_name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="register-screen__input-group">
                                    <label className="register-screen__label" htmlFor="last_name">Apellido</label>
                                    <input
                                        className="register-screen__input"
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

                            <div className="register-screen__input-group">
                                <label className="register-screen__label" htmlFor="user_name">Nombre de usuario</label>
                                <input
                                    className="register-screen__input"
                                    type="text"
                                    id="user_name"
                                    name="user_name"
                                    placeholder="Ej. juansito"
                                    value={formState.user_name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="register-screen__input-group">
                                <label className="register-screen__label" htmlFor="email">Correo electrónico</label>
                                <input
                                    className="register-screen__input"
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="nombre@trabajo.com"
                                    value={formState.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                             <div className="register-screen__input-group">
                                <label className="register-screen__label" htmlFor="password">Contraseña</label>
                                <div className="register-screen__password-wrapper">
                                    <input
                                        className="register-screen__input register-screen__input--password"
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
                                        className="register-screen__password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? 'Ocultar' : 'Mostrar'}
                                    </button>
                                </div>
                            </div>

                            <button
                                className="register-screen__submit-btn"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Creando cuenta...' : 'Registrarse'}
                            </button>

                            {error && (
                                <div className="register-screen__error-msg">
                                    {error.message}
                                </div>
                            )}
                        </form>

                        <div className="register-screen__links">
                            <span>¿Ya tienes cuenta? <Link to="/login" className="register-screen__link">Inicia sesión aquí</Link></span>
                        </div>
                    </>
                ) : (
                    <div className="register-screen__success-card">
                        <div className="register-screen__success-icon">✉️</div>
                        <h2 className="register-screen__heading">¡Registro casi completo!</h2>
                        <p className="register-screen__subheading">
                            Hemos enviado un enlace de verificación a **{registeredEmail}**.<br />
                            Por favor, revisa tu casilla de correo y haz clic en el botón para activar tu cuenta.
                        </p>
                        <Link to="/login" className="register-screen__submit-btn register-screen__submit-btn--success">
                            Ir a Iniciar Sesión
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default RegisterScreen
