import { useState } from 'react'
import { useNavigate } from 'react-router'
import useRequest from './useRequest'
import useAuth from './useAuth'
import { checkEmail as apiCheckEmail, login as apiLogin, verify2FA as apiVerify2FA } from '../services/authService'

export function useLogin() {
    const { login: syncLogin } = useAuth()
    const navigate = useNavigate()

    const [step, setStep] = useState('email') // 'email' | 'password' | '2fa'
    const [email, setEmail] = useState('')

    const { sendRequest, loading, error, clearStates } = useRequest()

    const handleEmailSubmit = async (emailVal) => {
        try {
            clearStates()
            await sendRequest(() => apiCheckEmail(emailVal))
            setEmail(emailVal)
            setStep('password')
        } catch (err) {
            console.error("Error al verificar email:", err)
        }
    }

    const handlePasswordSubmit = async (passwordVal) => {
        try {
            clearStates()
            await sendRequest(() => apiLogin(email, passwordVal))
            setStep('2fa')
        } catch (err) {
            console.error("Error al iniciar sesión:", err)
        }
    }

    const handle2FASubmit = async (codeVal) => {
        try {
            clearStates()
            const res = await sendRequest(() => apiVerify2FA(email, codeVal))
            if (res?.ok && res?.data?.access_token) {
                syncLogin(res.data.access_token)
                navigate('/home')
            }
        } catch (err) {
            console.error("Error al verificar código 2FA:", err)
        }
    }

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
        handleEmailSubmit,
        handlePasswordSubmit,
        handle2FASubmit,
        goBackToEmail,
        goBackToPassword
    }
}

export default useLogin
