import React, { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { forgotPassword, resetPassword } from '../../services/authService'
import './ResetPasswordScreen.css'

export const ResetPasswordScreen = () => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const [emailSent, setEmailSent] = useState(false)
    const [resetSuccess, setResetSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const {
        sendRequest: sendForgotReq,
        loading: forgotLoading,
        error: forgotError
    } = useRequest()

    const {
        sendRequest: sendResetReq,
        loading: resetLoading,
        error: resetError
    } = useRequest()

    const initialForgotState = {
        email: ''
    }

    const initialResetState = {
        password: '',
        confirmPassword: ''
    }

    const [passwordMatchError, setPasswordMatchError] = useState(null)

    const onForgotSubmit = async (formData) => {
        try {
            await sendForgotReq(() => forgotPassword(formData.email))
            setEmailSent(true)
        } catch (err) {
            console.error("Error al solicitar recuperación:", err)
        }
    }

    const onResetSubmit = async (formData) => {
        if (formData.password !== formData.confirmPassword) {
            setPasswordMatchError("Las contraseñas no coinciden")
            return
        }
        setPasswordMatchError(null)
        try {
            await sendResetReq(() => resetPassword(token, formData.password))
            setResetSuccess(true)
        } catch (err) {
            console.error("Error al restablecer contraseña:", err)
        }
    }

    const forgotForm = useForm(initialForgotState, onForgotSubmit)
    const resetForm = useForm(initialResetState, onResetSubmit)

    return (
        <div className="reset-screen">
            <div className="reset-screen__container">
                <div className="reset-screen__logo-container">
                    <svg className="reset-screen__logo" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                        <path d="M26.2,74.9 C26.2,80.7 21.5,85.4 15.7,85.4 C9.9,85.4 5.2,80.7 5.2,74.9 C5.2,69.1 9.9,64.4 15.7,64.4 L26.2,64.4 L26.2,74.9 Z" fill="#E01E5A"/>
                        <path d="M31.4,74.9 C31.4,69.1 36.1,64.4 41.9,64.4 C47.7,64.4 52.4,69.1 52.4,74.9 L52.4,106.3 C52.4,112.1 47.7,116.8 41.9,116.8 C36.1,116.8 31.4,112.1 31.4,106.3 L31.4,74.9 Z" fill="#E01E5A"/>
                        <path d="M41.9,26.2 C36.1,26.2 31.4,21.5 31.4,15.7 C31.4,9.9 36.1,5.2 41.9,5.2 C47.7,5.2 52.4,9.9 52.4,15.7 L52.4,26.2 L41.9,26.2 Z" fill="#36C5F0"/>
                        <path d="M41.9,31.4 C47.7,31.4 52.4,36.1 52.4,41.9 C52.4,47.7 47.7,52.4 41.9,52.4 L10.5,52.4 C4.7,52.4 0,47.7 0,41.9 C0,36.1 4.7,31.4 10.5,31.4 L41.9,31.4 Z" fill="#36C5F0"/>
                        <path d="M93.8,41.9 C93.8,36.1 98.5,31.4 104.3,31.4 C110.1,31.4 114.8,36.1 114.8,41.9 C114.8,47.7 110.1,52.4 104.3,52.4 L93.8,52.4 L93.8,41.9 Z" fill="#2EB67D"/>
                        <path d="M88.6,41.9 C88.6,47.7 83.9,52.4 78.1,52.4 C72.3,52.4 67.6,47.7 67.6,41.9 L67.6,10.5 C67.6,4.7 72.3,0 78.1,0 C83.9,0 88.6,4.7 88.6,10.5 L88.6,41.9 Z" fill="#2EB67D"/>
                        <path d="M78.1,93.8 C83.9,93.8 88.6,98.5 88.6,104.3 C88.6,110.1 83.9,114.8 78.1,114.8 C72.3,114.8 67.6,110.1 67.6,104.3 L67.6,93.8 L78.1,93.8 Z" fill="#ECB22E"/>
                        <path d="M78.1,88.6 C72.3,88.6 67.6,83.9 67.6,78.1 C67.6,73.3 72.3,68.6 78.1,68.6 L109.5,68.6 C115.3,68.6 120,73.3 120,78.1 C120,83.9 115.3,88.6 109.5,88.6 L78.1,88.6 Z" fill="#ECB22E"/>
                    </svg>
                    <span className="reset-screen__logo-text">slack</span>
                </div>

                {/* Si NO hay token: Solicitar link de recuperación */}
                {!token ? (
                    !emailSent ? (
                        <>
                            <h2 className="reset-screen__heading">Restablece tu contraseña</h2>
                            <p className="reset-screen__subheading">Escribe la dirección de correo electrónico con la que te registraste y te enviaremos un token temporal.</p>

                            <form className="reset-screen__form" onSubmit={forgotForm.handleSubmit}>
                                <div className="reset-screen__input-group">
                                    <label className="reset-screen__label" htmlFor="email">Dirección de correo</label>
                                    <input
                                        className="reset-screen__input"
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
                                    className="reset-screen__submit-btn"
                                    type="submit"
                                    disabled={forgotLoading}
                                >
                                    {forgotLoading ? 'Enviando...' : 'Obtener enlace de recuperación'}
                                </button>

                                {forgotError && (
                                    <div className="reset-screen__error-msg">
                                        {forgotError.message}
                                    </div>
                                )}
                            </form>

                            <div className="reset-screen__links">
                                <Link to="/login" className="reset-screen__link">Volver al inicio de sesión</Link>
                            </div>
                        </>
                    ) : (
                        <div className="reset-screen__success-card">
                            <div className="reset-screen__success-icon">✉️</div>
                            <h2 className="reset-screen__heading">Revisa tu correo</h2>
                            <p className="reset-screen__subheading">
                                Si el correo se encuentra registrado en nuestra plataforma, habrás recibido las instrucciones y el token para configurar tu contraseña.
                            </p>
                            <Link to="/login" className="reset-screen__submit-btn reset-screen__submit-btn--success">
                                Entendido
                            </Link>
                        </div>
                    )
                ) : (
                    /* Si SÍ hay token: Establecer nueva contraseña */
                    !resetSuccess ? (
                        <>
                            <h2 className="reset-screen__heading">Configura tu nueva contraseña</h2>
                            <p className="reset-screen__subheading">Escribe una contraseña segura que recuerdes con facilidad.</p>

                            <form className="reset-screen__form" onSubmit={resetForm.handleSubmit}>
                                <div className="reset-screen__input-group">
                                    <label className="reset-screen__label" htmlFor="password">Nueva contraseña</label>
                                    <div className="reset-screen__password-wrapper">
                                        <input
                                            className="reset-screen__input reset-screen__input--password"
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            placeholder="Mínimo 8 caracteres"
                                            value={resetForm.formState.password}
                                            onChange={resetForm.handleChange}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="reset-screen__password-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? 'Ocultar' : 'Mostrar'}
                                        </button>
                                    </div>
                                </div>

                                <div className="reset-screen__input-group">
                                    <label className="reset-screen__label" htmlFor="confirmPassword">Confirmar nueva contraseña</label>
                                    <div className="reset-screen__password-wrapper">
                                        <input
                                            className="reset-screen__input reset-screen__input--password"
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            placeholder="Repite tu nueva contraseña"
                                            value={resetForm.formState.confirmPassword}
                                            onChange={resetForm.handleChange}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="reset-screen__password-toggle"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? 'Ocultar' : 'Mostrar'}
                                        </button>
                                    </div>
                                </div>

                                {(passwordMatchError || resetError) && (
                                    <div className="reset-screen__error-msg">
                                        {passwordMatchError || resetError.message}
                                    </div>
                                )}

                                <button
                                    className="reset-screen__submit-btn"
                                    type="submit"
                                    disabled={resetLoading}
                                >
                                    {resetLoading ? 'Restableciendo...' : 'Restablecer contraseña'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="reset-screen__success-card">
                            <div className="reset-screen__success-icon">🎉</div>
                            <h2 className="reset-screen__heading">¡Cambio exitoso!</h2>
                            <p className="reset-screen__subheading">
                                Tu contraseña ha sido actualizada correctamente. Ya puedes iniciar sesión con tus nuevas credenciales.
                            </p>
                            <Link to="/login" className="reset-screen__submit-btn reset-screen__submit-btn--success">
                                Iniciar sesión
                            </Link>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}

export default ResetPasswordScreen
