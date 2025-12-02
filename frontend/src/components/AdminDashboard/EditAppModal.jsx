import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchGroupNames } from '../../APIs/index.jsx';
import { Input, Upload, message } from 'antd';
import { UploadOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;

const EditAppModal = ({ openModal, handleCancel, handleSave, selectedApp }) => {
    const [formData, setFormData] = useState({
        appName: '',
        appView: '',
        appImg: '',
        description: '',
        appID: '',
        spreadSheetName: '',
        overview: '',
        multipleImage: [],
        allowedGroups: [],
        show: true,
        standOut: []
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadingMultiple, setUploadingMultiple] = useState(false);

    // React Query to fetch group names
    const { data: groupNames, isLoading, error } = useQuery({
        queryKey: ['groupNames'],
        queryFn: fetchGroupNames,
        enabled: openModal,
    });

    // Initialize form data when selectedApp changes
    useEffect(() => {
        if (selectedApp) {
            setFormData({
                appName: selectedApp.appName || '',
                appView: selectedApp.appView || '',
                appImg: selectedApp.appImg || '',
                description: selectedApp.description || '',
                appID: selectedApp.appID || '',
                spreadSheetName: selectedApp.spreadSheetName || '',
                overview: selectedApp.overview || '',
                multipleImage: selectedApp.multipleImage || [],
                allowedGroups: selectedApp.allowedGroups || [],
                show: selectedApp.show !== undefined ? selectedApp.show : true,
                standOut: selectedApp.standOut || []
            });
        }
    }, [selectedApp]);

    // Filter groups based on search term
    const filteredGroups = groupNames && Array.isArray(groupNames)
        ? groupNames.filter(group =>
            group.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleGroupToggle = (group) => {
        setFormData(prev => {
            const currentGroups = prev.allowedGroups || [];
            if (currentGroups.includes(group)) {
                return {
                    ...prev,
                    allowedGroups: currentGroups.filter(g => g !== group)
                };
            } else {
                return {
                    ...prev,
                    allowedGroups: [...currentGroups, group]
                };
            }
        });
    };

    // Handle main image upload
    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "Logo_Images");
        formData.append("folder", "app-images");

        try {
            setUploading(true);
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/dq6cfckdm/image/upload`,
                formData
            );
            const uploadedUrl = res.data.secure_url;
            handleInputChange('appImg', uploadedUrl);
            message.success('Image uploaded successfully!');
        } catch (err) {
            console.error("Upload error:", err);
            message.error("Image upload failed.");
        } finally {
            setUploading(false);
        }
        return false; // Prevent AntD auto upload
    };

    // Handle multiple images upload
    const handleMultipleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "Logo_Images");
        formData.append("folder", "app-images");

        try {
            setUploadingMultiple(true);
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/dq6cfckdm/image/upload`,
                formData
            );
            const uploadedUrl = res.data.secure_url;
            setFormData(prev => ({
                ...prev,
                multipleImage: [...(prev.multipleImage || []), uploadedUrl]
            }));
            message.success('Image added successfully!');
        } catch (err) {
            console.error("Upload error:", err);
            message.error("Image upload failed.");
        } finally {
            setUploadingMultiple(false);
        }
        return false;
    };

    const removeMultipleImage = (index) => {
        setFormData(prev => ({
            ...prev,
            multipleImage: prev.multipleImage.filter((_, i) => i !== index)
        }));
    };

    // Handle standOut array editing
    const handleStandOutKeyChange = (index, newKey) => {
        setFormData(prev => {
            const newStandOut = [...(prev.standOut || [])];
            const currentItem = newStandOut[index] || {};
            const currentValue = Object.values(currentItem)[0] || '';
            // Remove old key and add new key with same value
            newStandOut[index] = { [newKey]: currentValue };
            return {
                ...prev,
                standOut: newStandOut
            };
        });
    };

    const handleStandOutValueChange = (index, newValue) => {
        setFormData(prev => {
            const newStandOut = [...(prev.standOut || [])];
            const currentItem = newStandOut[index] || {};
            const currentKey = Object.keys(currentItem)[0] || '';
            newStandOut[index] = { [currentKey]: newValue };
            return {
                ...prev,
                standOut: newStandOut
            };
        });
    };

    const addStandOutItem = () => {
        setFormData(prev => ({
            ...prev,
            standOut: [...(prev.standOut || []), { 'New Feature': '' }]
        }));
    };

    const removeStandOutItem = (index) => {
        setFormData(prev => ({
            ...prev,
            standOut: prev.standOut.filter((_, i) => i !== index)
        }));
    };

    const handleSaveClick = async () => {
        setIsSaving(true);
        try {
            await handleSave(formData);
        } catch (error) {
            console.error('Error saving app:', error);
            message.error('Failed to save app');
        } finally {
            setIsSaving(false);
        }
    };

    if (!openModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Dimmed background */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={handleCancel}
            />

            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Edit App
                </h1>

                <div className="space-y-4">
                    {/* App Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            App Name *
                        </label>
                        <Input
                            value={formData.appName}
                            onChange={(e) => handleInputChange('appName', e.target.value)}
                            placeholder="Enter app name"
                        />
                    </div>

                    {/* App View */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            App View *
                        </label>
                        <Input
                            value={formData.appView}
                            onChange={(e) => handleInputChange('appView', e.target.value)}
                            placeholder="e.g., ProductCataloguePreview"
                        />
                    </div>

                    {/* App Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            App Image *
                        </label>
                        <div className="flex items-center gap-4">
                            {formData.appImg && (
                                <img
                                    src={formData.appImg}
                                    alt="App preview"
                                    className="w-32 h-20 object-contain border border-gray-300 rounded"
                                />
                            )}
                            <Upload
                                beforeUpload={handleImageUpload}
                                showUploadList={false}
                                accept="image/*"
                            >
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                                    disabled={uploading}
                                >
                                    {uploading ? 'Uploading...' : 'Upload Image'}
                                </button>
                            </Upload>
                        </div>
                        <Input
                            value={formData.appImg}
                            onChange={(e) => handleInputChange('appImg', e.target.value)}
                            placeholder="Or enter image URL directly"
                            className="mt-2"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                        </label>
                        <TextArea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Enter app description"
                            rows={3}
                        />
                    </div>

                    {/* App ID */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            App ID (Google Sheet ID) *
                        </label>
                        <Input
                            value={formData.appID}
                            onChange={(e) => handleInputChange('appID', e.target.value)}
                            placeholder="Enter Google Sheet ID"
                        />
                    </div>

                    {/* Spreadsheet Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Spreadsheet Name *
                        </label>
                        <Input
                            value={formData.spreadSheetName}
                            onChange={(e) => handleInputChange('spreadSheetName', e.target.value)}
                            placeholder="e.g., Data"
                        />
                    </div>

                    {/* Overview */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Overview *
                        </label>
                        <TextArea
                            value={formData.overview}
                            onChange={(e) => handleInputChange('overview', e.target.value)}
                            placeholder="Enter app overview"
                            rows={4}
                        />
                    </div>

                    {/* Multiple Images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Multiple Images
                        </label>
                        <div className="space-y-2 mb-2">
                            {formData.multipleImage?.map((img, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <img
                                        src={img}
                                        alt={`Preview ${index + 1}`}
                                        className="w-24 h-16 object-contain border border-gray-300 rounded"
                                    />
                                    <Input
                                        value={img}
                                        onChange={(e) => {
                                            const newMultipleImage = [...(formData.multipleImage || [])];
                                            newMultipleImage[index] = e.target.value;
                                            handleInputChange('multipleImage', newMultipleImage);
                                        }}
                                        placeholder="Image URL"
                                        className="flex-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeMultipleImage(index)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                        <Upload
                            beforeUpload={handleMultipleImageUpload}
                            showUploadList={false}
                            accept="image/*"
                        >
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                                disabled={uploadingMultiple}
                            >
                                {uploadingMultiple ? 'Uploading...' : <><PlusOutlined /> Add Image</>}
                            </button>
                        </Upload>
                    </div>

                    {/* Allowed Groups */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Select Allowed Groups
                        </label>

                        {/* Search input */}
                        <div className="mb-3">
                            <Input
                                type="text"
                                placeholder="Search groups..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
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
                                                checked={formData.allowedGroups?.includes(group)}
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

                        {formData.allowedGroups?.length > 0 && (
                            <div className="mt-3">
                                <div className="text-sm text-gray-600 mb-2">Selected groups:</div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.allowedGroups.map((group, index) => (
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

                    {/* Show/Hide Toggle */}
                    <div>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={formData.show}
                                onChange={(e) => handleInputChange('show', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="text-sm font-medium text-gray-700">Show App</span>
                        </label>
                    </div>

                    {/* Stand Out Features */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stand Out Features
                        </label>
                        {formData.standOut?.map((item, index) => {
                            const key = Object.keys(item)[0] || '';
                            const value = item[key] || '';
                            return (
                                <div key={index} className="mb-3 p-3 border border-gray-200 rounded">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600">Feature {index + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeStandOutItem(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <DeleteOutlined />
                                        </button>
                                    </div>
                                    <Input
                                        placeholder="Feature title"
                                        value={key}
                                        onChange={(e) => handleStandOutKeyChange(index, e.target.value)}
                                        className="mb-2"
                                    />
                                    <TextArea
                                        placeholder="Feature description"
                                        value={value}
                                        onChange={(e) => handleStandOutValueChange(index, e.target.value)}
                                        rows={2}
                                    />
                                </div>
                            );
                        })}
                        <button
                            type="button"
                            onClick={addStandOutItem}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                            <PlusOutlined /> Add Feature
                        </button>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
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
                        <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditAppModal;

