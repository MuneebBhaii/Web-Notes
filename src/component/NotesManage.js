import React, { useState } from 'react'
import dayjs from 'dayjs'
import { Button, Modal, Typography, Divider, Form, Input, Select, DatePicker, ColorPicker, Row, Col, message } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {doc,setDoc,deleteDoc } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { useNotesContext } from '../context/NotesContext';
import { useListContext } from '../context/ListContext';
const initialstate = { title: '', list: '', date: '', color: '#1677FF', description: '' }
export default function Today(props) {
  const { lists, setLists } = useListContext()
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [edit, setEdit] = useState(initialstate)
  const { Option } = Select;
  const { Notes, setNotes } = useNotesContext()
  
  const deleteNote = async (note) => {
    const afetrDelete = Notes.filter((sticky) => sticky.id !== note.id)
    setNotes(afetrDelete)
    message.success("Note deleted successfully")
    await deleteDoc(doc(firestore, "notes", note.id));
  }
  // open
  const editModal = () => {
    setEditOpen(true);
  };
  // cancel
  const editCancel = () => {
    setEditOpen(false);
    message.error("cancel notes")
  };
  // handle change for edit 
  const handleEditChange = e => {
    setEdit(s => ({ ...s, [e.target.name]: e.target.value }))
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
    }, 1500);
    console.log(edit)
    const { title,list, description, date, color } = edit

    if (!title) { return message.error("give at least title") }
    const todo = { ...edit,
      title, list, description, date, color,
    }
    console.log(todo)
    try {
      await setDoc(doc(firestore, "notes", todo.id), todo);
      props.getAllNotes.find(note =>{
        if(note.id == todo.id){
          note.color = todo.color;
          note.title = todo.title;
          note.list = todo.list;
          note.description = todo.description;
          note.date = todo.date
        }
      })
      message.success("A notes updated successfully")
    } catch (e) {
      message.error("try again ", e);
    }
    setEdit(initialstate)
    const afterUpdate = Notes.map(sticky => sticky)
    setNotes(afterUpdate)
  }
  return (
    <div className='container'>
      <div className="row mt-3">
      {!props.getAllNotes.length == 0 ? props.getAllNotes.map((note, i) => {
            return (
              <div className="col-12 mb-2 col-sm-6  col-md-4 col-lg-3 mb-md-3">
                <div className='notesDiv' style={{ backgroundColor: note.color }} key={i}><Row><Col span={20}><h5 className='title'>{note.title}</h5></Col><Col span={4}><EditOutlined className='editOption' onClick={() => { editNote(note) }} /><DeleteOutlined className='deleteOption' onClick={() => { deleteNote(note) }} /></Col></Row><span>{note.list}</span><p className='textmanage'>{note.description}</p><p className='date'>{note.date}</p></div>
              </div>
            )
          }) : <div className='py-5 h2 d-flex justify-content-center align-item-center bg-secondary'> <p>Not have notes</p> </div>}
      </div>

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
                    <Select placeholder="Select list" value={edit.list} onChange={list => { setEdit(s =>({...s,list})) }}>
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
    </div>
  )
}
