import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { getCategoryLabel } from '../lib/categories'
import { parseStyledText, parseStyledLines } from '../lib/styledText'
import {
  CartIcon, PhoneIcon, MailIcon, PinIcon, ClockIcon, ShieldIcon,
  CheckIcon, BoltIcon, PhotoIcon, ArrowRightIcon,
} from '../components/Icons'
import '../styles/Page.css'
import '../styles/ProductDetail.css'
import '../styles/StyledText.css'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('vladimir_products')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (!error) setProduct(data)
      setLoading(false)
    }
    fetchProduct()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  if (loading) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
          <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="page page-transition">
        <div className="container">
          <div className="catalog-empty glass-strong" style={{ maxWidth: 500, margin: '60px auto' }}>
            <h3>Producto no encontrado</h3>
            <p>El producto que buscas no existe o fue removido.</p>
            <Link to="/catalogo" className="btn btn-primary" style={{ marginTop: 18 }}>
              Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const photos = [product.main_image, ...(product.photos || [])].filter(Boolean)
  const price = Number(product.price) || 0
  const customParagraphs = Array.isArray(product.custom_paragraphs) ? product.custom_paragraphs : []

  const handleAdd = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/producto/${id}` } } })
      return
    }
    setAdding(true)
    const { error } = await addToCart(product.id, quantity)
    setAdding(false)
    if (!error) {
      setAdded(true)
      setTimeout(() => setAdded(false), 1800)
    }
  }

  return (
    <div className="page page-transition">
      <div className="container">
        <nav className="pd-breadcrumb">
          <Link to="/">Inicio</Link>
          <span>›</span>
          <Link to="/catalogo">Catálogo</Link>
          {product.category && (
            <>
              <span>›</span>
              <Link to={`/categoria/${encodeURIComponent(product.category)}`}>
                {getCategoryLabel(product.category)}
              </Link>
            </>
          )}
          <span>›</span>
          <span className="pd-breadcrumb-current">{product.title}</span>
        </nav>

        <div className="pd-grid">
          {/* Gallery */}
          <motion.div
            className="pd-gallery"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="pd-main-img glass">
              {photos[activeImage] ? (
                <img src={photos[activeImage]} alt={product.title} />
              ) : (
                <div className="pd-noimg"><PhotoIcon width="80" height="80" /></div>
              )}
            </div>
            {photos.length > 1 && (
              <div className="pd-thumbs">
                {photos.map((p, i) => (
                  <button
                    key={i}
                    className={`pd-thumb ${i === activeImage ? 'active' : ''}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <img src={p} alt={`${product.title} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            className="pd-info"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {product.category && (
              <span className="pd-cat">{getCategoryLabel(product.category)}</span>
            )}
            <h1>{parseStyledText(product.title)}</h1>

            {product.basic_description && (
              <p className="pd-desc">{parseStyledText(product.basic_description)}</p>
            )}

            <div className="pd-price-row">
              <div>
                <small>Precio</small>
                <span className="pd-price text-gradient">
                  L. {price.toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="pd-stock">
                <CheckIcon width="16" height="16" />
                <span>{product.stock > 0 ? `Stock: ${product.stock}` : 'Disponible'}</span>
              </div>
            </div>

            <div className="pd-actions">
              <div className="pd-quantity">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Reducir cantidad"
                >
                  −
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>
              <button
                className={`btn btn-primary pd-add ${added ? 'added' : ''}`}
                onClick={handleAdd}
                disabled={adding}
              >
                {adding ? (
                  <><span className="spinner" /> Añadiendo...</>
                ) : added ? (
                  <><CheckIcon width="16" height="16" /> Añadido al carrito</>
                ) : (
                  <><CartIcon width="16" height="16" /> Añadir al carrito</>
                )}
              </button>
            </div>

            <div className="pd-perks">
              <div className="pd-perk">
                <ShieldIcon width="20" height="20" />
                <div>
                  <strong>Garantía</strong>
                  <small>Productos certificados</small>
                </div>
              </div>
              <div className="pd-perk">
                <BoltIcon width="20" height="20" />
                <div>
                  <strong>Velocidad</strong>
                  <small>Atención inmediata</small>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Details */}
        <motion.div
          className="pd-details"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {product.technical_info && (
            <div className="pd-section glass-strong">
              <h2>Información Técnica</h2>
              <div className="pd-text-block">
                {parseStyledLines(product.technical_info)}
              </div>
            </div>
          )}

          {product.advantages && (
            <div className="pd-section glass-strong">
              <h2>Ventajas</h2>
              <ul className="pd-advantages">
                {product.advantages.split('\n').filter(Boolean).map((adv, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <span className="pd-advantage-icon"><CheckIcon width="14" height="14" /></span>
                    <span>{parseStyledText(adv)}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {/* Custom paragraphs */}
        {customParagraphs.length > 0 && (
          <motion.div
            className="pd-custom-paragraphs"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {customParagraphs.map((p, i) => (
              <motion.div
                key={p.id || i}
                className="pd-section glass-strong pd-custom-paragraph"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {p.title && <h2>{parseStyledText(p.title)}</h2>}
                <div className="pd-text-block pd-custom-paragraph-text">
                  {parseStyledLines(p.text)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Contact */}
        <motion.div
          className="pd-contact glass-strong"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2>¿Interesado en este producto?</h2>
          <p>Contáctanos para más información, disponibilidad y métodos de pago.</p>
          <div className="pd-contact-grid">
            <a href="tel:+50489789131" className="pd-contact-item">
              <PhoneIcon width="20" height="20" />
              <div>
                <small>Teléfono</small>
                <strong>+504 8978-9131</strong>
              </div>
            </a>
            <a href="mailto:vladimirlaptophn@gmail.com" className="pd-contact-item">
              <MailIcon width="20" height="20" />
              <div>
                <small>Correo</small>
                <strong>vladimirlaptophn@gmail.com</strong>
              </div>
            </a>
            <div className="pd-contact-item">
              <PinIcon width="20" height="20" />
              <div>
                <small>Dirección</small>
                <strong>San Pedro Sula, Honduras</strong>
              </div>
            </div>
            <div className="pd-contact-item">
              <ClockIcon width="20" height="20" />
              <div>
                <small>Horario</small>
                <strong>Lun - Sáb · 8:00 - 18:00</strong>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProductDetail
