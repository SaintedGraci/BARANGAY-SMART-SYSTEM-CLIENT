import { LogOut, X } from 'lucide-react';
import bakilidLogo from '../assets/bakilidlogo.png';

export default function AdminSidebar({
  isOpen,
  isMobileOpen,
  activeTab,
  menuItems,
  user,
  onTabChange,
  onLogout,
  onClose,
}) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ${
          isOpen ? 'w-72' : 'w-20'
        }`}
      >
        <SidebarContent
          isOpen={isOpen}
          activeTab={activeTab}
          menuItems={menuItems}
          user={user}
          onTabChange={onTabChange}
          onLogout={onLogout}
        />
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 lg:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-1">
              <img src={bakilidLogo} alt="Bakilid Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-950">Barangay Bakilid</h1>
              <p className="text-xs font-medium text-blue-700">Admin Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <SidebarContent
          isOpen={true}
          activeTab={activeTab}
          menuItems={menuItems}
          user={user}
          onTabChange={(tab) => {
            onTabChange(tab);
            onClose();
          }}
          onLogout={onLogout}
        />
      </aside>
    </>
  );
}

function SidebarContent({ isOpen, activeTab, menuItems, user, onTabChange, onLogout }) {
  return (
    <>
      {/* Logo - Desktop only */}
      <div className="hidden lg:flex h-20 items-center border-b border-slate-100 px-5">
        {isOpen ? (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-1">
              <img src={bakilidLogo} alt="Bakilid Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-950">Barangay Bakilid</h1>
              <p className="text-xs font-medium text-blue-700">Admin Portal</p>
            </div>
          </div>
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-1 mx-auto">
            <img src={bakilidLogo} alt="Bakilid Logo" className="h-full w-full object-contain" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
              } ${!isOpen && 'justify-center'}`}
              title={!isOpen ? item.name : ''}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {isOpen && (
                <>
                  <span className="flex-1 text-left">{item.name}</span>
                  {item.badge > 0 && (
                    <span className="rounded-full bg-rose-500 px-2 py-0.5 text-xs font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {/* Tooltip for collapsed state */}
              {!isOpen && (
                <span className="absolute left-full ml-2 hidden whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg group-hover:block">
                  {item.name}
                  {item.badge > 0 && ` (${item.badge})`}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User profile & logout */}
      <div className="border-t border-slate-100 p-4">
        <div className={`flex items-center gap-3 ${!isOpen && 'justify-center'}`}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-sm">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          {isOpen && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-950">{user?.username}</p>
              <p className="truncate text-xs font-medium capitalize text-slate-500">{user?.role}</p>
            </div>
          )}
        </div>
        {isOpen && (
          <button
            onClick={onLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        )}
      </div>
    </>
  );
}
