import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { MenuIcon, ChevronDownIcon, LogoutIcon, SettingsIcon, CartIcon } from './Icons'
import '../styles/Navbar.css'

const Navbar = ({ onMenuClick }) => {
  const { user, profile, signOut } = useAuth()
  const { totalItems } = useCart()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()
  const userMenuRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario'
  const avatarUrl = profile?.avatar_url
  const initials = displayName.slice(0, 2).toUpperCase()

  const handleSignOut = async () => {
    await signOut()
    setUserMenuOpen(false)
    navigate('/')
  }

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="navbar-inner">
        <button
          className="btn-icon nav-menu-btn"
          onClick={onMenuClick}
          aria-label="Abrir menú"
        >
          <MenuIcon />
        </button>

        <Link to="/" className="nav-brand">
          <img src="/logo.jpeg" alt="Vladimir Laptop" className="nav-logo" />
          <span className="nav-brand-text">
            <span className="text-gradient">Vladimir</span>
            <span className="nav-brand-sub">LAPTOP</span>
          </span>
        </Link>

        <div className="nav-actions">
          <Link to="/carrito" className="nav-cart-btn" aria-label="Carrito">
            <CartIcon />
            {totalItems > 0 && <span className="nav-cart-badge">{totalItems > 99 ? '99+' : totalItems}</span>}
          </Link>

          {user ? (
            <div className="user-menu-wrapper" ref={userMenuRef}>
              <button
                className="user-button"
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
              >
                <span className="user-avatar">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} />
                  ) : (
                    <span className="user-initials">{initials}</span>
                  )}
                </span>
                <span className="user-name">{displayName}</span>
                {profile?.role === 'admin' && <span className="user-role-badge">Admin</span>}
                <ChevronDownIcon style={{ opacity: 0.7 }} />
              </button>
              {userMenuOpen && (
                <motion.div
                  className="user-dropdown"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="user-dropdown-header">
                    <strong>{displayName}</strong>
                    <small>{user.email}</small>
                  </div>
                  <Link to="/configuracion" className="user-dropdown-item" onClick={() => setUserMenuOpen(false)}>
                    <SettingsIcon width="16" height="16" /> Configuración
                  </Link>
                  <button className="user-dropdown-item danger" onClick={handleSignOut}>
                    <LogoutIcon width="16" height="16" /> Cerrar sesión
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="nav-auth-buttons">
              <Link to="/login" className="btn btn-ghost">Iniciar sesión</Link>
              <Link to="/register" className="btn btn-primary">Registrarse</Link>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
