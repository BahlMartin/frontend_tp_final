import React from 'react'
import './UserProfileForm.css'

// Subcomponente de utilería local para representar cada grupo de entrada del formulario
const UserProfileInputGroup = ({ label, id, name, type = 'text', value, onChange, required }) => (
    <div className="user-profile__input-group">
        <label className="user-profile__label" htmlFor={id}>{label}</label>
        <input
            className="user-profile__input"
            type={type}
            id={id}
            name={name}
            value={value || ''}
            onChange={onChange}
            required={required}
        />
    </div>
)

export const UserProfileForm = ({
    formState,
    handleChange,
    handleSubmit,
    loading,
    error,
    successMsg,
    handleCancel
}) => {
    return (
        <form className="user-profile__form" onSubmit={handleSubmit}>
            <div className="user-profile__row">
                <UserProfileInputGroup
                    label="Nombre"
                    id="first_name"
                    name="first_name"
                    value={formState.first_name}
                    onChange={handleChange}
                    required
                />

                <UserProfileInputGroup
                    label="Apellido"
                    id="last_name"
                    name="last_name"
                    value={formState.last_name}
                    onChange={handleChange}
                    required
                />
            </div>

            <UserProfileInputGroup
                label="Nombre de usuario (display name)"
                id="user_name"
                name="user_name"
                value={formState.user_name}
                onChange={handleChange}
                required
            />

            <UserProfileInputGroup
                label="Correo electrónico"
                id="email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
                required
            />

            {successMsg && (
                <div className="user-profile__success">
                    ¡Perfil actualizado exitosamente!
                </div>
            )}

            {error && (
                <div className="user-profile__error">
                    {error.message || String(error)}
                </div>
            )}

            <div className="user-profile__actions">
                <button
                    type="button"
                    className="user-profile__btn user-profile__btn--cancel"
                    onClick={handleCancel}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="user-profile__btn user-profile__btn--submit"
                    disabled={loading}
                >
                    {loading ? 'Guardando...' : 'Guardar cambios'}
                </button>
            </div>
        </form>
    )
}

export default UserProfileForm
