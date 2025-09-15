import React from "react";
import { Modal, Typography, Space, Button } from "antd";
import { ExclamationCircleOutlined, DeleteOutlined, CloseOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

const DeleteConfirmation = ({ 
  visible, 
  onClose, 
  onConfirm, 
  title = "Delete Feature",
  description = "Are you sure you want to delete this feature? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel"
}) => {
  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <ExclamationCircleOutlined className="text-red-500 text-lg" />
          <span className="text-red-600">{title}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={500}
      centered
      destroyOnClose
    >
      <div className="space-y-6">
        <div className="text-center">
          <ExclamationCircleOutlined className="text-red-500 text-6xl mb-4" />
          <Title level={4} className="!mb-2 text-gray-800">
            Confirm Deletion
          </Title>
          <Text className="text-gray-600 text-base">
            {description}
          </Text>
        </div>

        <Space className="w-full justify-end">
          <Button 
            onClick={onClose}
            icon={<CloseOutlined />}
            size="large"
            className="px-6"
          >
            {cancelText}
          </Button>
          <Button
            danger
            type="primary"
            icon={<DeleteOutlined />}
            onClick={onConfirm}
            size="large"
            className="px-6"
          >
            {confirmText}
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default DeleteConfirmation;