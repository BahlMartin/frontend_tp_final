import React, { useState, useEffect, useRef, useMemo } from 'react'
import MessageItem from '../MessageItem/MessageItem.jsx'
import './MessageList.css'

/**
 * MessageList representa la lista completa de mensajes dentro de un canal.
 * Se encarga de la paginación, carga inicial, scroll automático y de mapear
 * cada mensaje a un componente optimizado <MessageItem />.
 */
export const MessageList = ({
    messages,
    loading,
    pagination,
    loadMore,
    editMessage,
    removeMessage,
    channelName,
    channelId,
    userData
}) => {
    // Controla si se debe ejecutar el scroll automático al final de la pantalla
    const [shouldScroll, setShouldScroll] = useState(false)
    // Referencia al final del chat para posicionar el scroll
    const messagesEndRef = useRef(null)

    // Función para deslizar suavemente la pantalla de chat hasta abajo
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    // 1. Activar bandera de scroll automático al cambiar de canal.
    // Puesto que cargar los mensajes del nuevo canal es asíncrono, no podemos desplazar
    // el scroll inmediatamente (el DOM aún no tiene los mensajes nuevos).
    useEffect(() => {
        if (channelId) {
            setShouldScroll(true)
        }
    }, [channelId])

    // 2. Ejecutar scroll automático al final de la conversación solo una vez
    // que los nuevos mensajes ya se han renderizado en el DOM.
    useEffect(() => {
        if (shouldScroll && messages.length > 0) {
            scrollToBottom()
            setShouldScroll(false) // Desactiva la bandera
        }
    }, [messages, shouldScroll])

    // 3. Detectar si la cantidad de mensajes aumentó para hacer scroll automático 
    // únicamente si el mensaje entrante fue enviado por el propio usuario actual.
    const previousMessagesLength = useRef(messages.length)
    useEffect(() => {
        if (messages.length > previousMessagesLength.current) {
            // El backend devuelve los mensajes ordenados descendentemente (los más nuevos en la posición 0)
            const latestMsgRaw = messages[0]
            if (latestMsgRaw) {
                const latestMsg = parseMessage(latestMsgRaw)
                if (latestMsg.isOwn) {
                    // Forzar scroll al final con un pequeño retardo para asegurar renderizado del DOM
                    setTimeout(scrollToBottom, 50)
                }
            }
        }
        previousMessagesLength.current = messages.length
    }, [messages])

    // Analizador defensivo de mensajes (Anti-Corruption Layer).
    // Adapta estructuras variables del backend (REST API o WebSockets)
    // a un objeto plano uniforme para simplificar el renderizado.
    const parseMessage = (msg) => {
        const text = msg.message || msg.content || ""
        const id = msg.message_id || msg._id
        const date = msg.creation_date || msg.modification_date || msg.updated_at || new Date().toISOString()

        let user = "Usuario"
        let senderId = null

        // Resolución jerárquica del remitente para evitar errores de tipo si no se populó en la DB
        if (msg.member_name) {
            user = msg.member_name
        } else if (msg.fk_user_id) {
            user = msg.fk_user_id
        } else if (msg.fk_channel_member_id) {
            const chanMember = msg.fk_channel_member_id
            if (chanMember.fk_workspace_member_id) {
                const wsMember = chanMember.fk_workspace_member_id
                if (wsMember.fk_user_id) {
                    user = wsMember.fk_user_id.user_name || "Usuario"
                    senderId = wsMember.fk_user_id._id || wsMember.fk_user_id
                }
            }
        }

        // Evalúa si el mensaje es del usuario activo
        const isOwn = (senderId && senderId === userData?.id) || (user === userData?.user_name)

        return { id, text, user, date, isOwn }
    }

    /**
     * ¿Qué hace 'useMemo' aquí?
     * 'useMemo' memoriza (cachea) el array resultante de invertir y parsear todos los mensajes.
     * Si las dependencias ([messages, userData]) no cambian, React reutiliza el resultado cacheado 
     * en lugar de volver a copiar, ordenar y parsear cada mensaje en cada renderización de MessageList.
     */
    const parsedMessages = useMemo(() => {
        return [...messages].reverse().map((rawMsg) => parseMessage(rawMsg))
    }, [messages, userData])

    return (
        <div className="message-list">
            {/* Si está cargando y no hay mensajes renderizados, muestra spinner */}
            {loading && messages.length === 0 ? (
                <div className="message-list__loading">
                    <div className="message-list__spinner"></div>
                    <span>Cargando conversación...</span>
                </div>
            ) : messages.length === 0 ? (
                /* Si no hay mensajes, renderiza mensaje de bienvenida del canal */
                <div className="message-list__welcome">
                    <div className="message-list__welcome-icon">💬</div>
                    <h4 className="message-list__welcome-title">Este es el comienzo del canal #{channelName}</h4>
                    <p className="message-list__welcome-text">Los mensajes que envíes aquí serán leídos por todos los miembros del workspace.</p>
                </div>
            ) : (
                <>
                    {/* Botón opcional para paginar hacia arriba */}
                    {pagination?.has_next_page && (
                        <div className="message-list__load-more-container">
                            <button
                                className="message-list__load-more-btn"
                                onClick={loadMore}
                                disabled={loading}
                            >
                                {loading ? 'Cargando más...' : 'Cargar mensajes anteriores'}
                            </button>
                        </div>
                    )}
                    {/* Mapea la lista memoizada de mensajes a componentes independientes optimizados con React.memo */}
                    {parsedMessages.map((msg) => (
                        <MessageItem
                            key={msg.id}
                            msg={msg}
                            editMessage={editMessage}
                            removeMessage={removeMessage}
                        />
                    ))}
                </>
            )}
            {/* Marcador invisible para apuntar el scroll automático */}
            <div ref={messagesEndRef} />
        </div>
    )
}

export default MessageList
