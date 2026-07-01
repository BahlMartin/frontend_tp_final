import React from 'react'
import useWorkspaceInvite from '../../hooks/useWorkspaceInvite.js'
import './InviteWorkspaceMemberModal.css'

export const InviteWorkspaceMemberModal = ({ workspaceId, currentWorkspace, onClose }) => {
    const {
        inviteForm,
        inviteError,
        setInviteError,
        inviteSuccess,
        setInviteSuccess,
        isInviting
    } = useWorkspaceInvite(workspaceId)

    return (
        <div className="invite-member-modal__overlay">
            <div className="invite-member-modal__box">
                <div className="invite-member-modal__header">
                    <h3 className="invite-member-modal__title">Invitar miembros a {currentWorkspace?.name}</h3>
                    <button className="invite-member-modal__close" onClick={onClose}>&times;</button>
                </div>
                <form className="invite-member-modal__form" onSubmit={inviteForm.handleSubmit}>
                    {!inviteSuccess ? (
                        <>
                            <div className="invite-member-modal__input-group">
                                <label className="invite-member-modal__label" htmlFor="invite-email">Correo electrónico</label>
                                <input
                                    className="invite-member-modal__input"
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
                                <div className="invite-member-modal__error">
                                    {inviteError}
                                </div>
                            )}

                            <div className="invite-member-modal__actions">
                                <button
                                    className="invite-member-modal__btn invite-member-modal__btn--cancel"
                                    type="button"
                                    onClick={onClose}
                                    disabled={isInviting}
                                >
                                    Cancelar
                                </button>
                                <button
                                    className="invite-member-modal__btn invite-member-modal__btn--submit"
                                    type="submit"
                                    disabled={isInviting}
                                >
                                    {isInviting ? 'Enviando...' : 'Enviar invitación'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="invite-member-modal__success">
                            <span className="invite-member-modal__success-badge">🎉</span>
                            <h4 className="invite-member-modal__success-title">¡Invitación enviada con éxito!</h4>
                            <p className="invite-member-modal__success-text">Se ha enviado una solicitud a la casilla indicada.</p>
                            <button
                                className="invite-member-modal__btn invite-member-modal__btn--submit"
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
    )
}

export default InviteWorkspaceMemberModal
