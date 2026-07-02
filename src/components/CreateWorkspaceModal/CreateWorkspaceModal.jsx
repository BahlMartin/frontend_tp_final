import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import useForm from '../../hooks/useForm.js'
import { createWorkspace } from '../../services/workspaceService.js'
import { Modal } from '../Modal/Modal.jsx'
import './CreateWorkspaceModal.css'

export const CreateWorkspaceModal = ({ onClose, onSuccess }) => {
    const navigate = useNavigate()
    const [createError, setCreateError] = useState(null)
    const [isCreating, setIsCreating] = useState(false)

    const initialWorkspaceState = {
        name: '',
        description: ''
    }

    const handleCreateSubmit = async (formData) => {
        setCreateError(null)
        setIsCreating(true)
        try {
            const res = await createWorkspace(formData.name, formData.description)
            if (res.ok && res.data?._id) {
                onClose()
                if (onSuccess) onSuccess()
                // Redirigir al nuevo workspace creado
                navigate(`/workspace/${res.data._id}`)
            }
        } catch (err) {
            console.error("Error al crear espacio de trabajo:", err)
            setCreateError(err.message || "Error al crear el espacio de trabajo")
        } finally {
            setIsCreating(false)
        }
    }

    const { formState, handleChange, handleSubmit } = useForm(initialWorkspaceState, handleCreateSubmit)

    return (
        <Modal title="Crear espacio de trabajo" onClose={onClose}>
            <form className="create-workspace-modal__form" onSubmit={handleSubmit}>
                <div className="create-workspace-modal__input-group">
                    <label className="create-workspace-modal__label" htmlFor="name">Nombre del espacio</label>
                    <input
                        className="create-workspace-modal__input"
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Ej. Acme Corp, Slucky..."
                        value={formState.name}
                        onChange={handleChange}
                        required
                        autoFocus
                    />
                </div>

                <div className="create-workspace-modal__input-group">
                    <label className="create-workspace-modal__label" htmlFor="description">Descripción del espacio</label>
                    <textarea
                        className="create-workspace-modal__input"
                        id="description"
                        name="description"
                        placeholder="Ej. Canal de comunicación interna para Acme Corp"
                        value={formState.description}
                        onChange={handleChange}
                    />
                </div>

                {createError && (
                    <div className="create-workspace-modal__error">
                        {createError}
                    </div>
                )}

                <div className="create-workspace-modal__actions">
                    <button
                        className="create-workspace-modal__btn create-workspace-modal__btn--cancel"
                        type="button"
                        onClick={onClose}
                        disabled={isCreating}
                    >
                        Cancelar
                    </button>
                    <button
                        className="create-workspace-modal__btn create-workspace-modal__btn--submit"
                        type="submit"
                        disabled={isCreating}
                    >
                        {isCreating ? 'Creando...' : 'Crear espacio'}
                    </button>
                </div>
            </form>
        </Modal>
    )
}

export default CreateWorkspaceModal
