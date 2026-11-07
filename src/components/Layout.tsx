import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export const Layout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-neutral-900 text-neutral-100">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-neutral-900 p-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};
