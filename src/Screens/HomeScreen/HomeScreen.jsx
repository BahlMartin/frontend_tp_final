import { useState } from 'react'
import { useNavigate } from 'react-router'
import useAuth from '../../hooks/useAuth.js'
import useWorkspace from '../../hooks/useWorkspace.js'
import { HomeScreenHeader } from '../../components/HomeScreenHeader/HomeScreenHeader.jsx'
import { WorkspaceList } from '../../components/WorkspaceList/WorkspaceList.jsx'
import CreateWorkspaceModal from '../../components/CreateWorkspaceModal/CreateWorkspaceModal.jsx'
import './HomeScreen.css'

export const HomeScreen = () => {
    const { userData, logout } = useAuth()
    const { workspaces, refetchWorkspaces, loading } = useWorkspace()
    const navigate = useNavigate()
    const [showCreateModal, setShowCreateModal] = useState(false)

    return (
        <div className="home-screen">
            {/* Cabecera */}
            <HomeScreenHeader userData={userData} onLogout={logout} />

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

                    <WorkspaceList
                        workspaces={workspaces}
                        loading={loading}
                        onEnterWorkspace={(id) => navigate(`/workspace/${id}`)}
                    />

                    <div className="home-screen__workspace-actions">
                        <span className="home-screen__action-desc">¿Quieres usar Slucky con otro equipo?</span>
                        <button
                            className="home-screen__create-workspace-btn"
                            onClick={() => setShowCreateModal(true)}
                        >
                            Crear un espacio de trabajo
                        </button>
                    </div>
                </div>
            </main>

            {/* Modal para Crear Workspace */}
            {showCreateModal && (
                <CreateWorkspaceModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={refetchWorkspaces}
                />
            )}
        </div>
    )
}

export default HomeScreen
