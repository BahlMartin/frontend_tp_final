import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router'
import useAuth from '../../hooks/useAuth'
import useWorkspace from '../../hooks/useWorkspace'
import useChat from '../../hooks/useChat'
import { getChannelById, getChannelMembers, addChannelMember, removeChannelMember } from '../../services/channelService'
import { updateChannel, deleteChannel } from '../../services/workspaceService'
import './ChannelScreen.css'

export const ChannelScreen = () => {
    const { channelId, workspaceId } = useParams()
    const navigate = useNavigate()
    const { userData } = useAuth()
    const { members: workspaceMembers, refetchCurrentWorkspace } = useWorkspace()
    const [channelDetails, setChannelDetails] = useState(null)
    
    // Estados para gestión de miembros del canal
    const [channelMembers, setChannelMembers] = useState([])
    const [showMembersModal, setShowMembersModal] = useState(false)
    const [showAddMemberModal, setShowAddMemberModal] = useState(false)
    const [loadingMembers, setLoadingMembers] = useState(false)
    const [selectedWorkspaceMemberId, setSelectedWorkspaceMemberId] = useState('')
    const [addMemberError, setAddMemberError] = useState(null)
    const {
        messages,
        loading,
        error,
        pagination,
        sendMessage,
        editMessage,
        removeMessage,
        loadMore
    } = useChat(channelId)

    const [inputMessage, setInputMessage] = useState('')
    const [editingMessageId, setEditingMessageId] = useState(null)
    const [editValue, setEditValue] = useState('')
    const messagesEndRef = useRef(null)

    // Estados para edición y eliminación de canales
    const [showEditChannelModal, setShowEditChannelModal] = useState(false)
    const [editChannelName, setEditChannelName] = useState('')
    const [editChannelDesc, setEditChannelDesc] = useState('')
    const [isSavingEdit, setIsSavingEdit] = useState(false) // guarda para doble clic
    const [isUpdatingChannel, setIsUpdatingChannel] = useState(false)
    const [editChannelError, setEditChannelError] = useState(null)

    // Cargar detalles específicos del canal
    useEffect(() => {
        if (channelId) {
            getChannelById(channelId)
                .then((res) => {
                    if (res.ok) {
                        setChannelDetails(res.data)
                    }
                })
                .catch((err) => console.error("Error al obtener detalles del canal:", err))
        } else {
            setChannelDetails(null)
        }
    }, [channelId])

    useEffect(() => {
        if (channelDetails) {
            setEditChannelName(channelDetails.name)
            setEditChannelDesc(channelDetails.description || '')
        }
    }, [channelDetails])

    const fetchChannelMembers = useCallback(async () => {
        if (!channelId) return
        setLoadingMembers(true)
        try {
            const res = await getChannelMembers(channelId)
            if (res.ok) {
                setChannelMembers(res.data || [])
            }
        } catch (err) {
            console.error("Error al obtener miembros del canal:", err)
        } finally {
            setLoadingMembers(false)
        }
    }, [channelId])

    useEffect(() => {
        if (channelId) {
            fetchChannelMembers()
        } else {
            setChannelMembers([])
        }
    }, [channelId, fetchChannelMembers])

    const handleAddMemberSubmit = async (e) => {
        e.preventDefault()
        if (!selectedWorkspaceMemberId) return
        setAddMemberError(null)
        try {
            const res = await addChannelMember(channelId, selectedWorkspaceMemberId)
            if (res.ok) {
                setSelectedWorkspaceMemberId('')
                setShowAddMemberModal(false)
                fetchChannelMembers()
            }
        } catch (err) {
            console.error("Error al agregar miembro al canal:", err)
            setAddMemberError(err.message || "Error al agregar miembro")
        }
    }

    const handleRemoveMember = async (channelMemberId) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar a este miembro del canal?")) return
        try {
            await removeChannelMember(channelId, channelMemberId)
            fetchChannelMembers()
        } catch (err) {
            console.error("Error al eliminar miembro del canal:", err)
            alert(err.message || "Error al eliminar miembro")
        }
    }

    const [shouldScroll, setShouldScroll] = useState(false)

    // Auto-scroll al final del chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    // Activar scroll automático al cambiar de canal
    useEffect(() => {
        if (channelId) {
            setShouldScroll(true)
        }
    }, [channelId])

    useEffect(() => {
        if (shouldScroll && messages.length > 0) {
            scrollToBottom()
            setShouldScroll(false)
        }
    }, [messages, shouldScroll])

    // Enviar Mensaje
    const handleSend = async (e) => {
        e.preventDefault()
        if (!inputMessage.trim()) return
        try {
            await sendMessage(inputMessage)
            setInputMessage('')
            // Forzar scroll al final después de enviar un mensaje propio
            setTimeout(scrollToBottom, 50)
        } catch (err) {
            alert(err.message || "Error al enviar el mensaje")
        }
    }

    // Activar edición de mensaje
    const startEdit = (msgId, currentText) => {
        setEditingMessageId(msgId)
        setEditValue(currentText)
    }

    // Confirmar edición de mensaje
    const handleEditSave = async (msgId) => {
        if (!editValue.trim() || isSavingEdit) return
        setIsSavingEdit(true)
        try {
            await editMessage(msgId, editValue)
            setEditingMessageId(null)
        } catch (err) {
            alert(err.message || "No se pudo actualizar el mensaje (el tiempo límite de 15 minutos puede haber expirado)")
        } finally {
            setIsSavingEdit(false)
        }
    }

    // Actualizar canal
    const handleUpdateChannel = async (e) => {
        e.preventDefault()
        if (!editChannelName.trim() || isUpdatingChannel) return
        setEditChannelError(null)
        setIsUpdatingChannel(true)
        try {
            const cleanName = editChannelName.toLowerCase().replace(/\s+/g, '-')
            const res = await updateChannel(workspaceId, channelId, cleanName, editChannelDesc)
            if (res.ok) {
                setChannelDetails(res.data)
                setShowEditChannelModal(false)
                refetchCurrentWorkspace()
            }
        } catch (err) {
            console.error("Error al actualizar canal:", err)
            setEditChannelError(err.message || "Error al actualizar canal")
        } finally {
            setIsUpdatingChannel(false)
        }
    }

    // Eliminar canal
    const handleDeleteChannel = async () => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este canal y todos sus mensajes? Esta acción no se puede deshacer.")) return
        setEditChannelError(null)
        setIsUpdatingChannel(true)
        try {
            await deleteChannel(workspaceId, channelId)
            setShowEditChannelModal(false)
            refetchCurrentWorkspace()
            navigate(`/workspace/${workspaceId}`)
        } catch (err) {
            console.error("Error al eliminar canal:", err)
            alert(err.message || "Error al eliminar canal")
        } finally {
            setIsUpdatingChannel(false)
        }
    }

    // Manejar tecla Enter en el textarea del chat
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend(e)
        }
    }

    // Confirmar borrado de mensaje
    const handleDelete = async (msgId) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este mensaje?")) {
            try {
                await removeMessage(msgId)
            } catch (err) {
                alert(err.message || "No se pudo eliminar el mensaje")
            }
        }
    }

    // Analizador defensivo de mensajes
    const parseMessage = (msg) => {
        const text = msg.message || msg.content || "";
        const id = msg.message_id || msg._id;
        const date = msg.creation_date || msg.modification_date || msg.updated_at || new Date().toISOString();

        // Identificar remitente
        let user = "Usuario";
        let senderId = null;

        if (msg.member_name) {
            user = msg.member_name;
        } else if (msg.fk_user_id) {
            user = msg.fk_user_id;
        } else if (msg.fk_channel_member_id) {
            const chanMember = msg.fk_channel_member_id;
            if (chanMember.fk_workspace_member_id) {
                const wsMember = chanMember.fk_workspace_member_id;
                if (wsMember.fk_user_id) {
                    user = wsMember.fk_user_id.user_name || "Usuario";
                    senderId = wsMember.fk_user_id._id || wsMember.fk_user_id;
                }
            }
        }

        // Si no se encuentra el ID de usuario mediante referencias populadas, intentamos matchear por nombre
        const isOwn = (senderId && senderId === userData?.id) || (user === userData?.user_name);

        return { id, text, user, date, isOwn };
    }

    // Obtener iniciales para el avatar del mensaje
    const getInitials = (name) => {
        return name.slice(0, 2).toUpperCase()
    }

    const currentUserRole = workspaceMembers.find(wm => wm.user_name === userData?.user_name || wm.email === userData?.email)?.role;
    const isAuthorized = currentUserRole === 'owner' || currentUserRole === 'admin';

    return (
        <div className="channel-screen">
            {/* Header del canal */}
            <div className="channel-screen__header">
                <div className="channel-screen__header-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h3 className="channel-screen__channel-title">
                            <span className="channel-screen__title-hash">#</span>
                            {channelDetails?.name || 'canal'}
                        </h3>
                        {isAuthorized && (
                            <button 
                                className="channel-screen__edit-channel-btn"
                                onClick={() => setShowEditChannelModal(true)}
                                title="Configurar Canal"
                            >
                                ⚙️
                            </button>
                        )}
                    </div>
                    <div className="channel-screen__channel-details">
                        <span 
                            className="channel-screen__member-count channel-screen__member-count--interactive"
                            onClick={() => setShowMembersModal(true)}
                            title="Ver miembros del canal"
                        >
                            👤 {channelMembers.length} miembros
                        </span>
                        {channelDetails?.description && (
                            <span className="channel-screen__channel-desc">
                                | {channelDetails.description}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Historial de mensajes */}
            <div className="channel-screen__chat-area">
                {loading && messages.length === 0 ? (
                    <div className="channel-screen__loading">
                        <div className="channel-screen__spinner"></div>
                        <span>Cargando conversación...</span>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="channel-screen__welcome">
                        <div className="channel-screen__welcome-icon">💬</div>
                        <h4>Este es el comienzo del canal #{channelDetails?.name}</h4>
                        <p>Los mensajes que envíes aquí serán leídos por todos los miembros del workspace.</p>
                    </div>
                ) : (
                    <>
                        {pagination?.has_next_page && (
                            <div className="channel-screen__load-more-container">
                                <button
                                    className="channel-screen__load-more-btn"
                                    onClick={loadMore}
                                    disabled={loading}
                                >
                                    {loading ? 'Cargando más...' : 'Cargar mensajes anteriores'}
                                </button>
                            </div>
                        )}
                        {/* Invertimos el orden para mostrar cronológicamente (el backend los devuelve con sort creation_date: -1) */}
                        {[...messages].reverse().map((rawMsg) => {
                            const msg = parseMessage(rawMsg)
                            return (
                                <div className="channel-screen__message-row" key={msg.id}>
                                    <div className="channel-screen__message-avatar">
                                        {getInitials(msg.user)}
                                    </div>
                                    <div className="channel-screen__message-body">
                                        <div className="channel-screen__message-header">
                                            <span className="channel-screen__message-user">{msg.user}</span>
                                            <span className="channel-screen__message-time">
                                                {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        {editingMessageId === msg.id ? (
                                            <div className="channel-screen__edit-container">
                                                <textarea
                                                    className="channel-screen__edit-input"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    autoFocus
                                                    style={{ resize: 'none', minHeight: '34px', height: 'auto', fontFamily: 'inherit', padding: '8px', boxSizing: 'border-box' }}
                                                />
                                                <div className="channel-screen__edit-actions">
                                                    <button className="channel-screen__edit-btn channel-screen__edit-btn--cancel" onClick={() => setEditingMessageId(null)}>Cancelar</button>
                                                    <button className="channel-screen__edit-btn channel-screen__edit-btn--save" onClick={() => handleEditSave(msg.id)} disabled={isSavingEdit}>
                                                        {isSavingEdit ? 'Guardando...' : 'Guardar'}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="channel-screen__message-text">{msg.text}</span>
                                        )}
                                    </div>

                                    {/* Acciones rápidas (Solo si el mensaje es propio y no está en edición) */}
                                    {msg.isOwn && editingMessageId !== msg.id && (
                                        <div className="channel-screen__actions">
                                            <button
                                                className="channel-screen__action-btn"
                                                onClick={() => startEdit(msg.id, msg.text)}
                                                title="Editar mensaje"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="channel-screen__action-btn channel-screen__action-btn--delete"
                                                onClick={() => handleDelete(msg.id)}
                                                title="Eliminar mensaje"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input de Mensajes */}
            <div className="channel-screen__input-area">
                <form className="channel-screen__input-form" onSubmit={handleSend}>
                    <textarea
                        className="channel-screen__input-field"
                        placeholder={`Enviar mensaje a #${channelDetails?.name || 'canal'}`}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                    />
                    <button
                        type="submit"
                        className="channel-screen__send-btn"
                        disabled={!inputMessage.trim()}
                    >
                        ➤
                    </button>
                </form>
            </div>

            {/* Modal de Miembros del Canal */}
            {showMembersModal && (
                <div className="channel-screen__modal-overlay">
                    <div className="channel-screen__modal-box">
                        <div className="channel-screen__modal-header">
                            <h3 className="channel-screen__modal-title">Miembros de #{channelDetails?.name || 'canal'}</h3>
                            <button className="channel-screen__modal-close" onClick={() => setShowMembersModal(false)}>&times;</button>
                        </div>
                        <div className="channel-screen__modal-body">
                            <div className="channel-screen__members-actions">
                                <button 
                                    className="channel-screen__modal-btn channel-screen__modal-btn--submit"
                                    onClick={() => {
                                        setShowMembersModal(false)
                                        setShowAddMemberModal(true)
                                    }}
                                >
                                    Agregar personas
                                </button>
                            </div>
                            
                            {loadingMembers ? (
                                <div className="channel-screen__modal-loading">Cargando miembros...</div>
                            ) : (
                                <div className="channel-screen__members-list">
                                    {channelMembers.map((m) => {
                                        const wsM = workspaceMembers.find(wm => wm.id === m.workspace_member_id || wm.user_name === m.member_name);
                                        const role = wsM?.role || 'member';
                                        
                                        // Verificar si el usuario actual es owner/admin para permitir eliminar a otros
                                        const currentUserRole = workspaceMembers.find(wm => wm.user_name === userData?.user_name || wm.email === userData?.email)?.role;
                                        const isAuthorized = currentUserRole === 'owner' || currentUserRole === 'admin';
                                        
                                        return (
                                            <div className="channel-screen__member-row" key={m.channel_member_id}>
                                                <div className="channel-screen__member-avatar">
                                                    {getInitials(m.member_name || 'U')}
                                                </div>
                                                <div className="channel-screen__member-info">
                                                    <span className="channel-screen__member-name">{m.member_name}</span>
                                                    <span className="channel-screen__member-role">{role}</span>
                                                </div>
                                                {isAuthorized && m.member_name !== userData?.user_name && (
                                                    <button 
                                                        className="channel-screen__member-remove-btn"
                                                        onClick={() => handleRemoveMember(m.channel_member_id)}
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
            )}

            {/* Modal para Agregar Miembro al Canal */}
            {showAddMemberModal && (
                <div className="channel-screen__modal-overlay">
                    <div className="channel-screen__modal-box">
                        <div className="channel-screen__modal-header">
                            <h3 className="channel-screen__modal-title">Agregar personas a #{channelDetails?.name || 'canal'}</h3>
                            <button 
                                className="channel-screen__modal-close" 
                                onClick={() => {
                                    setShowAddMemberModal(false)
                                    setShowMembersModal(true)
                                }}
                            >
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleAddMemberSubmit} className="channel-screen__modal-form">
                            <div className="channel-screen__input-group">
                                <label className="channel-screen__label" htmlFor="select-member">
                                    Seleccionar miembro del espacio de trabajo
                                </label>
                                <select
                                    id="select-member"
                                    className="channel-screen__select"
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

                            {addMemberError && (
                                <div className="channel-screen__modal-error">
                                    {addMemberError}
                                </div>
                            )}

                            <div className="channel-screen__modal-actions">
                                <button 
                                    className="channel-screen__modal-btn channel-screen__modal-btn--cancel"
                                    type="button"
                                    onClick={() => {
                                        setShowAddMemberModal(false)
                                        setShowMembersModal(true)
                                    }}
                                >
                                    Volver
                                </button>
                                <button 
                                    className="channel-screen__modal-btn channel-screen__modal-btn--submit"
                                    type="submit"
                                    disabled={!selectedWorkspaceMemberId}
                                >
                                    Agregar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Editar/Eliminar Canal */}
            {showEditChannelModal && (
                <div className="channel-screen__modal-overlay">
                    <div className="channel-screen__modal-box">
                        <div className="channel-screen__modal-header">
                            <h3 className="channel-screen__modal-title">Editar Canal</h3>
                            <button className="channel-screen__modal-close" onClick={() => setShowEditChannelModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleUpdateChannel} className="channel-screen__modal-form">
                            <div className="channel-screen__input-group">
                                <label className="channel-screen__label" htmlFor="edit-channel-name">
                                    Nombre del canal
                                </label>
                                <input
                                    type="text"
                                    id="edit-channel-name"
                                    className="channel-screen__input"
                                    style={{ width: '100%', height: '40px', padding: '0 10px', fontSize: '15px', border: '1px solid #868686', borderRadius: '4px', boxSizing: 'border-box' }}
                                    value={editChannelName}
                                    onChange={(e) => setEditChannelName(e.target.value)}
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="channel-screen__input-group">
                                <label className="channel-screen__label" htmlFor="edit-channel-desc">
                                    Descripción
                                </label>
                                <textarea
                                    id="edit-channel-desc"
                                    className="channel-screen__input"
                                    style={{ width: '100%', minHeight: '80px', padding: '10px', fontSize: '15px', border: '1px solid #868686', borderRadius: '4px', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit', lineHeight: '1.4' }}
                                    value={editChannelDesc}
                                    onChange={(e) => setEditChannelDesc(e.target.value)}
                                    placeholder="Agrega una descripción para este canal"
                                />
                            </div>

                            {editChannelError && (
                                <div className="channel-screen__modal-error">
                                    {editChannelError}
                                </div>
                            )}

                            <div className="channel-screen__modal-actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button 
                                    className="channel-screen__modal-btn channel-screen__modal-btn--danger"
                                    type="button"
                                    onClick={handleDeleteChannel}
                                    disabled={isUpdatingChannel}
                                    style={{ marginRight: 'auto', backgroundColor: '#e01e5a', color: '#fff', border: 'none' }}
                                >
                                    Eliminar Canal
                                </button>
                                <button 
                                    className="channel-screen__modal-btn channel-screen__modal-btn--cancel"
                                    type="button"
                                    onClick={() => setShowEditChannelModal(false)}
                                    disabled={isUpdatingChannel}
                                >
                                    Cancelar
                                </button>
                                <button 
                                    className="channel-screen__modal-btn channel-screen__modal-btn--submit"
                                    type="submit"
                                    disabled={isUpdatingChannel || !editChannelName.trim()}
                                >
                                    {isUpdatingChannel ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ChannelScreen
