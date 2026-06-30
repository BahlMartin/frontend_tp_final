import React from "react"
import { Navigate, Outlet } from "react-router"
import useAuth from "../hooks/useAuth"

function AuthMiddleware() {
    const { isLogged } = useAuth()

    if (isLogged) {
        return <Outlet />
    } else {
        return <Navigate to="/login" replace />
    }
}

export default AuthMiddleware
