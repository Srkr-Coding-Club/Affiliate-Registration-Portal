import React, { useState, useEffect } from 'react';
import { FileText, Users } from 'lucide-react';
import Sidebar from './components/sidebar';
import RegistrationForm from './components/registrationform';
import AllAffiliates from './components/allaffiliates';
import SuccessPopup from './components/successpopup';
import AdminLogin from './components/Adminlogin';
import axiosInstance from './components/axiosInstance';

const App = () => {
  const [activeTab, setActiveTab] = useState('form');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    const checkAuth = async () => {
      const res = await axiosInstance.get("/check-auth");
      if (res.data.isLoggedIn) {
        setIsLoggedIn(true);
      }
    };
    checkAuth();
  }, []);

  const handleFormSubmit = (data) => {
    setSubmittedData(data);
    setShowSuccessPopup(true);
  };

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    setSubmittedData(null);
  };

  const menuItems = [
    { id: 'form', label: 'Application Form', icon: FileText },
    { id: 'affiliates', label: 'All Affiliates', icon: Users }
  ];

  if (!isLoggedIn) {
    return <AdminLogin onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-md shadow-lg"
      >
        <div className="w-5 h-5 flex flex-col justify-center">
          <span className="block h-0.5 bg-white mb-1 transition-all duration-200"></span>
          <span className="block h-0.5 bg-white mb-1 transition-all duration-200"></span>
          <span className="block h-0.5 bg-white transition-all duration-200"></span>
        </div>
      </button>

      {/* Sidebar */}
      <Sidebar
        menuItems={menuItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={() => {
          localStorage.removeItem("token"); // clear token
          setIsLoggedIn(false);
        }}
      />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <div className="pt-16 lg:pt-0">
          <main className="p-4 md:p-6 lg:p-8 min-h-screen">
            {activeTab === 'form' && (
              <RegistrationForm onSubmitSuccess={handleFormSubmit} />
            )}
            {activeTab === 'affiliates' && <AllAffiliates />}
          </main>
        </div>
      </div>

      {/* Success Popup */}
      <SuccessPopup
        isOpen={showSuccessPopup}
        onClose={handleClosePopup}
        affiliateData={submittedData}
      />
    </div>
  );
};

export default App;
