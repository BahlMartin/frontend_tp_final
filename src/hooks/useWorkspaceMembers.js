import { useState, useEffect } from 'react'
import { updateMemberRole, removeMember } from '../services/workspaceService.js'

export const useWorkspaceMembers = (workspaceId, refetchCurrentWorkspace) => {
    const [selectedMember, setSelectedMember] = useState(null)
    const [selectedRole, setSelectedRole] = useState('')
    const [updatingRole, setUpdatingRole] = useState(false)
    const [roleError, setRoleError] = useState(null)

    // Sync selectedRole with current member role
    useEffect(() => {
        if (selectedMember) {
            setSelectedRole(selectedMember.role)
            setRoleError(null)
        }
    }, [selectedMember])

    const handleRoleUpdate = async (e) => {
        if (e && e.preventDefault) e.preventDefault()
        if (!selectedMember) return
        setRoleError(null)
        setUpdatingRole(true)
        try {
            const res = await updateMemberRole(workspaceId, selectedMember.id, selectedRole)
            if (res.ok) {
                setSelectedMember(null)
                if (refetchCurrentWorkspace) await refetchCurrentWorkspace()
            }
        } catch (err) {
            console.error("Error al actualizar rol:", err)
            setRoleError(err.message || "Error al actualizar rol")
        } finally {
            setUpdatingRole(false)
        }
    }

    const handleRemoveWorkspaceMember = async () => {
        if (!selectedMember) return
        if (!window.confirm(`¿Estás seguro de que quieres eliminar a ${selectedMember.user_name || 'este miembro'} del espacio de trabajo?`)) return
        setRoleError(null)
        setUpdatingRole(true)
        try {
            const res = await removeMember(workspaceId, selectedMember.id)
            if (res.ok) {
                setSelectedMember(null)
                if (refetchCurrentWorkspace) await refetchCurrentWorkspace()
            }
        } catch (err) {
            console.error("Error al eliminar miembro:", err)
            setRoleError(err.message || "Error al eliminar miembro")
        } finally {
            setUpdatingRole(false)
        }
    }

    return {
        selectedMember,
        setSelectedMember,
        selectedRole,
        setSelectedRole,
        updatingRole,
        roleError,
        setRoleError,
        handleRoleUpdate,
        handleRemoveWorkspaceMember
    }
}

export default useWorkspaceMembers
