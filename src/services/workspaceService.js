import ENVIRONMENT from '../config/enviroment.config.js'

function getHeaders() {
    const token = localStorage.getItem('auth_token')
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}

export async function getWorkspaces() {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspaces`, {
        method: 'GET',
        headers: getHeaders()
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al obtener espacios de trabajo')
    }
    return response
}

export async function getWorkspaceById(workspace_id) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspaces/${workspace_id}`, {
        method: 'GET',
        headers: getHeaders()
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al obtener detalles del espacio de trabajo')
    }
    return response
}

export async function createWorkspace(name, description) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspaces`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, description })
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al crear el espacio de trabajo')
    }
    return response
}

export async function updateWorkspace(workspace_id, name, description) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspaces/${workspace_id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ name, description })
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al actualizar el espacio de trabajo')
    }
    return response
}

export async function deleteWorkspace(workspace_id) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspaces/${workspace_id}`, {
        method: 'DELETE',
        headers: getHeaders()
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al eliminar el espacio de trabajo')
    }
    return response
}

export async function inviteMember(workspace_id, email) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspaces/${workspace_id}/invitations`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email })
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al enviar invitación')
    }
    return response
}

export async function getMembers(workspace_id) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspaces/${workspace_id}/members`, {
        method: 'GET',
        headers: getHeaders()
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al obtener miembros')
    }
    return response
}

export async function updateMemberRole(workspace_id, member_id, role) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspaces/${workspace_id}/members/${member_id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ rol: role })
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al actualizar rol del miembro')
    }
    return response
}

export async function removeMember(workspace_id, member_id) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspaces/${workspace_id}/members/${member_id}`, {
        method: 'DELETE',
        headers: getHeaders()
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al eliminar miembro')
    }
    return response
}

export async function createChannel(workspace_id, name, description) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspaces/${workspace_id}/channels`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, description })
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al crear canal')
    }
    return response
}

export async function getChannels(workspace_id) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspaces/${workspace_id}/channels`, {
        method: 'GET',
        headers: getHeaders()
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al obtener canales')
    }
    return response
}

export async function respondInvitation(invitation_id, decision) {
    // decision: 'accept' o 'reject'
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/invitations/${invitation_id}/${decision}`, {
        method: 'PUT',
        headers: getHeaders()
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al responder la invitación')
    }
    return response
}

export async function updateChannel(workspace_id, channel_id, name, description) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspaces/${workspace_id}/channels/${channel_id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ name, description })
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al actualizar canal')
    }
    return response
}

export async function deleteChannel(workspace_id, channel_id) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/workspaces/${workspace_id}/channels/${channel_id}`, {
        method: 'DELETE',
        headers: getHeaders()
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al eliminar canal')
    }
    return response
}
