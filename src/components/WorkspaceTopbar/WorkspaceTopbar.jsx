import React from 'react'
import { Link } from 'react-router'
import { getInitialsFromUser } from '../../utils/stringHelper.js'
import './WorkspaceTopbar.css'

export const WorkspaceTopbar = ({
    sidebarOpen,
    setSidebarOpen,
    showProfileDropdown,
    setShowProfileDropdown,
    userData,
    logout
}) => {
    return (
        <header className="workspace-topbar">
            <button 
                className="workspace-topbar__menu-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                title="Menu"
            >
                ☰
            </button>
            <div className="workspace-topbar__spacer"></div>
            <div className="workspace-topbar__user">
                <div 
                    className="workspace-topbar__avatar"
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                >
                    {getInitialsFromUser(userData?.first_name, userData?.last_name, userData?.user_name)}
                </div>

                {showProfileDropdown && (
                    <div className="workspace-topbar__profile-dropdown">
                        <div className="workspace-topbar__dropdown-header">
                            <span className="workspace-topbar__dropdown-name">
                                {userData?.first_name ? `${userData.first_name} ${userData.last_name}` : userData?.user_name}
                            </span>
                            <span className="workspace-topbar__dropdown-email">{userData?.email}</span>
                        </div>
                        <Link 
                            to="/user" 
                            className="workspace-topbar__dropdown-item"
                            onClick={() => setShowProfileDropdown(false)}
                        >
                            Configurar Perfil
                        </Link>
                        <Link 
                            to="/home" 
                            className="workspace-topbar__dropdown-item"
                            onClick={() => setShowProfileDropdown(false)}
                        >
                            Cambiar de Workspace
                        </Link>
                        <button 
                            className="workspace-topbar__dropdown-item workspace-topbar__dropdown-item--logout"
                            onClick={logout}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                )}
            </div>
        </header>
    )
}

export default WorkspaceTopbar
