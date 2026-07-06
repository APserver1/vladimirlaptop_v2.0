import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const ChatContext = createContext({})

export const useChat = () => useContext(ChatContext)

export const ChatProvider = ({ children }) => {
  const { user, profile, isAdmin } = useAuth()
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const lastSeenRef = useRef(null)

  // Get or create the user's conversation
  const getOrCreateConversation = useCallback(async () => {
    if (!user) return null
    // Try to get existing
    const { data: existing } = await supabase
      .from('vladimir_chat_conversations')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
    if (existing) return existing
    // Create new
    const { data, error } = await supabase
      .from('vladimir_chat_conversations')
      .insert({ user_id: user.id, subject: 'Soporte general' })
      .select()
      .single()
    if (error) {
      console.error('Error creating conversation:', error)
      return null
    }
    return data
  }, [user])

  // Load user's conversation and messages
  useEffect(() => {
    if (!user) {
      setConversation(null)
      setMessages([])
      return
    }
    const init = async () => {
      setLoading(true)
      const conv = await getOrCreateConversation()
      if (conv) {
        setConversation(conv)
        const { data: msgs } = await supabase
          .from('vladimir_chat_messages')
          .select('*')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: true })
        setMessages(msgs || [])
      }
      setLoading(false)
    }
    init()
  }, [user, getOrCreateConversation])

  // Subscribe to new messages in this conversation
  useEffect(() => {
    if (!conversation) return
    const channel = supabase
      .channel(`vladimir_chat_${conversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'vladimir_chat_messages',
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((m) => m.id === payload.new.id)) return prev
            return [...prev, payload.new]
          })
        },
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversation])

  const sendMessage = async (content, attachments = []) => {
    if (!user || !conversation) return { error: new Error('No hay conversación activa') }
    if (!content.trim() && (!attachments || attachments.length === 0)) {
      return { error: new Error('El mensaje está vacío') }
    }
    const { data, error } = await supabase
      .from('vladimir_chat_messages')
      .insert({
        conversation_id: conversation.id,
        sender_id: user.id,
        sender_role: isAdmin ? 'admin' : 'user',
        content: content.trim() || null,
        attachments,
      })
      .select()
      .single()
    if (!error && data) {
      setMessages((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev
        return [...prev, data]
      })
    }
    return { data, error }
  }

  const uploadAttachment = async (file) => {
    if (!user) return { url: null, error: new Error('No user') }
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

  const sendMessageWithFiles = async (content, files = []) => {
    const attachments = []
    for (const f of files) {
      const { url, error } = await uploadAttachment(f)
      if (url) attachments.push(url)
      else if (error) return { error }
    }
    return await sendMessage(content, attachments)
  }

  return {
    conversation,
    messages,
    loading,
    sendMessage,
    sendMessageWithFiles,
    uploadAttachment,
    isAdmin,
  }
}
