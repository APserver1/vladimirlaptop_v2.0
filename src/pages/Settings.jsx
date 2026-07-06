import { useState, useEffect, useRef } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { UploadIcon, CheckIcon, ShieldIcon, UserIcon } from '../components/Icons'
import '../styles/Page.css'
import '../styles/Settings.css'

const Settings = () => {
  const { user, profile, loading, updateProfile, signOut, uploadAvatar, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [avatarPreview, setAvatarPreview] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setPhone(profile.phone || '')
      setAddress(profile.address || '')
      setBio(profile.bio || '')
      setAvatarPreview(profile.avatar_url || '')
    } else if (user) {
      setFullName(user.user_metadata?.full_name || '')
    }
  }, [profile, user])

  if (loading) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
          <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: { pathname: '/configuracion' } }} replace />
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    setSaving(true)
    const { error } = await updateProfile({
      full_name: fullName,
      phone,
      address,
      bio,
    })
    setSaving(false)
    if (error) {
      setMessage({ type: 'error', text: 'No se pudo guardar la configuración.' })
    } else {
      setMessage({ type: 'success', text: 'Cambios guardados correctamente.' })
      await refreshProfile()
    }
  }

  const handleAvatarClick = () => fileInputRef.current?.click()

  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'La imagen no debe superar 5 MB.' })
      return
    }
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Por favor sube un archivo de imagen válido.' })
      return
    }
    setMessage({ type: '', text: '' })
    setUploading(true)
    setAvatarPreview(URL.createObjectURL(file))
    const { error } = await uploadAvatar(file)
    setUploading(false)
    if (error) {
      setMessage({ type: 'error', text: 'No se pudo subir la imagen. Intenta de nuevo.' })
      setAvatarPreview(profile?.avatar_url || '')
    } else {
      setMessage({ type: 'success', text: 'Foto de perfil actualizada.' })
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="page page-transition">
      <div className="container">
        <motion.div
          className="page-hero"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="kicker">Tu cuenta</span>
          <h1><span className="text-gradient">Configuración</span></h1>
          <p>Gestiona tu información personal y preferencias</p>
        </motion.div>

        <div className="settings-grid">
          <motion.div
            className="settings-card glass-strong"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="settings-avatar-wrap">
              <div className="settings-avatar">
                {avatarPreview ? (
                  <img src={avatarPreview} alt={fullName} />
                ) : (
                  <span>{(fullName || user.email).slice(0, 2).toUpperCase()}</span>
                )}
                {uploading && (
                  <div className="settings-avatar-loading">
                    <span className="spinner" />
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarFile}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="settings-avatar-btn"
                onClick={handleAvatarClick}
                disabled={uploading}
              >
                <UploadIcon width="14" height="14" />
                {avatarPreview ? 'Cambiar foto' : 'Subir foto'}
              </button>
              <p className="settings-avatar-help">JPG, PNG o WebP · Máx. 5 MB</p>
            </div>

            <div className="settings-profile-info">
              <h3>{fullName || 'Usuario'}</h3>
              <p>{user.email}</p>
              {profile?.role === 'admin' && (
                <span className="settings-admin-badge">
                  <ShieldIcon width="12" height="12" /> Administrador
                </span>
              )}
            </div>

            <div className="settings-info">
              <div className="settings-info-item">
                <span><UserIcon width="16" height="16" /></span>
                <div>
                  <small>Miembro desde</small>
                  <strong>{new Date(user.created_at).toLocaleDateString('es-HN', { year: 'numeric', month: 'long' })}</strong>
                </div>
              </div>
              <div className="settings-info-item">
                <span><ShieldIcon width="16" height="16" /></span>
                <div>
                  <small>ID de usuario</small>
                  <strong style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{user.id.slice(0, 8)}...</strong>
                </div>
              </div>
            </div>

            <button className="btn btn-ghost" style={{ width: '100%', marginTop: 24 }} onClick={handleSignOut}>
              Cerrar sesión
            </button>
          </motion.div>

          <motion.div
            className="settings-form-card glass-strong"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2>Información personal</h2>
            <p className="settings-subtitle">Actualiza tus datos para mantener tu cuenta al día</p>

            {message.text && (
              <motion.div
                className={message.type === 'error' ? 'auth-error' : 'auth-info'}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span>{message.type === 'error' ? '⚠️' : '✓'}</span> {message.text}
              </motion.div>
            )}

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Nombre completo</label>
                <input
                  type="text"
                  className="form-input"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Tu nombre"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className="form-input"
                  value={user.email}
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+504 ..."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Dirección</label>
                  <input
                    type="text"
                    className="form-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Tu dirección"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Sobre ti</label>
                <textarea
                  className="form-input"
                  rows="4"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Cuéntanos un poco sobre ti..."
                  style={{ resize: 'vertical', minHeight: 100 }}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? (
                  <><span className="spinner" /> Guardando...</>
                ) : (
                  <>Guardar cambios →</>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Settings
