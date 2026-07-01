import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import useAuth from './useAuth.js'
import useForm from './useForm.js'
import useRequest from './useRequest.js'
import { updateMe } from '../services/userService.js'
import { getInitialsFromUser } from '../utils/stringHelper.js'

/**
 * Hook personalizado para gestionar la lógica, el estado y las interacciones del formulario
 * de la pantalla de perfil de usuario (UserProfileScreen).
 */
export function useUserProfile() {
    const { userData, refreshUser } = useAuth()
    const navigate = useNavigate()
    const [successMsg, setSuccessMsg] = useState(false)

    const {
        sendRequest,
        loading,
        error
    } = useRequest()

    const initialFormState = {
        first_name: userData?.first_name || '',
        last_name: userData?.last_name || '',
        user_name: userData?.user_name || '',
        email: userData?.email || ''
    }

    // Inicializa el formulario con el helper useForm.
    const profileForm = useForm(initialFormState, async (formData) => {
        setSuccessMsg(false)
        try {
            // Se utiliza await para esperar a que se complete el envío de la petición
            const res = await sendRequest(() => updateMe(formData))
            if (res.ok) {
                setSuccessMsg(true)
                // Se utiliza await para refrescar la información del usuario en el contexto de autenticación
                await refreshUser()
            }
        } catch (err) {
            console.error("Error al actualizar el perfil:", err)
        }
    })

    // Sincroniza el estado local del formulario cuando el usuario (userData) termina de cargarse desde el contexto
    useEffect(() => {
        if (userData) {
            profileForm.setFormState({
                first_name: userData.first_name || '',
                last_name: userData.last_name || '',
                user_name: userData.user_name || '',
                email: userData.email || ''
            })
        }
    }, [userData])

    // Maneja la acción de volver a la página anterior
    const handleBack = () => {
        navigate(-1)
    }

    // Genera las iniciales a partir de los datos del usuario
    const initials = getInitialsFromUser(userData?.first_name, userData?.last_name, userData?.user_name)

    return {
        formState: profileForm.formState,
        handleChange: profileForm.handleChange,
        handleSubmit: profileForm.handleSubmit,
        loading,
        error,
        successMsg,
        handleBack,
        initials,
        userData
    }
}

export default useUserProfile

