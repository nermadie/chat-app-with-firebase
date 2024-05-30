import { Form, Modal } from "antd";
import Input from "antd/es/input/Input";
import React, { useContext, useEffect } from "react";
import { AppContext } from "../../Context/AppProvider";
import { addDocument } from "../../firebase/services";
import { AuthContext } from "../../Context/AuthProvider";

export default function AddRoomModal() {
  const { isAddRoomVisible, setIsAddRoomVisible } = useContext(AppContext);
  const {
    user: { uid },
  } = useContext(AuthContext);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isAddRoomVisible) {
      form.resetFields();
    }
  }, [form, isAddRoomVisible]);

  const handleOk = () => {
    //handle logic here
    //add new room to firestore
    addDocument("rooms", { ...form.getFieldsValue(), members: [uid] });
    setIsAddRoomVisible(false);
  };
  const handleCancel = () => {
    setIsAddRoomVisible(false);
  };
  return (
    <div>
      <Modal
        title="Create Room"
        open={isAddRoomVisible}
        onOk={handleOk}
        onCancel={handleCancel}>
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name">
            <Input placeholder="Input room name..." />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea placeholder="Input description..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
