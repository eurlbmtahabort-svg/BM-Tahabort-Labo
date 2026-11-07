import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-neutral-900 text-neutral-100">
      <Header onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <main className="flex-1 overflow-y-auto bg-neutral-900 p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};
