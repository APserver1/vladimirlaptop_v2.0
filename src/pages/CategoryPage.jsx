import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'
import { SearchIcon, ArrowRightIcon } from '../components/Icons'
import { CATEGORIES, getCategoryLabel } from '../lib/categories'
import '../styles/Page.css'
import '../styles/Catalog.css'

const iconMap = {
  'Computacion': 'computer',
  'Laptops': 'laptop',
  'Perifericos': 'peripherals',
  'Camaras de Seguridad': 'camera',
  'Paginas Web': 'web',
  'Desarrollo de Software': 'software',
  'Edicion y Fotografica': 'photo',
}

const CategoryPage = () => {
  const { slug } = useParams()
  const decoded = decodeURIComponent(slug || '')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('vladimir_products')
        .select('*')
        .eq('category', decoded)
        .order('created_at', { ascending: false })
      if (!error) setItems(data || [])
      setLoading(false)
    }
    fetchItems()
  }, [decoded])

  const label = getCategoryLabel(decoded) || decoded
  const filtered = items.filter((it) =>
    !search || (it.title || '').toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="page page-transition">
      <div className="container">
        <motion.div
          className="page-hero"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="kicker">Categoría</span>
          <h1><span className="text-gradient">{label}</span></h1>
          <p>Explora todos los productos de {label.toLowerCase()} disponibles en Vladimir Laptop</p>
        </motion.div>

        {/* Category navigation */}
        <div className="categories-strip glass">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to={`/categoria/${encodeURIComponent(c.slug)}`}
              className={`cat-pill ${c.slug === decoded ? 'active' : ''}`}
            >
              {c.label}
            </Link>
          ))}
        </div>

        <motion.div
          className="catalog-controls glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="catalog-search">
            <SearchIcon />
            <input
              type="text"
              placeholder={`Buscar en ${label}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </motion.div>

        {loading ? (
          <div className="catalog-loading">
            <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
            <p>Cargando productos...</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            className="catalog-empty glass-strong"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3>Pronto habrá productos aquí</h3>
            <p>
              Estamos preparando productos para {label}. Vuelve pronto o explora otras categorías.
            </p>
            <Link to="/catalogo" className="btn btn-primary" style={{ marginTop: 18 }}>
              Ver catálogo completo <ArrowRightIcon width="16" height="16" />
            </Link>
          </motion.div>
        ) : (
          <div className="catalog-grid">
            {filtered.map((it, i) => (
              <ProductCard key={it.id} product={it} index={i} showCategory={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryPage
