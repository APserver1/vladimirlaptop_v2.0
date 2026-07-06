import { useState, useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { getCategoryLabel } from '../lib/categories'
import { parseStyledText } from '../lib/styledText'
import {
  PlusIcon, PhotoIcon, TrashIcon, ArrowRightIcon, EditIcon,
} from '../components/Icons'
import '../styles/Page.css'
import '../styles/AdminProducts.css'
import '../styles/StyledText.css'

const AdminProducts = () => {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [filter, setFilter] = useState('Todos')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!isAdmin) return
    const fetchProducts = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('vladimir_products')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error) setProducts(data || [])
      setLoading(false)
    }
    fetchProducts()
  }, [isAdmin])

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
    return <Navigate to="/login" state={{ from: { pathname: '/admin/productos' } }} replace />
  }

  if (!isAdmin) {
    return (
      <div className="page page-transition">
        <div className="container">
          <div className="catalog-empty glass-strong" style={{ maxWidth: 500, margin: '60px auto' }}>
            <h3>Acceso restringido</h3>
            <p>Esta sección es solo para administradores. Si crees que deberías tener acceso, contacta al equipo.</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: 18 }}>
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return
    setDeleting(id)
    const { error } = await supabase.from('vladimir_products').delete().eq('id', id)
    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } else {
      alert('Error al eliminar: ' + error.message)
    }
    setDeleting(null)
  }

  const filtered = products.filter((p) => {
    const matchCat = filter === 'Todos' || p.category === filter
    const matchSearch = !search || (p.title || '').toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="page page-transition">
      <div className="container">
        <motion.div
          className="admin-hero"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <span className="kicker">Panel de administración</span>
            <h1>Gestión de <span className="text-gradient">productos</span></h1>
            <p>Administra el catálogo completo de Vladimir Laptop</p>
          </div>
          <Link to="/admin/productos/nuevo" className="btn btn-primary">
            <PlusIcon width="16" height="16" /> Nuevo producto
          </Link>
        </motion.div>

        <div className="admin-stats">
          <div className="admin-stat glass">
            <span className="admin-stat-value">{products.length}</span>
            <span className="admin-stat-label">Total productos</span>
          </div>
          <div className="admin-stat glass">
            <span className="admin-stat-value">{products.filter((p) => p.is_active).length}</span>
            <span className="admin-stat-label">Activos</span>
          </div>
          <div className="admin-stat glass">
            <span className="admin-stat-value">{products.filter((p) => !p.category).length}</span>
            <span className="admin-stat-label">Sin categoría</span>
          </div>
          <div className="admin-stat glass">
            <span className="admin-stat-value text-gradient">
              L. {products.reduce((s, p) => s + Number(p.price || 0), 0).toLocaleString('es-HN', { maximumFractionDigits: 0 })}
            </span>
            <span className="admin-stat-label">Valor catálogo</span>
          </div>
        </div>

        {loading ? (
          <div className="catalog-loading">
            <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
            <p>Cargando productos...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="catalog-empty glass-strong">
            {products.length === 0 ? (
              <>
                <h3>No hay productos aún</h3>
                <p>Comienza creando tu primer producto para el catálogo.</p>
                <Link to="/admin/productos/nuevo" className="btn btn-primary" style={{ marginTop: 18 }}>
                  <PlusIcon width="16" height="16" /> Crear primer producto
                </Link>
              </>
            ) : (
              <>
                <h3>Sin resultados</h3>
                <p>No hay productos que coincidan con tu filtro.</p>
              </>
            )}
          </div>
        ) : (
          <div className="admin-list">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                className="admin-item glass"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="admin-item-img">
                  {p.main_image ? (
                    <img src={p.main_image} alt={p.title} />
                  ) : (
                    <div className="admin-item-noimg"><PhotoIcon width="28" height="28" /></div>
                  )}
                </div>
                <div className="admin-item-info">
                  <div className="admin-item-meta">
                    {p.category && <span className="admin-item-cat">{getCategoryLabel(p.category)}</span>}
                    {!p.category && <span className="admin-item-cat empty">Sin categoría</span>}
                    <span className={`admin-item-status ${p.is_active ? 'active' : 'inactive'}`}>
                      {p.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <h3>{parseStyledText(p.title)}</h3>
                  {p.basic_description && <p>{parseStyledText(p.basic_description)}</p>}
                  <div className="admin-item-foot">
                    <span className="admin-item-price text-gradient">
                      L. {Number(p.price || 0).toLocaleString('es-HN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="admin-item-photos">
                      {p.photos?.length || 0} fotos adicionales
                    </span>
                  </div>
                </div>
                <div className="admin-item-actions">
                  <Link to={`/producto/${p.id}`} className="admin-action-btn" title="Ver">
                    <ArrowRightIcon width="16" height="16" />
                  </Link>
                  <Link to={`/admin/productos/${p.id}`} className="admin-action-btn" title="Editar">
                    <EditIcon width="16" height="16" />
                  </Link>
                  <button
                    className="admin-action-btn danger"
                    onClick={() => handleDelete(p.id)}
                    disabled={deleting === p.id}
                    title="Eliminar"
                  >
                    {deleting === p.id ? <span className="spinner" /> : <TrashIcon width="16" height="16" />}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// EditIcon imported from Icons.jsx

export default AdminProducts
