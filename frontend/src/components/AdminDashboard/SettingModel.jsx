import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchGroupNames } from '../../APIs/index.jsx';

const SettingModel = ({ openSettingsModal, handleCancel, handleSave, selectedApp }) => {
    const [selectedGroups, setSelectedGroups] = useState([]);

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

    const handleGroupToggle = (group) => {
        setSelectedGroups(prev => {
            if (prev.includes(group)) {
                return prev.filter(g => g !== group);
            } else {
                return [...prev, group];
            }
        });
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
                            {groupNames && Array.isArray(groupNames) && groupNames.length > 0 ? (
                                groupNames.map((group, index) => (
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
                                    No groups available
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
                        onClick={() => handleSave(selectedGroups)}
                        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingModel;
