import ENVIRONMENT from '../config/enviroment.config.js'

function getHeaders() {
    const token = localStorage.getItem('auth_token')
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
}

export async function getMe() {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/users/me`, {
        method: 'GET',
        headers: getHeaders()
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al obtener datos del usuario')
    }
    return response
}

export async function updateMe(profileData) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/users/me`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            user_name: profileData.user_name,
            email: profileData.email
        })
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al actualizar el perfil')
    }
    return response
}
