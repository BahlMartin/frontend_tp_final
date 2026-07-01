import { useState } from 'react'
import useRequest from './useRequest.js'
import useForm from './useForm.js'
import { register as apiRegister } from '../services/authService.js'

const INITIAL_FORM_STATE = {
    first_name: '',
    last_name: '',
    user_name: '',
    email: '',
    password: ''
}

export function useRegister() {
    const [registered, setRegistered] = useState(false)
    const [registeredEmail, setRegisteredEmail] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const { sendRequest, loading, error } = useRequest()

    const onSubmit = async (formData) => {
        try {
            setRegisteredEmail(formData.email)
            const res = await sendRequest(() => apiRegister(formData))
            if (res.ok) {
                setRegistered(true)
            }
        } catch (err) {
            console.error("Error al registrar:", err)
        }
    }

    const form = useForm(INITIAL_FORM_STATE, onSubmit)

    const toggleShowPassword = () => {
        setShowPassword((prev) => !prev)
    }

    return {
        form,
        registered,
        registeredEmail,
        showPassword,
        toggleShowPassword,
        loading,
        error
    }
}

export default useRegister
