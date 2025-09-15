import React, { useState } from "react";
import { 
  Form, 
  Input, 
  Button, 
  Upload, 
  message, 
  Select, 
  Space,
  Typography,
  Divider
} from "antd";
import { 
  UploadOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  SaveOutlined
} from "@ant-design/icons";
import axios from "axios";
import { url } from "../../redux/store";

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const AddFeature = ({ onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");

  const success = (msg) => {
    message.success(msg);
  };

  const error = (msg) => {
    message.error(msg);
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      const formData = {
        featureName: values.featureName,
        month: values.month,
        videoUrl: videoUrl || "",
        imgUrl: imageFile ? await convertFileToUrl(imageFile) : ""
      };

      const response = await axios.post(`${url}/v4/addFeature`, formData);
      
      if (response.data.success) {
        success("Feature added successfully!");
        form.resetFields();
        setImageFile(null);
        setVideoUrl("");
        onSuccess();
      } else {
        error(response.data.message || "Failed to add feature");
      }
    } catch (err) {
      console.error("Error adding feature:", err);
      error("Failed to add feature");
    } finally {
      setLoading(false);
    }
  };

  // Convert file to URL (you can implement your own file upload logic)
  const convertFileToUrl = async (file) => {
    // This is a placeholder - implement your file upload logic here
    // You might want to use FormData to upload to your server
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  };

  // Handle image upload
  const handleImageUpload = (info) => {
    if (info.file.status === 'done') {
      setImageFile(info.file.originFileObj);
      success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      error(`${info.file.name} file upload failed.`);
    }
  };

  // Handle image removal
  const handleImageRemove = () => {
    setImageFile(null);
  };

  // Handle video URL change
  const handleVideoUrlChange = (e) => {
    setVideoUrl(e.target.value);
    if (e.target.value) {
      setImageFile(null);
    }
  };

  // Month options
  const monthOptions = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="space-y-6">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="space-y-4"
      >
        {/* Feature Name */}
        <Form.Item
          name="featureName"
          label="Feature Name"
          rules={[
            { required: true, message: "Please enter feature name" },
            { min: 3, message: "Feature name must be at least 3 characters" }
          ]}
        >
          <Input 
            placeholder="Enter feature name"
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        {/* Month */}
        <Form.Item
          name="month"
          label="Month"
          rules={[{ required: true, message: "Please select month" }]}
        >
          <Select
            placeholder="Select month"
            size="large"
            className="rounded-lg"
          >
            {monthOptions.map(month => (
              <Option key={month} value={month}>{month}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* <Divider>Media Content</Divider> */}

        {/* Video URL */}
        <Form.Item
          label="Video URL (Optional)"
          help="Enter a YouTube, Vimeo, or direct video link"
        >
          <Input
            placeholder="https://youtube.com/watch?v=..."
            value={videoUrl}
            onChange={handleVideoUrlChange}
            size="large"
            className="rounded-lg"
          />
        </Form.Item>

        {/* Image Upload */}
        <Form.Item
          label="Image Upload (Optional)"
          help="Upload an image to showcase the feature"
        >
          <div className="space-y-3">
            {!imageFile ? (
              <Upload
                accept="image/*"
                showUploadList={false}
                customRequest={({ file, onSuccess }) => {
                  setTimeout(() => {
                    onSuccess("ok");
                  }, 0);
                }}
                onChange={handleImageUpload}
              >
                <Button 
                  // icon={<UploadOutlined />} 
                  size="large"
                  className="w-full h-32 border-dashed border-2 border-gray-300 hover:border-blue-500 rounded-lg"
                >
                  <div className="space-y-2">
                    <UploadOutlined className="text-2xl text-gray-400" />
                    <div className="text-gray-600">
                      Click to upload image
                    </div>
                    <div className="text-xs text-gray-400">
                      PNG, JPG, GIF up to 10MB
                    </div>
                  </div>
                </Button>
              </Upload>
            ) : (
              <div className="relative">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
                <Button
                  icon={<DeleteOutlined />}
                  danger
                  size="small"
                  onClick={handleImageRemove}
                  className="absolute top-2 right-2"
                />
              </div>
            )}
          </div>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item className="!mb-0">
          <Space className="w-full justify-end">
            <Button 
              onClick={onClose}
              size="large"
              className="px-8"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
              size="large"
              style={{
                background: "#334155",
                borderColor: "#334155"
              }}
              className="hover:bg-[#475569] px-8"
            >
              {loading ? "Adding..." : "Add Feature"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddFeature;
