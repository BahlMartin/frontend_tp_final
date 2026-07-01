import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router'
import useRequest from './useRequest.js'
import { verifyEmail } from '../services/authService.js'

export function useVerifyEmail() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const hasAttempted = useRef(false)

    const {
        sendRequest,
        loading,
        error,
        response
    } = useRequest()

    useEffect(() => {
        if (token && !hasAttempted.current) {
            hasAttempted.current = true
            sendRequest(() => verifyEmail(token))
        }
    }, [token, sendRequest])

    return {
        token,
        loading,
        error,
        isSuccess: !!response?.ok,
        response
    }
}

export default useVerifyEmail
