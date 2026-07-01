import React from 'react'
import useRegister from '../../hooks/useRegister.js'
import Logo from '../../components/Logo/Logo.jsx'
import RegisterForm from '../../components/RegisterForm/RegisterForm.jsx'
import RegisterSuccess from '../../components/RegisterSuccess/RegisterSuccess.jsx'
import './RegisterScreen.css'

export const RegisterScreen = () => {
    const {
        form,
        registered,
        registeredEmail,
        showPassword,
        toggleShowPassword,
        loading,
        error
    } = useRegister()

    return (
        <div className="register-screen">
            <div className="register-screen__container">
                <Logo 
                    containerClassName="register-screen__logo-container" 
                    svgClassName="register-screen__logo" 
                    textClassName="register-screen__logo-text" 
                />

                {!registered ? (
                    <RegisterForm
                        form={form}
                        showPassword={showPassword}
                        toggleShowPassword={toggleShowPassword}
                        loading={loading}
                        error={error}
                    />
                ) : (
                    <RegisterSuccess 
                        registeredEmail={registeredEmail} 
                    />
                )}
            </div>
        </div>
    )
}

export default RegisterScreen
