import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import useAuth from '../../hooks/useAuth'
import useWorkspace from '../../hooks/useWorkspace'
import useChat from '../../hooks/useChat'

// Subcomponentes
import ChannelHeader from '../../components/ChannelHeader/ChannelHeader.jsx'
import MessageList from '../../components/MessageList/MessageList.jsx'
import ChatInput from '../../components/ChatInput/ChatInput.jsx'
import EditChannelModal from '../../components/EditChannelModal/EditChannelModal.jsx'
import MembersModal from '../../components/MembersModal/MembersModal.jsx'
import AddMemberModal from '../../components/AddMemberModal/AddMemberModal.jsx'

// Hooks personalizados
import { useChannelDetails } from '../../hooks/useChannelDetails.js'
import { useChannelMembers } from '../../hooks/useChannelMembers.js'

import './ChannelScreen.css'

export const ChannelScreen = () => {
    const { channelId, workspaceId } = useParams()
    const navigate = useNavigate()
    const { userData } = useAuth()
    const { members: workspaceMembers, refetchCurrentWorkspace } = useWorkspace()

    // Lógica del canal (detalles, edición, eliminación)
    const {
        channelDetails,
        isUpdatingChannel,
        editChannelError,
        updateChannelDetails,
        deleteChannelDetails
    } = useChannelDetails(workspaceId, channelId, refetchCurrentWorkspace)

    // Lógica de miembros del canal (listar, agregar, remover)
    const {
        channelMembers,
        loadingMembers,
        addMemberError,
        setAddMemberError,
        addMember,
        removeMember
    } = useChannelMembers(channelId)

    // Lógica del chat (mensajes, envío, edición, eliminación)
    const {
        messages,
        loading,
        pagination,
        sendMessage,
        editMessage,
        removeMessage,
        loadMore
    } = useChat(channelId)

    // Estados de UI para modales
    const [showEditChannelModal, setShowEditChannelModal] = useState(false)
    const [showMembersModal, setShowMembersModal] = useState(false)
    const [showAddMemberModal, setShowAddMemberModal] = useState(false)

    // Roles y Autorización
    const currentUserRole = workspaceMembers.find(wm => wm.user_name === userData?.user_name || wm.email === userData?.email)?.role
    const isAuthorized = currentUserRole === 'owner' || currentUserRole === 'admin'

    const handleDeleteChannel = async () => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar este canal y todos sus mensajes? Esta acción no se puede deshacer.")) return
        try {
            await deleteChannelDetails()
            setShowEditChannelModal(false)
            navigate(`/workspace/${workspaceId}`)
        } catch (err) {
            alert(err.message || "Error al eliminar canal")
        }
    }

    return (
        <div className="channel-screen">
            <ChannelHeader
                channelName={channelDetails?.name}
                description={channelDetails?.description}
                memberCount={channelMembers.length}
                isAuthorized={isAuthorized}
                onOpenSettings={() => setShowEditChannelModal(true)}
                onOpenMembers={() => setShowMembersModal(true)}
            />

            <MessageList
                messages={messages}
                loading={loading}
                pagination={pagination}
                loadMore={loadMore}
                editMessage={editMessage}
                removeMessage={removeMessage}
                channelName={channelDetails?.name}
                channelId={channelId}
                userData={userData}
            />

            <ChatInput
                channelName={channelDetails?.name}
                onSendMessage={sendMessage}
            />

            {showEditChannelModal && (
                <EditChannelModal
                    channelDetails={channelDetails}
                    onClose={() => setShowEditChannelModal(false)}
                    onUpdate={updateChannelDetails}
                    onDelete={handleDeleteChannel}
                    isUpdating={isUpdatingChannel}
                    error={editChannelError}
                />
            )}

            {showMembersModal && (
                <MembersModal
                    channelName={channelDetails?.name}
                    members={channelMembers}
                    workspaceMembers={workspaceMembers}
                    currentUserRole={currentUserRole}
                    currentUserName={userData?.user_name}
                    loading={loadingMembers}
                    onClose={() => setShowMembersModal(false)}
                    onOpenAddMember={() => {
                        setShowMembersModal(false)
                        setShowAddMemberModal(true)
                    }}
                    onRemoveMember={removeMember}
                />
            )}

            {showAddMemberModal && (
                <AddMemberModal
                    channelName={channelDetails?.name}
                    channelMembers={channelMembers}
                    workspaceMembers={workspaceMembers}
                    onClose={() => {
                        setShowAddMemberModal(false)
                        setShowMembersModal(true)
                    }}
                    onAddMember={addMember}
                    error={addMemberError}
                    setError={setAddMemberError}
                />
            )}
        </div>
    )
}

export default ChannelScreen
