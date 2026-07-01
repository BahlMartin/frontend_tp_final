import { useState, memo } from 'react'
import { getInitialsFromName } from '../../utils/stringHelper.js'
import './MessageItem.css'

/**
 * MessageItem representa un mensaje individual en la lista de chat.
 * 
 * ¿Qué hace 'memo' aquí?
 * Al envolver este componente con 'memo', React realiza una comparación superficial (shallow comparison) 
 * de las props recibidas (msg, editMessage, removeMessage). Si las props no cambian entre renders,
 * React evita volver a renderizar (re-render) este componente.
 * Puesto que las funciones 'editMessage' y 'removeMessage' se estabilizaron usando useCallback en useChat,
 * cuando llega un mensaje nuevo al final de la lista, los mensajes antiguos ya renderizados no se vuelven a procesar.
 */
export const MessageItem = memo(({ msg, editMessage, removeMessage }) => {
    // Controla si el mensaje individual está en modo edición
    const [isEditing, setIsEditing] = useState(false)
    // Almacena temporalmente el valor del input al editar (aisla el re-render por keystroke)
    const [editValue, setEditValue] = useState(msg.text)
    // Controla el estado de carga local para evitar clics dobles mientras se guarda la edición en el backend
    const [isSavingEdit, setIsSavingEdit] = useState(false)

    // Guarda los cambios de la edición en el backend
    const handleEditSave = async () => {
        if (!editValue.trim() || isSavingEdit) return
        setIsSavingEdit(true)
        try {
            await editMessage(msg.id, editValue)
            setIsEditing(false)
        } catch (err) {
            alert(err.message || "No se pudo actualizar el mensaje (el tiempo límite de 15 minutos puede haber expirado)")
        } finally {
            setIsSavingEdit(false)
        }
    }

    // Solicita confirmación y elimina el mensaje en el backend
    const handleDelete = async () => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este mensaje?")) {
            try {
                await removeMessage(msg.id)
            } catch (err) {
                alert(err.message || "No se pudo eliminar el mensaje")
            }
        }
    }

    return (
        <div className="message-item">
            {/* Avatar del usuario con sus iniciales */}
            <div className="message-item__avatar">
                {getInitialsFromName(msg.user)}
            </div>

            <div className="message-item__body">
                {/* Cabecera del mensaje: Nombre de usuario y hora */}
                <div className="message-item__header">
                    <span className="message-item__user">{msg.user}</span>
                    <span className="message-item__time">
                        {new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>

                {/* Si está editando, renderiza la caja de texto, de lo contrario muestra el texto plano del mensaje */}
                {isEditing ? (
                    <div className="message-item__edit-container">
                        <textarea
                            className="message-item__edit-input"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                        />
                        <div className="message-item__edit-actions">
                            <button
                                className="message-item__edit-btn message-item__edit-btn--cancel"
                                onClick={() => {
                                    setIsEditing(false)
                                    setEditValue(msg.text) // Restablece el valor original al cancelar
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                className="message-item__edit-btn message-item__edit-btn--save"
                                onClick={handleEditSave}
                                disabled={isSavingEdit}
                            >
                                {isSavingEdit ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <span className="message-item__text">{msg.text}</span>
                )}
            </div>

            {/* Si el mensaje pertenece al usuario logueado y no está en edición, muestra botones para editar o eliminar */}
            {msg.isOwn && !isEditing && (
                <div className="message-item__actions">
                    <button
                        className="message-item__action-btn"
                        onClick={() => {
                            setIsEditing(true)
                            setEditValue(msg.text)
                        }}
                        title="Editar mensaje"
                    >
                        ✏️
                    </button>
                    <button
                        className="message-item__action-btn message-item__action-btn--delete"
                        onClick={handleDelete}
                        title="Eliminar mensaje"
                    >
                        🗑️
                    </button>
                </div>
            )}
        </div>
    )
})

export default MessageItem
