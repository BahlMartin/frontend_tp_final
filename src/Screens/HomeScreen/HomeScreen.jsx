import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import useAuth from '../../hooks/useAuth'
import useWorkspace from '../../hooks/useWorkspace'
import useForm from '../../hooks/useForm'
import { createWorkspace } from '../../services/workspaceService'
import './HomeScreen.css'

export const HomeScreen = () => {
    const { userData, logout } = useAuth()
    const { workspaces, refetchWorkspaces, loading } = useWorkspace()
    const navigate = useNavigate()
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [createError, setCreateError] = useState(null)
    const [isCreating, setIsCreating] = useState(false)

    const initialWorkspaceState = {
        name: '',
        description: ''
    }

    const handleCreateSubmit = async (formData) => {
        setCreateError(null)
        setIsCreating(true)
        try {
            const res = await createWorkspace(formData.name, formData.description)
            if (res.ok && res.data?._id) {
                setShowCreateModal(false)
                refetchWorkspaces()
                // Redirigir al nuevo workspace creado
                navigate(`/workspace/${res.data._id}`)
            }
        } catch (err) {
            console.error("Error al crear espacio de trabajo:", err)
            setCreateError(err.message || "Error al crear el espacio de trabajo")
        } finally {
            setIsCreating(false)
        }
    }

    const { formState, handleChange, handleSubmit, resetForm } = useForm(initialWorkspaceState, handleCreateSubmit)

    // Generador de Iniciales para Avatares
    const getInitials = (first, last, username) => {
        if (first && last) return (first[0] + last[0]).toUpperCase()
        if (username) return username.slice(0, 2).toUpperCase()
        return 'U'
    }

    return (
        <div className="home-screen">
            {/* Cabecera */}
            <header className="home-screen__header">
                <div className="home-screen__header-logo">
                    <svg className="home-screen__logo-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                        <path d="M26.2,74.9 C26.2,80.7 21.5,85.4 15.7,85.4 C9.9,85.4 5.2,80.7 5.2,74.9 C5.2,69.1 9.9,64.4 15.7,64.4 L26.2,64.4 L26.2,74.9 Z" fill="#E01E5A" />
                        <path d="M31.4,74.9 C31.4,69.1 36.1,64.4 41.9,64.4 C47.7,64.4 52.4,69.1 52.4,74.9 L52.4,106.3 C52.4,112.1 47.7,116.8 41.9,116.8 C36.1,116.8 31.4,112.1 31.4,106.3 L31.4,74.9 Z" fill="#E01E5A" />
                        <path d="M41.9,26.2 C36.1,26.2 31.4,21.5 31.4,15.7 C31.4,9.9 36.1,5.2 41.9,5.2 C47.7,5.2 52.4,9.9 52.4,15.7 L52.4,26.2 L41.9,26.2 Z" fill="#36C5F0" />
                        <path d="M41.9,31.4 C47.7,31.4 52.4,36.1 52.4,41.9 C52.4,47.7 47.7,52.4 41.9,52.4 L10.5,52.4 C4.7,52.4 0,47.7 0,41.9 C0,36.1 4.7,31.4 10.5,31.4 L41.9,31.4 Z" fill="#36C5F0" />
                        <path d="M93.8,41.9 C93.8,36.1 98.5,31.4 104.3,31.4 C110.1,31.4 114.8,36.1 114.8,41.9 C114.8,47.7 110.1,52.4 104.3,52.4 L93.8,52.4 L93.8,41.9 Z" fill="#2EB67D" />
                        <path d="M88.6,41.9 C88.6,47.7 83.9,52.4 78.1,52.4 C72.3,52.4 67.6,47.7 67.6,41.9 L67.6,10.5 C67.6,4.7 72.3,0 78.1,0 C83.9,0 88.6,4.7 88.6,10.5 L88.6,41.9 Z" fill="#2EB67D" />
                        <path d="M78.1,93.8 C83.9,93.8 88.6,98.5 88.6,104.3 C88.6,110.1 83.9,114.8 78.1,114.8 C72.3,114.8 67.6,110.1 67.6,104.3 L67.6,93.8 L78.1,93.8 Z" fill="#ECB22E" />
                        <path d="M78.1,88.6 C72.3,88.6 67.6,83.9 67.6,78.1 C67.6,73.3 72.3,68.6 78.1,68.6 L109.5,68.6 C115.3,68.6 120,73.3 120,78.1 C120,83.9 115.3,88.6 109.5,88.6 L78.1,88.6 Z" fill="#ECB22E" />
                    </svg>
                    <span className="home-screen__logo-text">slack</span>
                </div>
                <div className="home-screen__user-profile">
                    <Link to="/user" className="home-screen__profile-link" title="Editar Perfil">
                        <div className="home-screen__avatar">
                            {getInitials(userData?.first_name, userData?.last_name, userData?.user_name)}
                        </div>
                        <span className="home-screen__user-name">
                            {userData?.first_name ? `${userData.first_name} ${userData.last_name}` : userData?.user_name}
                        </span>
                    </Link>
                    <button className="home-screen__logout-btn" onClick={logout}>Cerrar Sesión</button>
                </div>
            </header>

            {/* Contenido Principal */}
            <main className="home-screen__main">
                <div className="home-screen__welcome-section">
                    <span className="home-screen__welcome-label">¡Hola de nuevo!</span>
                    <h1 className="home-screen__welcome-title">Elige un espacio de trabajo para empezar</h1>
                </div>

                <div className="home-screen__workspaces-card">
                    <div className="home-screen__workspaces-header">
                        <span className="home-screen__workspaces-count">
                            Espacios de trabajo para {userData?.user_name}
                        </span>
                    </div>

                    <div className="home-screen__workspaces-list">
                        {loading && workspaces.length === 0 ? (
                            <div className="home-screen__loading-indicator">
                                <div className="home-screen__spinner"></div>
                                <span>Cargando tus espacios de trabajo...</span>
                            </div>
                        ) : workspaces.length === 0 ? (
                            <div className="home-screen__empty-workspaces">
                                <p>No perteneces a ningún espacio de trabajo actualmente.</p>
                            </div>
                        ) : (
                            workspaces.map((ws) => (
                                <div className="home-screen__workspace-item" key={ws._id}>
                                    <div className="home-screen__workspace-info">
                                        <div className="home-screen__workspace-avatar">
                                            {ws.name.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div className="home-screen__workspace-text">
                                            <span className="home-screen__workspace-name">{ws.name}</span>
                                            <span className="home-screen__workspace-members-count">
                                                ID: {ws._id}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        className="home-screen__workspace-enter-btn"
                                        onClick={() => navigate(`/workspace/${ws._id}`)}
                                    >
                                        Entrar a Slack
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="home-screen__workspace-actions">
                        <span className="home-screen__action-desc">¿Quieres usar Slack con otro equipo?</span>
                        <button
                            className="home-screen__create-workspace-btn"
                            onClick={() => {
                                resetForm()
                                setCreateError(null)
                                setShowCreateModal(true)
                            }}
                        >
                            Crear un espacio de trabajo
                        </button>
                    </div>
                </div>
            </main>

            {/* Modal para Crear Workspace */}
            {showCreateModal && (
                <div className="home-screen__modal-overlay">
                    <div className="home-screen__modal-box">
                        <div className="home-screen__modal-header">
                            <h3 className="home-screen__modal-title">Crear espacio de trabajo</h3>
                            <button
                                className="home-screen__modal-close-btn"
                                onClick={() => setShowCreateModal(false)}
                            >
                                &times;
                            </button>
                        </div>
                        <form className="home-screen__modal-form" onSubmit={handleSubmit}>
                            <div className="home-screen__input-group">
                                <label className="home-screen__label" htmlFor="name">Nombre del espacio</label>
                                <input
                                    className="home-screen__input"
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Ej. Acme Corp, UTN Backend..."
                                    value={formState.name}
                                    onChange={handleChange}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="home-screen__input-group">
                                <label className="home-screen__label" htmlFor="description">Descripción del espacio</label>
                                <textarea
                                    className="home-screen__input"
                                    id="description"
                                    name="description"
                                    placeholder="Ej. Canal de comunicación interna para Acme Corp"
                                    value={formState.description}
                                    onChange={handleChange}
                                />
                            </div>

                            {createError && (
                                <div className="home-screen__modal-error">
                                    {createError}
                                </div>
                            )}

                            <div className="home-screen__modal-actions">
                                <button
                                    className="home-screen__modal-btn home-screen__modal-btn--cancel"
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    disabled={isCreating}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="home-screen__modal-btn home-screen__modal-btn--submit"
                                    type="submit"
                                    disabled={isCreating}
                                >
                                    {isCreating ? 'Creando...' : 'Crear espacio'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HomeScreen
