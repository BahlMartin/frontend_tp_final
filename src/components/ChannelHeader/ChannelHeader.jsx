import './ChannelHeader.css'

export const ChannelHeader = ({
    channelName,
    description,
    memberCount,
    isAuthorized,
    onOpenSettings,
    onOpenMembers
}) => {
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
                        <span className="channel-header__desc">
                            | {description}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChannelHeader
