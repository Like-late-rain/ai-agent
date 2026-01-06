/**
 * @file Layout Component
 * @description Main layout with navigation and header
 */

import { WalletConnect } from '@/components/business/WalletConnect'
import { clsx } from 'clsx'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

/**
 * Layout component props
 */
export interface LayoutProps {
  /** Page content */
  children: ReactNode
}

/**
 * Navigation items
 */
const navItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/stake', label: 'Stake', icon: '💰' },
  { path: '/attractions', label: 'Attractions', icon: '🗺️' },
  { path: '/rewards', label: 'Rewards', icon: '🎁' },
]

/**
 * Layout Component
 *
 * @example
 * <Layout>
 *   <YourPageContent />
 * </Layout>
 */
export function Layout({ children }: LayoutProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-background-dark text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b-2 border-border-dark bg-background-dark/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">✈️</span>
              <span className="text-xl font-bold text-primary">TravelCheck</span>
            </Link>

            {/* Wallet Connect */}
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-[73px] z-30 border-b-2 border-border-dark bg-card-dark">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-3 font-medium transition-colors',
                    'hover:text-primary',
                    isActive
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-text-muted'
                  )}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t-2 border-border-dark bg-card-dark py-8">
        <div className="container mx-auto px-4 text-center text-text-muted text-sm">
          <p>&copy; 2024 TravelCheck. All rights reserved.</p>
          <p className="mt-2">Explore the world, earn rewards with blockchain</p>
        </div>
      </footer>
    </div>
  )
}
