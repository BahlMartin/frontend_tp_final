import { useState } from 'react'
import { useNavigate } from 'react-router'
import useRequest from './useRequest.js'
import useAuth from './useAuth.js'
import useForm from './useForm.js'
import { checkEmail as apiCheckEmail, login as apiLogin, verify2FA as apiVerify2FA } from '../services/authService.js'

export function useLogin() {
    const { login: syncLogin } = useAuth()
    const navigate = useNavigate()

    const [step, setStep] = useState('email') // 'email' | 'password' | '2fa'
    const [email, setEmail] = useState('')

    const { sendRequest, loading, error, clearStates } = useRequest()

    const form = useForm({ email: '', password: '', code: '' }, async (formData) => {
        if (step === 'email') {
            try {
                clearStates()
                await sendRequest(() => apiCheckEmail(formData.email))
                setEmail(formData.email)
                setStep('password')
            } catch (err) {
                console.error("Error al verificar email:", err)
            }
        } else if (step === 'password') {
            try {
                clearStates()
                await sendRequest(() => apiLogin(email, formData.password))
                setStep('2fa')
            } catch (err) {
                console.error("Error al iniciar sesión:", err)
            }
        } else if (step === '2fa') {
            try {
                clearStates()
                const res = await sendRequest(() => apiVerify2FA(email, formData.code))
                if (res?.ok && res?.data?.access_token) {
                    const pendingInvitation = sessionStorage.getItem('pendingInvitation')
                    syncLogin(res.data.access_token)
                    if (!pendingInvitation) {
                        navigate('/home')
                    }
                }
            } catch (err) {
                console.error("Error al verificar código 2FA:", err)
            }
        }
    })

    const goBackToEmail = () => {
        clearStates()
        setStep('email')
    }

    const goBackToPassword = () => {
        clearStates()
        setStep('password')
    }

    return {
        step,
        email,
        loading,
        error,
        form,
        goBackToEmail,
        goBackToPassword
    }
}

export default useLogin
