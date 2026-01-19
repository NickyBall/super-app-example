import { useEffect, useCallback, useState } from 'react'

/**
 * Bridge Types - Shared between native and JavaScript
 */
export interface BridgeMessage {
  type: string
  data?: any
}

export interface UserInfo {
  userId: string
  name: string
  email: string
}

/**
 * Custom hook for Native Bridge communication
 *
 * This hook provides methods to:
 * 1. Send messages to native (Android/iOS)
 * 2. Receive messages from native
 * 3. Listen for specific message types
 */
export const useBridge = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isReady, setIsReady] = useState(false)

  /**
   * Send message to native
   */
  const sendToNative = useCallback((type: string, data?: any) => {
    const message: BridgeMessage = { type, data }

    // Android bridge
    if (window.AndroidBridge) {
      window.AndroidBridge.postMessage(JSON.stringify(message))
    }
    // iOS bridge
    else if (window.webkit?.messageHandlers?.nativeApp) {
      window.webkit.messageHandlers.nativeApp.postMessage(message)
    }
    // Fallback for web development
    else {
      console.log('[Bridge] Message to native:', message)
    }
  }, [])

  /**
   * Log message to native console
   */
  const log = useCallback((message: string) => {
    sendToNative('log', { message })
    console.log('[MiniApp]', message)
  }, [sendToNative])

  /**
   * Get user info from native
   */
  const getUserInfo = useCallback(() => {
    sendToNative('getUserInfo')
  }, [sendToNative])

  /**
   * Show native toast/alert
   */
  const showToast = useCallback((message: string) => {
    sendToNative('showToast', { message })
  }, [sendToNative])

  /**
   * Navigate to a screen
   */
  const navigate = useCallback((screen: string) => {
    sendToNative('navigate', { screen })
  }, [sendToNative])

  /**
   * Setup listener for messages from native
   */
  useEffect(() => {
    // Global handler for receiving messages from native
    window.receiveFromNative = (message: BridgeMessage) => {
      console.log('[Bridge] Message from native:', message)

      switch (message.type) {
        case 'userInfo':
          setUserInfo(message.data as UserInfo)
          break
        default:
          console.log('[Bridge] Unknown message type:', message.type)
      }
    }

    setIsReady(true)
    log('Mini app initialized')

    return () => {
      delete window.receiveFromNative
    }
  }, [log])

  return {
    isReady,
    userInfo,
    sendToNative,
    getUserInfo,
    showToast,
    navigate,
    log,
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    AndroidBridge?: {
      postMessage: (message: string) => void
    }
    webkit?: {
      messageHandlers?: {
        nativeApp?: {
          postMessage: (message: any) => void
        }
      }
    }
    receiveFromNative?: (message: BridgeMessage) => void
  }
}
