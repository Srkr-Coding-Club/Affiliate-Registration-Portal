import React, { useEffect } from 'react';
import { Check, X } from 'lucide-react';

const SuccessPopup = ({ isOpen, onClose }) => {
  // Close on Escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl transform animate-in zoom-in-95 duration-200 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Success Icon and Message */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-sm">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">🎉 Registration Successful!</h3>
          <p className="text-gray-600">
            A confirmation email has been sent to your registered email address.
            Please check your inbox (and spam folder if necessary).
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-300 hover:to-orange-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            ✅ Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup;
