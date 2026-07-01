import { useState } from 'react'
import { useNavigate } from 'react-router'
import { createChannel } from '../services/workspaceService.js'
import useForm from './useForm.js'

export const useCreateChannel = (workspaceId, refetchCurrentWorkspace, onClose) => {
    const navigate = useNavigate()
    const [chanError, setChanError] = useState(null)
    const [isCreatingChan, setIsCreatingChan] = useState(false)

    const initialChannelState = { name: '', description: '' }

    const handleChannelSubmit = async (formData) => {
        setChanError(null)
        setIsCreatingChan(true)
        try {
            const cleanName = formData.name.toLowerCase().replace(/\s+/g, '-')
            const res = await createChannel(workspaceId, cleanName, formData.description)
            if (res.ok && res.data?._id) {
                if (onClose) onClose()
                if (refetchCurrentWorkspace) await refetchCurrentWorkspace()
                navigate(`/workspace/${workspaceId}/channel/${res.data._id}`)
            }
        } catch (err) {
            console.error("Error al crear canal:", err)
            setChanError(err.message || "Error al crear el canal")
        } finally {
            setIsCreatingChan(false)
        }
    }

    const chanForm = useForm(initialChannelState, handleChannelSubmit)

    return {
        chanForm,
        chanError,
        setChanError,
        isCreatingChan
    }
}

export default useCreateChannel
