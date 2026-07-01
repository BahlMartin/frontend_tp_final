import React, { useState } from 'react'
import useLogin from '../../hooks/useLogin.js'
import Logo from '../../components/Logo/Logo.jsx'
import EmailStep from '../../components/EmailStep/EmailStep.jsx'
import PasswordStep from '../../components/PasswordStep/PasswordStep.jsx'
import TwoFAStep from '../../components/TwoFAStep/TwoFAStep.jsx'
import './LoginScreen.css'

export const LoginScreen = () => {
    const [showPassword, setShowPassword] = useState(false)
    const {
        step,
        email,
        loading,
        error,
        form,
        goBackToEmail
    } = useLogin()

    return (
        <div className="login-screen">
            <div className="login-screen__container">
                <Logo
                    containerClassName="login-screen__logo-container"
                    svgClassName="login-screen__logo"
                    textClassName="login-screen__title"
                />

                {step === 'email' && (
                    <EmailStep
                        form={form}
                        loading={loading}
                        error={error}
                    />
                )}

                {step === 'password' && (
                    <PasswordStep
                        form={form}
                        email={email}
                        loading={loading}
                        error={error}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        goBackToEmail={goBackToEmail}
                    />
                )}

                {step === '2fa' && (
                    <TwoFAStep
                        form={form}
                        email={email}
                        loading={loading}
                        error={error}
                        goBackToEmail={goBackToEmail}
                    />
                )}
            </div>
        </div>
    )
}

export default LoginScreen
