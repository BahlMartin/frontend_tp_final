import React from 'react'
import Logo from '../../components/Logo/Logo.jsx'
import useResetPassword from '../../hooks/useResetPassword.js'
import ForgotPasswordRequestForm from '../../components/ForgotPasswordRequestForm/ForgotPasswordRequestForm.jsx'
import ForgotPasswordSuccess from '../../components/ForgotPasswordSuccess/ForgotPasswordSuccess.jsx'
import ResetPasswordForm from '../../components/ResetPasswordForm/ResetPasswordForm.jsx'
import ResetPasswordSuccess from '../../components/ResetPasswordSuccess/ResetPasswordSuccess.jsx'
import './ResetPasswordScreen.css'

export const ResetPasswordScreen = () => {
    const {
        token,
        emailSent,
        resetSuccess,
        showPassword,
        showConfirmPassword,
        passwordMatchError,
        forgotLoading,
        forgotError,
        resetLoading,
        resetError,
        forgotForm,
        resetForm,
        toggleShowPassword,
        toggleShowConfirmPassword
    } = useResetPassword()

    return (
        <div className="reset-screen">
            <div className="reset-screen__container">
                <Logo
                    containerClassName="reset-screen__logo-container"
                    svgClassName="reset-screen__logo"
                    textClassName="reset-screen__logo-text"
                />

                {/* Si NO hay token: Solicitar link de recuperación */}
                {!token ? (
                    !emailSent ? (
                        <ForgotPasswordRequestForm
                            forgotForm={forgotForm}
                            forgotLoading={forgotLoading}
                            forgotError={forgotError}
                        />
                    ) : (
                        <ForgotPasswordSuccess />
                    )
                ) : (
                    /* Si SÍ hay token: Establecer nueva contraseña */
                    !resetSuccess ? (
                        <ResetPasswordForm
                            resetForm={resetForm}
                            showPassword={showPassword}
                            showConfirmPassword={showConfirmPassword}
                            toggleShowPassword={toggleShowPassword}
                            toggleShowConfirmPassword={toggleShowConfirmPassword}
                            passwordMatchError={passwordMatchError}
                            resetError={resetError}
                            resetLoading={resetLoading}
                        />
                    ) : (
                        <ResetPasswordSuccess />
                    )
                )}
            </div>
        </div>
    )
}

export default ResetPasswordScreen
