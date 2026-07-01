/**
 * Genera las iniciales a partir de campos estructurados de un usuario.
 * @param {string} [first] - Nombre (first_name).
 * @param {string} [last] - Apellido (last_name).
 * @param {string} [username] - Nombre de usuario (user_name).
 * @returns {string} Iniciales en mayúsculas (ej: 'JD', 'US', 'U').
 */
export const getInitialsFromUser = (first, last, username) => {
    if (first && last) return (first[0] + last[0]).toUpperCase()
    if (username) return username.slice(0, 2).toUpperCase()
    return 'U'
}

/**
 * Genera las iniciales a partir de un único string (nombre completo o nombre de usuario).
 * @param {string} name - Nombre completo o username (ej: "John Doe" o "johndoe").
 * @returns {string} Iniciales en mayúsculas (ej: 'JD', 'JO', 'U').
 */
export const getInitialsFromName = (name) => {
    if (!name || typeof name !== 'string') return 'U'
    const cleaned = name.trim()
    if (cleaned.includes(' ')) {
        const parts = cleaned.split(/\s+/)
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return cleaned.slice(0, 2).toUpperCase()
}
