import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import SideMenu from './components/SideMenu'
import AnimatedBackground from './components/AnimatedBackground'
import ChatWidget from './components/ChatWidget'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Terms from './pages/Terms'
import Settings from './pages/Settings'
import Catalog from './pages/Catalog'
import CategoryPage from './pages/CategoryPage'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Support from './pages/Support'
import AdminProducts from './pages/AdminProducts'
import AdminProductForm from './pages/AdminProductForm'
import AdminChats from './pages/AdminChats'
import './styles/App.css'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="app-container">
      <AnimatedBackground />
      <Navbar onMenuClick={() => setMenuOpen(true)} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/terminos" element={<Terms />} />
            <Route path="/configuracion" element={<Settings />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/categoria/:slug" element={<CategoryPage />} />
            <Route path="/producto/:id" element={<ProductDetail />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/soporte" element={<Support />} />
            <Route path="/admin/productos" element={<AdminProducts />} />
            <Route path="/admin/productos/nuevo" element={<AdminProductForm />} />
            <Route path="/admin/productos/:id" element={<AdminProductForm />} />
            <Route path="/admin/chats" element={<AdminChats />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </AnimatePresence>
      </main>

      <ChatWidget />
    </div>
  )
}

export default App
