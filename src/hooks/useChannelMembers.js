import { useState, useEffect, useCallback } from 'react'
import { getChannelMembers, addChannelMember, removeChannelMember } from '../services/channelService.js'

/**
 * Hook personalizado `useChannelMembers`
 * Gestiona el listado y las operaciones sobre los miembros de un canal específico.
 * Permite obtener los miembros, añadir nuevos miembros del espacio de trabajo al canal,
 * y remover miembros del mismo.
 * 
 * @param {string} channelId - El ID del canal activo para el cual se obtendrán y gestionarán los miembros.
 */
export const useChannelMembers = (channelId) => {
    // Lista de miembros actualmente asignados al canal
    const [channelMembers, setChannelMembers] = useState([])
    // Estado de carga de la petición de obtención de miembros
    const [loadingMembers, setLoadingMembers] = useState(false)
    // Estado para registrar cualquier error al intentar agregar un miembro
    const [addMemberError, setAddMemberError] = useState(null)

    /**
     * Obtiene de forma asíncrona la lista de miembros asociados al canal activo.
     * Utiliza `useCallback` para evitar recrear la función a menos que el `channelId` cambie.
     */
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

    // Efecto para obtener la lista de miembros de forma automática al cambiar de canal o recrear la petición
    useEffect(() => {
        if (channelId) {
            fetchChannelMembers()
        } else {
            setChannelMembers([])
        }
    }, [channelId, fetchChannelMembers])

    /**
     * Agrega un miembro del Workspace al canal actual.
     * Actualiza automáticamente el listado al completarse con éxito.
     * 
     * @param {string} workspaceMemberId - El ID del miembro del espacio de trabajo a agregar.
     * @returns {Promise<Object>} Resultado del flujo ({ ok: true } o { ok: false, error: string }).
     */
    const addMember = async (workspaceMemberId) => {
        if (!workspaceMemberId) return { ok: false }
        setAddMemberError(null)
        try {
            const res = await addChannelMember(channelId, workspaceMemberId)
            if (res.ok) {
                await fetchChannelMembers()
                return { ok: true }
            }
            throw new Error(res.message || "Error al agregar miembro")
        } catch (err) {
            console.error("Error al agregar miembro al canal:", err)
            const errMsg = err.message || "Error al agregar miembro"
            setAddMemberError(errMsg)
            return { ok: false, error: errMsg }
        }
    }

    /**
     * Elimina un miembro del canal actual.
     * Actualiza automáticamente la lista local al completarse con éxito.
     * 
     * @param {string} channelMemberId - El ID de asociación del miembro dentro del canal a eliminar.
     * @returns {Promise<Object>} Resultado del flujo ({ ok: true }).
     */
    const removeMember = async (channelMemberId) => {
        try {
            await removeChannelMember(channelId, channelMemberId)
            await fetchChannelMembers()
            return { ok: true }
        } catch (err) {
            console.error("Error al eliminar miembro del canal:", err)
            throw err
        }
    }

    return {
        channelMembers,
        loadingMembers,
        addMemberError,
        setAddMemberError,
        fetchChannelMembers,
        addMember,
        removeMember
    }
}

export default useChannelMembers
