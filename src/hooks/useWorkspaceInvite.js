import { useState } from 'react'
import { inviteMember } from '../services/workspaceService.js'
import useForm from './useForm.js'

export const useWorkspaceInvite = (workspaceId) => {
    const [inviteError, setInviteError] = useState(null)
    const [inviteSuccess, setInviteSuccess] = useState(false)
    const [isInviting, setIsInviting] = useState(false)

    const initialInviteState = { email: '' }

    const handleInviteSubmit = async (formData) => {
        setInviteError(null)
        setInviteSuccess(false)
        setIsInviting(true)
        try {
            const res = await inviteMember(workspaceId, formData.email)
            if (res.ok) {
                setInviteSuccess(true)
                inviteForm.resetForm()
            }
        } catch (err) {
            console.error("Error al invitar:", err)
            setInviteError(err.message || "Error al enviar invitación")
        } finally {
            setIsInviting(false)
        }
    }

    const inviteForm = useForm(initialInviteState, handleInviteSubmit)

    return {
        inviteForm,
        inviteError,
        setInviteError,
        inviteSuccess,
        setInviteSuccess,
        isInviting
    }
}

export default useWorkspaceInvite
