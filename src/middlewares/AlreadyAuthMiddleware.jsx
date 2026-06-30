import React from "react"
import { Navigate, Outlet } from "react-router"
import useAuth from "../hooks/useAuth"

function AlreadyAuthMiddleware() {
    const { isLogged } = useAuth()

    if (!isLogged) {
        return <Outlet />
    } else {
        return <Navigate to="/home" replace />
    }
}

export default AlreadyAuthMiddleware
