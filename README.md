# 🎨 Slucky (Frontend) - Trabajo Integrador Final UTN

Este es el repositorio correspondiente al Frontend del proyecto final **Slucky** (Slack-Clone) desarrollado para el curso Full-Stack de la Universidad Tecnológica Nacional (UTN).

---

## 🛠️ Tecnologías y Características

- **Framework**: React (Vite) para un entorno de desarrollo rápido y builds optimizados.
- **Lenguaje**: JavaScript (JSX).
- **Estilos**: Vanilla CSS modularizado con variables CSS personalizadas y convención de nombres BEM (Block-Element-Modifier) para mantener la mantenibilidad.
- **Control de Rutas**: React Router DOM, incluyendo middlewares para la protección de rutas públicas y privadas (autenticación).
- **Gestión de Estado**: React Context ([AuthContext], [WorkspaceContext]) para estados globales y custom hooks reutilizables que separan la lógica de negocio del renderizado de componentes.
- **Diseño Responsivo**: Adaptabilidad completa garantizada mediante CSS media queries desde dispositivos móviles pequeños (320px) hasta pantallas de ultra alta definición (2000px).

---

## 🕒 Mecanismo de Polling (Sensación de Inmediatez)

Para brindar una experiencia interactiva, dinámica y dar una sensación de inmediatez sin la sobrecarga técnica o de recursos de una infraestructura de WebSockets, la aplicación implementa una estrategia de **polling (consultas periódicas)** a la API Backend:

1. **Mensajes del Canal (`cada 15 segundos`)**: A través del hook [useChat], la API de mensajes se consulta automáticamente cada 15 segundos para traer nuevos mensajes del canal activo y mantener la conversación actualizada.
2. **Detalles del Workspace (`cada 30 segundos`)**: A través del [WorkspaceContext], los detalles del espacio de trabajo (lista de canales, miembros y configuración) se actualizan en segundo plano cada 30 segundos, reflejando cambios en la estructura de los canales o el ingreso de nuevos miembros.

Ambos intervalos se limpian de forma segura al desmontar los componentes o al cambiar de canal/workspace, optimizando así el rendimiento de la aplicación y el uso de red.

---

## 🚀 Funcionalidades Principales

- **Gestión de Sesión & Autenticación Completa**:
  - Registro de usuarios con validaciones de campos en tiempo real.
  - Verificación de correo electrónico mediante código OTP.
  - Inicio de sesión con persistencia segura de token JWT.
  - Recuperación y restablecimiento de contraseña mediante envío de token por email.
- **Espacios de Trabajo (Workspaces)**:
  - Creación de múltiples workspaces por usuario.
  - Panel de administración y edición de configuraciones de cada workspace.
  - Sistema de invitación de nuevos miembros mediante enlaces y códigos de invitación únicos.
- **Canales (Channels)**:
  - Creación de canales dentro de los workspaces.
  - Lista de canales accesibles y dinámicos para los miembros.
- **Chat Interactivo**:
  - Envío y recepción de mensajes de texto en tiempo real simulado (polling).
- **Gestión del Perfil**:
  - Vista y edición de los datos de perfil del usuario (nombre, avatar, etc.).

---

## 🏗️ Estructura del Proyecto

```text
src/
 ├─ components/     # Componentes modulares y reutilizables (Modales, Formularios, etc.)
 ├─ config/         # Archivos de configuración (instancia de API, variables de entorno)
 ├─ context/        # Contextos globales (AuthContext para sesión y WorkspaceContext para datos del workspace)
 ├─ hooks/          # Hooks personalizados para encapsular lógica de negocio (useChat, useWorkspace, etc.)
 ├─ middlewares/    # Componentes para protección de rutas (Auth / Guest wrappers)
 ├─ Screens/        # Pantallas completas de la aplicación (Home, Login, Register, Workspace, etc.)
 ├─ services/       # Conectores y peticiones HTTP a la API Backend utilizando fetch adaptado
 ├─ utils/          # Constantes y funciones de utilidad comunes
 ├─ App.jsx         # Configuración del enrutamiento y estructura raíz de React Router DOM
 └─ main.jsx        # Punto de entrada de React
```

---

## 🎨 Patrones y Buenas Prácticas de Desarrollo

Para asegurar que la aplicación sea escalable y fácil de mantener, el proyecto sigue estos patrones de arquitectura frontend:

- **Separación de Responsabilidades (UI/Lógica)**: Las pantallas dentro de `Screens/` e interfaces en `components/` solo se encargan del renderizado y el diseño visual. Toda la lógica de negocio, manejo de estados de carga/error y llamadas al backend se delega a hooks personalizados ubicados en `hooks/`.
- **Organización de la Capa de API**: Las peticiones HTTP se organizan por servicio en la carpeta `services/` (ej. `authService.js`, `workspaceService.js`, etc.) y consumen la URL base configurada dinámicamente mediante [enviroment.config.js].
- **Control de Acceso mediante Middlewares**: El enrutamiento en [App.jsx] está envuelto por componentes de middleware:
  - `AlreadyAuthMiddleware` protege páginas públicas (Login, Registro, etc.) para usuarios que ya iniciaron sesión.
  - `AuthMiddleware` protege la aplicación principal y configuraciones, forzando a redirigir a `/login` si el usuario no tiene una sesión activa.
- **Nomenclatura CSS BEM (Block-Element-Modifier)**: Para evitar conflictos en la cascada global de CSS y mantener el código de estilos legible, los nombres de clases siguen la convención BEM (ej. `.workspace-screen__body` para un elemento secundario y `.workspace-screen__body--active` para modificadores).

---

## ⚙️ Configuración y Variables de Entorno

Crea un archivo `.env` en la raíz de la carpeta `FRONTEND` para apuntar a tu backend desplegado o local:

```env
VITE_URL_API=http://localhost:8080
```

---

## ⚡ Pasos para la Instalación y Ejecución Local

1. Navegar a la carpeta del frontend:
   ```bash
   cd FRONTEND
   ```
2. Instalar las dependencias necesarias:
   ```bash
   npm install
   ```
3. Ejecutar la aplicación en modo desarrollo:
   ```bash
   npm run dev
   ```
   *La aplicación estará corriendo localmente en `http://localhost:5173/`.*



---

## 🌐 Enlace del Despliegue Público
- **Sitio Web Desplegado**: `https://slucky.vercel.app`
