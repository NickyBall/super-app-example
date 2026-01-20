import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SuperApp - Web',
  description: 'Web Super App - Host for Mini Apps',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
