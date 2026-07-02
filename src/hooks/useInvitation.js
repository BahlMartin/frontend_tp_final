import { useState, useEffect, useRef } from 'react'
import { respondInvitation } from '../services/workspaceService.js'

const VALID_DECISIONS = ['accepted', 'rejected']

export function useInvitation(invitationId, decision, enabled = true) {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [successMessage, setSuccessMessage] = useState('')
    const [workspaceId, setWorkspaceId] = useState(null)
    const hasAttempted = useRef(false)

    useEffect(() => {
        if (!enabled) return

        // 1. Validación temprana del ID de la invitación
        if (!invitationId) {
            setError('El ID de la invitación es requerido.')
            setLoading(false)
            return
        }

        // 2. Validación temprana de la decisión
        if (!decision || !VALID_DECISIONS.includes(decision)) {
            setError('Decisión de invitación inválida. Debe ser "accepted" o "rejected".')
            setLoading(false)
            return
        }

        // 3. Ejecución de la petición controlada contra StrictMode
        if (!hasAttempted.current) {
            hasAttempted.current = true
            setLoading(true)
            setError(null)

            respondInvitation(invitationId, decision)
                .then((res) => {
                    setLoading(false)
                    if (res.ok) {
                        setSuccessMessage(res.message || 'Operación completada con éxito')
                        if (res.data?.workspace_id) {
                            setWorkspaceId(res.data.workspace_id)
                        }
                    } else {
                        setError(res.message || 'Error al procesar la invitación')
                    }
                })
                .catch((err) => {
                    setLoading(false)
                    setError(err.message || 'Ocurrió un error inesperado al procesar la invitación')
                })
        }
    }, [invitationId, decision, enabled])

    return {
        loading,
        error,
        successMessage,
        workspaceId
    }
}

export default useInvitation
