import React from 'react'
import useUserProfile from '../../hooks/useUserProfile.js'
import Logo from '../../components/Logo/Logo.jsx'
import UserProfileForm from '../../components/UserProfileForm/UserProfileForm.jsx'
import './UserProfileScreen.css'

export const UserProfileScreen = () => {
    const {
        formState,
        handleChange,
        handleSubmit,
        loading,
        error,
        successMsg,
        handleBack,
        initials
    } = useUserProfile()

    return (
        <div className="user-profile">
            {/* Header */}
            <header className="user-profile__header">
                <Logo
                    containerClassName="user-profile__logo-container"
                    svgClassName="user-profile__logo-svg"
                    textClassName="user-profile__logo-text"
                />
                <button type="button" className="user-profile__back-btn" onClick={handleBack}>
                    Volver
                </button>
            </header>

            {/* Formulario */}
            <main className="user-profile__main">
                <div className="user-profile__card">
                    <h1 className="user-profile__title">Tu perfil</h1>
                    <p className="user-profile__desc">Personaliza los datos y cómo te ven los demás miembros en los espacios de trabajo.</p>

                    <div className="user-profile__avatar-container">
                        <div className="user-profile__avatar-badge">
                            {initials}
                        </div>
                        <div className="user-profile__avatar-text">
                            <h3>Foto de perfil</h3>
                            <p>Tu inicial se genera de forma automática a partir de tus nombres.</p>
                        </div>
                    </div>

                    <UserProfileForm
                        formState={formState}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        loading={loading}
                        error={error}
                        successMsg={successMsg}
                        handleCancel={handleBack}
                    />
                </div>
            </main>
        </div>
    )
}

export default UserProfileScreen


