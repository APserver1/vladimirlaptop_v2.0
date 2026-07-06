import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ProductCard'
import { SearchIcon } from '../components/Icons'
import { CATEGORIES, getCategoryLabel } from '../lib/categories'
import '../styles/Page.css'
import '../styles/Catalog.css'

const Catalog = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState('Todos')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('vladimir_products')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error) setItems(data || [])
      setLoading(false)
    }
    fetchItems()
  }, [])

  const filtered = items.filter((it) => {
    const matchCat = active === 'Todos' || it.category === active
    const matchSearch = !search || (it.title || '').toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="page page-transition">
      <div className="container">
        <motion.div
          className="page-hero"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="kicker">Catálogo</span>
          <h1>Explora nuestro <span className="text-gradient">catálogo</span></h1>
          <p>Productos destacados con garantía y soporte Vladimir Laptop</p>
        </motion.div>

        <motion.div
          className="catalog-controls glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="catalog-search">
            <SearchIcon />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="catalog-categories">
            <button
              className={`catalog-cat ${active === 'Todos' ? 'active' : ''}`}
              onClick={() => setActive('Todos')}
            >
              Todos
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.slug}
                className={`catalog-cat ${active === c.slug ? 'active' : ''}`}
                onClick={() => setActive(c.slug)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="catalog-loading">
            <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
            <p>Cargando catálogo...</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            className="catalog-empty glass-strong"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {items.length === 0 ? (
              <>
                <h3>Catálogo en construcción</h3>
                <p>
                  Estamos preparando nuestro catálogo. Pronto encontrarás aquí productos
                  y servicios con detalles, precios y disponibilidad.
                </p>
                <p style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Mientras tanto, contáctanos directamente para consultas.
                </p>
              </>
            ) : (
              <>
                <h3>Sin resultados</h3>
                <p>
                  No encontramos productos que coincidan con tu búsqueda en la categoría
                  {active !== 'Todos' ? ` "${getCategoryLabel(active)}"` : ''}.
                </p>
                <button
                  className="btn btn-ghost"
                  style={{ marginTop: 16 }}
                  onClick={() => { setActive('Todos'); setSearch('') }}
                >
                  Limpiar filtros
                </button>
              </>
            )}
          </motion.div>
        ) : (
          <div className="catalog-grid">
            {filtered.map((it, i) => (
              <ProductCard key={it.id} product={it} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Catalog
