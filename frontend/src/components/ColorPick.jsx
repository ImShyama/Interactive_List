import React, { useState } from 'react';
import { Form, ColorPicker, Button } from 'antd';

const ColorPick = () => {
  // State for background and text color
  const [backgroundColor, setBackgroundColor] = useState('#ffffff'); // default white
  const [textColor, setTextColor] = useState('#000000'); // default black

  const onFinish = (values) => {
    console.log('Form Values:', values);
    console.log('Background Color:', backgroundColor);
    console.log('Text Color:', textColor);
  };

  return (
    <Form
      name="colorPickerForm"
      layout="vertical"
      onFinish={onFinish}
    >
      {/* Background Color Picker */}
      <Form.Item
        label="Background Color"
        rules={[{ required: true, message: 'Background color is required!' }]}
      >
        <ColorPicker
          value={backgroundColor}
          onChange={(color) => setBackgroundColor(color.hex)}
        />
      </Form.Item>

      {/* Text Color Picker */}
      <Form.Item
        label="Text Color"
        rules={[{ required: true, message: 'Text color is required!' }]}
      >
        <ColorPicker
          value={textColor}
          onChange={(color) => setTextColor(color.hex)}
        />
      </Form.Item>

      {/* Submit Button */}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>

      {/* Example box to show chosen colors */}
      <div
        style={{
          backgroundColor: backgroundColor,
          color: textColor,
          padding: '10px',
          marginTop: '20px',
        }}
      >
        This is an example of the chosen background and text color.
      </div>
    </Form>
  );
};

export default ColorPick;
