import { useState } from 'react'
import { useBridge } from './useBridge'
import './App.css'

interface PaymentMethod {
  id: string
  name: string
  icon: string
}

function App() {
  const { userInfo, getUserInfo, showToast, navigate, log } = useBridge()
  const [amount, setAmount] = useState('100.00')
  const [selectedMethod, setSelectedMethod] = useState<string>('')

  const paymentMethods: PaymentMethod[] = [
    { id: 'credit', name: 'Credit Card', icon: '💳' },
    { id: 'debit', name: 'Debit Card', icon: '🏦' },
    { id: 'paypal', name: 'PayPal', icon: '🅿️' },
    { id: 'crypto', name: 'Cryptocurrency', icon: '₿' },
  ]

  const handlePayment = () => {
    if (!selectedMethod) {
      showToast('Please select a payment method')
      return
    }

    const method = paymentMethods.find(m => m.id === selectedMethod)
    showToast(`Processing payment of $${amount} via ${method?.name}`)
    log(`Payment initiated: ${amount} - ${method?.name}`)

    // Simulate payment processing
    setTimeout(() => {
      navigate('payment-success')
    }, 1000)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>💰 Payment App</h1>
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

        <section className="payment-section">
          <h2>Payment Details</h2>

          <div className="amount-input">
            <label htmlFor="amount">Amount (USD)</label>
            <div className="input-group">
              <span className="currency">$</span>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className="payment-methods">
            <label>Payment Method</label>
            <div className="methods-grid">
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  className={`method-card ${selectedMethod === method.id ? 'selected' : ''}`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className="method-icon">{method.icon}</div>
                  <div className="method-name">{method.name}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handlePayment}
            className="btn btn-primary btn-large"
            disabled={!selectedMethod || !amount || parseFloat(amount) <= 0}
          >
            Pay ${amount}
          </button>
        </section>
      </main>

      <footer className="footer">
        <p>Mini App 2 - Payment Demo</p>
      </footer>
    </div>
  )
}

export default App
