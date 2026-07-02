import React, { useState } from 'react'
import { Modal } from '../Modal/Modal.jsx'
import './ChannelHeader.css'

export const ChannelHeader = ({
    channelName,
    description,
    memberCount,
    isAuthorized,
    onOpenSettings,
    onOpenMembers
}) => {
    const [showDetails, setShowDetails] = useState(false)

    return (
        <div className="channel-header">
            <div className="channel-header__info">
                <div className="channel-header__title-container">
                    <h3 className="channel-header__title">
                        <span className="channel-header__title-hash">#</span>
                        {channelName || 'canal'}
                    </h3>
                    {isAuthorized && (
                        <button
                            className="channel-header__edit-btn"
                            onClick={onOpenSettings}
                            title="Configurar Canal"
                        >
                            ⚙️
                        </button>
                    )}
                </div>
                <div className="channel-header__details">
                    <span
                        className="channel-header__member-count"
                        onClick={onOpenMembers}
                        title="Ver miembros del canal"
                    >
                        👤 {memberCount} miembros
                    </span>
                    {description && (
                        <span 
                            className="channel-header__desc"
                            onClick={() => setShowDetails(true)}
                            title="Ver descripción completa"
                        >
                            | {description}
                        </span>
                    )}
                </div>
            </div>

            {showDetails && (
                <Modal title={`Acerca de #${channelName}`} onClose={() => setShowDetails(false)}>
                    <div className="channel-details-modal">
                        <div className="channel-details-modal__section">
                            <h4 className="channel-details-modal__section-title">Descripción</h4>
                            <div className="channel-details-modal__content-box">
                                <p className="channel-details-modal__text">{description}</p>
                            </div>
                        </div>
                        <div className="channel-details-modal__section">
                            <h4 className="channel-details-modal__section-title">Información adicional</h4>
                            <p className="channel-details-modal__text">
                                Canal de comunicación con <strong>{memberCount} miembros</strong>.
                            </p>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}

export default ChannelHeader
