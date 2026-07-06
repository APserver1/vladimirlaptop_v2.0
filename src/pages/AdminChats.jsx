import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import {
  ChatIcon, SendIcon, UploadIcon, CloseIcon, UserIcon, SearchIcon,
} from '../components/Icons'
import '../styles/AdminChats.css'

const formatTime = (iso) => {
  try {
    const d = new Date(iso)
    const now = new Date()
    const diffMin = Math.floor((now - d) / 60000)
    if (diffMin < 1) return 'ahora'
    if (diffMin < 60) return `${diffMin}m`
    if (diffMin < 1440) return `${Math.floor(diffMin / 60)}h`
    if (diffMin < 10080) return `${Math.floor(diffMin / 1440)}d`
    return d.toLocaleDateString('es-HN', { day: '2-digit', month: 'short' })
  } catch { return '' }
}

const formatFull = (iso) => {
  try {
    return new Date(iso).toLocaleString('es-HN', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
    })
  } catch { return '' }
}

const AdminChats = () => {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [messages, setMessages] = useState([])
  const [loadingList, setLoadingList] = useState(true)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [pendingFiles, setPendingFiles] = useState([])
  const [pendingPreviews, setPendingPreviews] = useState([])
  const [search, setSearch] = useState('')
  const [userMap, setUserMap] = useState({})
  const [unreadMap, setUnreadMap] = useState({})
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    if (!isAdmin) {
      navigate('/')
    }
  }, [user, isAdmin, navigate])

  // Fetch all conversations and user info
  const fetchConversations = useCallback(async () => {
    setLoadingList(true)
    const { data, error } = await supabase
      .from('vladimir_chat_conversations')
      .select('*')
      .order('last_message_at', { ascending: false, nullsFirst: false })
    if (error) {
      console.error(error)
      setError('No se pudieron cargar las conversaciones')
    } else {
      setConversations(data || [])
      // fetch profiles for each unique user
      const ids = [...new Set((data || []).map((c) => c.user_id).filter(Boolean))]
      if (ids.length > 0) {
        const { data: profiles } = await supabase
          .from('vladimir_profiles')
          .select('id, full_name, email, avatar_url')
          .in('id', ids)
        if (profiles) {
          const map = {}
          profiles.forEach((p) => { map[p.id] = p })
          setUserMap(map)
        }
      }
    }
    setLoadingList(false)
  }, [])

  useEffect(() => {
    if (!isAdmin) return
    fetchConversations()
  }, [isAdmin, fetchConversations])

  // Compute unread count per conversation (messages from users that admin hasn't read)
  const computeUnread = useCallback(async (convs) => {
    if (!convs || convs.length === 0) return {}
    const ids = convs.map((c) => c.id)
    const { data } = await supabase
      .from('vladimir_chat_messages')
      .select('conversation_id, id, sender_role, created_at')
      .in('conversation_id', ids)
      .eq('sender_role', 'user')
    const map = {}
    ;(data || []).forEach((m) => {
      map[m.conversation_id] = (map[m.conversation_id] || 0) + 1
    })
    setUnreadMap(map)
  }, [])

  useEffect(() => {
    if (conversations.length > 0) {
      computeUnread(conversations)
    }
  }, [conversations, computeUnread])

  // Subscribe to new messages globally (admin)
  useEffect(() => {
    if (!isAdmin) return
    const channel = supabase
      .channel('vladimir_admin_chats_global')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'vladimir_chat_messages' },
        async (payload) => {
          const m = payload.new
          // refresh conversation ordering by re-fetching
          if (m.sender_role === 'user') {
            setUnreadMap((prev) => ({ ...prev, [m.conversation_id]: (prev[m.conversation_id] || 0) + 1 }))
          }
          // re-fetch conversation to update last_message_at
          await fetchConversations()
          // if the open conversation matches, append
          setMessages((prev) => {
            if (m.conversation_id !== selectedId) return prev
            if (prev.some((x) => x.id === m.id)) return prev
            return [...prev, m]
          })
        },
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'vladimir_chat_conversations' },
        () => { fetchConversations() },
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [isAdmin, selectedId, fetchConversations])

  // Load messages of selected conversation
  useEffect(() => {
    if (!selectedId) { setMessages([]); return }
    const load = async () => {
      setLoadingMsgs(true)
      const { data, error } = await supabase
        .from('vladimir_chat_messages')
        .select('*')
        .eq('conversation_id', selectedId)
        .order('created_at', { ascending: true })
      if (!error) {
        setMessages(data || [])
        setUnreadMap((prev) => ({ ...prev, [selectedId]: 0 }))
      }
      setLoadingMsgs(false)
    }
    load()
  }, [selectedId])

  // Subscribe to new messages of selected conversation
  useEffect(() => {
    if (!selectedId) return
    const channel = supabase
      .channel(`vladimir_admin_chat_${selectedId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'vladimir_chat_messages',
          filter: `conversation_id=eq.${selectedId}`,
        },
        (payload) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === payload.new.id)) return prev
            return [...prev, payload.new]
          })
        },
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [selectedId])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, selectedId])

  const handleFiles = (filesList) => {
    const files = Array.from(filesList || [])
    const accepted = []
    const previews = []
    for (const f of files) {
      if (!f.type.startsWith('image/')) { setError('Solo se permiten imágenes'); continue }
      if (f.size > 5 * 1024 * 1024) { setError('Cada imagen no debe superar 5 MB'); continue }
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

  const uploadAttachment = async (file) => {
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error('La imagen no debe superar 5 MB')
      if (!file.type.startsWith('image/')) throw new Error('Solo se permiten imágenes')
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const path = `chat/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const { error: upErr } = await supabase.storage
        .from('chat-media')
        .upload(path, file, { contentType: file.type })
      if (upErr) throw upErr
      const { data } = supabase.storage.from('chat-media').getPublicUrl(path)
      return { url: data.publicUrl, error: null }
    } catch (err) {
      return { url: null, error: err }
    }
  }

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!selectedId) return
    if (!text.trim() && pendingFiles.length === 0) return
    if (sending) return
    setSending(true)
    setError('')
    const attachments = []
    for (const f of pendingFiles) {
      const { url, error } = await uploadAttachment(f)
      if (url) attachments.push(url)
      else if (error) { setError(error.message); setSending(false); return }
    }
    const { error: sendErr } = await supabase
      .from('vladimir_chat_messages')
      .insert({
        conversation_id: selectedId,
        sender_id: user.id,
        sender_role: 'admin',
        content: text.trim() || null,
        attachments,
      })
    setSending(false)
    if (sendErr) {
      setError(sendErr.message || 'No se pudo enviar')
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

  if (!isAdmin) {
    return (
      <div className="adminchats-denied">
        <h2>Acceso restringido</h2>
        <p>Esta página es exclusiva para administradores.</p>
        <Link to="/" className="btn btn-primary">Volver al inicio</Link>
      </div>
    )
  }

  const selected = conversations.find((c) => c.id === selectedId)
  const selectedUser = selected ? userMap[selected.user_id] : null
  const filtered = conversations.filter((c) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    const u = userMap[c.user_id]
    return (
      c.subject?.toLowerCase().includes(q) ||
      u?.full_name?.toLowerCase().includes(q) ||
      u?.email?.toLowerCase().includes(q)
    )
  })

  const totalUnread = Object.values(unreadMap).reduce((a, b) => a + b, 0)

  return (
    <motion.section
      className="adminchats-page"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
    >
      <div className="adminchats-header">
        <div>
          <h1 className="adminchats-title">
            <span className="adminchats-title-icon"><ChatIcon width="22" height="22" /></span>
            <span className="text-gradient">Mensajes de soporte</span>
          </h1>
          <p className="adminchats-subtitle">
            Gestiona las conversaciones con los usuarios en tiempo real.
          </p>
        </div>
        <div className="adminchats-stats">
          <div className="adminchats-stat">
            <strong>{conversations.length}</strong>
            <span>Conversaciones</span>
          </div>
          <div className="adminchats-stat">
            <strong>{totalUnread}</strong>
            <span>Sin leer</span>
          </div>
        </div>
      </div>

      <div className="adminchats-shell glass">
        <aside className="adminchats-list">
          <div className="adminchats-search">
            <SearchIcon width="16" height="16" />
            <input
              type="text"
              placeholder="Buscar por nombre, correo o asunto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="adminchats-list-scroll">
            {loadingList ? (
              <div className="adminchats-list-loading">
                <div className="spinner" style={{ width: 24, height: 24, borderWidth: 3 }} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="adminchats-empty">
                <p>No hay conversaciones.</p>
              </div>
            ) : (
              filtered.map((c) => {
                const u = userMap[c.user_id]
                const unread = unreadMap[c.id] || 0
                const isActive = c.id === selectedId
                return (
                  <button
                    type="button"
                    key={c.id}
                    className={`adminchats-item ${isActive ? 'active' : ''}`}
                    onClick={() => setSelectedId(c.id)}
                  >
                    <div className="adminchats-item-avatar">
                      {u?.avatar_url ? (
                        <img src={u.avatar_url} alt="" />
                      ) : (
                        <UserIcon width="18" height="18" />
                      )}
                    </div>
                    <div className="adminchats-item-body">
                      <div className="adminchats-item-top">
                        <strong>{u?.full_name || 'Usuario'}</strong>
                        <span className="adminchats-item-time">
                          {c.last_message_at ? formatTime(c.last_message_at) : formatTime(c.created_at)}
                        </span>
                      </div>
                      <div className="adminchats-item-sub">
                        <span className="adminchats-item-subject">{c.subject || 'Soporte general'}</span>
                      </div>
                    </div>
                    {unread > 0 && (
                      <span className="adminchats-item-badge">{unread}</span>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </aside>

        <section className="adminchats-panel">
          {!selected ? (
            <div className="adminchats-panel-empty">
              <ChatIcon width="48" height="48" />
              <strong>Selecciona una conversación</strong>
              <p>Elige una conversación de la izquierda para ver los mensajes y responder al usuario.</p>
            </div>
          ) : (
            <>
              <header className="adminchats-panel-header">
                <div className="adminchats-panel-user">
                  <div className="adminchats-panel-avatar">
                    {selectedUser?.avatar_url ? (
                      <img src={selectedUser.avatar_url} alt="" />
                    ) : (
                      <UserIcon width="20" height="20" />
                    )}
                  </div>
                  <div>
                    <strong>{selectedUser?.full_name || 'Usuario'}</strong>
                    <small>{selectedUser?.email || 'Sin correo registrado'}</small>
                  </div>
                </div>
                <div className="adminchats-panel-meta">
                  <span className={`status-pill ${selected.status || 'open'}`}>
                    {selected.status === 'closed' ? 'Cerrado' : 'Abierto'}
                  </span>
                </div>
              </header>

              <div className="adminchats-messages">
                {loadingMsgs ? (
                  <div className="adminchats-list-loading">
                    <div className="spinner" style={{ width: 24, height: 24, borderWidth: 3 }} />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="adminchats-msgs-empty">
                    <p>Esta conversación aún no tiene mensajes.</p>
                  </div>
                ) : (
                  <>
                    {messages.map((m) => {
                      const isAdminMsg = m.sender_role === 'admin'
                      return (
                        <motion.div
                          key={m.id}
                          className={`adminchats-msg ${isAdminMsg ? 'admin' : 'user'}`}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="adminchats-msg-bubble">
                            {m.content && <p>{m.content}</p>}
                            {m.attachments && m.attachments.length > 0 && (
                              <div className="adminchats-msg-attachments">
                                {m.attachments.map((url, idx) => (
                                  <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                                    <img src={url} alt={`Adjunto ${idx + 1}`} loading="lazy" />
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                          <span className="adminchats-msg-time">
                            {isAdminMsg ? 'Tú · ' : ''}{formatFull(m.created_at)}
                          </span>
                        </motion.div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {pendingPreviews.length > 0 && (
                <div className="adminchats-pending">
                  {pendingPreviews.map((src, i) => (
                    <div key={i} className="adminchats-pending-item">
                      <img src={src} alt="" />
                      <button type="button" onClick={() => removePending(i)}>
                        <CloseIcon width="10" height="10" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <form className="adminchats-input-wrap" onSubmit={handleSend}>
                {error && <div className="adminchats-error">{error}</div>}
                <button
                  type="button"
                  className="adminchats-attach"
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
                  className="adminchats-input"
                  placeholder="Escribe una respuesta..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                />
                <button
                  type="submit"
                  className="adminchats-send"
                  disabled={sending || (!text.trim() && pendingFiles.length === 0)}
                  aria-label="Enviar respuesta"
                >
                  {sending ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <SendIcon />}
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </motion.section>
  )
}

export default AdminChats
