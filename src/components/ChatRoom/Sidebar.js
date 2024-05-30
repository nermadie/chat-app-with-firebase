import { Col, Row } from "antd";
import React from "react";
import UserInfo from "./UserInfo";
import RoomList from "./RoomList";
import styled from "styled-components";

const SidebarStyled = styled.div`
  background-color: #3f0e40;
  height: 100vh;
  color: white;
`;

export default function Sidebar() {
  return (
    <SidebarStyled>
      <Row>
        <Col span={24}>
          <UserInfo />
        </Col>
        <Col span={24}>
          <RoomList />
        </Col>
      </Row>
    </SidebarStyled>
  );
}
