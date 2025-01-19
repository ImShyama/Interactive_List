import { GoInfo } from "react-icons/go";
import { useState } from "react";
import { Popover } from "antd";
import "antd/dist/reset.css"; // Ensure Ant Design styles are imported

const Info = ({info}) => {
    const [visible, setVisible] = useState(false);

    const handleVisibleChange = (newVisible) => {
        setVisible(newVisible);
    };

    return (
        <div>
            <Popover
                content={<div style={{ maxWidth: "300px" }}><span>{info}</span></div>}
                trigger="click"
                visible={visible}
                onVisibleChange={handleVisibleChange}
                placement="bottom"
            >
                <GoInfo
                    style={{
                        color: "gray",
                        fontSize: "20px",
                        cursor: "pointer",
                        transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => e.target.style.color = "var(--primary-color)"}
                    onMouseLeave={(e) => e.target.style.color = "gray"}
                />
            </Popover>
        </div>
    );
};

export default Info;
