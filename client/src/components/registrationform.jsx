import React, { useRef, useState, useEffect } from 'react';
import axiosInstance from './axiosInstance';

const RegistrationForm = ({ onSubmitSuccess }) => {
    const clubIdRef = useRef(null);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        branch: '',
        phoneNumber: '',
        member: '',
        clubId: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingClubId, setIsLoadingClubId] = useState(true);
    const [clubIdError, setClubIdError] = useState('');
    const [isOtherMember, setIsOtherMember] = useState(false);

    // Fetch last club ID and set next one
    const fetchAndSetClubId = async () => {
        try {
            setIsLoadingClubId(true);
            setClubIdError('');
            const response = await axiosInstance.get('/last-club-id');
            const nextClubId = response.data?.data?.nextClubId;

            if (!nextClubId) throw new Error('Invalid response: nextClubId missing');

            setFormData(prev => ({ ...prev, clubId: nextClubId }));
        } catch (error) {
            console.error('Error fetching club ID:', error);
            setClubIdError('Failed to generate club ID. Please try refreshing the page.');
        } finally {
            setIsLoadingClubId(false);
        }
    };

    useEffect(() => {
        fetchAndSetClubId();
    }, []);

    const validateForm = () => {
        const newErrors = {};

        // Full Name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Full name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName.trim())) {
            newErrors.fullName = 'Full name should contain only letters and spaces';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Branch validation
        if (!formData.branch.trim()) {
            newErrors.branch = 'Branch is required';
        }

        // Phone Number validation
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = formData.phoneNumber.replace(/[\s\-\(\)]/g, '');
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (cleanPhone.length < 10 || cleanPhone.length > 15) {
            newErrors.phoneNumber = 'Phone number must be between 10-15 digits';
        } else if (!phoneRegex.test(cleanPhone)) {
            newErrors.phoneNumber = 'Please enter a valid phone number';
        }

        // Club ID validation
        if (!formData.clubId.trim()) {
            newErrors.clubId = 'Club ID is required';
        }

        // Member validation
        if (!formData.member.trim()) {
            newErrors.member = 'Club Member is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === "member") {
            if (value === "Other") {
                setIsOtherMember(true);
                setFormData(prev => ({ ...prev, member: "" }));
            } else {
                setIsOtherMember(false);
                setFormData(prev => ({ ...prev, member: value }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const response = await axiosInstance.post('/submit', formData);
            onSubmitSuccess(response.data);

            setFormData({
                fullName: '',
                email: '',
                branch: '',
                phoneNumber: '',
                member: '',
                clubId: ''
            });
            setErrors({});
            setIsOtherMember(false);
            await fetchAndSetClubId();
        } catch (error) {
            console.error('Error submitting form:', error);
            alert(error.response?.data?.error || 'An error occurred while submitting the form. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRefreshClubId = async () => {
        setFormData(prev => ({ ...prev, clubId: '' }));
        await fetchAndSetClubId();
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
                    Affiliate Registration Form
                </h2>

                <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                            placeholder="Enter your full name"
                            disabled={isSubmitting}
                        />
                        {errors.fullName && <p className="text-red-500 text-sm mt-1">⚠️ {errors.fullName}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                            placeholder="Enter your email address"
                            disabled={isSubmitting}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">⚠️ {errors.email}</p>}
                    </div>

                    {/* Branch Dropdown */}
                    <div>
                        <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
                            Branch *
                        </label>
                        <select
                            id="branch"
                            name="branch"
                            value={formData.branch}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.branch ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                            disabled={isSubmitting}
                        >
                            <option value="">-- Select Branch --</option>
                            <option value="CIVIL">Civil Engineering</option>
                            <option value="CSE">Computer Science and Engineering</option>
                            <option value="ECE">Electronics and Communication Engineering</option>
                            <option value="EEE">Electrical and Electronics Engineering</option>
                            <option value="IT">Information Technology</option>
                            <option value="MECH">Mechanical Engineering</option>
                            <option value="AIML">Artificial Intelligence and Machine Learning</option>
                            <option value="AIDS">Artificial Intelligence and Data Science</option>
                            <option value="CSD">Computer Science and Design</option>
                            <option value="CIC">Computer Science and Cyber Security</option>
                            <option value="CSBS">Computer Science and Business System</option>
                            <option value="CSIT">Computer Science and Information Technology</option>
                        </select>
                        {errors.branch && <p className="text-red-500 text-sm mt-1">⚠️ {errors.branch}</p>}
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                        </label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.phoneNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                            placeholder="Enter your phone number"
                            disabled={isSubmitting}
                        />
                        {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">⚠️ {errors.phoneNumber}</p>}
                    </div>

                    {/* Club Member Dropdown + Other */}
                    <div>
                        <label htmlFor="member" className="block text-sm font-medium text-gray-700 mb-1">
                            Club Member *
                        </label>
                        <select
                            id="member"
                            name="member"
                            value={isOtherMember ? "Other" : formData.member}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${errors.member ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                            disabled={isSubmitting}
                        >
                            <option value="">-- Select Club Member --</option>
                            <option value="A.Vijay Babu">A.Vijay Babu</option>
                            <option value="N.Yemima">N.Yemima</option>
                            <option value="P.Sreedevi">P.Sreedevi</option>
                            <option value="V.Ashok babu">V.Ashok babu</option>
                            <option value="G.Tharunee">G.Tharunee</option>
                            <option value="M.Narendra reddy">M.Narendra reddy</option>
                            <option value="J.Pavan Kumar">J.Pavan Kumar</option>
                            <option value="P.Prasanna">P.Prasanna</option>
                            <option value="A.Asha">A.Asha</option>
                            <option value="P.Tarun">P.Tarun</option>
                            <option value="P.Adithya">P.Adithya</option>
                            <option value="A.Rajitha">A.Rajitha</option>
                            <option value="V.Siddhardha">V.Siddhardha</option>
                            <option value="S.Lakshmana Swamy">S.Lakshmana Swamy</option>
                            <option value="T.Bashitha">T.Bashitha</option>
                            <option value="D.Hepsiba">D.Hepsiba</option>
                            <option value="Harshith Raju">Harshith Raju</option>
                            <option value="Other">Other</option>
                        </select>

                        {isOtherMember && (
                            <input
                                type="text"
                                placeholder="Enter member name"
                                value={formData.member}
                                onChange={(e) => setFormData(prev => ({ ...prev, member: e.target.value }))}
                                className="mt-2 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 border-gray-300"
                                disabled={isSubmitting}
                            />
                        )}

                        {errors.member && <p className="text-red-500 text-sm mt-1">⚠️ {errors.member}</p>}
                    </div>

                    {/* Club ID */}
                    <div>
                        <label htmlFor="clubId" className="block text-sm font-medium text-gray-700 mb-1">
                            Club ID * <span className="text-gray-500 text-xs">(Auto Generated)</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                id="clubId"
                                name="clubId"
                                value={formData.clubId}
                                readOnly
                                className={`flex-1 px-3 py-2 border rounded-md bg-gray-50 cursor-not-allowed ${clubIdError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder={isLoadingClubId ? "Generating Club ID..." : "Club ID will be generated automatically"}
                                disabled
                            />
                            <button
                                type="button"
                                onClick={handleRefreshClubId}
                                disabled={isLoadingClubId || isSubmitting}
                                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 border border-gray-300 rounded-md text-gray-600 hover:text-gray-800 disabled:text-gray-400"
                            >
                                {isLoadingClubId ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                                ) : (
                                    "🔄"
                                )}
                            </button>
                        </div>
                        {clubIdError && <p className="text-red-500 text-sm mt-1">⚠️ {clubIdError}</p>}
                        {errors.clubId && <p className="text-red-500 text-sm mt-1">⚠️ {errors.clubId}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit" disabled={isSubmitting || isLoadingClubId || clubIdError}
                        className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-300 hover:to-orange-400 disabled:from-orange-400 disabled:to-orange-500 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-md transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-[1.02] disabled:transform-none cursor-pointer disabled:cursor-not-allowed" >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Submitting...
                            </>
                        ) : isLoadingClubId ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Generating Club ID...
                            </>
                        ) : (
                            <>
                                <span className="mr-2">📝</span> Register Affiliate
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegistrationForm;
