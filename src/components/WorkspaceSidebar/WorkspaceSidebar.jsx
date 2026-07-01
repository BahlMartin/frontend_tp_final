import React from 'react'
import { Link, useNavigate } from 'react-router'
import './WorkspaceSidebar.css'

export const WorkspaceSidebar = ({
    workspaceId,
    currentWorkspace,
    channels,
    members,
    sidebarOpen,
    setSidebarOpen,
    isCurrentUserOwner,
    isActiveChannel,
    onShowWorkspaceSettings,
    onShowCreateChannel,
    onShowInviteMember,
    onSelectMember
}) => {
    const navigate = useNavigate()

    return (
        <aside className={`workspace-sidebar ${sidebarOpen ? 'workspace-sidebar--open' : ''}`}>
            <div className="workspace-sidebar__header">
                <Link 
                    to={`/workspace/${workspaceId}`} 
                    className="workspace-sidebar__header-link"
                >
                    <h2 className="workspace-sidebar__title">{currentWorkspace?.name || 'Cargando...'}</h2>
                </Link>
                {isCurrentUserOwner && (
                    <button 
                        className="workspace-sidebar__settings-btn"
                        onClick={onShowWorkspaceSettings}
                        title="Configuración del espacio de trabajo"
                    >
                        ⚙️
                    </button>
                )}
            </div>

            <nav className="workspace-sidebar__nav">
                {/* Canales */}
                <div className="workspace-sidebar__section">
                    <div className="workspace-sidebar__section-header">
                        <span className="workspace-sidebar__section-title">Canales</span>
                        <button 
                            className="workspace-sidebar__add-btn"
                            onClick={onShowCreateChannel}
                            title="Crear Canal"
                        >
                            +
                        </button>
                    </div>
                    <div className="workspace-sidebar__section-list">
                        {channels.map((chan) => (
                            <button
                                key={chan._id}
                                className={`workspace-sidebar__item-btn ${isActiveChannel(chan._id) ? 'workspace-sidebar__item-btn--active' : ''}`}
                                onClick={() => {
                                    setSidebarOpen(false)
                                    navigate(`/workspace/${workspaceId}/channel/${chan._id}`)
                                }}
                            >
                                <span className="workspace-sidebar__channel-hash">#</span> {chan.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Miembros */}
                <div className="workspace-sidebar__section">
                    <div className="workspace-sidebar__section-header">
                        <span className="workspace-sidebar__section-title">Miembros</span>
                        <button 
                            className="workspace-sidebar__add-btn"
                            onClick={onShowInviteMember}
                            title="Invitar Miembro"
                        >
                            +
                        </button>
                    </div>
                    <div className="workspace-sidebar__section-list">
                        {members.map((member) => (
                            <div 
                                className="workspace-sidebar__member-item workspace-sidebar__member-item--clickable" 
                                key={member._id || member.id}
                                onClick={() => onSelectMember(member)}
                                title="Administrar miembro"
                            >
                                <div className="workspace-sidebar__member-indicator"></div>
                                <div className="workspace-sidebar__member-info-container">
                                    <span className="workspace-sidebar__member-name">
                                        {member.user_name || member.email.split('@')[0]}
                                    </span>
                                    <span className="workspace-sidebar__member-role-badge">
                                        {member.role}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </nav>
        </aside>
    )
}

export default WorkspaceSidebar
