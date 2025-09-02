import React, { useState, useEffect } from 'react';
import { Users, Search, Calendar, Phone, Mail, Building, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import axiosInstance from './axiosInstance'; // <-- your axios instance

const AllAffiliates = () => {
  const [affiliates, setAffiliates] = useState([]);
  const [filteredAffiliates, setFilteredAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Fetch affiliates from API
  useEffect(() => {
    const fetchAffiliates = async () => {
      try {
        const res = await axiosInstance.get('/allaffiliates');
        // Sort affiliates in descending order by creation date
        const sortedAffiliates = res.data.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAffiliates(sortedAffiliates);
        setFilteredAffiliates(sortedAffiliates);
      } catch (error) {
        console.error('Error fetching affiliates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAffiliates();
  }, []);

  // Filter affiliates when searchTerm changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAffiliates(affiliates);
    } else {
      const filtered = affiliates.filter(affiliate =>
        affiliate.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        affiliate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        affiliate.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
        affiliate.clubId.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAffiliates(filtered);
    }
  }, [searchTerm, affiliates]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const exportToExcel = () => {
    setIsExporting(true);

    try {
      // Prepare data for Excel export
      const excelData = affiliates.map((affiliate, index) => ({
        'S.No': index + 1,
        'Full Name': affiliate.fullName,
        'Email': affiliate.email,
        'Phone Number': affiliate.phoneNumber,
        'Branch': affiliate.branch,
        'Club ID': affiliate.clubId,
        'Member': affiliate.member,
        'Registration Date': formatDate(affiliate.createdAt),
        'Status': 'Active'
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const columnWidths = [
        { wch: 8 },   // S.No
        { wch: 20 },  // Full Name
        { wch: 28 },  // Email
        { wch: 15 },  // Phone Number
        { wch: 15 },  // Branch
        { wch: 12 },  // Club ID
        { wch: 20 },  // Member
        { wch: 15 },  // Registration Date
        { wch: 10 }   // Status
      ];
      worksheet['!cols'] = columnWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Affiliates');

      // Generate filename with current date
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `affiliates_${currentDate}.xlsx`;

      // Save file
      XLSX.writeFile(workbook, filename);

    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading affiliates...</p>
      </div>
    );
  }

  if (affiliates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <Users className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No Affiliates Yet</h3>
        <p className="text-gray-600 mb-4">Start by registering your first affiliate to see them here.</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-blue-700 text-sm">
            💡 Tip: Use the "Application Form" in the sidebar to add new affiliates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              All Affiliates ({filteredAffiliates.length})
            </h2>
            <p className="text-gray-600">Manage and view all registered affiliates</p>
          </div>

          {/* Export Button */}
          <button
            onClick={exportToExcel}
            disabled={isExporting || affiliates.length === 0}
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export to Excel'}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search affiliates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        {searchTerm && (
          <p className="text-sm text-gray-600 mt-2">
            Showing {filteredAffiliates.length} of {affiliates.length} affiliates
          </p>
        )}
      </div>

      {/* Affiliates Grid - 16:9 Cards */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {filteredAffiliates.map((affiliate, index) => (
          <div key={affiliate._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:border-orange-300 overflow-hidden">
            {/* 16:9 Aspect Ratio Container */}
            <div className="aspect-video relative">
              <div className="absolute inset-0 p-4 flex flex-col justify-between">

                {/* Top Section - Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="bg-gradient-to-r from-orange-100 to-orange-200 rounded-full p-2 mr-3 shadow-sm flex-shrink-0">
                      <Users className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-gray-900 truncate">{affiliate.fullName}</h3>
                      <p className="text-xs text-gray-500"># {affiliate.branch}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full ml-2">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(affiliate.createdAt)}
                  </div>
                </div>

                {/* Middle Section - Key Details */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-50/80 p-2 rounded">
                    <div className="flex items-center mb-1">
                      <Mail className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="font-medium text-gray-700">Email</span>
                    </div>
                    <p className="text-gray-600 truncate">{affiliate.email}</p>
                  </div>

                  <div className="bg-gray-50/80 p-2 rounded">
                    <div className="flex items-center mb-1">
                      <Phone className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="font-medium text-gray-700">Phone</span>
                    </div>
                    <p className="text-gray-600 truncate">{affiliate.phoneNumber}</p>
                  </div>

                  <div className="bg-gray-50/80 p-2 rounded">
                    <span className="font-medium text-gray-700 block mb-1">Club ID</span>
                    <p className="text-gray-600 font-mono text-xs bg-white px-1 py-0.5 rounded border truncate">
                      {affiliate.clubId}
                    </p>
                  </div>
                  <div className="bg-gray-50/80 p-2 rounded">
                    <div className="flex items-center mb-1">
                      <Phone className="h-3 w-3 text-gray-400 mr-1" />
                      <span className="font-medium text-gray-700">Member</span>
                    </div>
                    <p className="text-gray-600 truncate">{affiliate.member}</p>
                  </div>
                </div>
                <div className="p-2 rounded relative mt-5">
                  <div className="absolute bottom-1 right-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      🟢 Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {searchTerm && filteredAffiliates.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No Results Found</h3>
          <p className="text-gray-600 mb-4">
            No affiliates found matching "<span className="font-medium">{searchTerm}</span>"
          </p>
          <button
            onClick={() => setSearchTerm('')}
            className="text-orange-400 hover:text-orange-500 font-medium"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
};

export default AllAffiliates;