import React, { useState } from 'react'
import './EditChannelModal.css'

export const EditChannelModal = ({
    channelDetails,
    onClose,
    onUpdate,
    onDelete,
    isUpdating,
    error
}) => {
    const [name, setName] = useState(channelDetails?.name || '')
    const [description, setDescription] = useState(channelDetails?.description || '')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await onUpdate(name, description)
        if (res && res.ok) {
            onClose()
        }
    }

    return (
        <div className="edit-channel-modal">
            <div className="edit-channel-modal__box">
                <div className="edit-channel-modal__header">
                    <h3 className="edit-channel-modal__title">Editar Canal</h3>
                    <button className="edit-channel-modal__close" onClick={onClose}>&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="edit-channel-modal__form">
                    <div className="edit-channel-modal__input-group">
                        <label className="edit-channel-modal__label" htmlFor="edit-channel-name">
                            Nombre del canal
                        </label>
                        <input
                            type="text"
                            id="edit-channel-name"
                            className="edit-channel-modal__input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="edit-channel-modal__input-group">
                        <label className="edit-channel-modal__label" htmlFor="edit-channel-desc">
                            Descripción
                        </label>
                        <textarea
                            id="edit-channel-desc"
                            className="edit-channel-modal__textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Agrega una descripción para este canal"
                        />
                    </div>

                    {error && (
                        <div className="edit-channel-modal__error">
                            {error}
                        </div>
                    )}

                    <div className="edit-channel-modal__actions">
                        <button 
                            className="edit-channel-modal__btn edit-channel-modal__btn--danger"
                            type="button"
                            onClick={onDelete}
                            disabled={isUpdating}
                        >
                            Eliminar Canal
                        </button>
                        <button 
                            className="edit-channel-modal__btn edit-channel-modal__btn--cancel"
                            type="button"
                            onClick={onClose}
                            disabled={isUpdating}
                        >
                            Cancelar
                        </button>
                        <button 
                            className="edit-channel-modal__btn edit-channel-modal__btn--submit"
                            type="submit"
                            disabled={isUpdating || !name.trim()}
                        >
                            {isUpdating ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditChannelModal
