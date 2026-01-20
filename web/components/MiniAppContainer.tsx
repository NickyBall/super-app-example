'use client'

import { useEffect, useRef } from 'react'
import { JSBridge } from '@/lib/jsBridge'
import styles from './MiniAppContainer.module.css'

interface MiniAppContainerProps {
  appName: 'demo-app1' | 'demo-app2'
}

/**
 * Container component that loads mini-apps in an iframe
 * and provides JSBridge communication
 */
export default function MiniAppContainer({ appName }: MiniAppContainerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const bridgeRef = useRef<JSBridge | null>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    // Initialize JSBridge once iframe is loaded
    const handleLoad = () => {
      console.log('[MiniAppContainer] iframe loaded:', appName)
      bridgeRef.current = new JSBridge(iframe)
    }

    iframe.addEventListener('load', handleLoad)

    return () => {
      iframe.removeEventListener('load', handleLoad)
      bridgeRef.current?.destroy()
    }
  }, [appName])

  // Map app names to URLs
  const appUrls: Record<string, string> = {
    'demo-app1': 'http://localhost:5173',
    'demo-app2': 'http://localhost:5174',
  }

  const url = appUrls[appName] || 'http://localhost:5173'

  return (
    <div className={styles.container}>
      <iframe
        ref={iframeRef}
        src={url}
        className={styles.iframe}
        title={`Mini App: ${appName}`}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />
    </div>
  )
}
