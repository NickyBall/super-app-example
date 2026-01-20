'use client'

import { useState } from 'react'
import MiniAppContainer from '@/components/MiniAppContainer'
import styles from './page.module.css'

export default function Home() {
  const [currentApp, setCurrentApp] = useState<'demo-app1' | 'demo-app2'>('demo-app1')

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🌐 Web SuperApp</h1>
        <div className={styles.navigation}>
          <button
            className={`${styles.navButton} ${currentApp === 'demo-app1' ? styles.active : ''}`}
            onClick={() => setCurrentApp('demo-app1')}
          >
            🛍️ Shopping App
          </button>
          <button
            className={`${styles.navButton} ${currentApp === 'demo-app2' ? styles.active : ''}`}
            onClick={() => setCurrentApp('demo-app2')}
          >
            💳 Payment App
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <MiniAppContainer appName={currentApp} />
      </div>
    </div>
  )
}
