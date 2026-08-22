import { useState } from 'react';
import { Menu } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';

export default function AdminLayout({ children, activeTab, onTabChange, menuItems, user, onLogout, onRefresh }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    // Desktop: collapse/expand
    // Mobile: keep closed, use mobile overlay
    if (window.innerWidth >= 1024) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        isMobileOpen={isMobileSidebarOpen}
        activeTab={activeTab}
        menuItems={menuItems}
        user={user}
        onTabChange={onTabChange}
        onLogout={onLogout}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader
          activeTab={activeTab}
          menuItems={menuItems}
          user={user}
          onMenuClick={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          onRefresh={onRefresh}
        />

        {/* Page content with scroll */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
