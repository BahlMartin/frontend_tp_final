import { useState } from 'react'
import { useSearchParams } from 'react-router'
import useForm from './useForm.js'
import useRequest from './useRequest.js'
import { forgotPassword, resetPassword } from '../services/authService.js'

// Estado inicial para el formulario de solicitud de enlace de recuperación (ForgotPassword)
const INITIAL_FORGOT_STATE = {
    email: ''
}

// Estado inicial para el formulario de establecimiento de nueva contraseña (ResetPassword)
const INITIAL_RESET_STATE = {
    password: '',
    confirmPassword: ''
}

/**
 * Hook personalizado `useResetPassword`
 * Encapsula toda la lógica de negocio, manejo de estados y peticiones HTTP 
 * asociadas a los flujos de recuperación y restablecimiento de contraseña.
 * 
 * Este hook divide su comportamiento en dos fases principales:
 * 1. Envío de un enlace/token de recuperación al email del usuario.
 * 2. Restablecimiento físico de la contraseña usando el token proveído.
 */
export function useResetPassword() {
    // Lectura del token de restablecimiento enviado por parámetro de consulta (?token=...)
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')

    // Estados de confirmación de flujos exitosos
    const [emailSent, setEmailSent] = useState(false)
    const [resetSuccess, setResetSuccess] = useState(false)

    // Estados para alternar la visibilidad de los inputs de contraseña
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // Error de validación local cuando las contraseñas no coinciden
    const [passwordMatchError, setPasswordMatchError] = useState(null)

    // Hook personalizado para gestionar el ciclo de vida de la petición de recuperación
    const {
        sendRequest: sendForgotReq,
        loading: forgotLoading,
        error: forgotError
    } = useRequest()

    // Hook personalizado para gestionar el ciclo de vida de la petición de restablecimiento
    const {
        sendRequest: sendResetReq,
        loading: resetLoading,
        error: resetError
    } = useRequest()

    /**
     * Controlador de envío para solicitar el enlace de recuperación de contraseña.
     * Llama al servicio del backend `forgotPassword` con el correo ingresado.
     * 
     * @param {Object} formData - Objeto con los datos del formulario (email)
     */
    const onForgotSubmit = async (formData) => {
        try {
            await sendForgotReq(() => forgotPassword(formData.email))
            setEmailSent(true)
        } catch (err) {
            console.error("Error al solicitar recuperación:", err)
        }
    }

    /**
     * Controlador de envío para registrar la nueva contraseña.
     * Valida que las contraseñas ingresadas coincidan antes de llamar al backend.
     * Llama al servicio del backend `resetPassword` con el token y la nueva contraseña.
     * 
     * @param {Object} formData - Objeto con los datos del formulario (password, confirmPassword)
     */
    const onResetSubmit = async (formData) => {
        if (formData.password !== formData.confirmPassword) {
            setPasswordMatchError("Las contraseñas no coinciden")
            return
        }
        setPasswordMatchError(null)
        try {
            await sendResetReq(() => resetPassword(token, formData.password))
            setResetSuccess(true)
        } catch (err) {
            console.error("Error al restablecer contraseña:", err)
        }
    }

    // Inicialización del formulario de solicitud de enlace con el hook `useForm`
    const forgotForm = useForm(INITIAL_FORGOT_STATE, onForgotSubmit)

    // Inicialización del formulario de restablecimiento de contraseña con el hook `useForm`
    const resetForm = useForm(INITIAL_RESET_STATE, onResetSubmit)

    // Funciones utilitarias para alternar la visibilidad de los campos
    const toggleShowPassword = () => setShowPassword(prev => !prev)
    const toggleShowConfirmPassword = () => setShowConfirmPassword(prev => !prev)

    return {
        token,
        emailSent,
        resetSuccess,
        showPassword,
        showConfirmPassword,
        passwordMatchError,
        forgotLoading,
        forgotError,
        resetLoading,
        resetError,
        forgotForm,
        resetForm,
        toggleShowPassword,
        toggleShowConfirmPassword
    }
}

export default useResetPassword
