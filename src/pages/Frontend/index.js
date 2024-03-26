import React from 'react'
import { Routes, Route } from 'react-router-dom'
import NotesContextProvider from "../../context/NotesContext";
import StickyWall from "./stickyWall"
import Today from "./today"
import Upcoming from "./upcoming"
import Calendar from "./calendar"
import ListType from './list'
import { Col, Row } from 'antd'
import Sidebar from '../../component/Sidebar'
import SidebarB from '../../component/SidebarB';
import { Content } from 'antd/es/layout/layout'
import {
  MenuOutlined
} from '@ant-design/icons';
import ListContextProvider from '../../context/ListContext';
import Notes from './notes';
export default function index() {
  const showMenu = () => {
    document.getElementById("sider").style.display = "block";
  }

  return (
    <>
      <div>
        <Row style={{
          height: "100vh",
          padding: "20px 10px",
        }}>
          <ListContextProvider>
            <NotesContextProvider>
              <Col xl={5} lg={5} md={7} sm={9} >
                <Sidebar />
                <SidebarB />
              </Col>
              <Col xl={19} lg={19} md={17} sm={15} xs={24}>
                {/* Header */}
                <Row style={{
                  padding: "0 20px",
                }}>
                  <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                    <Row>
                      <Col xl={0} lg={0} md={0} sm={0} xs={4}>
                        <button className='btn btn-primary menu' onClick={showMenu}><MenuOutlined /></button>
                      </Col>
                      <Col xl={24} lg={24} md={24} sm={24} xs={20}>
                        <h2>Sticky Notes 📓✏ </h2>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                {/* Content */}
                <Row style={{
                  padding: "10px",
                }}>
                  <Content>
                    {/* <ListContextProvider> */}
                    <Routes>
                      <Route path="/" element={<StickyWall />} />
                      <Route path="today" element={<Today />} />
                      <Route path="upcoming" element={<Upcoming />} />
                      <Route path="calendar" element={<Calendar />} />
                      <Route path="list/:id" element={<ListType />} />
                      <Route path="notes/:id" element={<Notes />} />
                    </Routes>
                    {/* </ListContextProvider> */}
                  </Content>
                </Row>
              </Col>
            </NotesContextProvider>
          </ListContextProvider>
        </Row>
      </div>

    </>
  )
}
