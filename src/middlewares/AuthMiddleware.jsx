import React from "react"
import { Navigate, Outlet, useLocation } from "react-router"
import useAuth from "../hooks/useAuth"

function AuthMiddleware() {
    const { isLogged } = useAuth()
    const location = useLocation()

    if (isLogged) {
        return <Outlet />
    } else {
        if (location.pathname.startsWith('/invitations/')) {
            sessionStorage.setItem('pendingInvitation', location.pathname)
        }
        return <Navigate to="/login" replace />
    }
}

export default AuthMiddleware
