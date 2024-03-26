import React, {useState } from 'react';
import { Button, Modal, Typography, Divider, Form, Input, Select, DatePicker, ColorPicker, Row, Col, message } from 'antd';
import { doc, setDoc, deleteDoc} from 'firebase/firestore';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { firestore } from '../../config/firebase';
import { useAuthContext } from '../../context/AuthContext';
// context
import { useNotesContext } from '../../context/NotesContext';
import dayjs from 'dayjs';
import { useListContext } from '../../context/ListContext';
import { Link } from 'react-router-dom';

const initialstate = { title: '', list: "" , date: "", color: '#1677FF', description: '' }
export default function StickyWall() {
  const { user } = useAuthContext()
  const { lists, setLists } = useListContext()
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [state, setState] = useState(initialstate)
  const [edit, setEdit] = useState(initialstate)
  const { Notes, setNotes } = useNotesContext()
  const { Option } = Select;
  const showModal = () => {
    setOpen(true);
  };
  const editModal = () => {
    setEditOpen(true);
  };
  const handleOk = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 1000);
    console.log(state)
    const { title,list, description, date , color } = state
    if (!title) { return message.error("give at least title") }
    if (!list) { return message.error("add list type") }
    const todo = {
      title, list, description, date, color,
      id: Math.random().toString(36).slice(2),
      createdBy: {
        email: user.email,
        uid: user.uid,
      }
    }
    if (!todo.list) { return message.error("select list type") }
    try {
      // add notes in user interface quickly 
      setNotes(s=>([...s , todo]))
      message.success("A new notes added successfully")
      // add notes in firebase 
      await setDoc(doc(firestore, "notes", todo.id), todo);
    } catch (e) {
      message.error("try again ");
    }
    setState(initialstate)
  };


  const handleCancel = () => {
    setOpen(false);
    message.error("cancel notes")
  };

  const editCancel = () => {
    setEditOpen(false);
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

  //  delect function
  const deleteNote = async (note) => {
    //  delect from  user interface quickly
    const afetrDelete = Notes.filter((sticky) => sticky.id !== note.id)
    setNotes(afetrDelete)
    message.success("Note deleted successfully")
    // delect from firebase
    await deleteDoc(doc(firestore, "notes", note.id));
  }
  // handle change for edit 
  const handleEditChange = e => {
    setEdit(s => ({ ...s, [e.target.name]: e.target.value }))
    console.log(state)
  }
  const handleEditDate = (_, date) => {
    setEdit(s => ({ ...s, date }))
  }
  const handleEditColor = (_, color) => {
    setEdit(s => ({ ...s, color }))
  }
  // edit function
  const editNote = async (noteEditId) => {
    editModal()
    const getTodo =  Notes.find((note) => note.id === noteEditId.id)
    setEdit(getTodo)
  }
  // update notes
  const updatenote = async()=>{
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEditOpen(false);
    }, 1000);
    console.log(edit)
    const { title,list, description, date, color } = edit

    if (!title) { return message.error("give at least title") }
    if (!list) { return message.error("add list type") }
    const todo = { ...edit,
      title, list, description, date, color,
    }
    console.log(todo)
    try {
      // add notes in user interface quickly
      // this is for new update notes  
      // setNotes(edit=>([...edit , todo]))
      // this is for edit update notes
      Notes.find(note =>{
        if(note.id == todo.id){
          note.color = todo.color;
          note.title = todo.title;
          note.list = todo.list;
          note.description = todo.description;
          note.date = todo.date
        }
      })
      message.success("A notes updated successfully")
      // update notes in firebase 
      await setDoc(doc(firestore, "notes", todo.id), todo);
    } catch (e) {
      message.error("try again ", e);
    }
    setEdit(initialstate)
  }
  return (
    <>
      <div className="container mt-3">
        <div className="row">
          {Notes.map((note, i) => {
            return (
              <div className="col-12 mb-2 col-sm-6  col-md-4 col-lg-3 mb-md-3">
                <div key={i} className='notesDiv' style={{ backgroundColor: note.color }}><Row><Col span={20}><Link to={`notes/${note.id}`} className='title'>{note.title}</Link></Col><Col span={4}><EditOutlined className='editOption' onClick={() => { editNote(note) }} /><DeleteOutlined className='deleteOption' onClick={() => { deleteNote(note) }} /></Col></Row><b>{note.list}</b><Link to={`notes/${note.id}`} className='textmanage'>{note.description}</Link><br /><p className='date'>{note.date}</p></div>
              </div>
            )
          })}
          <div className='col-12 mb-2 col-sm-6  col-md-4 col-lg-3 mb-md-3'>
            <div className='bg-secondary' style={{ height: '200px', borderRadius: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', }} onClick={showModal}>
              <PlusOutlined />
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={open}
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
                    <Select placeholder="Select list" value={state.list} onChange={list =>  setState(s => ({...s, list}))}>
                      {lists.map((list, i) => {
                        return <Option key={i} value={list.name}>{list.name}</Option>
                      })}
                    </Select>
                  </Form.Item>
                  <Row>
                    <Col xs={24} sm={12}>
                      <Form.Item label='Select Date' className='mb-2'>
                        <DatePicker className='w-100' value={state.date ? dayjs(state.date) : null}  onChange={handleDate} />
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

{/* edit model */}
<Modal
        open={editOpen}
        onOk={updatenote}
        onCancel={editCancel}
        footer={[
          <Button key="back" onClick={editCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={updatenote}>
            Submit
          </Button>
        ]}
      >
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="p-1 p-md-2">
                <Typography.Title level={2} className="m-0 text-center font-italic bg-transparent">Update Notes</Typography.Title>
                <Divider className='mt-2' />
                <Form layout='vertical'>
                  <Form.Item label='Title' className='mb-2'>
                    <Input placeholder='Title' value={edit.title} name='title' onChange={handleEditChange} />
                  </Form.Item>
                  <Form.Item label='Select list type' className='mb-2' >
                    <Select placeholder="Select list" value={edit.list} onChange={list => { setEdit(s => ({...s ,list}))}}>
                      {lists.map((list, i) => {
                        return <Option key={i} value={list.name} >{list.name}</Option>
                      })}
                    </Select> 
                  </Form.Item>
                  <Row>
                    <Col xs={24} sm={12}>
                      <Form.Item label='Select Date' className='mb-2'>
                        <DatePicker className='w-100' value={edit.date ? dayjs(edit.date):""} onChange={handleEditDate} />
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item label="Select Color" className='mx-sm-5 mb-2'>
                        <ColorPicker onChange={handleEditColor} value={edit.color} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item label='Description' className='mb-0'>
                    <Input.TextArea placeholder='Notes description' value={edit.description} name='description' onChange={handleEditChange} />
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
