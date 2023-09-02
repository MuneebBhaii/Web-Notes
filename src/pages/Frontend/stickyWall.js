import React, { useEffect, useState } from 'react';
import { Button, Modal, Typography, Divider, Form, Input, Select, DatePicker, ColorPicker, Row, Col, message } from 'antd';
import { doc, setDoc, collection, getDocs, deleteDoc, query, where } from 'firebase/firestore';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { firestore } from '../../config/firebase';
import { useAuthContext } from '../../context/AuthContext'
const initialstate = { title: '', list: '', date: '', color: '#1677FF', description: '' }
export default function StickyWall() {
  const { user } = useAuthContext()
  const [getList, setlist] = useState("")
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(initialstate)
  const [notes, setNotes] = useState([])
  const {Option} = Select;
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
    console.log(state)
    const { title, description, date, color } = state
    if (!title) { return message.error("give at least title") }
    const todo = {
      title, list:getList, description, date, color,
      id: Math.random().toString(36).slice(2),
      createdBy: {
        email: user.email,
        uid: user.uid,
      }
    }
    // if (!todo.list) { return message.error("select list type") }
    try {
      await setDoc(doc(firestore, "notes", todo.id), todo);
      message.success("A new notes added successfully")
    } catch (e) {
      message.error("try again ", e);
    }
    setState(initialstate)
  };

  const fatchDocument = async () => {

    const q = query(collection(firestore, "notes"), where("createdBy.uid", "==", user.uid))
    // const querySnapshot = await getDocs(collection(firestore, "notes"));
    const querySnapshot = await getDocs(q);
    let array = []
    querySnapshot.forEach((doc) => {
      let data = doc.data()
      data.id = doc.id
      array.push(data)
      // console.log(`${doc.id} => ${doc.data()}`);
    })
    setNotes(array)
    setlist(null)
  }

  useEffect(() => {
    fatchDocument()
  }, [notes])
  const handleCancel = () => {
    setOpen(false);
    message.error("cancel notes")
  };
  //  get input field value
  const handleChange = e => {
    setState(s => ({ ...s, [e.target.name]: e.target.value }))
    console.log(state)
  }
  const handleDate = (_, date) => {
    setState(s => ({ ...s, date }))
  }
  const handleColor = (_, color) => {
    setState(s => ({ ...s, color }))
  }
  const deleteNote = async (note) => {
    await deleteDoc(doc(firestore, "notes", note.id));
    message.success("Note deleted successfully")
  }
  const editNote = async (note) => {
    
    await setDoc(doc(firestore, "notes", note.id), {
      title: "kia hall hai"
    }, { merge: true });
    message.success("Note update successfully")
  }
  return (
    <>
    <div className="container mt-3">
      <div className="row">
      {notes.map((note, i) => {
        return(
          <div className="col-12 mb-2 col-sm-6  col-md-4 col-lg-3 mb-md-3">
           <div className='' style={{ padding: '8px', borderRadius: 8 , height: '200px', backgroundColor: note.color }} key={i}><Row><Col span={20}><h5 className=''>{note.title}</h5></Col><Col span={4}><EditOutlined className='editOption' onClick={() => { editNote(note) }} /><DeleteOutlined className='deleteOption' onClick={() => { deleteNote(note) }} /></Col></Row><span>{note.list}</span><p className='textmanage'>{note.description}</p><br /><p className='date'>{note.date}</p></div>
           </div>
      )})}
      <div className='col-12 mb-2 col-sm-6  col-md-4 col-lg-3 mb-md-3'>
      <div className='bg-secondary' style={{ height: '200px', borderRadius: 8 , display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', }} onClick={showModal}>
        <PlusOutlined />
      </div>
      </div>
      </div>
    </div>
      <Modal
        open={open}
        // title="Create notes"
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
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="p-1 p-md-2">
                <Typography.Title level={2} className="m-0 text-center font-italic bg-transparent">Add Notes</Typography.Title>
                <Divider className='mt-2' />
                <Form layout='vertical'>
                  <Form.Item label='Title' className='mb-2'>
                    <Input placeholder='Title' value={state.title} name='title' onChange={handleChange} />
                  </Form.Item>
                  <Form.Item label='Select list type' className='mb-2' >
                    <Select placeholder="Select list" onChange={list =>{ setlist(list)}}>
                      {["Personal", "Work"].map((list, i) => {
                        return <Option key={i} value={list} >{list}</Option>
                      })}
                    </Select>
                  </Form.Item>
                  <Row>
                    <Col xs={24} sm={12}>
                      <Form.Item label='Select Date' className='mb-2'>
                        <DatePicker className='w-100' onChange={handleDate} />
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item label="Select Color" className='mx-sm-5 mb-2'>
                        <ColorPicker onChange={handleColor} value={state.color} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item label='Description' className='mb-0'>
                    <Input.TextArea placeholder='Notes description' value={state.description} name='description' onChange={handleChange} />
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </Modal>

    </>
  )
}
