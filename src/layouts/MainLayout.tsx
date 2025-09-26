// src/layouts/MainLayout.tsx
import React, { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="min-vh-100 bg-body">
      <Navbar onToggleSidebar={toggleSidebar} />
      
      <div className="d-flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className={`flex-grow-1 transition-all ${sidebarOpen ? 'ps-sidebar-width' : ''}`}>
          <div className="p-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default MainLayout
