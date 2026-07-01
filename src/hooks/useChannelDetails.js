import { useState, useEffect } from 'react'
import { getChannelById } from '../services/channelService.js'
import { updateChannel, deleteChannel } from '../services/workspaceService.js'

export const useChannelDetails = (workspaceId, channelId, refetchCurrentWorkspace) => {
    const [channelDetails, setChannelDetails] = useState(null)
    const [isUpdatingChannel, setIsUpdatingChannel] = useState(false)
    const [editChannelError, setEditChannelError] = useState(null)

    // Cargar detalles específicos del canal al cambiar de channelId
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

    // Actualizar canal
    const updateChannelDetails = async (name, description) => {
        if (!name.trim() || isUpdatingChannel) return { ok: false }
        setEditChannelError(null)
        setIsUpdatingChannel(true)
        try {
            const cleanName = name.toLowerCase().replace(/\s+/g, '-')
            const res = await updateChannel(workspaceId, channelId, cleanName, description)
            if (res.ok) {
                setChannelDetails(res.data)
                refetchCurrentWorkspace()
                return { ok: true, data: res.data }
            }
            throw new Error(res.message || "Error al actualizar canal")
        } catch (err) {
            console.error("Error al actualizar canal:", err)
            const errMsg = err.message || "Error al actualizar canal"
            setEditChannelError(errMsg)
            return { ok: false, error: errMsg }
        } finally {
            setIsUpdatingChannel(false)
        }
    }

    // Eliminar canal
    const deleteChannelDetails = async () => {
        setEditChannelError(null)
        setIsUpdatingChannel(true)
        try {
            await deleteChannel(workspaceId, channelId)
            refetchCurrentWorkspace()
            return { ok: true }
        } catch (err) {
            console.error("Error al eliminar canal:", err)
            throw err
        } finally {
            setIsUpdatingChannel(false)
        }
    }

    return {
        channelDetails,
        setChannelDetails,
        isUpdatingChannel,
        editChannelError,
        setEditChannelError,
        updateChannelDetails,
        deleteChannelDetails
    }
}

export default useChannelDetails
