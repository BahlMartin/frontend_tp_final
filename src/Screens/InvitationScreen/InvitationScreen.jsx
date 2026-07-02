import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import useInvitation from '../../hooks/useInvitation.js'
import useAuth from '../../hooks/useAuth.js'
import Logo from '../../components/Logo/Logo.jsx'
import './InvitationScreen.css'

export const InvitationScreen = () => {
    const { invitationId, decision } = useParams()
    const navigate = useNavigate()
    const { isLogged } = useAuth()

    useEffect(() => {
        sessionStorage.removeItem('pendingInvitation')
    }, [])

    // hook para la logica de invitacion 
    const { loading, error, successMessage, workspaceId } = useInvitation(invitationId, decision, isLogged)

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
                <Logo
                    containerClassName="invitation-screen__logo-container"
                    svgClassName="invitation-screen__logo"
                    textClassName="invitation-screen__logo-text"
                />

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
                            {decision === 'accepted' ? '🎉' : '❌'}
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
