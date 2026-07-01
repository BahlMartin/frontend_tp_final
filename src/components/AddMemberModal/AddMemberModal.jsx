import React, { useState } from 'react'
import './AddMemberModal.css'

export const AddMemberModal = ({
    channelName,
    channelMembers,
    workspaceMembers,
    onClose,
    onAddMember,
    error,
    setError
}) => {
    const [selectedWorkspaceMemberId, setSelectedWorkspaceMemberId] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!selectedWorkspaceMemberId) return
        setError(null)
        const res = await onAddMember(selectedWorkspaceMemberId)
        if (res && res.ok) {
            setSelectedWorkspaceMemberId('')
            onClose()
        }
    }

    return (
        <div className="add-member-modal">
            <div className="add-member-modal__box">
                <div className="add-member-modal__header">
                    <h3 className="add-member-modal__title">Agregar personas a #{channelName}</h3>
                    <button
                        className="add-member-modal__close"
                        onClick={onClose}
                    >
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="add-member-modal__form">
                    <div className="add-member-modal__input-group">
                        <label className="add-member-modal__label" htmlFor="select-member">
                            Seleccionar miembro del espacio de trabajo
                        </label>
                        <select
                            id="select-member"
                            className="add-member-modal__select"
                            value={selectedWorkspaceMemberId}
                            onChange={(e) => setSelectedWorkspaceMemberId(e.target.value)}
                            required
                        >
                            <option value="">Selecciona una persona...</option>
                            {workspaceMembers
                                .filter(wm => !channelMembers.some(cm => cm.workspace_member_id === wm.id || cm.member_name === wm.user_name))
                                .map(wm => (
                                    <option key={wm.id} value={wm.id}>
                                        {wm.user_name} ({wm.role})
                                    </option>
                                ))
                            }
                        </select>
                    </div>

                    {error && (
                        <div className="add-member-modal__error">
                            {error}
                        </div>
                    )}

                    <div className="add-member-modal__actions">
                        <button
                            className="add-member-modal__btn add-member-modal__btn--cancel"
                            type="button"
                            onClick={onClose}
                        >
                            Volver
                        </button>
                        <button
                            className="add-member-modal__btn add-member-modal__btn--submit"
                            type="submit"
                            disabled={!selectedWorkspaceMemberId}
                        >
                            Agregar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddMemberModal
