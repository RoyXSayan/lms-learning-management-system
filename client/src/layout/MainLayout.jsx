import Navbar from '@/components/Navbar'
import Footer from '@/components/ui/footer'
import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div>
      <Navbar/>
      <div>
        <Outlet />
      </div>
      <Footer/>
    </div>
  )
}

export default MainLayout
