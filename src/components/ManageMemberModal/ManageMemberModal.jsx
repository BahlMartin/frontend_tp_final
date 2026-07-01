import React from 'react'
import './ManageMemberModal.css'

/**
 * Componente: ManageMemberModal
 * Descripción: Modal interactivo para administrar miembros dentro de un espacio de trabajo.
 * Permite visualizar el perfil del miembro seleccionado, modificar su rol jerárquico
 * (Administrador/Miembro) y removerlo del workspace. La edición está restringida
 * únicamente a los usuarios con rol de Propietario (owner).
 */
export const ManageMemberModal = ({
    selectedMember,
    setSelectedMember,
    members,
    userData,
    selectedRole,
    setSelectedRole,
    updatingRole,
    roleError,
    handleRoleUpdate,
    handleRemoveWorkspaceMember
}) => {
    return (
        <div className="manage-member-modal__overlay">
            <div className="manage-member-modal__box">
                <div className="manage-member-modal__header">
                    <h3 className="manage-member-modal__title">Administrar Miembro</h3>
                    <button className="manage-member-modal__close" onClick={() => setSelectedMember(null)}>&times;</button>
                </div>
                <form className="manage-member-modal__form" onSubmit={handleRoleUpdate}>
                    <div className="manage-member-modal__profile-info">
                        <div className="manage-member-modal__profile-avatar">👤</div>
                        <h4 className="manage-member-modal__profile-name">
                            {selectedMember.user_name}
                        </h4>
                        <p className="manage-member-modal__profile-email">
                            {selectedMember.email}
                        </p>
                    </div>

                    <div className="manage-member-modal__input-group">
                        <label className="manage-member-modal__label">Rol actual</label>
                        <span className="manage-member-modal__value">
                            {selectedMember.role}
                        </span>
                    </div>

                    {(() => {
                        const currentWSMember = members.find(m => m.user_name === userData?.user_name || m.email === userData?.email);
                        const isCurrentUserOwner = currentWSMember?.role === 'owner';
                        const isTargetOwner = selectedMember.role === 'owner';

                        if (isCurrentUserOwner && !isTargetOwner) {
                            return (
                                <>
                                    <div className="manage-member-modal__input-group">
                                        <label className="manage-member-modal__label" htmlFor="member-role-select">
                                            Asignar nuevo rol
                                        </label>
                                        <select
                                            id="member-role-select"
                                            className="manage-member-modal__select"
                                            value={selectedRole}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                            required
                                        >
                                            <option value="admin">Administrador (admin)</option>
                                            <option value="member">Miembro (member)</option>
                                        </select>
                                    </div>

                                    {roleError && (
                                        <div className="manage-member-modal__error">
                                            {roleError}
                                        </div>
                                    )}

                                    <div className="manage-member-modal__actions">
                                        <button
                                            className="manage-member-modal__btn manage-member-modal__btn--danger"
                                            type="button"
                                            onClick={handleRemoveWorkspaceMember}
                                            disabled={updatingRole}
                                        >
                                            Eliminar
                                        </button>
                                        <button
                                            className="manage-member-modal__btn manage-member-modal__btn--cancel"
                                            type="button"
                                            onClick={() => setSelectedMember(null)}
                                            disabled={updatingRole}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            className="manage-member-modal__btn manage-member-modal__btn--submit"
                                            type="submit"
                                            disabled={updatingRole || selectedRole === selectedMember.role}
                                        >
                                            {updatingRole ? 'Guardando...' : 'Guardar'}
                                        </button>
                                    </div>
                                </>
                            )
                        } else {
                            return (
                                <div className="manage-member-modal__actions">
                                    <button
                                        className="manage-member-modal__btn manage-member-modal__btn--cancel"
                                        type="button"
                                        onClick={() => setSelectedMember(null)}
                                        style={{ width: '100%' }}
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            )
                        }
                    })()}
                </form>
            </div>
        </div>
    )
}

export default ManageMemberModal
