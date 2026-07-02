import React from "react"
import { Navigate, Outlet } from "react-router"
import useAuth from "../hooks/useAuth"

function AlreadyAuthMiddleware() {
    const { isLogged } = useAuth()

    if (!isLogged) {
        return <Outlet />
    } else {
        const pendingInvitation = sessionStorage.getItem('pendingInvitation')
        if (pendingInvitation) {
            return <Navigate to={pendingInvitation} replace />
        }
        return <Navigate to="/home" replace />
    }
}

export default AlreadyAuthMiddleware
