import React from 'react';

const Sidebar = ({ menuItems, activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  return (
    <div className={`
      fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-center h-16 bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md">
        <h1 className="text-xl font-bold tracking-wide">Affiliate Portal</h1>
      </div>
      
      {/* Navigation Menu */}
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center px-6 py-4 text-left hover:bg-gray-50 transition-all duration-200 transform hover:translate-x-1
                ${activeTab === item.id 
                  ? 'bg-blue-50 border-r-4 border-orange-400 text-orange-500 shadow-sm' 
                  : 'text-gray-700 hover:text-gray-900'
                }
              `}
            >
              <Icon className={`h-5 w-5 mr-3 ${activeTab === item.id ? 'text-orange-500' : 'text-gray-500'}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          © 2025 Affiliate Management System
        </p>
      </div>
    </div>
  );
};

export default Sidebar;