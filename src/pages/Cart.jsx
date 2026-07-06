import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import {
  CartIcon, PlusIcon, MinusIcon, TrashIcon, ArrowRightIcon,
  PhotoIcon, ShieldIcon, BoltIcon,
} from '../components/Icons'
import { getCategoryLabel } from '../lib/categories'
import '../styles/Page.css'
import '../styles/Cart.css'

const Cart = () => {
  const { user, loading: authLoading } = useAuth()
  const { items, loading, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice } = useCart()
  const navigate = useNavigate()
  const [confirmClear, setConfirmClear] = useState(false)

  if (authLoading) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
          <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: { pathname: '/carrito' } }} replace />
  }

  const handleCheckout = () => {
    alert('Funcionalidad de pago en construcción. Pronto nos contactaremos para confirmar tu pedido.')
  }

  if (loading) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
          <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
          <p style={{ marginTop: 16, color: 'var(--text-muted)' }}>Cargando carrito...</p>
        </div>
      </div>
    )
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
          <span className="kicker">Tu compra</span>
          <h1>Carrito de <span className="text-gradient">compras</span></h1>
          <p>{totalItems > 0 ? `${totalItems} ${totalItems === 1 ? 'producto' : 'productos'} en tu carrito` : 'Tu carrito está vacío'}</p>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            className="cart-empty glass-strong"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="cart-empty-icon">
              <CartIcon width="56" height="56" />
            </div>
            <h2>No hay productos en tu carrito</h2>
            <p>Explora nuestro catálogo y descubre todo lo que tenemos para ti.</p>
            <Link to="/catalogo" className="btn btn-primary" style={{ marginTop: 24 }}>
              Explorar catálogo <ArrowRightIcon width="16" height="16" />
            </Link>
          </motion.div>
        ) : (
          <div className="cart-grid">
            <div className="cart-items">
              <div className="cart-items-header">
                <h2>Productos ({items.length})</h2>
                {!confirmClear ? (
                  <button
                    className="cart-clear-btn"
                    onClick={() => setConfirmClear(true)}
                  >
                    <TrashIcon width="14" height="14" /> Vaciar carrito
                  </button>
                ) : (
                  <div className="cart-confirm-clear">
                    <span>¿Seguro?</span>
                    <button onClick={() => { clearCart(); setConfirmClear(false) }}>Sí</button>
                    <button onClick={() => setConfirmClear(false)}>No</button>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {items.map((it, i) => (
                  <motion.div
                    key={it.id}
                    className="cart-item glass"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link to={`/producto/${it.product_id}`} className="cart-item-img">
                      {it.product?.main_image ? (
                        <img src={it.product.main_image} alt={it.product.title} />
                      ) : (
                        <div className="cart-item-noimg">
                          <PhotoIcon width="32" height="32" />
                        </div>
                      )}
                    </Link>

                    <div className="cart-item-body">
                      <div className="cart-item-top">
                        <div>
                          {it.product?.category && (
                            <span className="cart-item-cat">{getCategoryLabel(it.product.category)}</span>
                          )}
                          <Link to={`/producto/${it.product_id}`} className="cart-item-title">
                            {it.product?.title}
                          </Link>
                        </div>
                        <button
                          className="cart-item-remove"
                          onClick={() => removeFromCart(it.id)}
                          aria-label="Eliminar"
                        >
                          <TrashIcon width="16" height="16" />
                        </button>
                      </div>

                      <div className="cart-item-bottom">
                        <div className="cart-qty">
                          <button
                            onClick={() => updateQuantity(it.id, it.quantity - 1)}
                            aria-label="Reducir"
                          >
                            <MinusIcon width="14" height="14" />
                          </button>
                          <span>{it.quantity}</span>
                          <button
                            onClick={() => updateQuantity(it.id, it.quantity + 1)}
                            aria-label="Aumentar"
                          >
                            <PlusIcon width="14" height="14" />
                          </button>
                        </div>
                        <div className="cart-item-price">
                          <span className="cart-item-unit">
                            L. {Number(it.product?.price || 0).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                          <strong className="text-gradient">
                            L. {(Number(it.product?.price || 0) * it.quantity).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <motion.div
              className="cart-summary glass-strong"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2>Resumen</h2>
              <div className="cart-summary-row">
                <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                <span>L. {totalPrice.toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="cart-summary-row">
                <span>Envío</span>
                <span>A coordinar</span>
              </div>
              <div className="cart-summary-row total">
                <span>Total</span>
                <span className="text-gradient">
                  L. {totalPrice.toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <button
                className="btn btn-primary cart-checkout"
                onClick={handleCheckout}
              >
                Solicitar compra <ArrowRightIcon width="16" height="16" />
              </button>

              <div className="cart-perks">
                <div className="cart-perk">
                  <ShieldIcon width="16" height="16" />
                  <span>Productos garantizados</span>
                </div>
                <div className="cart-perk">
                  <BoltIcon width="16" height="16" />
                  <span>Atención inmediata</span>
                </div>
              </div>

              <div className="cart-contact">
                <strong>¿Dudas?</strong>
                <a href="tel:+50489789131">📞 +504 8978-9131</a>
                <a href="mailto:vladimirlaptophn@gmail.com">✉️ vladimirlaptophn@gmail.com</a>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
