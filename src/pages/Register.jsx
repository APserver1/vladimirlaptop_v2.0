import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { SparkleIcon, ShieldIcon, MailIcon } from '../components/Icons'
import '../styles/Auth.css'

const Register = () => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    const { data, error } = await signUp(email, password, fullName)
    setLoading(false)

    if (error) {
      setError(error.message || 'No se pudo crear la cuenta. Intenta de nuevo.')
      return
    }

    // If session is null, email confirmation is required
    if (data?.session) {
      navigate('/', { replace: true })
    } else {
      setInfo('Te enviamos un correo de confirmación. Revisa tu bandeja de entrada para activar tu cuenta.')
    }
  }

  return (
    <div className="auth-page page-transition">
      <div className="auth-bg-glow" />
      <div className="container">
        <div className="auth-grid">
          <motion.div
            className="auth-visual"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="auth-brand">
              <img src="/logo.jpeg" alt="Vladimir Laptop" />
              <span><span className="text-gradient">Vladimir</span> LAPTOP</span>
            </Link>
            <h1>Únete a <span className="text-gradient">Vladimir Laptop</span></h1>
            <p>
              Crea tu cuenta gratis y desbloquea un mundo de posibilidades: gestión de servicios,
              catálogo personalizado, soporte prioritario y mucho más.
            </p>
            <div className="auth-features">
              <div className="auth-feature">
                <span className="auth-feature-icon"><SparkleIcon width="22" height="22" /></span>
                <div>
                  <strong>Registro gratuito</strong>
                  <small>Sin costo alguno, en menos de un minuto.</small>
                </div>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon"><ShieldIcon width="22" height="22" /></span>
                <div>
                  <strong>Historial de servicios</strong>
                  <small>Lleva el control de tus equipos y proyectos.</small>
                </div>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon"><MailIcon width="22" height="22" /></span>
                <div>
                  <strong>Atención prioritaria</strong>
                  <small>Soporte rápido y personalizado cuando lo necesites.</small>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="auth-form-wrap"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="auth-card glass-strong">
              <div className="auth-card-header">
                <h2>Crear cuenta</h2>
                <p>Completa el formulario para registrarte</p>
              </div>

              <form onSubmit={handleSubmit} className="auth-form">
                {error && (
                  <motion.div
                    className="auth-error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span>⚠️</span> {error}
                  </motion.div>
                )}
                {info && (
                  <motion.div
                    className="auth-info"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span>📬</span> {info}
                  </motion.div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="fullName">Nombre completo</label>
                  <input
                    id="fullName"
                    type="text"
                    className="form-input"
                    placeholder="Tu nombre"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">Correo electrónico</label>
                  <input
                    id="email"
                    type="email"
                    className="form-input"
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="password">Contraseña</label>
                    <input
                      id="password"
                      type="password"
                      className="form-input"
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="confirm">Confirmar</label>
                    <input
                      id="confirm"
                      type="password"
                      className="form-input"
                      placeholder="Repetir contraseña"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary auth-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner" /> Creando cuenta...
                    </>
                  ) : (
                    <>
                      Crear mi cuenta <span>→</span>
                    </>
                  )}
                </button>

                <div className="auth-divider">
                  <span>o</span>
                </div>

                <p className="auth-switch">
                  ¿Ya tienes cuenta?{' '}
                  <Link to="/login" className="auth-link">Iniciar sesión</Link>
                </p>
              </form>
            </div>
            <Link to="/" className="auth-back">← Volver al inicio</Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Register
