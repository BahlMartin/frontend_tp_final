import { useState, useCallback } from "react"

function useRequest() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [response, setResponse] = useState(null)

    const sendRequest = useCallback(async (requestCallbackFn) => {
        try {
            setLoading(true)
            setError(null)
            const server_response = await requestCallbackFn()
            setResponse(server_response)
            return server_response
        } catch (err) {
            setError(err)
            setResponse(null)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const clearStates = useCallback(() => {
        setLoading(false)
        setError(null)
        setResponse(null)
    }, [])

    return {
        sendRequest,
        loading,
        error,
        response,
        clearStates
    }
}

export default useRequest
