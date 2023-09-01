import React from 'react'
import { Routes, Route } from 'react-router-dom'
import StickyWall from "./stickyWall"
import Today from "./today"
import Upcoming from "./upcoming"
import Calendar from "./calendar"
import ListType from './list'
import { Col, Row } from 'antd'
import Sidebar from '../../component/Sidebar'
import { Content } from 'antd/es/layout/layout'
export default function index() {
  return (
    <>
      <div>
        <Row style={{
          height: "100vh",
          padding: 20,
        }}>
          <Col span={5}>
            <Sidebar />
          </Col>
          <Col span={19}>
            {/* Header */}
            <Row>
              <Col>
              <h2>
                Sticky Notes 📓✏
              </h2>
              </Col>
            </Row>
            {/* Content */}
            <Row>
              <Content>
                <Routes>
                  <Route path="/" element={<StickyWall />} />
                  <Route path="today" element={<Today />} />
                  <Route path="upcoming" element={<Upcoming />} />
                  <Route path="calendar" element={<Calendar />} />
                  <Route path="list/:id" element={<ListType />} />
                </Routes>
              </Content>
            </Row>
          </Col>
        </Row>
      </div>

    </>
  )
}
