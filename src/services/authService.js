import ENVIRONMENT from '../config/enviroment.config.js'

export async function login(email, password) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al iniciar sesión')
    }
    return response
}

export async function verify2FA(email, code) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/auth/verify-2fa`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, code: Number(code) })
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Código 2FA incorrecto')
    }
    return response
}

export async function register(userData) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: userData.email,
            password: userData.password,
            first_name: userData.first_name,
            last_name: userData.last_name,
            user_name: userData.user_name
        })
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al registrar usuario')
    }
    return response
}

export async function verifyEmail(token) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/auth/verify-email?token=${token}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al verificar email')
    }
    return response
}

export async function forgotPassword(email) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al solicitar recuperación')
    }
    return response
}

export async function resetPassword(token, password) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/auth/reset-password?token=${token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Error al restablecer contraseña')
    }
    return response
}

export async function checkEmail(email) {
    const response_http = await fetch(`${ENVIRONMENT.URL_API}/api/auth/check-email?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const response = await response_http.json()
    if (!response_http.ok) {
        throw new Error(response.message || 'Email no encontrado')
    }
    return response
}
