import React from 'react'
import Siderpart from "./Siderpart"
import close from '../asets/image/close.png'
import { Layout } from 'antd';
const { Sider } = Layout;
export default function Sidebar() {
  const closeMenu = () => {
    document.getElementById("sider").style.display = 'none'
  }

  return (
    <>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 10,
          top: 20,
          bottom: 0,
        }}
        className='siderScroll'
        id='sider'
      >
        <div className="container d-flex">
          <div className="row">
            <div className="col menu_part">
              <h3>Menu</h3>
              <button className='close' onClick={closeMenu}><img src={close} alt="close_Menu" /></button>
            </div>
          </div>
        </div>
        <Siderpart />
      </Sider>
    </>
  )
}
