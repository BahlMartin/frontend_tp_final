import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'
import useForm from '../../hooks/useForm'
import useLogin from '../../hooks/useLogin'
import './LoginScreen.css'

export const LoginScreen = () => {
    const [showPassword, setShowPassword] = useState(false)
    const {
        step,
        email,
        loading,
        error,
        handleEmailSubmit,
        handlePasswordSubmit,
        handle2FASubmit,
        goBackToEmail
    } = useLogin()

    const emailForm = useForm({ email: '' }, (formData) => {
        handleEmailSubmit(formData.email)
    })

    const passwordForm = useForm({ password: '' }, (formData) => {
        handlePasswordSubmit(formData.password)
    })

    const twofaForm = useForm({ code: '' }, (formData) => {
        handle2FASubmit(formData.code)
    })

    // Prefill the email input if the user decides to go back to the email stage
    useEffect(() => {
        if (step === 'email' && email) {
            emailForm.setFormState({ email })
        }
    }, [step, email])

    return (
        <div className="login-screen">
            <div className="login-screen__container">
                <div className="login-screen__logo-container">
                    <svg className="login-screen__logo" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                        <path d="M26.2,74.9 C26.2,80.7 21.5,85.4 15.7,85.4 C9.9,85.4 5.2,80.7 5.2,74.9 C5.2,69.1 9.9,64.4 15.7,64.4 L26.2,64.4 L26.2,74.9 Z" fill="#E01E5A"/>
                        <path d="M31.4,74.9 C31.4,69.1 36.1,64.4 41.9,64.4 C47.7,64.4 52.4,69.1 52.4,74.9 L52.4,106.3 C52.4,112.1 47.7,116.8 41.9,116.8 C36.1,116.8 31.4,112.1 31.4,106.3 L31.4,74.9 Z" fill="#E01E5A"/>
                        <path d="M41.9,26.2 C36.1,26.2 31.4,21.5 31.4,15.7 C31.4,9.9 36.1,5.2 41.9,5.2 C47.7,5.2 52.4,9.9 52.4,15.7 L52.4,26.2 L41.9,26.2 Z" fill="#36C5F0"/>
                        <path d="M41.9,31.4 C47.7,31.4 52.4,36.1 52.4,41.9 C52.4,47.7 47.7,52.4 41.9,52.4 L10.5,52.4 C4.7,52.4 0,47.7 0,41.9 C0,36.1 4.7,31.4 10.5,31.4 L41.9,31.4 Z" fill="#36C5F0"/>
                        <path d="M93.8,41.9 C93.8,36.1 98.5,31.4 104.3,31.4 C110.1,31.4 114.8,36.1 114.8,41.9 C114.8,47.7 110.1,52.4 104.3,52.4 L93.8,52.4 L93.8,41.9 Z" fill="#2EB67D"/>
                        <path d="M88.6,41.9 C88.6,47.7 83.9,52.4 78.1,52.4 C72.3,52.4 67.6,47.7 67.6,41.9 L67.6,10.5 C67.6,4.7 72.3,0 78.1,0 C83.9,0 88.6,4.7 88.6,10.5 L88.6,41.9 Z" fill="#2EB67D"/>
                        <path d="M78.1,93.8 C83.9,93.8 88.6,98.5 88.6,104.3 C88.6,110.1 83.9,114.8 78.1,114.8 C72.3,114.8 67.6,110.1 67.6,104.3 L67.6,93.8 L78.1,93.8 Z" fill="#ECB22E"/>
                        <path d="M78.1,88.6 C72.3,88.6 67.6,83.9 67.6,78.1 C67.6,73.3 72.3,68.6 78.1,68.6 L109.5,68.6 C115.3,68.6 120,73.3 120,78.1 C120,83.9 115.3,88.6 109.5,88.6 L78.1,88.6 Z" fill="#ECB22E"/>
                    </svg>
                    <span className="login-screen__title">slack</span>
                </div>

                {step === 'email' && (
                    <>
                        <h2 className="login-screen__heading">Inicia sesión en tu espacio</h2>
                        <p className="login-screen__subheading">Te recomendamos usar el <strong>correo electrónico del trabajo</strong>.</p>
                        
                        <form className="login-screen__form" onSubmit={emailForm.handleSubmit}>
                            <div className="login-screen__input-group">
                                <label className="login-screen__label" htmlFor="email">Dirección de correo</label>
                                <input
                                    className="login-screen__input"
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="nombre@trabajo.com"
                                    value={emailForm.formState.email}
                                    onChange={emailForm.handleChange}
                                    required
                                />
                            </div>

                            <button
                                className="login-screen__submit-btn"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Verificando...' : 'Continuar'}
                            </button>

                            {error && (
                                <div className="login-screen__error-msg">
                                    {error.message}
                                </div>
                            )}
                        </form>

                        <div className="login-screen__links">
                            <span>¿Nuevo en Slack? <Link to="/register" className="login-screen__link">Crea una cuenta</Link></span>
                        </div>
                    </>
                )}

                {step === 'password' && (
                    <>
                        <h2 className="login-screen__heading">Introduce tu contraseña</h2>
                        <p className="login-screen__subheading">Iniciando sesión con el correo electrónico del trabajo.</p>
                        
                        <div className="login-screen__email-badge">
                            <span className="login-screen__email-text">{email}</span>
                            <button 
                                type="button" 
                                className="login-screen__change-link" 
                                onClick={goBackToEmail}
                            >
                                (Cambiar)
                            </button>
                        </div>

                        <form className="login-screen__form" onSubmit={passwordForm.handleSubmit}>
                            <div className="login-screen__input-group">
                                <label className="login-screen__label" htmlFor="password">Contraseña</label>
                                <div className="login-screen__password-wrapper">
                                    <input
                                        className="login-screen__input login-screen__input--password"
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        placeholder="Tu contraseña secreta"
                                        value={passwordForm.formState.password}
                                        onChange={passwordForm.handleChange}
                                        required
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        className="login-screen__password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="login-screen__eye-icon">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="login-screen__eye-icon">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button
                                className="login-screen__submit-btn"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                            </button>

                            {error && (
                                <div className="login-screen__error-msg">
                                    {error.message}
                                </div>
                            )}
                            
                            <button
                                className="login-screen__cancel-btn"
                                type="button"
                                onClick={goBackToEmail}
                            >
                                Volver al paso anterior
                            </button>
                        </form>

                        <div className="login-screen__links">
                            <Link to="/reset-password" className="login-screen__link login-screen__link--forgot">¿Olvidaste tu contraseña?</Link>
                        </div>
                    </>
                )}

                {step === '2fa' && (
                    <>
                        <h2 className="login-screen__heading">Introduce el código 2FA</h2>
                        <p className="login-screen__subheading">Hemos enviado un código temporal de 6 dígitos a <strong>{email}</strong>.</p>

                        <form className="login-screen__form" onSubmit={twofaForm.handleSubmit}>
                            <div className="login-screen__input-group">
                                <label className="login-screen__label" htmlFor="code">Código de acceso</label>
                                <input
                                    className="login-screen__input login-screen__input--code"
                                    type="text"
                                    id="code"
                                    name="code"
                                    placeholder="123456"
                                    maxLength={6}
                                    value={twofaForm.formState.code}
                                    onChange={twofaForm.handleChange}
                                    required
                                    autoFocus
                                />
                            </div>

                            <button
                                className="login-screen__submit-btn"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Verificando...' : 'Verificar código'}
                            </button>

                            {error && (
                                <div className="login-screen__error-msg">
                                    {error.message}
                                </div>
                            )}

                            <button
                                className="login-screen__cancel-btn"
                                type="button"
                                onClick={goBackToEmail}
                            >
                                Volver a intentar
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}

export default LoginScreen
