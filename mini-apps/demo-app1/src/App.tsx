import { useState } from 'react'
import { useBridge } from './useBridge'
import './App.css'

function App() {
  const { userInfo, getUserInfo, showToast, navigate, log } = useBridge()
  const [cartItems, setCartItems] = useState(0)

  const products = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Phone', price: 699 },
    { id: 3, name: 'Headphones', price: 199 },
  ]

  const handleAddToCart = (productName: string) => {
    setCartItems(prev => prev + 1)
    showToast(`Added ${productName} to cart!`)
    log(`Product added: ${productName}`)
  }

  const handleCheckout = () => {
    if (cartItems === 0) {
      showToast('Cart is empty!')
      return
    }
    navigate('checkout')
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🛍️ Shopping App</h1>
        <div className="cart-badge">
          Cart: {cartItems}
        </div>
      </header>

      <main className="main">
        <section className="user-section">
          <button onClick={getUserInfo} className="btn btn-secondary">
            Get User Info
          </button>
          {userInfo && (
            <div className="user-info">
              <p><strong>Name:</strong> {userInfo.name}</p>
              <p><strong>Email:</strong> {userInfo.email}</p>
              <p><strong>User ID:</strong> {userInfo.userId}</p>
            </div>
          )}
        </section>

        <section className="products">
          <h2>Products</h2>
          <div className="product-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <h3>{product.name}</h3>
                <p className="price">${product.price}</p>
                <button
                  onClick={() => handleAddToCart(product.name)}
                  className="btn btn-primary"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="checkout-section">
          <button
            onClick={handleCheckout}
            className="btn btn-primary btn-large"
            disabled={cartItems === 0}
          >
            Proceed to Checkout ({cartItems} items)
          </button>
        </section>
      </main>

      <footer className="footer">
        <p>Mini App 1 - Shopping Demo</p>
      </footer>
    </div>
  )
}

export default App
