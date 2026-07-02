import { useState } from 'react'
import './ChatInput.css'

export const ChatInput = ({ channelName, onSendMessage }) => {
    const [inputMessage, setInputMessage] = useState('')
    const [isSending, setIsSending] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isSending) return
        const trimmed = inputMessage.trim()
        if (!trimmed) return
        setIsSending(true)
        try {
            await onSendMessage(trimmed)
            setInputMessage('')
        } catch (err) {
            alert(err.message || "Error al enviar el mensaje")
        } finally {
            setIsSending(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    return (
        <div className="chat-input">
            <form className="chat-input__form" onSubmit={handleSubmit}>
                <textarea
                    className="chat-input__field"
                    placeholder={`Enviar mensaje a #${channelName}`}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                />
                <button
                    type="submit"
                    className="chat-input__send-btn"
                    disabled={isSending || !inputMessage.trim()}
                >
                    ➤
                </button>
            </form>
        </div>
    )
}

export default ChatInput
