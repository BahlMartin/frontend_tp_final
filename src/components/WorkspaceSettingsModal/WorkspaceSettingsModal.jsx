import React from 'react'
import useWorkspaceSettings from '../../hooks/useWorkspaceSettings'
import './WorkspaceSettingsModal.css'

export const WorkspaceSettingsModal = ({
    workspaceId,
    currentWorkspace,
    refetchCurrentWorkspace,
    refetchWorkspaces,
    onClose
}) => {
    const {
        editWSName,
        setEditWSName,
        editWSDesc,
        setEditWSDesc,
        isUpdatingWS,
        updateWSError,
        handleUpdateWorkspaceSubmit,
        handleDeleteWorkspace
    } = useWorkspaceSettings(workspaceId, currentWorkspace, refetchCurrentWorkspace, refetchWorkspaces, onClose)

    return (
        <div className="workspace-settings-modal__overlay">
            <div className="workspace-settings-modal__box">
                <div className="workspace-settings-modal__header">
                    <h3 className="workspace-settings-modal__title">Configuración del espacio de trabajo</h3>
                    <button className="workspace-settings-modal__close" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleUpdateWorkspaceSubmit} className="workspace-settings-modal__form">
                    <div className="workspace-settings-modal__input-group">
                        <label className="workspace-settings-modal__label" htmlFor="edit-ws-name">Nombre del espacio</label>
                        <input
                            type="text"
                            id="edit-ws-name"
                            className="workspace-settings-modal__input"
                            value={editWSName}
                            onChange={(e) => setEditWSName(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="workspace-settings-modal__input-group">
                        <label className="workspace-settings-modal__label" htmlFor="edit-ws-desc">Descripción del espacio</label>
                        <textarea
                            id="edit-ws-desc"
                            className="workspace-settings-modal__input workspace-settings-modal__input--textarea"
                            value={editWSDesc}
                            onChange={(e) => setEditWSDesc(e.target.value)}
                            placeholder="Agrega una descripción para tu equipo..."
                        />
                    </div>

                    {updateWSError && (
                        <div className="workspace-settings-modal__error">
                            {updateWSError}
                        </div>
                    )}

                    <div className="workspace-settings-modal__actions">
                        <button 
                            className="workspace-settings-modal__btn workspace-settings-modal__btn--danger"
                            type="button"
                            onClick={handleDeleteWorkspace}
                            disabled={isUpdatingWS}
                        >
                            Eliminar Workspace
                        </button>
                        <button 
                            className="workspace-settings-modal__btn workspace-settings-modal__btn--cancel"
                            type="button"
                            onClick={onClose}
                            disabled={isUpdatingWS}
                        >
                            Cancelar
                        </button>
                        <button 
                            className="workspace-settings-modal__btn workspace-settings-modal__btn--submit"
                            type="submit"
                            disabled={isUpdatingWS || !editWSName.trim()}
                        >
                            {isUpdatingWS ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default WorkspaceSettingsModal
