import ENVIRONMENT from '../config/enviroment.config.js'

function getHeaders() {
    const token = localStorage.getItem('auth_token')
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}

export async function getChannelById(channel_id) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/channels/${channel_id}`, {
        method: 'GET',
        headers: getHeaders()
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al obtener detalles del canal')
    }
    return response
}

export async function getMessages(channel_id, page = 1, limit = 10) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/channels/${channel_id}/messages?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: getHeaders()
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al obtener mensajes')
    }
    return response
}

export async function createMessage(channel_id, content) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/channels/${channel_id}/messages`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ content })
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al enviar mensaje')
    }
    return response
}

export async function updateMessage(message_id, content) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/channels/messages/${message_id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ content })
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al editar mensaje')
    }
    return response
}

export async function deleteMessage(message_id) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/channels/messages/${message_id}`, {
        method: 'DELETE',
        headers: getHeaders()
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al eliminar mensaje')
    }
    return response
}

export async function addChannelMember(channel_id, member_id) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/channels/${channel_id}/members`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ member_id })
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al agregar miembro al canal')
    }
    return response
}

export async function removeChannelMember(channel_id, member_id) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/channels/${channel_id}/members/${member_id}`, {
        method: 'DELETE',
        headers: getHeaders()
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al eliminar miembro del canal')
    }
    return response
}

export async function getChannelMembers(channel_id) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/channels/${channel_id}/members`, {
        method: 'GET',
        headers: getHeaders()
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al obtener miembros del canal')
    }
    return response
}
