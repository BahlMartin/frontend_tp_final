import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link, Outlet, useLocation } from 'react-router'
import useAuth from '../../hooks/useAuth'
import useWorkspace from '../../hooks/useWorkspace'
import useForm from '../../hooks/useForm'
import { createChannel, inviteMember, updateMemberRole, removeMember, updateWorkspace, deleteWorkspace } from '../../services/workspaceService'
import './WorkspaceScreen.css'
 
export const WorkspaceScreen = () => {
    const { workspaceId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { userData, logout } = useAuth()
    const {
        currentWorkspace,
        channels,
        members,
        loading,
        error,
        refetchCurrentWorkspace,
        refetchWorkspaces
    } = useWorkspace()
 
    // Control de modales y menús
    const [showChannelModal, setShowChannelModal] = useState(false)
    const [showInviteModal, setShowInviteModal] = useState(false)
    const [showProfileDropdown, setShowProfileDropdown] = useState(false)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    
    // Control de modal de configuracion de workspace
    const [showWorkspaceSettingsModal, setShowWorkspaceSettingsModal] = useState(false)
    const [editWSName, setEditWSName] = useState('')
    const [editWSDesc, setEditWSDesc] = useState('')
    const [isUpdatingWS, setIsUpdatingWS] = useState(false)
    const [updateWSError, setUpdateWSError] = useState(null)
    
    // Estados para administración de roles/miembros del workspace
    const [selectedMember, setSelectedMember] = useState(null)
    const [selectedRole, setSelectedRole] = useState('')
    const [updatingRole, setUpdatingRole] = useState(false)
    const [roleError, setRoleError] = useState(null)

    // Sync selectedRole with current member role
    useEffect(() => {
        if (selectedMember) {
            setSelectedRole(selectedMember.role)
            setRoleError(null)
        }
    }, [selectedMember])

    useEffect(() => {
        if (currentWorkspace) {
            setEditWSName(currentWorkspace.name)
            setEditWSDesc(currentWorkspace.description || '')
        }
    }, [currentWorkspace])

    const handleRoleUpdate = async (e) => {
        e.preventDefault()
        if (!selectedMember) return
        setRoleError(null)
        setUpdatingRole(true)
        try {
            const res = await updateMemberRole(workspaceId, selectedMember.id, selectedRole)
            if (res.ok) {
                setSelectedMember(null)
                refetchCurrentWorkspace()
            }
        } catch (err) {
            console.error("Error al actualizar rol:", err)
            setRoleError(err.message || "Error al actualizar rol")
        } finally {
            setUpdatingRole(false)
        }
    }

    const handleRemoveWorkspaceMember = async () => {
        if (!selectedMember) return
        if (!window.confirm(`¿Estás seguro de que quieres eliminar a ${selectedMember.user_name || 'este miembro'} del espacio de trabajo?`)) return
        setRoleError(null)
        setUpdatingRole(true)
        try {
            const res = await removeMember(workspaceId, selectedMember.id)
            if (res.ok) {
                setSelectedMember(null)
                refetchCurrentWorkspace()
            }
        } catch (err) {
            console.error("Error al eliminar miembro:", err)
            setRoleError(err.message || "Error al eliminar miembro")
        } finally {
            setUpdatingRole(false)
        }
    }

    // Actualizar workspace
    const handleUpdateWorkspaceSubmit = async (e) => {
        e.preventDefault()
        if (!editWSName.trim() || isUpdatingWS) return
        setUpdateWSError(null)
        setIsUpdatingWS(true)
        try {
            await updateWorkspace(workspaceId, editWSName, editWSDesc)
            setShowWorkspaceSettingsModal(false)
            await refetchCurrentWorkspace()
            await refetchWorkspaces()
        } catch (err) {
            console.error("Error al actualizar workspace:", err)
            setUpdateWSError(err.message || "Error al actualizar workspace")
        } finally {
            setIsUpdatingWS(false)
        }
    }

    // Eliminar workspace
    const handleDeleteWorkspace = async () => {
        if (!window.confirm("¿ESTÁS TOTALMENTE SEGURO de que deseas eliminar este espacio de trabajo? Esta acción eliminará permanentemente todos los canales, mensajes y miembros. No se puede deshacer.")) return
        setUpdateWSError(null)
        setIsUpdatingWS(true)
        try {
            await deleteWorkspace(workspaceId)
            setShowWorkspaceSettingsModal(false)
            await refetchWorkspaces()
            navigate('/home')
        } catch (err) {
            console.error("Error al eliminar workspace:", err)
            alert(err.message || "Error al eliminar workspace")
        } finally {
            setIsUpdatingWS(false)
        }
    }

    // Estados de envío
    const [chanError, setChanError] = useState(null)
    const [isCreatingChan, setIsCreatingChan] = useState(false)
    const [inviteError, setInviteError] = useState(null)
    const [inviteSuccess, setInviteSuccess] = useState(false)
    const [isInviting, setIsInviting] = useState(false)

    const initialChannelState = { name: '', description: '' }
    const initialInviteState = { email: '' }

    // Crear canal
    const handleChannelSubmit = async (formData) => {
        setChanError(null)
        setIsCreatingChan(true)
        try {
            const cleanName = formData.name.toLowerCase().replace(/\s+/g, '-')
            const res = await createChannel(workspaceId, cleanName, formData.description)
            if (res.ok && res.data?._id) {
                setShowChannelModal(false)
                refetchCurrentWorkspace()
                navigate(`/workspace/${workspaceId}/channel/${res.data._id}`)
            }
        } catch (err) {
            console.error("Error al crear canal:", err)
            setChanError(err.message || "Error al crear el canal")
        } finally {
            setIsCreatingChan(false)
        }
    }

    // Invitar miembro
    const handleInviteSubmit = async (formData) => {
        setInviteError(null)
        setInviteSuccess(false)
        setIsInviting(true)
        try {
            const res = await inviteMember(workspaceId, formData.email)
            if (res.ok) {
                setInviteSuccess(true)
                inviteForm.resetForm()
            }
        } catch (err) {
            console.error("Error al invitar:", err)
            setInviteError(err.message || "Error al enviar invitación")
        } finally {
            setIsInviting(false)
        }
    }

    const chanForm = useForm(initialChannelState, handleChannelSubmit)
    const inviteForm = useForm(initialInviteState, handleInviteSubmit)

    const getInitials = (first, last, username) => {
        if (first && last) return (first[0] + last[0]).toUpperCase()
        if (username) return username.slice(0, 2).toUpperCase()
        return 'U'
    }

    // Verificar si el canal está activo para colorear en sidebar
    const isActiveChannel = (id) => location.pathname.includes(`/channel/${id}`)

    const currentWSMember = members.find(m => m.user_name === userData?.user_name || m.email === userData?.email);
    const isCurrentUserOwner = currentWSMember?.role === 'owner';

    return (
        <div className="workspace-screen">
            {/* Barra de Navegación Superior Estilo Slack */}
            <header className="workspace-screen__topbar">
                <button 
                    className="workspace-screen__menu-toggle"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    title="Menu"
                >
                    ☰
                </button>
                <div style={{ flex: 1 }}></div> {/* Espaciador para empujar el usuario a la derecha */}
                <div className="workspace-screen__topbar-user">
                    <div 
                        className="workspace-screen__topbar-avatar"
                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    >
                        {getInitials(userData?.first_name, userData?.last_name, userData?.user_name)}
                    </div>

                    {showProfileDropdown && (
                        <div className="workspace-screen__profile-dropdown">
                            <div className="workspace-screen__dropdown-header">
                                <span className="workspace-screen__dropdown-name">
                                    {userData?.first_name ? `${userData.first_name} ${userData.last_name}` : userData?.user_name}
                                </span>
                                <span className="workspace-screen__dropdown-email">{userData?.email}</span>
                            </div>
                            <Link 
                                to="/user" 
                                className="workspace-screen__dropdown-item"
                                onClick={() => setShowProfileDropdown(false)}
                            >
                                Configurar Perfil
                            </Link>
                            <Link 
                                to="/home" 
                                className="workspace-screen__dropdown-item"
                                onClick={() => setShowProfileDropdown(false)}
                            >
                                Cambiar de Workspace
                            </Link>
                            <button 
                                className="workspace-screen__dropdown-item workspace-screen__dropdown-item--logout"
                                onClick={logout}
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <div className="workspace-screen__body">
                {/* Sidebar izquierdo (Canales y Miembros) */}
                <aside className={`workspace-screen__sidebar ${sidebarOpen ? 'workspace-screen__sidebar--open' : ''}`}>
                    <div className="workspace-screen__sidebar-header">
                        <Link 
                            to={`/workspace/${workspaceId}`} 
                            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}
                        >
                            <h2 className="workspace-screen__sidebar-title">{currentWorkspace?.name || 'Cargando...'}</h2>
                        </Link>
                        {isCurrentUserOwner && (
                            <button 
                                className="workspace-screen__sidebar-settings-btn"
                                onClick={() => setShowWorkspaceSettingsModal(true)}
                                title="Configuración del espacio de trabajo"
                            >
                                ⚙️
                            </button>
                        )}
                    </div>

                    <nav className="workspace-screen__sidebar-nav">
                        {/* Canales */}
                        <div className="workspace-screen__sidebar-section">
                            <div className="workspace-screen__section-header">
                                <span className="workspace-screen__section-title">Canales</span>
                                <button 
                                    className="workspace-screen__add-btn"
                                    onClick={() => {
                                        chanForm.resetForm()
                                        setChanError(null)
                                        setShowChannelModal(true)
                                    }}
                                    title="Crear Canal"
                                >
                                    +
                                </button>
                            </div>
                            <div className="workspace-screen__section-list">
                                {channels.map((chan) => (
                                    <button
                                        key={chan._id}
                                        className={`workspace-screen__item-btn ${isActiveChannel(chan._id) ? 'workspace-screen__item-btn--active' : ''}`}
                                        onClick={() => {
                                            setSidebarOpen(false)
                                            navigate(`/workspace/${workspaceId}/channel/${chan._id}`)
                                        }}
                                    >
                                        <span className="workspace-screen__channel-hash">#</span> {chan.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Miembros */}
                        <div className="workspace-screen__sidebar-section">
                            <div className="workspace-screen__section-header">
                                <span className="workspace-screen__section-title">Miembros</span>
                                <button 
                                    className="workspace-screen__add-btn"
                                    onClick={() => {
                                        inviteForm.resetForm()
                                        setInviteError(null)
                                        setInviteSuccess(false)
                                        setShowInviteModal(true)
                                    }}
                                    title="Invitar Miembro"
                                >
                                    +
                                </button>
                            </div>
                            <div className="workspace-screen__section-list">
                                {members.map((member) => (
                                    <div 
                                        className="workspace-screen__member-item workspace-screen__member-item--clickable" 
                                        key={member._id || member.id}
                                        onClick={() => setSelectedMember(member)}
                                        title="Administrar miembro"
                                    >
                                        <div className="workspace-screen__member-indicator"></div>
                                        <div className="workspace-screen__member-info-container">
                                            <span className="workspace-screen__member-name">
                                                {member.user_name || member.email.split('@')[0]}
                                            </span>
                                            <span className="workspace-screen__member-role-badge">
                                                {member.role}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </nav>
                </aside>

                {/* Contenido Derecho (Chat de Canal u Outlet de bienvenida) */}
                <main className="workspace-screen__main-content">
                    {loading ? (
                        <div className="workspace-screen__loader">
                            <div className="workspace-screen__spinner"></div>
                            <span>Cargando espacio de trabajo...</span>
                        </div>
                    ) : error ? (
                        <div className="workspace-screen__error-card">
                            <h3>Error al cargar Workspace</h3>
                            <p>{error}</p>
                            <Link to="/home" className="workspace-screen__back-link">
                                Volver al panel inicial
                            </Link>
                        </div>
                    ) : (
                        <Outlet />
                    )}
                </main>
            </div>

            {/* Modal Crear Canal */}
            {showChannelModal && (
                <div className="workspace-screen__modal-overlay">
                    <div className="workspace-screen__modal-box">
                        <div className="workspace-screen__modal-header">
                            <h3 className="workspace-screen__modal-title">Crear un canal nuevo</h3>
                            <button className="workspace-screen__modal-close" onClick={() => setShowChannelModal(false)}>&times;</button>
                        </div>
                        <form className="workspace-screen__modal-form" onSubmit={chanForm.handleSubmit}>
                            <div className="workspace-screen__input-group">
                                <label className="workspace-screen__label" htmlFor="channel-name">Nombre del canal</label>
                                <input
                                    className="workspace-screen__input"
                                    type="text"
                                    id="channel-name"
                                    name="name"
                                    placeholder="Ej. planificacion-semanal"
                                    value={chanForm.formState.name}
                                    onChange={chanForm.handleChange}
                                    required
                                    autoFocus
                                />
                                <span className="workspace-screen__input-tip">
                                    Los canales se escriben siempre en minúsculas y sin espacios.
                                </span>
                            </div>

                            <div className="workspace-screen__input-group">
                                <label className="workspace-screen__label" htmlFor="channel-description">Descripción</label>
                                <input
                                    className="workspace-screen__input"
                                    type="text"
                                    id="channel-description"
                                    name="description"
                                    placeholder="Ej. Avisos y debates sobre el desarrollo"
                                    value={chanForm.formState.description}
                                    onChange={chanForm.handleChange}
                                />
                            </div>

                            {chanError && (
                                <div className="workspace-screen__modal-error">
                                    {chanError}
                                </div>
                            )}

                            <div className="workspace-screen__modal-actions">
                                <button 
                                    className="workspace-screen__modal-btn workspace-screen__modal-btn--cancel"
                                    type="button"
                                    onClick={() => setShowChannelModal(false)}
                                    disabled={isCreatingChan}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    className="workspace-screen__modal-btn workspace-screen__modal-btn--submit"
                                    type="submit"
                                    disabled={isCreatingChan}
                                >
                                    {isCreatingChan ? 'Creando...' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Invitar Miembro */}
            {showInviteModal && (
                <div className="workspace-screen__modal-overlay">
                    <div className="workspace-screen__modal-box">
                        <div className="workspace-screen__modal-header">
                            <h3 className="workspace-screen__modal-title">Invitar miembros a {currentWorkspace?.name}</h3>
                            <button className="workspace-screen__modal-close" onClick={() => setShowInviteModal(false)}>&times;</button>
                        </div>
                        <form className="workspace-screen__modal-form" onSubmit={inviteForm.handleSubmit}>
                            {!inviteSuccess ? (
                                <>
                                    <div className="workspace-screen__input-group">
                                        <label className="workspace-screen__label" htmlFor="invite-email">Correo electrónico</label>
                                        <input
                                            className="workspace-screen__input"
                                            type="email"
                                            id="invite-email"
                                            name="email"
                                            placeholder="colaborador@empresa.com"
                                            value={inviteForm.formState.email}
                                            onChange={inviteForm.handleChange}
                                            required
                                            autoFocus
                                        />
                                    </div>

                                    {inviteError && (
                                        <div className="workspace-screen__modal-error">
                                            {inviteError}
                                        </div>
                                    )}

                                    <div className="workspace-screen__modal-actions">
                                        <button 
                                            className="workspace-screen__modal-btn workspace-screen__modal-btn--cancel"
                                            type="button"
                                            onClick={() => setShowInviteModal(false)}
                                            disabled={isInviting}
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            className="workspace-screen__modal-btn workspace-screen__modal-btn--submit"
                                            type="submit"
                                            disabled={isInviting}
                                        >
                                            {isInviting ? 'Enviando...' : 'Enviar invitación'}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="workspace-screen__success-invite">
                                    <span className="workspace-screen__success-badge">🎉</span>
                                    <h4>¡Invitación enviada con éxito!</h4>
                                    <p>Se ha enviado una solicitud a la casilla indicada.</p>
                                    <button 
                                        className="workspace-screen__modal-btn workspace-screen__modal-btn--submit"
                                        type="button"
                                        onClick={() => {
                                            setInviteSuccess(false)
                                            setInviteError(null)
                                        }}
                                    >
                                        Invitar a alguien más
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            )}
            {/* Modal Administrar Miembro del Workspace */}
            {selectedMember && (
                <div className="workspace-screen__modal-overlay">
                    <div className="workspace-screen__modal-box">
                        <div className="workspace-screen__modal-header">
                            <h3 className="workspace-screen__modal-title">Administrar Miembro</h3>
                            <button className="workspace-screen__modal-close" onClick={() => setSelectedMember(null)}>&times;</button>
                        </div>
                        <form className="workspace-screen__modal-form" onSubmit={handleRoleUpdate}>
                            <div className="workspace-screen__member-profile-info" style={{ textAlign: 'center', padding: '10px 0' }}>
                                <div style={{ fontSize: '40px', marginBottom: '8px' }}>👤</div>
                                <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '800' }}>
                                    {selectedMember.user_name}
                                </h4>
                                <p style={{ margin: 0, fontSize: '14px', color: '#616061' }}>
                                    {selectedMember.email}
                                </p>
                            </div>

                            {/* Mostrar rol actual */}
                            <div className="workspace-screen__input-group" style={{ marginTop: '20px' }}>
                                <label className="workspace-screen__label">Rol actual</label>
                                <span style={{ fontSize: '15px', color: '#1d1c1d', fontWeight: 'bold', textTransform: 'capitalize', display: 'block', marginTop: '4px' }}>
                                    {selectedMember.role}
                                </span>
                            </div>

                            {/* Si el usuario actual es owner, permitir cambiar rol (excepto si el seleccionado es el owner) */}
                            {(() => {
                                const currentWSMember = members.find(m => m.user_name === userData?.user_name || m.email === userData?.email);
                                const isCurrentUserOwner = currentWSMember?.role === 'owner';
                                const isTargetOwner = selectedMember.role === 'owner';

                                if (isCurrentUserOwner && !isTargetOwner) {
                                    return (
                                        <>
                                            <div className="workspace-screen__input-group" style={{ marginTop: '16px' }}>
                                                <label className="workspace-screen__label" htmlFor="member-role-select">
                                                    Asignar nuevo rol
                                                </label>
                                                <select
                                                    id="member-role-select"
                                                    className="workspace-screen__input"
                                                    style={{ height: '40px', padding: '0 10px', background: '#fff' }}
                                                    value={selectedRole}
                                                    onChange={(e) => setSelectedRole(e.target.value)}
                                                    required
                                                >
                                                    <option value="admin">Administrador (admin)</option>
                                                    <option value="member">Miembro (member)</option>
                                                </select>
                                            </div>

                                            {roleError && (
                                                <div className="workspace-screen__modal-error" style={{ marginTop: '12px', color: '#c5221f', background: '#fce8e6', padding: '8px', borderRadius: '4px', fontSize: '13px' }}>
                                                    {roleError}
                                                </div>
                                            )}

                                            <div className="workspace-screen__modal-actions" style={{ marginTop: '24px', display: 'flex', gap: '10px' }}>
                                                <button 
                                                    className="workspace-screen__modal-btn workspace-screen__modal-btn--danger"
                                                    type="button"
                                                    onClick={handleRemoveWorkspaceMember}
                                                    disabled={updatingRole}
                                                    style={{ marginRight: 'auto', backgroundColor: '#e01e5a', color: '#fff', border: 'none' }}
                                                >
                                                    Eliminar
                                                </button>
                                                <button 
                                                    className="workspace-screen__modal-btn workspace-screen__modal-btn--cancel"
                                                    type="button"
                                                    onClick={() => setSelectedMember(null)}
                                                    disabled={updatingRole}
                                                >
                                                    Cancelar
                                                </button>
                                                <button 
                                                    className="workspace-screen__modal-btn workspace-screen__modal-btn--submit"
                                                    type="submit"
                                                    disabled={updatingRole || selectedRole === selectedMember.role}
                                                >
                                                    {updatingRole ? 'Guardando...' : 'Guardar'}
                                                </button>
                                            </div>
                                        </>
                                    )
                                } else {
                                    return (
                                        <div className="workspace-screen__modal-actions" style={{ marginTop: '24px' }}>
                                            <button 
                                                className="workspace-screen__modal-btn workspace-screen__modal-btn--cancel"
                                                type="button"
                                                onClick={() => setSelectedMember(null)}
                                                style={{ width: '100%' }}
                                            >
                                                Cerrar
                                            </button>
                                        </div>
                                    )
                                }
                            })()}
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Configuración del Workspace */}
            {showWorkspaceSettingsModal && (
                <div className="workspace-screen__modal-overlay">
                    <div className="workspace-screen__modal-box">
                        <div className="workspace-screen__modal-header">
                            <h3 className="workspace-screen__modal-title">Configuración del espacio de trabajo</h3>
                            <button className="workspace-screen__modal-close" onClick={() => setShowWorkspaceSettingsModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleUpdateWorkspaceSubmit} className="workspace-screen__modal-form">
                            <div className="workspace-screen__input-group">
                                <label className="workspace-screen__label" htmlFor="edit-ws-name">Nombre del espacio</label>
                                <input
                                    type="text"
                                    id="edit-ws-name"
                                    className="workspace-screen__input"
                                    value={editWSName}
                                    onChange={(e) => setEditWSName(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="workspace-screen__input-group">
                                <label className="workspace-screen__label" htmlFor="edit-ws-desc">Descripción del espacio</label>
                                <textarea
                                    id="edit-ws-desc"
                                    className="workspace-screen__input workspace-screen__input--textarea"
                                    value={editWSDesc}
                                    onChange={(e) => setEditWSDesc(e.target.value)}
                                    placeholder="Agrega una descripción para tu equipo..."
                                />
                            </div>

                            {updateWSError && (
                                <div className="workspace-screen__modal-error">
                                    {updateWSError}
                                </div>
                            )}

                            <div className="workspace-screen__modal-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button 
                                    className="workspace-screen__modal-btn"
                                    type="button"
                                    onClick={handleDeleteWorkspace}
                                    disabled={isUpdatingWS}
                                    style={{ marginRight: 'auto', backgroundColor: '#e01e5a', color: '#fff', border: 'none' }}
                                >
                                    Eliminar Workspace
                                </button>
                                <button 
                                    className="workspace-screen__modal-btn workspace-screen__modal-btn--cancel"
                                    type="button"
                                    onClick={() => setShowWorkspaceSettingsModal(false)}
                                    disabled={isUpdatingWS}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    className="workspace-screen__modal-btn workspace-screen__modal-btn--submit"
                                    type="submit"
                                    disabled={isUpdatingWS || !editWSName.trim()}
                                >
                                    {isUpdatingWS ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default WorkspaceScreen
