import Navbar from '@/components/Navbar';
import Footer from '@/components/ui/footer';
import RouteChangeLoader from '@/components/RouteChangeLoader'; // 🔥 import the loader
import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div>
      <RouteChangeLoader /> {/* 🔥 loader for route transitions */}
      <Navbar />
      
      <div>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
