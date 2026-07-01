import { getInitialsFromName } from '../../utils/stringHelper.js'
import './MembersModal.css'

export const MembersModal = ({
    channelName,
    members,
    workspaceMembers,
    currentUserRole,
    currentUserName,
    loading,
    onClose,
    onOpenAddMember,
    onRemoveMember
}) => {
    const isAuthorized = currentUserRole === 'owner' || currentUserRole === 'admin'

    const handleRemoveClick = async (channelMemberId) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar a este miembro del canal?")) {
            try {
                await onRemoveMember(channelMemberId)
            } catch (err) {
                alert(err.message || "Error al eliminar miembro")
            }
        }
    }

    return (
        <div className="members-modal">
            <div className="members-modal__box">
                <div className="members-modal__header">
                    <h3 className="members-modal__title">Miembros de #{channelName || 'canal'}</h3>
                    <button className="members-modal__close" onClick={onClose}>&times;</button>
                </div>
                <div className="members-modal__body">
                    <div className="members-modal__actions">
                        <button
                            className="members-modal__btn members-modal__btn--submit"
                            onClick={onOpenAddMember}
                        >
                            Agregar personas
                        </button>
                    </div>

                    {loading ? (
                        <div className="members-modal__loading">Cargando miembros...</div>
                    ) : (
                        <div className="members-modal__list">
                            {members.map((m) => {
                                const wsM = workspaceMembers.find(wm => wm.id === m.workspace_member_id || wm.user_name === m.member_name)
                                const role = wsM.role

                                return (
                                    <div className="members-modal__row" key={m.channel_member_id}>
                                        <div className="members-modal__avatar">
                                            {getInitialsFromName(m.member_name)}
                                        </div>
                                        <div className="members-modal__info">
                                            <span className="members-modal__name">{m.member_name}</span>
                                            <span className="members-modal__role">{role}</span>
                                        </div>
                                        {isAuthorized && m.member_name !== currentUserName && (
                                            <button
                                                className="members-modal__remove-btn"
                                                onClick={() => handleRemoveClick(m.channel_member_id)}
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MembersModal
