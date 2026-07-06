import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import {
  HomeIcon, CatalogIcon, ComputerIcon, LaptopIcon, PeripheralsIcon,
  CameraIcon, WebIcon, SoftwareIcon, PhotoIcon, CartIcon, SupportIcon,
  TermsIcon, SettingsIcon, ProductIcon, ChatIcon, CloseIcon, LogoutIcon,
} from './Icons'
import { CATEGORIES } from '../lib/categories'
import '../styles/SideMenu.css'

const categoryItems = CATEGORIES.map((c) => {
  const iconMap = {
    'Computacion': ComputerIcon,
    'Laptops': LaptopIcon,
    'Perifericos': PeripheralsIcon,
    'Camaras de Seguridad': CameraIcon,
    'Paginas Web': WebIcon,
    'Desarrollo de Software': SoftwareIcon,
    'Edicion y Fotografica': PhotoIcon,
  }
  const Icon = iconMap[c.slug] || CatalogIcon
  return { to: `/categoria/${encodeURIComponent(c.slug)}`, label: c.label, Icon }
})

const menuStructure = [
  { to: '/', label: 'Inicio', Icon: HomeIcon },
  { to: '/catalogo', label: 'Catálogo', Icon: CatalogIcon },
  ...categoryItems,
  { to: '/carrito', label: 'Carrito', Icon: CartIcon },
  { to: '/soporte', label: 'Soporte', Icon: SupportIcon },
  { to: '/terminos', label: 'Términos y Condiciones', Icon: TermsIcon },
  { to: '/configuracion', label: 'Configuración', Icon: SettingsIcon },
]

const SideMenu = ({ open, onClose }) => {
  const { user, isAdmin, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    onClose?.()
    // eslint-disable-next-line
  }, [location.pathname])

  const handleSignOut = async () => {
    await signOut()
    onClose?.()
    navigate('/')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="sidemenu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.aside
            className="sidemenu glass-strong"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            role="dialog"
            aria-label="Menú principal"
          >
            <div className="sidemenu-header">
              <Link to="/" className="sidemenu-brand" onClick={onClose}>
                <img src="/logo.jpeg" alt="Vladimir Laptop" className="sidemenu-logo" />
                <div className="sidemenu-brand-text">
                  <span className="text-gradient">Vladimir</span>
                  <small>LAPTOP</small>
                </div>
              </Link>
              <button className="btn-icon sidemenu-close" onClick={onClose} aria-label="Cerrar menú">
                <CloseIcon />
              </button>
            </div>

            <nav className="sidemenu-nav">
              {menuStructure.map((item, idx) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + idx * 0.03 }}
                >
                  <Link
                    to={item.to}
                    className={`sidemenu-item ${location.pathname === item.to ? 'active' : ''}`}
                  >
                    <span className="sidemenu-icon"><item.Icon /></span>
                    <span className="sidemenu-label">{item.label}</span>
                    <span className="sidemenu-arrow">›</span>
                  </Link>
                </motion.div>
              ))}

              {isAdmin && (
                <>
                  <div className="sidemenu-divider">
                    <span>Administración</span>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + menuStructure.length * 0.03 }}
                  >
                    <Link
                      to="/admin/productos"
                      className={`sidemenu-item admin ${location.pathname.startsWith('/admin/productos') ? 'active' : ''}`}
                    >
                      <span className="sidemenu-icon"><ProductIcon /></span>
                      <span className="sidemenu-label">Productos</span>
                      <span className="sidemenu-badge">Admin</span>
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + (menuStructure.length + 1) * 0.03 }}
                  >
                    <Link
                      to="/admin/chats"
                      className={`sidemenu-item admin ${location.pathname.startsWith('/admin/chats') ? 'active' : ''}`}
                    >
                      <span className="sidemenu-icon"><ChatIcon /></span>
                      <span className="sidemenu-label">Chats</span>
                      <span className="sidemenu-badge">Admin</span>
                    </Link>
                  </motion.div>
                </>
              )}
            </nav>

            <div className="sidemenu-footer">
              {user ? (
                <button className="sidemenu-signout" onClick={handleSignOut}>
                  <LogoutIcon />
                  <span>Cerrar sesión</span>
                </button>
              ) : (
                <div className="sidemenu-cta">
                  <Link to="/login" className="btn btn-ghost" onClick={onClose} style={{ width: '100%' }}>
                    Iniciar sesión
                  </Link>
                  <Link to="/register" className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
                    Crear cuenta
                  </Link>
                </div>
              )}
              <div className="sidemenu-meta">
                <p>© {new Date().getFullYear()} Vladimir Laptop</p>
                <p>San Pedro Sula, Honduras</p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default SideMenu
