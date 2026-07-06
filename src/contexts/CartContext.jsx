import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const CartContext = createContext({})

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([])
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('vladimir_cart')
      .select(`
        id,
        quantity,
        product_id,
        product:vladimir_products (
          id, title, basic_description, main_image, price, category, is_active
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error) setItems(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  // Real-time subscription
  useEffect(() => {
    if (!user) return
    const channel = supabase
      .channel('vladimir_cart_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vladimir_cart', filter: `user_id=eq.${user.id}` },
        () => fetchCart(),
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, fetchCart])

  const addToCart = async (productId, quantity = 1) => {
    if (!user) return { error: new Error('Debes iniciar sesión para añadir al carrito.') }
    // Check if already in cart
    const existing = items.find((it) => it.product_id === productId)
    if (existing) {
      const { error } = await supabase
        .from('vladimir_cart')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id)
      if (!error) await fetchCart()
      return { error }
    }
    const { error } = await supabase
      .from('vladimir_cart')
      .insert({ user_id: user.id, product_id: productId, quantity })
    if (!error) await fetchCart()
    return { error }
  }

  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) {
      return await removeFromCart(cartItemId)
    }
    const { error } = await supabase
      .from('vladimir_cart')
      .update({ quantity })
      .eq('id', cartItemId)
    if (!error) await fetchCart()
    return { error }
  }

  const removeFromCart = async (cartItemId) => {
    const { error } = await supabase
      .from('vladimir_cart')
      .delete()
      .eq('id', cartItemId)
    if (!error) await fetchCart()
    return { error }
  }

  const clearCart = async () => {
    if (!user) return
    await supabase.from('vladimir_cart').delete().eq('user_id', user.id)
    await fetchCart()
  }

  const totalItems = items.reduce((sum, it) => sum + (it.quantity || 0), 0)
  const totalPrice = items.reduce(
    (sum, it) => sum + (Number(it.product?.price) || 0) * (it.quantity || 0),
    0,
  )

  const value = {
    items,
    loading,
    totalItems,
    totalPrice,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refresh: fetchCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
