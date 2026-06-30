import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { respondInvitation } from '../../services/workspaceService'
import './InvitationScreen.css'

export const InvitationScreen = () => {
    const { invitationId, decision } = useParams()
    const navigate = useNavigate()
    const hasAttempted = useRef(false)
    
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [successMessage, setSuccessMessage] = useState('')
    const [workspaceId, setWorkspaceId] = useState(null)

    useEffect(() => {
        if (invitationId && decision && !hasAttempted.current) {
            hasAttempted.current = true
            setLoading(true)
            setError(null)
            
            respondInvitation(invitationId, decision)
                .then((res) => {
                    setLoading(false)
                    if (res.ok) {
                        setSuccessMessage(res.message || 'Operación completada con éxito')
                        if (res.data?.workspace_id) {
                            setWorkspaceId(res.data.workspace_id)
                        }
                    } else {
                        setError(res.message || 'Error al procesar la invitación')
                    }
                })
                .catch((err) => {
                    setLoading(false)
                    setError(err.message || 'Ocurrió un error inesperado al procesar la invitación')
                })
        }
    }, [invitationId, decision])

    const handleContinue = () => {
        if (decision === 'accepted' && workspaceId) {
            navigate(`/workspace/${workspaceId}`)
        } else {
            navigate('/home')
        }
    }

    return (
        <div className="invitation-screen">
            <div className="invitation-screen__container">
                <div className="invitation-screen__logo-container">
                    <svg className="invitation-screen__logo" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                        <path d="M26.2,74.9 C26.2,80.7 21.5,85.4 15.7,85.4 C9.9,85.4 5.2,80.7 5.2,74.9 C5.2,69.1 9.9,64.4 15.7,64.4 L26.2,64.4 L26.2,74.9 Z" fill="#E01E5A"/>
                        <path d="M31.4,74.9 C31.4,69.1 36.1,64.4 41.9,64.4 C47.7,64.4 52.4,69.1 52.4,74.9 L52.4,106.3 C52.4,112.1 47.7,116.8 41.9,116.8 C36.1,116.8 31.4,112.1 31.4,106.3 L31.4,74.9 Z" fill="#E01E5A"/>
                        <path d="M41.9,26.2 C36.1,26.2 31.4,21.5 31.4,15.7 C31.4,9.9 36.1,5.2 41.9,5.2 C47.7,5.2 52.4,9.9 52.4,15.7 L52.4,26.2 L41.9,26.2 Z" fill="#36C5F0"/>
                        <path d="M41.9,31.4 C47.7,31.4 52.4,36.1 52.4,41.9 C52.4,47.7 47.7,52.4 41.9,52.4 L10.5,52.4 C4.7,52.4 0,47.7 0,41.9 C0,36.1 4.7,31.4 10.5,31.4 L41.9,31.4 Z" fill="#36C5F0"/>
                        <path d="M93.8,41.9 C93.8,36.1 98.5,31.4 104.3,31.4 C110.1,31.4 114.8,36.1 114.8,41.9 C114.8,47.7 110.1,52.4 104.3,52.4 L93.8,52.4 L93.8,41.9 Z" fill="#2EB67D"/>
                        <path d="M88.6,41.9 C88.6,47.7 83.9,52.4 78.1,52.4 C72.3,52.4 67.6,47.7 67.6,41.9 L67.6,10.5 C67.6,4.7 72.3,0 78.1,0 C83.9,0 88.6,4.7 88.6,10.5 L88.6,41.9 Z" fill="#2EB67D"/>
                        <path d="M78.1,93.8 C83.9,93.8 88.6,98.5 88.6,104.3 C88.6,110.1 83.9,114.8 78.1,114.8 C72.3,114.8 67.6,110.1 67.6,104.3 L67.6,93.8 L78.1,93.8 Z" fill="#ECB22E"/>
                        <path d="M78.1,88.6 C72.3,88.6 67.6,83.9 67.6,78.1 C67.6,73.3 72.3,68.6 78.1,68.6 L109.5,68.6 C115.3,68.6 120,73.3 120,78.1 C120,83.9 115.3,88.6 109.5,88.6 L78.1,88.6 Z" fill="#ECB22E"/>
                    </svg>
                    <span className="invitation-screen__logo-text">slack</span>
                </div>

                {loading && (
                    <div className="invitation-screen__status">
                        <div className="invitation-screen__spinner"></div>
                        <h2 className="invitation-screen__heading">Procesando invitación...</h2>
                        <p className="invitation-screen__subheading">
                            Por favor espera mientras validamos tu respuesta con nuestro servidor.
                        </p>
                    </div>
                )}

                {!loading && successMessage && (
                    <div className="invitation-screen__status invitation-screen__status--success">
                        <div className="invitation-screen__icon">
                            {decision === 'accepted' ? '🎉' : '👋'}
                        </div>
                        <h2 className="invitation-screen__heading">
                            {decision === 'accepted' ? '¡Invitación Aceptada!' : 'Invitación Rechazada'}
                        </h2>
                        <p className="invitation-screen__subheading">
                            {decision === 'accepted' 
                                ? 'Ya formas parte del nuevo espacio de trabajo. Haz clic abajo para ingresar.' 
                                : 'Has declinado la invitación. Haz clic abajo para volver al inicio.'}
                        </p>
                        <button className="invitation-screen__action-btn" onClick={handleContinue}>
                            {decision === 'accepted' ? 'Entrar al Workspace' : 'Ir al Dashboard'}
                        </button>
                    </div>
                )}

                {!loading && error && (
                    <div className="invitation-screen__status invitation-screen__status--error">
                        <div className="invitation-screen__icon">❌</div>
                        <h2 className="invitation-screen__heading">Error al responder invitación</h2>
                        <p className="invitation-screen__subheading">
                            No pudimos procesar la respuesta a la invitación en este momento.
                        </p>
                        <div className="invitation-screen__error-detail">{error}</div>
                        <Link to="/home" className="invitation-screen__action-btn invitation-screen__action-btn--secondary">
                            Volver al Dashboard
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default InvitationScreen
