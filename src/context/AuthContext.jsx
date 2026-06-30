import { createContext, useEffect, useState, useCallback } from "react"
import { jwtDecode } from "jwt-decode"
import { getMe } from "../services/userService.js"

export const AuthContext = createContext({
    isLogged: false,
    userData: null,
    login: () => { },
    logout: () => { },
    refreshUser: () => { }
})

export const AUTH_TOKEN_LOCALSTORAGE_KEY = 'auth_token'

export const AuthContextProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY))
    const [isLogged, setIsLogged] = useState(() => Boolean(localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY)))
    const [userData, setUserData] = useState(null)

    const login = useCallback((auth_token) => {
        localStorage.setItem(AUTH_TOKEN_LOCALSTORAGE_KEY, auth_token)
        setToken(auth_token)
        setIsLogged(true)
    }, [])

    const logout = useCallback(() => {
        localStorage.removeItem(AUTH_TOKEN_LOCALSTORAGE_KEY)
        setToken(null)
        setIsLogged(false)
        setUserData(null)
    }, [])

    const refreshUser = useCallback(async () => {
        if (!token) return
        try {
            const res = await getMe()
            if (res.ok && res.data) {
                setUserData(res.data.user || res.data)
            }
        } catch (error) {
            console.error("Error al refrescar sesión del usuario:", error)
            // Si el token es inválido o expiró, desloguear
            if (error.message && (error.message.includes("token") || error.message.includes("sesión"))) {
                logout()
            }
        }
    }, [token, logout])

    useEffect(() => {
        if (token) {
            try {
                const payload = jwtDecode(token)
                // Carga inicial rápida desde el token JWT
                setUserData({
                    email: payload.email,
                    id: payload.user_id || payload.id,
                    user_name: payload.username || payload.nombre || '',
                    first_name: payload.first_name || '',
                    last_name: payload.last_name || ''
                })
                // Carga detallada desde el backend
                refreshUser()
            } catch (e) {
                console.error("Error decodificando token:", e)
                logout()
            }
        } else {
            setUserData(null)
            setIsLogged(false)
        }
    }, [token, refreshUser, logout])

    const providerValues = {
        isLogged,
        userData,
        login,
        logout,
        refreshUser
    }

    return (
        <AuthContext.Provider value={providerValues}>
            {children}
        </AuthContext.Provider>
    )
}
