import React from 'react';

interface NavbarProps {
  pageTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ pageTitle = "Barangay Panel" }) => {
  // Mock logged-in user context data
  const user = { name: "Maria Santos", role: "Secretary" };

  return (
    <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800">{pageTitle}</h2>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
          <p className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full inline-block">
            {user.role}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-inner">
          {user.name.charAt(0)}
        </div>
      </div>
    </header>
  );
};