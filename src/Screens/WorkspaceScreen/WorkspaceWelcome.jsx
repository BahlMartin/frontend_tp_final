import React from 'react'
import useWorkspace from '../../hooks/useWorkspace'
import './WorkspaceWelcome.css'

export const WorkspaceWelcome = () => {
    const { currentWorkspace } = useWorkspace()

    return (
        <div className="workspace-welcome">
            <div className="workspace-welcome__rocket-container">
                <span className="workspace-welcome__rocket">🚀</span>
            </div>
            <h3 className="workspace-welcome__title">¡Bienvenido a tu espacio de trabajo!</h3>
            {currentWorkspace?.description && (
                <div className="workspace-welcome__description-container">
                    <span className="workspace-welcome__description-label">Descripción:</span>
                    <p className="workspace-welcome__description">
                        {currentWorkspace.description}
                    </p>
                </div>
            )}
            <p className="workspace-welcome__instructions">
                Selecciona un canal en la barra lateral para comenzar a chatear con tus compañeros de equipo, o haz clic en el botón <strong>+</strong> al lado de Canales para crear uno nuevo.
            </p>
        </div>
    )
}

export default WorkspaceWelcome
