import { getInitialsFromName } from '../../utils/stringHelper.js'
import './WorkspaceItem.css'

export const WorkspaceItem = ({ workspace, onEnter }) => {
    return (
        <div className="workspace-item">
            <div className="workspace-item__info">
                <div className="workspace-item__avatar">
                    {getInitialsFromName(workspace.name)}
                </div>
                <div className="workspace-item__text">
                    <span className="workspace-item__name">{workspace.name}</span>
                    <span className="workspace-item__members-count">
                        ID: {workspace._id}
                    </span>
                </div>
            </div>
            <button
                className="workspace-item__enter-btn"
                onClick={() => onEnter(workspace._id)}
            >
                Entrar a Slucky
            </button>
        </div>
    )
}

export default WorkspaceItem
