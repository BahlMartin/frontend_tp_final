import React from 'react'
import { Link } from 'react-router'
import Logo from '../../components/Logo/Logo.jsx'
import './NotFoundScreen.css'

export const NotFoundScreen = () => {
    return (
        <div className="not-found">
            <div className="not-found__container">
                <Logo
                    containerClassName="not-found__logo-container"
                    svgClassName="not-found__logo-svg"
                    textClassName="not-found__logo-text"
                />
                <h1 className="not-found__title">404 - Página no encontrada</h1>
                <p className="not-found__text">Parece que la dirección ingresada no existe o el recurso ha sido movido permanentemente.</p>
                <Link to="/home" className="not-found__btn">
                    Ir al panel de inicio
                </Link>
            </div>
        </div>
    )
}

export default NotFoundScreen
