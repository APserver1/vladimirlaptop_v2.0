// Centralized category list used by menus, catalog filters, product forms
export const CATEGORIES = [
  { slug: 'Computacion', label: 'Computación' },
  { slug: 'Laptops', label: 'Laptops' },
  { slug: 'Perifericos', label: 'Periféricos' },
  { slug: 'Camaras de Seguridad', label: 'Cámaras de Seguridad' },
  { slug: 'Paginas Web', label: 'Páginas Web' },
  { slug: 'Desarrollo de Software', label: 'Desarrollo de Software' },
  { slug: 'Edicion y Fotografica', label: 'Edición y Fotográfica' },
]

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug)

export const getCategoryLabel = (slug) => {
  if (!slug) return null
  return CATEGORIES.find((c) => c.slug === slug)?.label || slug
}
