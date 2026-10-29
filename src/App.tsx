import React, { useState, useEffect } from 'react';
import { BankingProvider, useBanking } from './context/BankingContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MyAccountPage } from './pages/MyAccountPage';
import { CardsPage } from './pages/CardsPage';
import { BankingPage } from './pages/BankingPage';
import { RewardsPage } from './pages/RewardsPage';
import { BusinessPage } from './pages/BusinessPage';
import { CustomerServicePage } from './pages/CustomerServicePage';
import { ExternalTransferPage } from './pages/ExternalTransferPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { LoginModal } from './components/public/LoginModal';
import { StatementModal } from './components/portal/StatementModal';

const MainAppLayout: React.FC = () => {
  const { activePage, setActivePage, isAdminLoggedIn, setIsAdminLoggedIn, isLoggedIn } = useBanking();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);

  // Stealth keyboard shortcut listener for Admin (Ctrl+Shift+A or Cmd+Shift+A) & URL Hash
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminLoggedIn(true);
        setActivePage('admin-dashboard');
      }
    };

    const handleHashChange = () => {
      if (window.location.hash === '#admin' || window.location.hash === '#admin-dashboard' || window.location.hash === '#ops') {
        setIsAdminLoggedIn(true);
        setActivePage('admin-dashboard');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [setActivePage, setIsAdminLoggedIn]);

  // If not logged in and not admin, or if activePage is login, render full LoginPage straight up
  if (!isLoggedIn && !isAdminLoggedIn) {
    return <LoginPage />;
  }

  if (activePage === 'login') {
    return <LoginPage />;
  }

  // If viewing Admin Dashboard
  if (activePage === 'admin-dashboard' || activePage === 'admin-wire-desk') {
    return (
      <div className="min-h-screen bg-[#F0F3F1] flex flex-col selection:bg-[#004732] selection:text-white">
        <AdminDashboardPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EEF2F0] text-slate-800 flex flex-col selection:bg-[#004732] selection:text-white">
      
      {/* Top Header - Matching Screenshot with blue square emblem & clean links */}
      <Header
        onOpenAccountClick={() => setIsLoginModalOpen(true)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Page Routing */}
      <main className="flex-1">
        {activePage === 'home' && (
          <HomePage
            onOpenCreateAccount={() => setIsLoginModalOpen(true)}
            onOpenLogin={() => setIsLoginModalOpen(true)}
          />
        )}
        {activePage === 'my-account' && (
          <MyAccountPage
            onOpenStatement={() => setIsStatementModalOpen(true)}
            onOpenCreateAccount={() => setIsLoginModalOpen(true)}
          />
        )}
        {activePage === 'profile' && <ProfilePage />}
        {activePage === 'cards' && (
          <CardsPage onOpenCreateAccount={() => setIsLoginModalOpen(true)} />
        )}
        {activePage === 'banking' && (
          <BankingPage onOpenCreateAccount={() => setIsLoginModalOpen(true)} />
        )}
        {activePage === 'rewards' && <RewardsPage />}
        {activePage === 'business' && (
          <BusinessPage onOpenCreateAccount={() => setIsLoginModalOpen(true)} />
        )}
        {activePage === 'customer-service' && <CustomerServicePage />}
        {(activePage === 'external-transfer' || activePage === 'transfers') && <ExternalTransferPage />}
      </main>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <StatementModal
        isOpen={isStatementModalOpen}
        onClose={() => setIsStatementModalOpen(false)}
      />

      {/* Footer - Matching 4 column corporate layout from screenshot */}
      <Footer onOpenLogin={() => setIsLoginModalOpen(true)} />

    </div>
  );
};

export default function App() {
  return (
    <BankingProvider>
      <MainAppLayout />
    </BankingProvider>
  );
}
