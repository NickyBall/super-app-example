/**
 * JavaScript Bridge for Web Super App
 *
 * Handles communication between host app and mini-apps loaded in iframes
 * Uses postMessage API for cross-origin communication
 */

export interface BridgeMessage {
  type: string
  data?: any
}

export class JSBridge {
  private iframe: HTMLIFrameElement | null = null
  private targetOrigin: string = '*'

  constructor(iframe: HTMLIFrameElement, targetOrigin: string = '*') {
    this.iframe = iframe
    this.targetOrigin = targetOrigin
    this.setupListeners()
  }

  /**
   * Setup message listeners from mini-app
   */
  private setupListeners() {
    window.addEventListener('message', this.handleMessage.bind(this))
  }

  /**
   * Handle messages from mini-app iframe
   */
  private handleMessage(event: MessageEvent) {
    // Security: Verify origin if needed
    // if (event.origin !== 'http://localhost:5173') return

    const message = event.data as BridgeMessage

    if (!message || !message.type) {
      return
    }

    console.log('[JSBridge] Received from mini-app:', message)

    // Handle different message types
    switch (message.type) {
      case 'log':
        this.handleLog(message.data)
        break
      case 'getUserInfo':
        this.handleGetUserInfo()
        break
      case 'showToast':
        this.handleShowToast(message.data)
        break
      case 'navigate':
        this.handleNavigate(message.data)
        break
      default:
        console.warn('[JSBridge] Unknown message type:', message.type)
    }
  }

  /**
   * Send message to mini-app iframe
   */
  sendToMiniApp(message: BridgeMessage) {
    if (!this.iframe || !this.iframe.contentWindow) {
      console.error('[JSBridge] iframe not ready')
      return
    }

    console.log('[JSBridge] Sending to mini-app:', message)
    this.iframe.contentWindow.postMessage(message, this.targetOrigin)
  }

  /**
   * Handle log messages
   */
  private handleLog(data: any) {
    const message = data?.message || 'No message'
    console.log('[MiniApp]', message)
  }

  /**
   * Handle getUserInfo request
   */
  private handleGetUserInfo() {
    const userInfo = {
      userId: '12345',
      name: 'John Doe',
      email: 'john@example.com',
    }

    this.sendToMiniApp({
      type: 'userInfo',
      data: userInfo,
    })
  }

  /**
   * Handle showToast request
   */
  private handleShowToast(data: any) {
    const message = data?.message || 'No message'

    // Simple toast notification
    const toast = document.createElement('div')
    toast.textContent = message
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #333;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `

    document.body.appendChild(toast)

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease'
      setTimeout(() => toast.remove(), 300)
    }, 3000)
  }

  /**
   * Handle navigation request
   */
  private handleNavigate(data: any) {
    const screen = data?.screen || 'unknown'
    console.log('[JSBridge] Navigate to:', screen)
    // TODO: Implement navigation logic
  }

  /**
   * Cleanup
   */
  destroy() {
    window.removeEventListener('message', this.handleMessage.bind(this))
  }
}
