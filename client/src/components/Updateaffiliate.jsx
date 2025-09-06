import React, { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";
import UpdatePopup from "./updatepopup";

const UpdateAffiliateForm = ({ affiliateId, isOpen, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        branch: "",
        phoneNumber: "",
        member: "",
        clubId: "",
    });

    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successPopup, setSuccessPopup] = useState(false);

    // Fetch affiliate data when popup opens
    useEffect(() => {
        const fetchAffiliate = async () => {
            if (!affiliateId || !isOpen) return;
            setLoading(true);
            try {
                const res = await axiosInstance.get(`/affiliate/${affiliateId}`);
                // console.log(res.data.data.user);
                setFormData(res.data.data.user);
            } catch (err) {
                console.error("Error fetching affiliate:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAffiliate();
    }, [affiliateId, isOpen]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axiosInstance.put("/affiliate/update", formData);
            setSuccessPopup(true);
            onUpdate(); // refresh affiliates in parent
        } catch (err) {
            console.error("Error updating affiliate:", err);
            alert("Failed to update affiliate");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-400 to-orange-500 px-6 py-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Update Affiliate Details</h2>
                            <button
                                onClick={onClose}
                                className="text-white hover:text-orange-100 transition-colors duration-200 text-xl font-semibold"
                            >
                                ✖
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                                <p className="ml-4 text-gray-600">Loading affiliate data...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleUpdate} className="space-y-6">
                                {/* Personal Information Section */}
                                <div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Full Name */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Full Name <span className="text-gray-400 text-xs">(Read Only)</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                disabled
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Email Address <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-colors duration-200"
                                                placeholder="Enter email address"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information Section */}
                                <div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Phone Number */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Phone Number
                                            </label>
                                            <input
                                                type="text"
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-500 transition-colors duration-200"
                                                placeholder="Enter phone number"
                                            />
                                        </div>

                                        {/* Branch */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Branch
                                            </label>
                                            <select
                                                name="branch"
                                                value={formData.branch}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-500 transition-colors duration-200 bg-white"
                                            >
                                                <option value="" >{formData.branch}</option>
                                                <option value="CIVIL">CIVIL</option>
                                                <option value="CSE">CSE</option>
                                                <option value="ECE">ECE</option>
                                                <option value="EEE">EEE</option>
                                                <option value="IT">IT</option>
                                                <option value="MECH">MECH</option>
                                                <option value="AIML">AIML</option>
                                                <option value="AIDS">AIDS</option>
                                                <option value="CSD">CSD</option>
                                                <option value="CIC">CIC</option>
                                                <option value="CSBS">CSBS</option>
                                                <option value="CSIT">CSIT</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Membership Information Section */}
                                <div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Member */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Member <span className="text-gray-400 text-xs">(Read Only)</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="member"
                                                disabled
                                                value={formData.member}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none"
                                                placeholder="Enter member information"
                                            />
                                        </div>

                                        {/* Club ID */}
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Club ID <span className="text-gray-400 text-xs">(Read Only)</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="clubId"
                                                id="clubId"
                                                value={formData.clubId}
                                                disabled
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-200 disabled:to-orange-300 text-white rounded-lg font-medium transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                Updating...
                                            </>
                                        ) : (
                                            "Update Affiliate"
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Success Popup */}
            <UpdatePopup
                isOpen={successPopup}
                onClose={() => {
                    setSuccessPopup(false);
                    onClose();
                }}
            />
        </>
    );
};

export default UpdateAffiliateForm;