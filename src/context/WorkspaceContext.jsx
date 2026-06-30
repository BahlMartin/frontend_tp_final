import React, { createContext, useState, useEffect, useCallback } from 'react'
import { useParams, Outlet } from 'react-router'
import { getWorkspaces, getWorkspaceById, getChannels, getMembers } from '../services/workspaceService.js'

export const WorkspaceContext = createContext({
    workspaces: [],
    currentWorkspace: null,
    channels: [],
    members: [],
    loading: false,
    error: null,
    refetchWorkspaces: () => {},
    refetchCurrentWorkspace: () => {}
})

export const WorkspaceContextProvider = () => {
    const { workspaceId } = useParams()
    const [workspaces, setWorkspaces] = useState([])
    const [currentWorkspace, setCurrentWorkspace] = useState(null)
    const [channels, setChannels] = useState([])
    const [members, setMembers] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchWorkspaces = useCallback(async () => {
        try {
            const res = await getWorkspaces()
            if (res.ok) {
                const mapped = (res.data || []).map(item => ({
                    _id: item.workspace_id,
                    name: item.workspace_nombre,
                    description: item.workspace_descripcion,
                    role: item.member_rol,
                    member_id: item.member_id
                }))
                setWorkspaces(mapped)
            }
        } catch (err) {
            console.error("Error al obtener workspaces:", err)
        }
    }, [])

    const fetchWorkspaceDetails = useCallback(async (id) => {
        setLoading(true)
        setError(null)
        try {
            const [wsRes, chanRes, memRes] = await Promise.all([
                getWorkspaceById(id),
                getChannels(id),
                getMembers(id)
            ])

            if (wsRes.ok) {
                setCurrentWorkspace(wsRes.data)
            }
            if (chanRes.ok) {
                setChannels(chanRes.data || [])
            }
            if (memRes.ok) {
                const mappedMembers = (memRes.data || []).map(m => ({
                    _id: m.member_id,
                    id: m.member_id,
                    user_name: m.member_nombre,
                    email: m.member_email,
                    role: m.member_rol
                }))
                setMembers(mappedMembers)
            }
        } catch (err) {
            console.error("Error al obtener detalles del workspace:", err)
            setError(err.message || "Error al cargar el espacio de trabajo")
        } finally {
            setLoading(false)
        }
    }, [])

    const pollWorkspaceDetails = useCallback(async (id) => {
        try {
            const [wsRes, chanRes, memRes] = await Promise.all([
                getWorkspaceById(id),
                getChannels(id),
                getMembers(id)
            ])

            if (wsRes.ok) {
                setCurrentWorkspace(wsRes.data)
            }
            if (chanRes.ok) {
                setChannels(chanRes.data || [])
            }
            if (memRes.ok) {
                const mappedMembers = (memRes.data || []).map(m => ({
                    _id: m.member_id,
                    id: m.member_id,
                    user_name: m.member_nombre,
                    email: m.member_email,
                    role: m.member_rol
                }))
                setMembers(mappedMembers)
            }
        } catch (err) {
            console.error("Error al actualizar detalles del workspace en segundo plano:", err)
        }
    }, [])

    useEffect(() => {
        fetchWorkspaces()
    }, [fetchWorkspaces])

    useEffect(() => {
        if (workspaceId) {
            fetchWorkspaceDetails(workspaceId)
        } else {
            setCurrentWorkspace(null)
            setChannels([])
            setMembers([])
        }
    }, [workspaceId, fetchWorkspaceDetails])

    useEffect(() => {
        if (!workspaceId) return

        const interval = setInterval(() => {
            pollWorkspaceDetails(workspaceId)
        }, 5000) // Consultar cada 5 segundos

        return () => clearInterval(interval)
    }, [workspaceId, pollWorkspaceDetails])

    const providerValue = {
        workspaces,
        currentWorkspace,
        channels,
        members,
        loading,
        error,
        refetchWorkspaces: fetchWorkspaces,
        refetchCurrentWorkspace: () => workspaceId && fetchWorkspaceDetails(workspaceId)
    }

    return (
        <WorkspaceContext.Provider value={providerValue}>
            <Outlet />
        </WorkspaceContext.Provider>
    )
}
