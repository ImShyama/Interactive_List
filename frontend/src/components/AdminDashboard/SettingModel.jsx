import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchGroupNames } from '../../APIs/index.jsx';

const SettingModel = ({ openSettingsModal, handleCancel, handleSave, selectedApp }) => {
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // React Query to fetch group names
    const { data: groupNames, isLoading, error } = useQuery({
        queryKey: ['groupNames'],
        queryFn: fetchGroupNames,
        enabled: openSettingsModal, // Only fetch when modal is open
    });

    // Initialize selectedGroups when selectedApp changes
    useEffect(() => {
        if (selectedApp && selectedApp.allowedGroups) {
            setSelectedGroups(selectedApp.allowedGroups);
        } else {
            setSelectedGroups([]);
        }
    }, [selectedApp]);

    // Filter groups based on search term
    const filteredGroups = groupNames && Array.isArray(groupNames) 
        ? groupNames.filter(group => 
            group.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : [];

    const handleGroupToggle = (group) => {
        setSelectedGroups(prev => {
            if (prev.includes(group)) {
                return prev.filter(g => g !== group);
            } else {
                return [...prev, group];
            }
        });
    };

    const handleSaveClick = async () => {
        setIsSaving(true);
        try {
            await handleSave(selectedGroups);
        } catch (error) {
            console.error('Error saving settings:', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!openSettingsModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Dimmed background */}
            <div 
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={handleCancel}
            />
            
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    App Settings
                </h1>
                
                {selectedApp && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {selectedApp.appName}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {selectedApp.description}
                        </p>
                    </div>
                )}
                
                {/* Multiple group selection */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Select Allowed Groups
                    </label>
                    
                    {/* Search input */}
                    <div className="mb-3">
                        <input
                            type="text"
                            placeholder="Search groups..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    
                    {isLoading ? (
                        <div className="text-center py-4">
                            <div className="text-gray-500">Loading groups...</div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-4">
                            <div className="text-red-500">Error loading groups: {error.message}</div>
                        </div>
                    ) : (
                        <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
                            {filteredGroups && filteredGroups.length > 0 ? (
                                filteredGroups.map((group, index) => (
                                    <div key={index} className="flex items-center p-3 hover:bg-gray-50">
                                        <input
                                            type="checkbox"
                                            id={`group-${index}`}
                                            checked={selectedGroups.includes(group)}
                                            onChange={() => handleGroupToggle(group)}
                                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label 
                                            htmlFor={`group-${index}`}
                                            className="flex-1 text-sm text-gray-700 cursor-pointer"
                                        >
                                            {group}
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-gray-500">
                                    {searchTerm ? 'No groups found matching your search' : 'No groups available'}
                                </div>
                            )}
                        </div>
                    )}
                    
                    {selectedGroups.length > 0 && (
                        <div className="mt-3">
                            <div className="text-sm text-gray-600 mb-2">Selected groups:</div>
                            <div className="flex flex-wrap gap-2">
                                {selectedGroups.map((group, index) => (
                                    <span 
                                        key={index}
                                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                    >
                                        {group}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveClick}
                        disabled={isSaving}
                        className={`px-4 py-2 text-white rounded-md transition-colors flex items-center space-x-2 ${
                            isSaving 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        {isSaving && (
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingModel;
