import React from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { AuthContextProvider } from './context/AuthContext'
import AlreadyAuthMiddleware from './middlewares/AlreadyAuthMiddleware'
import AuthMiddleware from './middlewares/AuthMiddleware'
import { WorkspaceContextProvider } from './context/WorkspaceContext'

import LoginScreen from './Screens/LoginScreen/LoginScreen'
import RegisterScreen from './Screens/RegisterScreen/RegisterScreen'
import ResetPasswordScreen from './Screens/ResetPasswordScreen/ResetPasswordScreen'
import VerifyEmailScreen from './Screens/VerifyEmailScreen/VerifyEmailScreen'
import HomeScreen from './Screens/HomeScreen/HomeScreen'
import WorkspaceScreen from './Screens/WorkspaceScreen/WorkspaceScreen'
import ChannelScreen from './Screens/ChannelScreen/ChannelScreen'
import UserProfileScreen from './Screens/UserProfileScreen/UserProfileScreen'
import NotFoundScreen from './Screens/NotFoundScreen/NotFoundScreen'
import InvitationScreen from './Screens/InvitationScreen/InvitationScreen'
import WorkspaceWelcome from './Screens/WorkspaceScreen/WorkspaceWelcome'


const App = () => {
  return (
    <AuthContextProvider>
      <Routes>
        {/* Rutas no autenticadas (Redirige a /home si ya estás logueado) */}
        <Route element={<AlreadyAuthMiddleware />}>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/reset-password" element={<ResetPasswordScreen />} />
          <Route path="/verify-email" element={<VerifyEmailScreen />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Route>

        {/* Rutas autenticadas (Redirige a /login si no estás logueado) */}
        <Route element={<AuthMiddleware />}>
          {/* Configuración de perfil */}
          <Route path="/user" element={<UserProfileScreen />} />

          {/* Decisiones de invitación */}
          <Route path="/invitations/:invitationId/:decision" element={<InvitationScreen />} />


          {/* Rutas con Contexto de Workspaces */}
          <Route element={<WorkspaceContextProvider />}>
            {/* Dashboard para seleccionar workspaces */}
            <Route path="/home" element={<HomeScreen />} />

            {/* Layout de un workspace seleccionado */}
            <Route path="/workspace/:workspaceId" element={<WorkspaceScreen />}>
              {/* Ruta hija por defecto cuando entras a un workspace sin canal activo */}
              <Route index element={<WorkspaceWelcome />} />
              
              {/* Canal de chat interactivo */}
              <Route path="channel/:channelId" element={<ChannelScreen />} />
            </Route>
          </Route>
        </Route>

        {/* Ruta Fallback 404 para errores */}
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
    </AuthContextProvider>
  )
}

export default App