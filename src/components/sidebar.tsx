import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  
  // In a real app, grab this state from an authentication token context
  const userRole = 'Secretary'; 

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', roles: ['Captain', 'Secretary', 'Treasurer'] },
    { name: 'Resident Records', path: '/residents', roles: ['Captain', 'Secretary'] },
    { name: 'Certificates & Clearances', path: '/clearances', roles: ['Captain', 'Secretary'] },
    { name: 'Blotter Records', path: '/blotter', roles: ['Captain', 'Secretary'] },
    { name: 'Barangay Finances', path: '/finances', roles: ['Captain', 'Treasurer'] },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col h-screen sticky top-0 shadow-lg">
      {/* Brand/Seal Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white text-sm">B</div>
        <span className="font-bold text-lg tracking-wide uppercase">Barangay OS</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation
          .filter(item => item.roles.includes(userRole))
          .map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg font-medium text-sm transition-all duration-150 group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
      </nav>

      {/* Logout Footer Section */}
      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-950/40 hover:text-red-400 transition-all duration-150">
          Sign Out
        </button>
      </div>
    </aside>
  );
};