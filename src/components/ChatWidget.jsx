import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useChat } from '../contexts/ChatContext'
import { SupportIcon, CloseIcon, SendIcon, UploadIcon } from './Icons'
import '../styles/ChatWidget.css'

const formatTime = (iso) => {
  try {
    const d = new Date(iso)
    const now = new Date()
    const sameDay = d.toDateString() === now.toDateString()
    if (sameDay) {
      return d.toLocaleTimeString('es-HN', { hour: '2-digit', minute: '2-digit' })
    }
    return d.toLocaleDateString('es-HN', { day: '2-digit', month: 'short' }) +
      ' ' + d.toLocaleTimeString('es-HN', { hour: '2-digit', minute: '2-digit' })
  } catch { return '' }
}

const ChatWidget = () => {
  const { user } = useAuth()
  const { messages, loading, sendMessageWithFiles, conversation } = useChat()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [pendingFiles, setPendingFiles] = useState([])
  const [pendingPreviews, setPendingPreviews] = useState([])
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [open, messages])

  const handleOpen = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/' } } })
      return
    }
    setOpen(true)
  }

  const handleFiles = (filesList) => {
    const files = Array.from(filesList || [])
    const accepted = []
    const previews = []
    for (const f of files) {
      if (!f.type.startsWith('image/')) {
        setError('Solo se permiten imágenes')
        continue
      }
      if (f.size > 5 * 1024 * 1024) {
        setError('Cada imagen no debe superar 5 MB')
        continue
      }
      accepted.push(f)
      previews.push(URL.createObjectURL(f))
    }
    if (accepted.length) {
      setPendingFiles((prev) => [...prev, ...accepted])
      setPendingPreviews((prev) => [...prev, ...previews])
      setError('')
    }
  }

  const handleFileInput = (e) => {
    handleFiles(e.target.files)
    e.target.value = ''
  }

  const removePending = (idx) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== idx))
    setPendingPreviews((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!text.trim() && pendingFiles.length === 0) return
    if (sending) return
    setSending(true)
    setError('')
    const { error } = await sendMessageWithFiles(text, pendingFiles)
    setSending(false)
    if (error) {
      setError(error.message || 'No se pudo enviar')
    } else {
      setText('')
      setPendingFiles([])
      setPendingPreviews([])
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <motion.button
        className="chat-fab"
        onClick={open ? () => setOpen(false) : handleOpen}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? 'Cerrar chat de soporte' : 'Abrir chat de soporte'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CloseIcon width="22" height="22" />
            </motion.span>
          ) : (
            <motion.span
              key="support"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SupportIcon width="22" height="22" />
            </motion.span>
          )}
        </AnimatePresence>
        <span className="chat-fab-pulse" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="chat-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="chat-header-avatar">
                  <SupportIcon width="18" height="18" />
                </div>
                <div>
                  <strong>Soporte Vladimir Laptop</strong>
                  <small>Te respondemos pronto</small>
                </div>
              </div>
              <button
                className="chat-close"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
              >
                <CloseIcon width="16" height="16" />
              </button>
            </div>

            <div className="chat-body">
              {loading ? (
                <div className="chat-loading">
                  <div className="spinner" style={{ width: 24, height: 24, borderWidth: 3 }} />
                </div>
              ) : messages.length === 0 ? (
                <div className="chat-empty">
                  <div className="chat-empty-icon"><SupportIcon width="36" height="36" /></div>
                  <strong>¡Hola! ¿En qué podemos ayudarte?</strong>
                  <p>Envíanos tu consulta y un miembro de nuestro equipo te responderá lo antes posible.</p>
                </div>
              ) : (
                <>
                  {messages.map((m, i) => {
                    const isMine = m.sender_id === user?.id
                    const isAdmin = m.sender_role === 'admin'
                    return (
                      <motion.div
                        key={m.id}
                        className={`chat-msg ${isMine ? 'mine' : 'theirs'} ${isAdmin ? 'admin' : ''}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 * (i % 5) }}
                      >
                        {isAdmin && !isMine && <span className="chat-msg-role">Soporte</span>}
                        {m.content && <p>{m.content}</p>}
                        {m.attachments && m.attachments.length > 0 && (
                          <div className="chat-msg-attachments">
                            {m.attachments.map((url, idx) => (
                              <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="chat-msg-img"
                              >
                                <img src={url} alt={`Adjunto ${idx + 1}`} loading="lazy" />
                              </a>
                            ))}
                          </div>
                        )}
                        <span className="chat-msg-time">{formatTime(m.created_at)}</span>
                      </motion.div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {pendingPreviews.length > 0 && (
              <div className="chat-pending">
                {pendingPreviews.map((src, i) => (
                  <div key={i} className="chat-pending-item">
                    <img src={src} alt="" />
                    <button type="button" onClick={() => removePending(i)}>
                      <CloseIcon width="10" height="10" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <form className="chat-input-wrap" onSubmit={handleSend}>
              {error && <div className="chat-error">{error}</div>}
              <button
                type="button"
                className="chat-attach-btn"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Adjuntar imagen"
              >
                <UploadIcon width="18" height="18" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileInput}
              />
              <textarea
                className="chat-input"
                placeholder="Escribe tu mensaje..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <button
                type="submit"
                className="chat-send-btn"
                disabled={sending || (!text.trim() && pendingFiles.length === 0)}
                aria-label="Enviar"
              >
                {sending ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <SendIcon />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatWidget
