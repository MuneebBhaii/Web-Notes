import React, { useContext, useEffect, useState } from 'react'
import { signOut } from "firebase/auth";
import { firestore, auth } from '../config/firebase';
import { Divider, Menu, Typography, Badge, Modal, Button, Form, Input, ColorPicker, message } from 'antd'
import { DeleteOutlined } from "@ant-design/icons"
import { AuthContext, useAuthContext } from "../context/AuthContext"
import { useListContext } from '../context/ListContext';
import { deleteDoc, doc, query, setDoc, where, collection, getDocs, } from "firebase/firestore";
import { Link, useNavigate } from 'react-router-dom';
import {
    PlusOutlined,
    DoubleRightOutlined,
    MenuUnfoldOutlined,
    CalendarOutlined,
    FileOutlined,
    MenuOutlined,
    UserDeleteOutlined,
} from '@ant-design/icons';
import { Layout } from 'antd';
import { useNotesContext } from '../context/NotesContext';
const { Sider } = Layout;
const initialstate = { name: '', color: '#1677FF' }
export default function Siderpart() {
    const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext)
    const { user } = useAuthContext();
    const { lists, setLists } = useListContext()
    const [state, setState] = useState(initialstate)
    const { Notes, setNotes } = useNotesContext()
    const [loading, setLoading] = useState(false);
    const [openpopup, setOpenpopup] = useState(false);
    const [openDeletepop, setOpenDeletepop] = useState(false);
    const [deleteList, setDeleteList] = useState({})
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
    const showModal = () => {
        setOpenpopup(true);
    };
    const handleOk = async () => {
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
            await setDoc(doc(firestore, "lists", userList.id), userList);
            setLists(li => ([...li, userList]))
            message.success("A new notes added successfully")
        } catch (e) {
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

    // listpopupDelete model 
    const listpopupDelete = (list) => {
        setOpenDeletepop(true)
        setDeleteList(list)
    }

    const handleDeleteList = async () => {
        // list delete from tempararily
        const currentList = lists.filter(listAll => listAll.id != deleteList.id)
        setLists(currentList)
        setOpenDeletepop(false)
        // notes delete from tempararily. is list kay  
        const deleteThisNotesAfter = Notes.filter(noteAll => noteAll.list != deleteList.name)
        setNotes(deleteThisNotesAfter)
        navigate("/")
        message.success("Delete List successfully")
        // list delete from parmanenetly from database
        await deleteDoc(doc(firestore, "lists", deleteList.id))
        // notes delete from parmanenetly from database. jo jo is list ka tha
        const todoref = collection(firestore, "notes");
        const listNameToDelete = deleteList.name;
        const queryRef = query(todoref, where("list", "==", listNameToDelete));
        getDocs(queryRef)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    deleteDoc(doc.ref)
                });
            })
    }
    return (
        <Sider>
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
                                <Link to={`list/${list.id}`}><li className='list-group-item bg-light my-1 rounded '><Badge color={list.color} text={list.name} />{i >= 2 ? <DeleteOutlined className='float-end p-1 text-danger' onClick={() => { listpopupDelete(list) }} /> : ""}</li></Link>
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
            {/* list delete popup */}
            <Modal
                open={openDeletepop}
                title="Delete list"
                onOk={handleDeleteList}
                onCancel={() => { setOpenDeletepop(false) }}
                footer={[
                    <Button key="back" onClick={() => { setOpenDeletepop(false) }}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={handleDeleteList}>
                        Delete
                    </Button>
                ]}
            >
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <h6>You are sure to delete this list and his notes permanently.</h6>
                        </div>
                    </div>
                </div>
            </Modal >
        </Sider >

    )
}
