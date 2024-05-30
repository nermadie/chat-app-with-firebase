import { Avatar, Form, Modal, Select, Spin } from "antd";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../Context/AppProvider";
import { debounce } from "lodash";
import { db } from "../../firebase/config";

function DebounceSelect({ fetchOptions, debounceTimeout = 300, ...props }) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      setOptions([]);
      setFetching(true);

      fetchOptions(value, props.currentmembers).then((newOptions) => {
        setOptions(newOptions);
        setFetching(false);
      });
    };
    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout, fetchOptions, props]);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}>
      {
        // [(label, value, photoURL), (label, value, photoURL), ...]
        options.map((opt) => (
          <Select.Option key={opt.value} value={opt.value} title={opt.label}>
            <Avatar size="small" src={opt.photoURL}>
              {opt.photoURL ? "" : opt.displayName?.charAt(0).toUpperCase()}
            </Avatar>
            {`${opt.label}`}
          </Select.Option>
        ))
      }
    </Select>
  );
}

function fetchUserList(search, currentmembers) {
  return db
    .collection("users")
    .where("keywords", "array-contains", search.toLowerCase())
    .orderBy("displayName")
    .limit(20)
    .get()
    .then((snapshot) => {
      return snapshot.docs
        .map((doc) => ({
          label: doc.data().displayName,
          value: doc.data().uid,
          photoURL: doc.data().photoURL,
        }))
        .filter((opt) => currentmembers.includes(opt.value) === false);
    });
}

export default function InviteMemberModal() {
  const {
    isInviteMemberVisible,
    setIsInviteMemberVisible,
    selectedRoomId,
    selectedRoom,
  } = useContext(AppContext);

  const [value, setValue] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isInviteMemberVisible) {
      form.resetFields();
    }
  }, [form, isInviteMemberVisible]);

  const handleOk = () => {
    //handle logic here
    //add new room to firestore
    const roomRef = db.collection("rooms").doc(selectedRoomId);
    roomRef.update({
      members: [...selectedRoom.members, ...value.map((val) => val.value)],
    });
    setIsInviteMemberVisible(false);
  };
  const handleCancel = () => {
    setIsInviteMemberVisible(false);
  };

  return (
    <div>
      <Modal
        title="Invite Member"
        open={isInviteMemberVisible}
        onOk={handleOk}
        onCancel={handleCancel}>
        <Form form={form} layout="vertical">
          <DebounceSelect
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="Select members to invite"
            value={value}
            fetchOptions={fetchUserList}
            onChange={(newValue) => setValue(newValue)}
            currentmembers={selectedRoom.members}
            notFoundContent="No user found"
          />
        </Form>
      </Modal>
    </div>
  );
}
