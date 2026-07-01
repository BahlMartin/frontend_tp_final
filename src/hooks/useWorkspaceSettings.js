import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { updateWorkspace, deleteWorkspace } from '../services/workspaceService.js'

export const useWorkspaceSettings = (workspaceId, currentWorkspace, refetchCurrentWorkspace, refetchWorkspaces, onClose) => {
    const navigate = useNavigate()
    const [editWSName, setEditWSName] = useState('')
    const [editWSDesc, setEditWSDesc] = useState('')
    const [isUpdatingWS, setIsUpdatingWS] = useState(false)
    const [updateWSError, setUpdateWSError] = useState(null)

    useEffect(() => {
        if (currentWorkspace) {
            setEditWSName(currentWorkspace.name)
            setEditWSDesc(currentWorkspace.description || '')
        }
    }, [currentWorkspace])

    const handleUpdateWorkspaceSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault()
        if (!editWSName.trim() || isUpdatingWS) return
        setUpdateWSError(null)
        setIsUpdatingWS(true)
        try {
            await updateWorkspace(workspaceId, editWSName, editWSDesc)
            if (onClose) onClose()
            if (refetchCurrentWorkspace) await refetchCurrentWorkspace()
            if (refetchWorkspaces) await refetchWorkspaces()
        } catch (err) {
            console.error("Error al actualizar workspace:", err)
            setUpdateWSError(err.message || "Error al actualizar workspace")
        } finally {
            setIsUpdatingWS(false)
        }
    }

    const handleDeleteWorkspace = async () => {
        if (!window.confirm("¿ESTÁS TOTALMENTE SEGURO de que deseas eliminar este espacio de trabajo? Esta acción eliminará permanentemente todos los canales, mensajes y miembros. No se puede deshacer.")) return
        setUpdateWSError(null)
        setIsUpdatingWS(true)
        try {
            await deleteWorkspace(workspaceId)
            if (onClose) onClose()
            if (refetchWorkspaces) await refetchWorkspaces()
            navigate('/home')
        } catch (err) {
            console.error("Error al eliminar workspace:", err)
            alert(err.message || "Error al eliminar workspace")
        } finally {
            setIsUpdatingWS(false)
        }
    }

    return {
        editWSName,
        setEditWSName,
        editWSDesc,
        setEditWSDesc,
        isUpdatingWS,
        updateWSError,
        setUpdateWSError,
        handleUpdateWorkspaceSubmit,
        handleDeleteWorkspace
    }
}

export default useWorkspaceSettings
