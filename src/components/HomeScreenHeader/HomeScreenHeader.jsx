import { Link } from 'react-router'
import { getInitialsFromUser } from '../../utils/stringHelper.js'
import { Logo } from '../Logo/Logo.jsx'
import './HomeScreenHeader.css'

export const HomeScreenHeader = ({ userData, onLogout }) => {
    return (
        <header className="home-screen-header">
            <Logo
                containerClassName="home-screen-header__logo"
                svgClassName="home-screen-header__logo-svg"
                textClassName="home-screen-header__logo-text"
            />
            <div className="home-screen-header__user-profile">
                <Link to="/user" className="home-screen-header__profile-link" title="Editar Perfil">
                    <div className="home-screen-header__avatar">
                        {getInitialsFromUser(userData?.first_name, userData?.last_name, userData?.user_name)}
                    </div>
                    <span className="home-screen-header__user-name">
                        {userData?.first_name ? `${userData.first_name} ${userData.last_name}` : userData?.user_name}
                    </span>
                </Link>
                <button onClick={onLogout} className="home-screen-header__logout-btn">
                    Cerrar sesión
                </button>
            </div>
        </header>
    )
}
