import dayjs from "dayjs";
import { useEffect, useState } from "react";
import NotesManage from "../../component/NotesManage"
import { useNotesContext } from '../../context/NotesContext'
import { theme } from "antd";
export default function Today() {
  const { token } = theme.useToken();
  const wrapperStyle = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };
  const [selectday, setSelectday] = useState()
  const pickday = dayjs(selectday).format("YYYY-MM-DD")
  const [seletedNotes, setseletedNotes] = useState([])
  const { Notes, setNotes } = useNotesContext()
  console.log(selectday)
  console.log(pickday)
  useEffect(()=>{
    let getNotes = Notes.filter(note => note.date == pickday)
    setseletedNotes(getNotes)
  },[pickday])
return (
  <main className='bg-light'>
    <div className="container">
      <div className="row">
        <div style={wrapperStyle}>
          <div className="col-12 mb-2 col-sm-6  col-md-4 col-lg-3 mb-md-3">
            <input type='date' onChange={e => setSelectday(e.target.value)} />
          </div>
        </div>
      </div>
      <div className="row">
        <NotesManage getAllNotes={seletedNotes} setAllNotes={setseletedNotes} />
      </div>
      </div>
  </main>
)
}
