import React, { useEffect } from 'react'
import './Modal.css'

export const Modal = ({ title, onClose, children, className = '' }) => {
    // Cerrar al presionar la tecla Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        // Bloquear scroll de la página al abrir
        document.body.style.overflow = 'hidden'
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'unset'
        }
    }, [onClose])

    return (
        <div className="modal-layout" onClick={onClose}>
            <div 
                className={`modal-layout__box ${className}`} 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-layout__header">
                    <h3 className="modal-layout__title">{title}</h3>
                    <button 
                        className="modal-layout__close-btn" 
                        onClick={onClose}
                        aria-label="Cerrar modal"
                    >
                        &times;
                    </button>
                </div>
                <div className="modal-layout__content">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal
