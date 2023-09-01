import React, { useContext, useEffect, useState } from 'react'
import { signOut } from "firebase/auth";
import { firestore,auth } from '../config/firebase';
import { Divider, Menu, Typography, Badge, Modal, Button, Form, Input, ColorPicker, message } from 'antd'
import { AuthContext, useAuthContext } from "../context/AuthContext"
import { collection, query, getDocs, doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusOutlined,
  DoubleRightOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  CalendarOutlined,
  FileOutlined,
  MenuOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons';
import { Layout } from 'antd';
const { Sider } = Layout;
const initialstate = { name: '', color: '#1677FF' }
export default function Sidebar() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext)
  const {user} = useAuthContext();
  const [state, setState] = useState(initialstate)
  const [loading, setLoading] = useState(false);
  const [openpopup, setOpenpopup] = useState(false);
  const [lists, setLists] = useState([])
  const navigate = useNavigate()

  const logoutUser = () => {
    signOut(auth)
      .then(() => {
        console.log("signout successfully")
        setIsAuthenticated(false)

      })
      .catch((error) => {
        console.error(error)
      });
  }
  const getList = async () => {
    const q = query(collection(firestore, "lists"));
    const array = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      array.push(doc.data());
    });
    setLists(array);
  }
  useEffect(() => {
    getList()
  }, [])
  const showModal = () => {
    setOpenpopup(true);
  };
  const handleOk = async() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpenpopup(false);
    }, 3000);
    const { name, color } = state
    let userList = {
      name, color,
      id: Math.random().toString(36).slice(2),
      createdBy: {
        uid: user.uid,
      }
    }
    // Add a new document in collection "cities"
    if (!userList.name) { return message.error("enter list Name") }
    try {
      await setDoc(doc(firestore, "lists" , userList.id), userList);
      message.success("A new notes added successfully")
    }catch (e) {
      message.error("Error adding document: ", e);
    }
    setState(initialstate)
  };
  const handleCancel = () => {
    setOpenpopup(false);
  };
  const handleChange = e => {
    setState(s => ({ ...s, [e.target.name]: e.target.value }))
  }

  const handleColor = (_, color) => {
    setState(s => ({ ...s, color }))
  }
  // silder bar
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <>
      {/* <div className="p-2"> */}
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 30,
          top: 20,
          bottom: 0,
        }}
      >
        <div className="container d-flex">
          <div className="row">
            <div className="col">
              <h3>Menu</h3>
            </div>
            <div className="col">
              <Button
                type="primary"
                // onClick={toggleCollapsed}
                style={{
                  marginBottom: 16,
                }}
              >
                {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              </Button>
            </div>
          </div>
        </div>
        <Divider />
        <Typography.Title level={5}>TASKS</Typography.Title>
        <Menu className='bg-light'
          onClick={({ key }) => {
            navigate(key)
          }}
          style={{
            fontSize: '15px',
          }}
          items={[
            {
              label: 'Upcoming',
              key: '/upcoming',
              icon: <DoubleRightOutlined />
            },
            {
              label: 'Today',
              key: '/today',
              icon: <MenuUnfoldOutlined />
            },
            {
              label: 'Calendar',
              key: '/calendar',
              icon: <CalendarOutlined />
            },
            {
              label: 'Stickywall',
              key: '/',
              icon: <FileOutlined />
            },
          ]}
        />
        <Divider />
        <Typography.Title level={5}>LISTS</Typography.Title>
        <div className="List-div scroll-hide">
          <ul className='list-group'>
            {lists.map((list, i) => {
              return (
                <div key={i}>
                  <Link to={`list/${list.id}`}><li className='list-group-item bg-light my-1 rounded'><Badge color={list.color} text={list.name} /></li></Link>
                </div>
              )
            })}
          </ul>
          <Button className='w-100 d-flex justify-content-center align-items-center' onClick={showModal} ><PlusOutlined /> Add new list</Button>
          <Modal
            open={openpopup}
            title="Add new list"
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                Submit
              </Button>
            ]}
          >
            <Form.Item label='List Name'>
              <Input placeholder='List Name' name='name' value={state.name} onChange={handleChange} className='mt-1' />
            </Form.Item>
            <Form.Item label='Select Color'>
              <ColorPicker className='mt-1' value={state.color} onChange={handleColor} />
            </Form.Item>
          </Modal>
        </div>
        <Menu className='bg-light mt-3'
          onClick={({ key }) => {
            if (key === 'logout') {
              logoutUser()
            } else {
              navigate(key)
            }
          }}
          style={{
            fontSize: '15px',
          }}
          items={[
            {
              label: 'Setting',
              // key: '',
              icon: <MenuOutlined />
            },
            {
              label: 'Logout',
              key: 'logout',
              icon: <UserDeleteOutlined />
            },

          ]}
        />
      </Sider>
      {/* </div> */}
    </>
  )
}
