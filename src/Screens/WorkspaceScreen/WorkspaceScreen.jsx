import React, { useState } from 'react'
import { useParams, Outlet, useLocation } from 'react-router'
import useAuth from '../../hooks/useAuth.js'
import useWorkspace from '../../hooks/useWorkspace.js'
import useWorkspaceMembers from '../../hooks/useWorkspaceMembers.js'
import WorkspaceTopbar from '../../components/WorkspaceTopbar/WorkspaceTopbar.jsx'
import WorkspaceSidebar from '../../components/WorkspaceSidebar/WorkspaceSidebar.jsx'
import CreateChannelModal from '../../components/CreateChannelModal/CreateChannelModal.jsx'
import InviteWorkspaceMemberModal from '../../components/InviteWorkspaceMemberModal/InviteWorkspaceMemberModal.jsx'
import ManageMemberModal from '../../components/ManageMemberModal/ManageMemberModal.jsx'
import WorkspaceSettingsModal from '../../components/WorkspaceSettingsModal/WorkspaceSettingsModal.jsx'
import './WorkspaceScreen.css'

export const WorkspaceScreen = () => {
    const { workspaceId } = useParams()
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
    const [showWorkspaceSettingsModal, setShowWorkspaceSettingsModal] = useState(false)

    // Gestión de miembros y roles
    const {
        selectedMember,
        setSelectedMember,
        selectedRole,
        setSelectedRole,
        updatingRole,
        roleError,
        handleRoleUpdate,
        handleRemoveWorkspaceMember
    } = useWorkspaceMembers(workspaceId, refetchCurrentWorkspace)

    // Verificar si el canal está activo para colorear en sidebar
    const isActiveChannel = (id) => location.pathname.includes(`/channel/${id}`)

    const currentWSMember = members.find(m => m.user_name === userData?.user_name || m.email === userData?.email)
    const isCurrentUserOwner = currentWSMember?.role === 'owner'

    return (
        <div className="workspace-screen">
            {/* Barra de Navegación Superior */}
            <WorkspaceTopbar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                showProfileDropdown={showProfileDropdown}
                setShowProfileDropdown={setShowProfileDropdown}
                userData={userData}
                logout={logout}
            />

            <div className="workspace-screen__body">
                {/* Sidebar izquierdo (Canales y Miembros) */}
                <WorkspaceSidebar
                    workspaceId={workspaceId}
                    currentWorkspace={currentWorkspace}
                    channels={channels}
                    members={members}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    isCurrentUserOwner={isCurrentUserOwner}
                    isActiveChannel={isActiveChannel}
                    onShowWorkspaceSettings={() => setShowWorkspaceSettingsModal(true)}
                    onShowCreateChannel={() => setShowChannelModal(true)}
                    onShowInviteMember={() => setShowInviteModal(true)}
                    onSelectMember={setSelectedMember}
                />

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
                            <a href="/home" className="workspace-screen__back-link">
                                Volver al panel inicial
                            </a>
                        </div>
                    ) : (
                        <Outlet />
                    )}
                </main>
            </div>

            {/* Modal Crear Canal */}
            {showChannelModal && (
                <CreateChannelModal
                    workspaceId={workspaceId}
                    refetchCurrentWorkspace={refetchCurrentWorkspace}
                    onClose={() => setShowChannelModal(false)}
                />
            )}

            {/* Modal Invitar Miembro */}
            {showInviteModal && (
                <InviteWorkspaceMemberModal
                    workspaceId={workspaceId}
                    currentWorkspace={currentWorkspace}
                    onClose={() => setShowInviteModal(false)}
                />
            )}

            {/* Modal Administrar Miembro del Workspace */}
            {selectedMember && (
                <ManageMemberModal
                    workspaceId={workspaceId}
                    selectedMember={selectedMember}
                    setSelectedMember={setSelectedMember}
                    refetchCurrentWorkspace={refetchCurrentWorkspace}
                    members={members}
                    userData={userData}
                    selectedRole={selectedRole}
                    setSelectedRole={setSelectedRole}
                    updatingRole={updatingRole}
                    roleError={roleError}
                    handleRoleUpdate={handleRoleUpdate}
                    handleRemoveWorkspaceMember={handleRemoveWorkspaceMember}
                />
            )}

            {/* Modal de Configuración del Workspace */}
            {showWorkspaceSettingsModal && (
                <WorkspaceSettingsModal
                    workspaceId={workspaceId}
                    currentWorkspace={currentWorkspace}
                    refetchCurrentWorkspace={refetchCurrentWorkspace}
                    refetchWorkspaces={refetchWorkspaces}
                    onClose={() => setShowWorkspaceSettingsModal(false)}
                />
            )}
        </div>
    )
}

export default WorkspaceScreen
