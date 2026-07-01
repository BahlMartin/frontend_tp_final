import React from 'react'
import useCreateChannel from '../../hooks/useCreateChannel.js'
import './CreateChannelModal.css'

export const CreateChannelModal = ({ workspaceId, refetchCurrentWorkspace, onClose }) => {
    const {
        chanForm,
        chanError,
        isCreatingChan
    } = useCreateChannel(workspaceId, refetchCurrentWorkspace, onClose)

    return (
        <div className="create-channel-modal__overlay">
            <div className="create-channel-modal__box">
                <div className="create-channel-modal__header">
                    <h3 className="create-channel-modal__title">Crear un canal nuevo</h3>
                    <button className="create-channel-modal__close" onClick={onClose}>&times;</button>
                </div>
                <form className="create-channel-modal__form" onSubmit={chanForm.handleSubmit}>
                    <div className="create-channel-modal__input-group">
                        <label className="create-channel-modal__label" htmlFor="channel-name">Nombre del canal</label>
                        <input
                            className="create-channel-modal__input"
                            type="text"
                            id="channel-name"
                            name="name"
                            placeholder="Ej. planificacion-semanal"
                            value={chanForm.formState.name}
                            onChange={chanForm.handleChange}
                            required
                            autoFocus
                        />
                        <span className="create-channel-modal__input-tip">
                            Los canales se escriben siempre en minúsculas y sin espacios.
                        </span>
                    </div>

                    <div className="create-channel-modal__input-group">
                        <label className="create-channel-modal__label" htmlFor="channel-description">Descripción</label>
                        <input
                            className="create-channel-modal__input"
                            type="text"
                            id="channel-description"
                            name="description"
                            placeholder="Ej. Avisos y debates sobre el desarrollo"
                            value={chanForm.formState.description}
                            onChange={chanForm.handleChange}
                        />
                    </div>

                    {chanError && (
                        <div className="create-channel-modal__error">
                            {chanError}
                        </div>
                    )}

                    <div className="create-channel-modal__actions">
                        <button
                            className="create-channel-modal__btn create-channel-modal__btn--cancel"
                            type="button"
                            onClick={onClose}
                            disabled={isCreatingChan}
                        >
                            Cancelar
                        </button>
                        <button
                            className="create-channel-modal__btn create-channel-modal__btn--submit"
                            type="submit"
                            disabled={isCreatingChan}
                        >
                            {isCreatingChan ? 'Creando...' : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateChannelModal
