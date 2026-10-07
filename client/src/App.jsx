import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { NewBooking } from './pages/NewBooking';
import { MyBookings } from './pages/MyBookings';
import { AdminApprovals } from './pages/AdminApprovals';
import { FleetManagement } from './pages/FleetManagement';
import { DriverDesk } from './pages/DriverDesk';
import { Analytics } from './pages/Analytics';
import { Login } from './pages/Login';
import { GatePassModal } from './components/GatePassModal';
import { AIAssistantWidget } from './components/AIAssistantWidget';

export const App = () => {
  const { user, token, role, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedBookingForPass, setSelectedBookingForPass] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold tracking-wide text-slate-300">
          Connecting to BIT Database & Authenticating...
        </p>
      </div>
    );
  }

  if (!token || !user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            setActiveTab={setActiveTab}
            onSelectBooking={(booking) => {
              if (role === 'FACULTY') {
                setActiveTab('my-bookings');
              } else if (role === 'ADMIN') {
                setActiveTab('admin-approvals');
              } else if (role === 'DRIVER') {
                setActiveTab('driver-desk');
              }
            }}
          />
        );
      case 'new-booking':
        return (
          <NewBooking
            setActiveTab={setActiveTab}
            onBookingCreated={() => {
              setActiveTab('my-bookings');
            }}
          />
        );
      case 'my-bookings':
        return <MyBookings onOpenNewBooking={() => setActiveTab('new-booking')} />;
      case 'admin-approvals':
      case 'all-bookings':
        return role === 'ADMIN' ? <AdminApprovals /> : <Dashboard setActiveTab={setActiveTab} onSelectBooking={() => {}} />;
      case 'fleet-management':
      case 'fleet-view':
        return role === 'ADMIN' ? <FleetManagement /> : <Dashboard setActiveTab={setActiveTab} onSelectBooking={() => {}} />;
      case 'driver-desk':
        return <DriverDesk />;
      case 'analytics':
        return role === 'ADMIN' ? <Analytics /> : <Dashboard setActiveTab={setActiveTab} onSelectBooking={() => {}} />;
      default:
        return <Dashboard setActiveTab={setActiveTab} onSelectBooking={() => {}} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-sans w-full relative">
      
      {/* 1. Full-Width Institutional Navbar */}
      <Navbar
        onOpenGatePass={() => {}}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />

      {/* 2. Full-Screen Body with Responsive Fluid Layout */}
      <div className="flex-1 flex w-full">
        
        {/* Responsive Sidebar (Desktop Fixed / Mobile Drawer) */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dynamic Fluid Workspace (Expands to 100% available width) */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="w-full">
            {renderContent()}
          </div>
        </main>

      </div>

      {/* 3. 24/7 AI Transport Assistant Floating Co-Pilot */}
      <AIAssistantWidget onNavigateTab={(tab) => setActiveTab(tab)} />

      {/* Global Gate Pass Modal Trigger */}
      {selectedBookingForPass && (
        <GatePassModal
          booking={selectedBookingForPass}
          onClose={() => setSelectedBookingForPass(null)}
        />
      )}

    </div>
  );
};

export default App;
