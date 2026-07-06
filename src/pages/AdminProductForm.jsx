import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { CATEGORIES } from '../lib/categories'
import { STYLE_CODES, parseStyledText, STYLE_HELP } from '../lib/styledText'
import {
  UploadIcon, TrashIcon, PlusIcon, CheckIcon, PhotoIcon, ArrowRightIcon,
  InfoIcon, CloseIcon, EditIcon,
} from '../components/Icons'
import '../styles/Page.css'
import '../styles/AdminForm.css'

const MAX_PHOTOS = 15

const newParagraph = () => ({
  id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  title: '',
  text: '',
})

const AdminProductForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAdmin, loading: authLoading } = useAuth()
  const isEdit = Boolean(id) && id !== 'nuevo'

  const [form, setForm] = useState({
    title: '',
    basic_description: '',
    main_image: '',
    technical_info: '',
    advantages: '',
    price: 0,
    category: '',
    is_active: true,
    stock: 0,
    photos: [],
    custom_paragraphs: [],
  })
  const [mainFile, setMainFile] = useState(null)
  const [mainPreview, setMainPreview] = useState('')
  const [mainDragOver, setMainDragOver] = useState(false)
  const [photoFiles, setPhotoFiles] = useState([])
  const [photoPreviews, setPhotoPreviews] = useState([])
  const [photosDragOver, setPhotosDragOver] = useState(false)
  const [loadingProduct, setLoadingProduct] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showStyleHelp, setShowStyleHelp] = useState(false)

  const mainInputRef = useRef(null)
  const photosInputRef = useRef(null)

  useEffect(() => {
    if (!isEdit) return
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('vladimir_products')
        .select('*')
        .eq('id', id)
        .maybeSingle()
      if (error || !data) {
        setMessage({ type: 'error', text: 'Producto no encontrado.' })
        setLoadingProduct(false)
        return
      }
      setForm({
        title: data.title || '',
        basic_description: data.basic_description || '',
        main_image: data.main_image || '',
        technical_info: data.technical_info || '',
        advantages: data.advantages || '',
        price: data.price || 0,
        category: data.category || '',
        is_active: data.is_active !== false,
        stock: data.stock || 0,
        photos: data.photos || [],
        custom_paragraphs: Array.isArray(data.custom_paragraphs) ? data.custom_paragraphs : [],
      })
      setMainPreview(data.main_image || '')
      setPhotoPreviews(data.photos || [])
      setLoadingProduct(false)
    }
    fetchProduct()
  }, [id, isEdit])

  if (authLoading || loadingProduct) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
          <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // ---------- Main image handlers ----------
  const handleMainFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Solo se permiten archivos de imagen.' })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'La imagen principal no debe superar 5 MB.' })
      return
    }
    setMainFile(file)
    setMainPreview(URL.createObjectURL(file))
    setMessage({ type: '', text: '' })
  }

  const handleMainInputFile = (e) => {
    const file = e.target.files?.[0]
    handleMainFile(file)
  }

  const handleMainDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setMainDragOver(true)
  }
  const handleMainDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setMainDragOver(false)
  }
  const handleMainDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setMainDragOver(false)
    const file = e.dataTransfer.files?.[0]
    handleMainFile(file)
  }

  // ---------- Gallery handlers ----------
  const handlePhotoFiles = (filesList) => {
    const files = Array.from(filesList || [])
    if (!files.length) return
    const remaining = MAX_PHOTOS - (form.photos?.length || 0) - photoFiles.length
    if (remaining <= 0) {
      setMessage({ type: 'error', text: `Máximo ${MAX_PHOTOS} fotos por producto.` })
      return
    }
    const accepted = files.slice(0, remaining)
    const bad = accepted.find((f) => !f.type.startsWith('image/'))
    if (bad) {
      setMessage({ type: 'error', text: 'Solo se permiten archivos de imagen.' })
      return
    }
    const oversized = accepted.find((f) => f.size > 5 * 1024 * 1024)
    if (oversized) {
      setMessage({ type: 'error', text: 'Cada imagen no debe superar 5 MB.' })
      return
    }
    setPhotoFiles((prev) => [...prev, ...accepted])
    setPhotoPreviews((prev) => [...prev, ...accepted.map((f) => URL.createObjectURL(f))])
    setMessage({ type: '', text: '' })
  }

  const handlePhotoInput = (e) => {
    handlePhotoFiles(e.target.files)
    e.target.value = '' // allow re-selecting same file
  }

  const handlePhotosDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setPhotosDragOver(true)
  }
  const handlePhotosDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setPhotosDragOver(false)
  }
  const handlePhotosDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setPhotosDragOver(false)
    handlePhotoFiles(e.dataTransfer.files)
  }

  // ---------- Custom paragraphs handlers ----------
  const addParagraph = () => {
    setForm((prev) => ({
      ...prev,
      custom_paragraphs: [...(prev.custom_paragraphs || []), newParagraph()],
    }))
  }

  const updateParagraph = (pid, field, value) => {
    setForm((prev) => ({
      ...prev,
      custom_paragraphs: (prev.custom_paragraphs || []).map((p) =>
        p.id === pid ? { ...p, [field]: value } : p
      ),
    }))
  }

  const removeParagraph = (pid) => {
    setForm((prev) => ({
      ...prev,
      custom_paragraphs: (prev.custom_paragraphs || []).filter((p) => p.id !== pid),
    }))
  }

  const moveParagraph = (pid, dir) => {
    setForm((prev) => {
      const list = [...(prev.custom_paragraphs || [])]
      const idx = list.findIndex((p) => p.id === pid)
      if (idx < 0) return prev
      const newIdx = idx + dir
      if (newIdx < 0 || newIdx >= list.length) return prev
      ;[list[idx], list[newIdx]] = [list[newIdx], list[idx]]
      return { ...prev, custom_paragraphs: list }
    })
  }

  // ---------- Photo remove handlers ----------
  const removeNewPhoto = (idx) => {
    setPhotoFiles((prev) => prev.filter((_, i) => i !== idx))
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== idx))
  }

  const removeExistingPhoto = (idx) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx),
    }))
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== idx))
  }

  // ---------- Upload helpers ----------
  const uploadToElements = async (files) => {
    const urls = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const path = `products/${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const { error } = await supabase.storage
        .from('elements')
        .upload(path, file, { contentType: file.type, upsert: false })
      if (error) throw error
      const { data } = supabase.storage.from('elements').getPublicUrl(path)
      urls.push(data.publicUrl)
      setUploadProgress(Math.round(((i + 1) / files.length) * 100))
    }
    return urls
  }

  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    setSaving(true)
    setUploadProgress(0)

    try {
      if (!form.title.trim()) throw new Error('El título es obligatorio.')
      if (!form.price || Number(form.price) <= 0) throw new Error('Ingresa un precio válido mayor a 0.')

      // Upload main image if new
      let mainImage = form.main_image
      if (mainFile) {
        const ext = mainFile.name.split('.').pop()?.toLowerCase() || 'jpg'
        const path = `products/main-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
        const { error: upErr } = await supabase.storage
          .from('elements')
          .upload(path, mainFile, { contentType: mainFile.type })
        if (upErr) throw upErr
        const { data } = supabase.storage.from('elements').getPublicUrl(path)
        mainImage = data.publicUrl
      }

      // Upload new gallery photos
      let photoUrls = form.photos || []
      if (photoFiles.length) {
        const newUrls = await uploadToElements(photoFiles)
        photoUrls = [...photoUrls, ...newUrls]
      }
      if (photoUrls.length > MAX_PHOTOS) {
        throw new Error(`Máximo ${MAX_PHOTOS} fotos por producto.`)
      }

      // Filter empty paragraphs
      const paragraphs = (form.custom_paragraphs || [])
        .filter((p) => p.title.trim() || p.text.trim())
        .map(({ id, title, text }) => ({ id, title: title.trim(), text: text.trim() }))

      const payload = {
        title: form.title.trim(),
        basic_description: form.basic_description.trim() || null,
        main_image: mainImage || null,
        technical_info: form.technical_info.trim() || null,
        advantages: form.advantages.trim() || null,
        price: Number(form.price) || 0,
        category: form.category || null,
        is_active: form.is_active,
        stock: Number(form.stock) || 0,
        photos: photoUrls,
        custom_paragraphs: paragraphs,
      }

      if (isEdit) {
        const { error } = await supabase
          .from('vladimir_products')
          .update(payload)
          .eq('id', id)
        if (error) throw error
        setMessage({ type: 'success', text: 'Producto actualizado correctamente.' })
      } else {
        const { error } = await supabase
          .from('vladimir_products')
          .insert(payload)
        if (error) throw error
        setMessage({ type: 'success', text: 'Producto creado correctamente.' })
      }

      setTimeout(() => navigate('/admin/productos'), 1200)
    } catch (err) {
      console.error('Save error:', err)
      setMessage({ type: 'error', text: err.message || 'Error al guardar.' })
    } finally {
      setSaving(false)
      setUploadProgress(0)
    }
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
          <span className="kicker">{isEdit ? 'Editar' : 'Nuevo'} producto</span>
          <h1>{isEdit ? 'Actualizar' : 'Crear'} <span className="text-gradient">producto</span></h1>
          <p>Completa toda la información para que el producto se muestre correctamente</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="admin-form">
          {message.text && (
            <motion.div
              className={message.type === 'error' ? 'auth-error' : 'auth-info'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span>{message.type === 'error' ? '⚠️' : '✓'}</span> {message.text}
            </motion.div>
          )}

          <div className="admin-form-grid">
            <div className="admin-form-main">
              {/* Basic info */}
              <div className="admin-form-card glass-strong">
                <div className="admin-form-card-head">
                  <h2>Información básica</h2>
                  <button
                    type="button"
                    className="admin-help-btn"
                    onClick={() => setShowStyleHelp((v) => !v)}
                  >
                    <InfoIcon width="14" height="14" /> {showStyleHelp ? 'Ocultar' : 'Ayuda de estilos'}
                  </button>
                </div>

                {showStyleHelp && (
                  <div className="admin-style-help">
                    <p><strong>Formato de texto:</strong> Envuelve con comillas y usa el código después del slash. Ejemplo: <code>"N/Texto"</code></p>
                    <div className="admin-style-codes">
                      {STYLE_CODES.map((c) => (
                        <div key={c.code} className="admin-style-code">
                          <span className="admin-style-code-tag">{c.code}</span>
                          <strong>{c.label}</strong>
                          <code>{c.example}</code>
                        </div>
                      ))}
                    </div>
                    <p className="admin-style-help-foot">
                      Combina efectos con coma: <code>"N,S/Texto"</code> = <strong><u>Texto</u></strong>
                    </p>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Título *</label>
                  <input
                    type="text"
                    name="title"
                    className="form-input"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder='Ej: Laptop "N/Gamer" ASUS ROG Strix'
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Descripción básica</label>
                  <textarea
                    name="basic_description"
                    className="form-input"
                    rows="3"
                    value={form.basic_description}
                    onChange={handleChange}
                    placeholder='Ej: La "N/mejor" laptop del mercado con "C/rendimiento" excepcional...'
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Precio (L.) *</label>
                    <input
                      type="number"
                      name="price"
                      className="form-input"
                      value={form.price}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                      placeholder="0.00"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock</label>
                    <input
                      type="number"
                      name="stock"
                      className="form-input"
                      value={form.stock}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Categoría</label>
                  <select
                    name="category"
                    className="form-input"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option value="">Sin categoría</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="admin-toggle">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={form.is_active}
                      onChange={handleChange}
                    />
                    <span className="admin-toggle-slider"></span>
                    <span>Producto activo (visible en el catálogo)</span>
                  </label>
                </div>
              </div>

              {/* Technical info */}
              <div className="admin-form-card glass-strong">
                <h2>Información técnica</h2>
                <div className="form-group">
                  <label className="form-label">Detalles técnicos (una línea por especificación)</label>
                  <textarea
                    name="technical_info"
                    className="form-input"
                    rows="6"
                    value={form.technical_info}
                    onChange={handleChange}
                    placeholder={`Ej:\n"N/Procesador": Intel Core i7-13700H\n"N/RAM": 16GB DDR5\n"N/Almacenamiento": 1TB SSD NVMe`}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>

              {/* Advantages */}
              <div className="admin-form-card glass-strong">
                <h2>Ventajas</h2>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Una ventaja por línea</label>
                  <textarea
                    name="advantages"
                    className="form-input"
                    rows="5"
                    value={form.advantages}
                    onChange={handleChange}
                    placeholder={`Ej:\n"N/Garantía" oficial de 2 años\nEnvío "S/gratis" en San Pedro Sula\nSoporte "C/técnico" 24/7`}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>

              {/* Custom paragraphs */}
              <div className="admin-form-card glass-strong">
                <div className="admin-form-card-head">
                  <div>
                    <h2>Párrafos personalizados</h2>
                    <p className="admin-form-card-sub">
                      Añade secciones adicionales con título y texto. Aparecerán debajo de
                      "Información técnica" y "Ventajas" en la página del producto.
                    </p>
                  </div>
                  <button type="button" className="btn btn-ghost" onClick={addParagraph}>
                    <PlusIcon width="14" height="14" /> Añadir párrafo
                  </button>
                </div>

                {(form.custom_paragraphs || []).length === 0 ? (
                  <div className="admin-paragraphs-empty">
                    <p>No has añadido párrafos personalizados todavía.</p>
                    <small>Puedes añadir tantos como necesites. Ejemplos: "En la caja", "Reseñas", "Preguntas frecuentes", etc.</small>
                  </div>
                ) : (
                  <div className="admin-paragraphs-list">
                    {form.custom_paragraphs.map((p, i) => (
                      <motion.div
                        key={p.id}
                        className="admin-paragraph glass"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div className="admin-paragraph-head">
                          <span className="admin-paragraph-num">#{i + 1}</span>
                          <div className="admin-paragraph-actions">
                            <button
                              type="button"
                              className="admin-mini-btn"
                              onClick={() => moveParagraph(p.id, -1)}
                              disabled={i === 0}
                              title="Mover arriba"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              className="admin-mini-btn"
                              onClick={() => moveParagraph(p.id, 1)}
                              disabled={i === form.custom_paragraphs.length - 1}
                              title="Mover abajo"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              className="admin-mini-btn danger"
                              onClick={() => removeParagraph(p.id)}
                              title="Eliminar"
                            >
                              <TrashIcon width="12" height="12" />
                            </button>
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Título del párrafo</label>
                          <input
                            type="text"
                            className="form-input"
                            value={p.title}
                            onChange={(e) => updateParagraph(p.id, 'title', e.target.value)}
                            placeholder='Ej: "N/En la caja" o "Preguntas Frecuentes"'
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label">Contenido</label>
                          <textarea
                            className="form-input"
                            rows="5"
                            value={p.text}
                            onChange={(e) => updateParagraph(p.id, 'text', e.target.value)}
                            placeholder={`Usa códigos de estilo entre comillas:\nIncluye "N,cargador" de 65W.\nCable "S/USB-C" a "S/USB-C".\nGuía de "C/inicio rápido".`}
                            style={{ resize: 'vertical' }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="admin-form-side">
              {/* Main image - drag and drop */}
              <div className="admin-form-card glass-strong">
                <h2>Imagen principal</h2>
                <div
                  className={`admin-main-img glass ${mainDragOver ? 'dragover' : ''}`}
                  onClick={() => mainInputRef.current?.click()}
                  onDragOver={handleMainDragOver}
                  onDragEnter={handleMainDragOver}
                  onDragLeave={handleMainDragLeave}
                  onDrop={handleMainDrop}
                >
                  {mainPreview ? (
                    <img src={mainPreview} alt="Preview" />
                  ) : (
                    <div className="admin-main-img-empty">
                      <PhotoIcon width="40" height="40" />
                      <span>Subir imagen principal</span>
                      <small>Click o arrastra y suelta</small>
                      <small>Máx. 5 MB</small>
                    </div>
                  )}
                  {mainDragOver && (
                    <div className="admin-drop-overlay">
                      <UploadIcon width="32" height="32" />
                      <span>Suelta la imagen aquí</span>
                    </div>
                  )}
                </div>
                <input
                  ref={mainInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleMainInputFile}
                  style={{ display: 'none' }}
                />
                {mainPreview && (
                  <button
                    type="button"
                    className="admin-remove-img"
                    onClick={() => { setMainFile(null); setMainPreview(''); setForm(p => ({ ...p, main_image: '' })) }}
                  >
                    <TrashIcon width="14" height="14" /> Quitar imagen
                  </button>
                )}
              </div>

              {/* Gallery - drag and drop */}
              <div className="admin-form-card glass-strong">
                <h2>Galería de fotos</h2>
                <p className="admin-form-help">
                  Hasta {MAX_PHOTOS} fotos adicionales. Click o arrastra y suelta. Cada imagen se almacena en el bucket <code>elements</code>.
                </p>
                <div
                  className={`admin-photos ${photosDragOver ? 'dragover' : ''}`}
                  onDragOver={handlePhotosDragOver}
                  onDragEnter={handlePhotosDragOver}
                  onDragLeave={handlePhotosDragLeave}
                  onDrop={handlePhotosDrop}
                >
                  {photoPreviews.map((src, i) => (
                    <div key={i} className="admin-photo">
                      <img src={src} alt={`Foto ${i + 1}`} />
                      <button
                        type="button"
                        className="admin-photo-remove"
                        onClick={(e) => {
                          e.stopPropagation()
                          const existingCount = form.photos?.length || 0
                          if (i < existingCount) removeExistingPhoto(i)
                          else removeNewPhoto(i - existingCount)
                        }}
                      >
                        <TrashIcon width="12" height="12" />
                      </button>
                    </div>
                  ))}
                  {photoPreviews.length < MAX_PHOTOS && (
                    <button
                      type="button"
                      className="admin-photo-add"
                      onClick={() => photosInputRef.current?.click()}
                    >
                      <PlusIcon width="20" height="20" />
                      <small>Añadir foto</small>
                    </button>
                  )}
                  {photosDragOver && (
                    <div className="admin-drop-overlay admin-photos-overlay">
                      <UploadIcon width="32" height="32" />
                      <span>Suelta aquí</span>
                    </div>
                  )}
                </div>
                <input
                  ref={photosInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoInput}
                  style={{ display: 'none' }}
                />
                <p className="admin-photos-count">
                  {photoPreviews.length} / {MAX_PHOTOS} fotos
                </p>
              </div>
            </div>
          </div>

          {saving && uploadProgress > 0 && (
            <div className="admin-progress glass">
              <div className="admin-progress-bar" style={{ width: `${uploadProgress}%` }} />
              <span>Subiendo imágenes... {uploadProgress}%</span>
            </div>
          )}

          <div className="admin-form-actions">
            <Link to="/admin/productos" className="btn btn-ghost">Cancelar</Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <><span className="spinner" /> Guardando...</>
              ) : isEdit ? (
                <><CheckIcon width="16" height="16" /> Guardar cambios</>
              ) : (
                <><PlusIcon width="16" height="16" /> Crear producto</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminProductForm
