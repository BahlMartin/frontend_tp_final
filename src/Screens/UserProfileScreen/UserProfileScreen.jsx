import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import useAuth from '../../hooks/useAuth'
import useForm from '../../hooks/useForm'
import useRequest from '../../hooks/useRequest'
import { updateMe } from '../../services/userService'
import './UserProfileScreen.css'

export const UserProfileScreen = () => {
    const { userData, refreshUser } = useAuth()
    const navigate = useNavigate()
    const [successMsg, setSuccessMsg] = useState(false)

    const {
        sendRequest,
        loading,
        error
    } = useRequest()

    const initialFormState = {
        first_name: userData?.first_name || '',
        last_name: userData?.last_name || '',
        user_name: userData?.user_name || '',
        email: userData?.email || ''
    }

    // Actualiza el formulario cuando el contexto termine de cargarse desde la base de datos
    const profileForm = useForm(initialFormState, async (formData) => {
        setSuccessMsg(false)
        try {
            const res = await sendRequest(() => updateMe(formData))
            if (res.ok) {
                setSuccessMsg(true)
                // Actualizar contexto global
                await refreshUser()
            }
        } catch (err) {
            console.error("Error al actualizar perfil:", err)
        }
    })

    useEffect(() => {
        if (userData) {
            profileForm.setFormState({
                first_name: userData.first_name || '',
                last_name: userData.last_name || '',
                user_name: userData.user_name || '',
                email: userData.email || ''
            })
        }
    }, [userData])

    const getInitials = (first, last, username) => {
        if (first && last) return (first[0] + last[0]).toUpperCase()
        if (username) return username.slice(0, 2).toUpperCase()
        return 'U'
    }

    return (
        <div className="user-profile">
            {/* Header */}
            <header className="user-profile__header">
                <div className="user-profile__logo-container">
                    <svg className="user-profile__logo-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                        <path d="M26.2,74.9 C26.2,80.7 21.5,85.4 15.7,85.4 C9.9,85.4 5.2,80.7 5.2,74.9 C5.2,69.1 9.9,64.4 15.7,64.4 L26.2,64.4 L26.2,74.9 Z" fill="#E01E5A"/>
                        <path d="M31.4,74.9 C31.4,69.1 36.1,64.4 41.9,64.4 C47.7,64.4 52.4,69.1 52.4,74.9 L52.4,106.3 C52.4,112.1 47.7,116.8 41.9,116.8 C36.1,116.8 31.4,112.1 31.4,106.3 L31.4,74.9 Z" fill="#E01E5A"/>
                        <path d="M41.9,26.2 C36.1,26.2 31.4,21.5 31.4,15.7 C31.4,9.9 36.1,5.2 41.9,5.2 C47.7,5.2 52.4,9.9 52.4,15.7 L52.4,26.2 L41.9,26.2 Z" fill="#36C5F0"/>
                        <path d="M41.9,31.4 C47.7,31.4 52.4,36.1 52.4,41.9 C52.4,47.7 47.7,52.4 41.9,52.4 L10.5,52.4 C4.7,52.4 0,47.7 0,41.9 C0,36.1 4.7,31.4 10.5,31.4 L41.9,31.4 Z" fill="#36C5F0"/>
                        <path d="M93.8,41.9 C93.8,36.1 98.5,31.4 104.3,31.4 C110.1,31.4 114.8,36.1 114.8,41.9 C114.8,47.7 110.1,52.4 104.3,52.4 L93.8,52.4 L93.8,41.9 Z" fill="#2EB67D"/>
                        <path d="M88.6,41.9 C88.6,47.7 83.9,52.4 78.1,52.4 C72.3,52.4 67.6,47.7 67.6,41.9 L67.6,10.5 C67.6,4.7 72.3,0 78.1,0 C83.9,0 88.6,4.7 88.6,10.5 L88.6,41.9 Z" fill="#2EB67D"/>
                        <path d="M78.1,93.8 C83.9,93.8 88.6,98.5 88.6,104.3 C88.6,110.1 83.9,114.8 78.1,114.8 C72.3,114.8 67.6,110.1 67.6,104.3 L67.6,93.8 L78.1,93.8 Z" fill="#ECB22E"/>
                        <path d="M78.1,88.6 C72.3,88.6 67.6,83.9 67.6,78.1 C67.6,73.3 72.3,68.6 78.1,68.6 L109.5,68.6 C115.3,68.6 120,73.3 120,78.1 C120,83.9 115.3,88.6 109.5,88.6 L78.1,88.6 Z" fill="#ECB22E"/>
                    </svg>
                    <span className="user-profile__logo-text">slack</span>
                </div>
                <button type="button" className="user-profile__back-btn" onClick={() => navigate(-1)}>
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
                            {getInitials(userData?.first_name, userData?.last_name, userData?.user_name)}
                        </div>
                        <div className="user-profile__avatar-text">
                            <h3>Foto de perfil</h3>
                            <p>Tu inicial se genera de forma automática a partir de tus nombres.</p>
                        </div>
                    </div>

                    <form className="user-profile__form" onSubmit={profileForm.handleSubmit}>
                        <div className="user-profile__row">
                            <div className="user-profile__input-group">
                                <label className="user-profile__label" htmlFor="first_name">Nombre</label>
                                <input
                                    className="user-profile__input"
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    value={profileForm.formState.first_name}
                                    onChange={profileForm.handleChange}
                                    required
                                />
                            </div>

                            <div className="user-profile__input-group">
                                <label className="user-profile__label" htmlFor="last_name">Apellido</label>
                                <input
                                    className="user-profile__input"
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    value={profileForm.formState.last_name}
                                    onChange={profileForm.handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="user-profile__input-group">
                            <label className="user-profile__label" htmlFor="user_name">Nombre de usuario (display name)</label>
                            <input
                                className="user-profile__input"
                                type="text"
                                id="user_name"
                                name="user_name"
                                value={profileForm.formState.user_name}
                                onChange={profileForm.handleChange}
                                required
                            />
                        </div>

                        <div className="user-profile__input-group">
                            <label className="user-profile__label" htmlFor="email">Correo electrónico</label>
                            <input
                                className="user-profile__input"
                                type="email"
                                id="email"
                                name="email"
                                value={profileForm.formState.email}
                                onChange={profileForm.handleChange}
                                required
                            />
                        </div>

                        {successMsg && (
                            <div className="user-profile__success">
                                ¡Perfil actualizado exitosamente!
                            </div>
                        )}

                        {error && (
                            <div className="user-profile__error">
                                {error.message || String(error)}
                            </div>
                        )}

                        <div className="user-profile__actions">
                            <button
                                type="button"
                                className="user-profile__btn user-profile__btn--cancel"
                                onClick={() => navigate(-1)}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="user-profile__btn user-profile__btn--submit"
                                disabled={loading}
                            >
                                {loading ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}

export default UserProfileScreen
