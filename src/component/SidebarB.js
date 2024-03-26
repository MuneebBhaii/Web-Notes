import React from 'react'
import Siderpart from "./Siderpart"
import { Layout } from 'antd';
const { Sider } = Layout;
export default function Sidebar() {

  return (
    <>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 30,
          top: 20,
          bottom: 0,
        }}
        className='siderScroll'
        id='siderBlock'
      >
        <div className="container d-flex">
          <div className="row">
            <div className="col menu_part">
              <h3>Menu</h3>
            </div>
          </div>
        </div>
        <Siderpart />
      </Sider>
    </>
  )
}
