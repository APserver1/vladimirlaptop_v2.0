import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { ShieldIcon, BoltIcon, SparkleIcon } from '../components/Icons'
import '../styles/Auth.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError(error.message || 'Credenciales inválidas. Verifica tu correo y contraseña.')
      return
    }
    navigate(from, { replace: true })
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
            <h1>Bienvenido de vuelta</h1>
            <p>
              Accede a tu cuenta para gestionar tus servicios, ver tu historial y mantenerte
              al día con todas las novedades tecnológicas de Vladimir Laptop.
            </p>
            <div className="auth-features">
              <div className="auth-feature">
                <span className="auth-feature-icon"><ShieldIcon width="22" height="22" /></span>
                <div>
                  <strong>Conexión segura</strong>
                  <small>Tus credenciales viajan cifradas con Supabase Auth.</small>
                </div>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon"><BoltIcon width="22" height="22" /></span>
                <div>
                  <strong>Acceso inmediato</strong>
                  <small>Entra y empieza a disfrutar de tu cuenta al instante.</small>
                </div>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon"><SparkleIcon width="22" height="22" /></span>
                <div>
                  <strong>Beneficios exclusivos</strong>
                  <small>Descuentos y soporte prioritario para miembros.</small>
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
                <h2>Iniciar sesión</h2>
                <p>Ingresa tus credenciales para continuar</p>
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

                <div className="form-group">
                  <label className="form-label" htmlFor="password">Contraseña</label>
                  <input
                    id="password"
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary auth-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner" /> Ingresando...
                    </>
                  ) : (
                    <>
                      Iniciar sesión <span>→</span>
                    </>
                  )}
                </button>

                <div className="auth-divider">
                  <span>o</span>
                </div>

                <p className="auth-switch">
                  ¿Aún no tienes cuenta?{' '}
                  <Link to="/register" className="auth-link">Crear una cuenta</Link>
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

export default Login
