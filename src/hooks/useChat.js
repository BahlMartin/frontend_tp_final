import { useState, useEffect, useCallback } from 'react'
import { getMessages, createMessage, updateMessage, deleteMessage } from '../services/channelService.js'

function useChat(channelId) {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [pagination, setPagination] = useState(null)

    const fetchMessages = useCallback(async (id, page = 1) => {
        setLoading(true)
        setError(null)
        try {
            const res = await getMessages(id, page)
            if (res.ok && res.data) {
                if (page === 1) {
                    setMessages(res.data.messages || [])
                } else {
                    setMessages((prev) => [...prev, ...(res.data.messages || [])])
                }
                setPagination(res.data.pagination || null)
            }
        } catch (err) {
            console.error("Error al cargar mensajes del chat:", err)
            setError(err.message || "No se pudieron cargar los mensajes")
        } finally {
            setLoading(false)
        }
    }, [])

    const pollMessages = useCallback(async (id) => {
        try {
            const res = await getMessages(id, 1)
            if (res.ok && res.data) {
                setMessages(res.data.messages || [])
                setPagination(res.data.pagination || null)
            }
        } catch (err) {
            console.error("Error al refrescar mensajes en segundo plano:", err)
        }
    }, [])

    useEffect(() => {
        if (channelId) {
            fetchMessages(channelId, 1)
        } else {
            setMessages([])
            setPagination(null)
        }
    }, [channelId, fetchMessages])

    useEffect(() => {
        if (!channelId) return

        const interval = setInterval(() => {
            pollMessages(channelId)
        }, 4000) // Consultar cada 4 segundos

        return () => clearInterval(interval)
    }, [channelId, pollMessages])

    const sendMessage = async (content) => {
        if (!channelId) return
        try {
            const res = await createMessage(channelId, content)
            if (res.ok && res.data) {
                // Agregamos el nuevo mensaje al principio (más nuevos primero)
                setMessages((prev) => [res.data, ...prev])
                return res.data
            }
        } catch (err) {
            console.error("Error al enviar mensaje:", err)
            throw err
        }
    }

    const editMessage = async (messageId, newContent) => {
        try {
            const res = await updateMessage(messageId, newContent)
            if (res.ok && res.data) {
                setMessages((prev) =>
                    prev.map((msg) => {
                        const msgId = msg.message_id || msg._id;
                        return msgId === messageId ? { ...msg, ...res.data, message: res.data.content } : msg;
                    })
                )
            }
        } catch (err) {
            console.error("Error al editar mensaje:", err)
            throw err
        }
    }

    const removeMessage = async (messageId) => {
        try {
            const res = await deleteMessage(messageId)
            if (res.ok) {
                setMessages((prev) => prev.filter((msg) => (msg.message_id || msg._id) !== messageId))
            }
        } catch (err) {
            console.error("Error al eliminar mensaje:", err)
            throw err
        }
    }

    const loadMore = useCallback(async () => {
        if (!channelId || loading || !pagination || !pagination.has_next_page) return
        await fetchMessages(channelId, pagination.current_page + 1)
    }, [channelId, loading, pagination, fetchMessages])

    return {
        messages,
        loading,
        error,
        pagination,
        sendMessage,
        editMessage,
        removeMessage,
        loadMore,
        refetchMessages: () => channelId && fetchMessages(channelId, 1)
    }
}

export default useChat
