import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { getCategoryLabel } from '../lib/categories'
import { parseStyledText } from '../lib/styledText'
import { CartIcon, PhotoIcon } from './Icons'
import { useState } from 'react'
import '../styles/ProductCard.css'
import '../styles/StyledText.css'

const ProductCard = ({ product, index = 0, showCategory = true }) => {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState('')

  const handleAdd = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      setError('Inicia sesión para añadir al carrito')
      setTimeout(() => setError(''), 2500)
      return
    }
    setAdding(true)
    setError('')
    const { error } = await addToCart(product.id, 1)
    setAdding(false)
    if (error) {
      setError(error.message || 'No se pudo añadir')
      setTimeout(() => setError(''), 2500)
    } else {
      setAdded(true)
      setTimeout(() => setAdded(false), 1800)
    }
  }

  const price = Number(product.price) || 0

  return (
    <motion.article
      className="product-card glass"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.4 }}
      whileHover={{ y: -6 }}
    >
      <Link to={`/producto/${product.id}`} className="product-card-link">
        <div className="product-card-img">
          {product.main_image ? (
            <img src={product.main_image} alt={product.title} loading="lazy" />
          ) : (
            <div className="product-card-noimg">
              <PhotoIcon width="48" height="48" />
            </div>
          )}
          <div className="product-card-overlay">
            <span>Ver detalles</span>
          </div>
        </div>
      </Link>

      <div className="product-card-body">
        {showCategory && product.category && (
          <span className="product-card-cat">{getCategoryLabel(product.category)}</span>
        )}
        <Link to={`/producto/${product.id}`} className="product-card-title-link">
          <h3>{parseStyledText(product.title)}</h3>
        </Link>
        {product.basic_description && (
          <p className="product-card-desc">{parseStyledText(product.basic_description)}</p>
        )}

        <div className="product-card-foot">
          <div className="product-card-price">
            <small>Precio</small>
            <span className="text-gradient">
              L. {price.toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <button
            className={`product-card-add ${added ? 'added' : ''}`}
            onClick={handleAdd}
            disabled={adding}
            aria-label="Añadir al carrito"
          >
            {adding ? (
              <span className="spinner" />
            ) : added ? (
              <span>✓ Añadido</span>
            ) : (
              <>
                <CartIcon width="16" height="16" />
                <span>Añadir</span>
              </>
            )}
          </button>
        </div>
        {error && <div className="product-card-msg">{error}</div>}
      </div>
    </motion.article>
  )
}

export default ProductCard
