import { WorkspaceItem } from '../WorkspaceItem/WorkspaceItem.jsx'
import './WorkspaceList.css'

export const WorkspaceList = ({ workspaces, loading, onEnterWorkspace }) => {
    return (
        <div className="workspace-list">
            {loading && workspaces.length === 0 ? (
                <div className="workspace-list__loading-indicator">
                    <div className="workspace-list__spinner"></div>
                    <span>Cargando tus espacios de trabajo...</span>
                </div>
            ) : workspaces.length === 0 ? (
                <div className="workspace-list__empty-workspaces">
                    <p>No perteneces a ningún espacio de trabajo actualmente.</p>
                </div>
            ) : (
                workspaces.map((ws) => (
                    <WorkspaceItem
                        key={ws._id}
                        workspace={ws}
                        onEnter={onEnterWorkspace}
                    />
                ))
            )}
        </div>
    )
}
