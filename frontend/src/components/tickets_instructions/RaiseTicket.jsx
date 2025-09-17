import React, { useContext, useState } from "react";
import { Button, Modal, Input, Select, Upload, Row, Col, Tooltip, message } from "antd";
import { UploadOutlined, MessageOutlined, UserOutlined, MailOutlined, PhoneOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
// import { url } from "../../redux/store";
import "./RaiseTicket.css";
const { TextArea } = Input;
import { HOST } from "../../utils/constants";

const RaiseTicket = ({ open, handleClose }) => {
  // const { user: loginUser } = useSelector((state) => state.auth);
  const loginUser = useSelector((state) => state?.auth?.user) || {};

  const [formValues, setFormValues] = useState({
    customerName: loginUser?.name || "",
    customerEmail: loginUser?.email || "",
    issueStatement: "",
    priorityLevel: "",
    phone: "",
    sheets: "Meet",
  });
  const [file, setFile] = useState(null);
  const [ticketApiResponse, setTicketApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState(null); // store uploaded file URL
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (file) => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Logo_Images"); // ✅ Cloudinary preset
      formData.append("folder", "tickets"); // ✅ Folder for screenshots

      try {
        setUploading(true);
        const res = await axios.post(
          `https://api.cloudinary.com/v1_1/dq6cfckdm/image/upload`,
          formData
        );
        const imageUrl = res.data.secure_url;
        setFileUrl(imageUrl);
        message.success("File uploaded successfully!");
      } catch (err) {
        console.error(err);
        message.error("File upload failed!");
      } finally {
        setUploading(false);
      }
    }
    return false; // prevent AntD auto upload
  };


  const handleChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setFile(reader.result);
      }
    };
    reader.readAsDataURL(file);
    return false; // Prevent auto upload by AntD
  };

  const handleSubmit = async () => {
    if (!formValues.customerName || !formValues.customerEmail || !formValues.issueStatement) {
      return message.error("Customer Name, email, and issue statement fields are required!");
    }

    const finalData = {
      "Issue Statement": formValues.issueStatement,
      customerName: formValues.customerName,
      email: formValues.customerEmail,
      "Priority Level": formValues.priorityLevel,
      phone: formValues.phone,
      sheets: formValues?.sheets || "",
    };

    if (fileUrl) {
      finalData["Upload Problem Screenshot"] = fileUrl;
    }

    setLoading(true);
    try {
      const { data: res } = await axios.post(`${HOST}/api/helpdesk/raiseTicket`, finalData);
      setTicketApiResponse(res);
      message.success(res.message);
    } catch (error) {
      message.error("Failed to submit ticket. Please try again.");
    } finally {
      setLoading(false);
      setFormValues({
        customerName: loginUser?.name || "",
        customerEmail: loginUser?.email || "",
        issueStatement: "",
        priorityLevel: "",
        phone: "",
        sheets: "Meet",
      });
      setFile(null);
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onCancel={handleClose}
        footer={null}
        centered
        width={550}
        className="raise-ticket-modal"
        title={
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#598931] rounded-full flex items-center justify-center">
              <MessageOutlined className="text-white text-base" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#598931] m-0">Raise Support Ticket</h2>
              <p className="text-gray-500 text-xs m-0">We're here to help you resolve any issues</p>
            </div>
          </div>
        }
        styles={{
          header: {
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: "12px",
            marginBottom: "12px"
          }
        }}
      >
        {!ticketApiResponse ? (
          <div className="space-y-4">
            <Row gutter={12}>
              <Col span={12}>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#334155] flex items-center gap-1">
                    <UserOutlined className="text-[#334155] text-sm" />
                    Name
                  </label>
                  <Input
                    placeholder="Enter your full name"
                    value={formValues.customerName}
                    onChange={(e) => handleChange("customerName", e.target.value)}
                    className="rounded-lg border-gray-300 hover:border-[#334155] focus:border-[#334155] focus:ring-[#334155]"
                    size="middle"
                  />
                </div>
              </Col>
              <Col span={12}>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[#334155] flex items-center gap-1">
                    <MailOutlined className="text-[#334155] text-sm" />
                    Email
                  </label>
                  <Input
                    placeholder="Enter your email address"
                    type="email"
                    value={formValues.customerEmail}
                    onChange={(e) => handleChange("customerEmail", e.target.value)}
                    className="rounded-lg border-gray-300 hover:border-[#334155] focus:border-[#334155] focus:ring-[#334155]"
                    size="middle"
                  />
                </div>
              </Col>
            </Row>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#334155] flex items-center gap-1">
                <PhoneOutlined className="text-[#334155] text-sm" />
                Phone Number
              </label>
              <Input
                placeholder="Enter your phone number"
                type="tel"
                value={formValues.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="rounded-lg border-gray-300 hover:border-[#334155] focus:border-[#334155] focus:ring-[#334155]"
                size="middle"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#334155] flex items-center gap-1">
                <ExclamationCircleOutlined className="text-[#334155] text-sm" />
                Issue Statement
              </label>
              <TextArea
                placeholder="Please describe your issue in detail..."
                rows={3}
                value={formValues.issueStatement}
                onChange={(e) => handleChange("issueStatement", e.target.value)}
                className="rounded-lg border-gray-300 hover:border-[#334155] focus:border-[#334155] focus:ring-[#334155] resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#334155]">Priority Level</label>
              <Select
                placeholder="Select priority level"
                className="w-full"
                value={formValues.priorityLevel}
                onChange={(value) => handleChange("priorityLevel", value)}
                size="middle"
                dropdownStyle={{ borderRadius: "8px" }}
              >
                <Select.Option value="Low">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Low Priority
                  </div>
                </Select.Option>
                <Select.Option value="Medium">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    Medium Priority
                  </div>
                </Select.Option>
                <Select.Option value="High">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    High Priority
                  </div>
                </Select.Option>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#334155] mr-2">Upload Screenshot (Optional)</label>

              <Upload
                beforeUpload={handleFileUpload}
                maxCount={1}
                showUploadList={true}
                className="w-full"
              >
                <Button
                  icon={<UploadOutlined />}
                  loading={uploading}
                  className="w-full h-10 border-dashed border-2 border-gray-300 hover:border-[#334155] hover:text-[#334155] rounded-lg"
                  size="middle"
                >
                  {uploading ? "Uploading..." : "Click to upload screenshot"}
                </Button>
              </Upload>

            </div>

            <div className="flex gap-3 w-full pt-4 border-t border-gray-200 footer-buttons">
              <button
                style={{ borderRadius: "50px" }}
                onClick={handleClose}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                style={{
                  borderRadius: "50px",
                  background: "linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), #598931"
                }}
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-2 px-4 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-700 transition-colors duration-200"
              >
                {loading ? "Submitting..." : "Submit Ticket"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[#334155]">Ticket Submitted Successfully!</h3>
              <p className="text-gray-600 text-sm">{ticketApiResponse?.message}</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-blue-800 text-sm">
                Ticket No.{" "}
                <span className="font-bold text-blue-600 text-base">
                  {ticketApiResponse?.ticket?.ticketNo}
                </span>{" "}
                has been generated.
              </p>
              <p className="text-blue-700 text-xs mt-1">
                You can check the status{" "}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://helpdesk.ceoitbox.com"
                  className="text-[#334155] underline font-medium hover:text-[#475569]"
                >
                  here
                </a>
                .
              </p>
            </div>

            <button
              style={{
                borderRadius: "50px",
                background: "linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), #334155"
              }}
              onClick={() => {
                handleClose();
                setTicketApiResponse(null);
              }}
              className="py-2 px-5 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-700 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RaiseTicket;

