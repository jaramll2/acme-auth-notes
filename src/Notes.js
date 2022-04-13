import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteNote } from './store';

const Notes = (props)=> {
  const notes = props.notes;

  console.log(typeof notes);
  return (
    <div>
      <Link to='/home'>Home</Link>
      <div>
        {
          notes.map( note=>{
            return(
              <div key={note.id}>
                {note.text} <button onClick={()=> props.deleteNote(note)} >x</button>
              </div>
            )
          })
        }
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch)=>{
  return{
      deleteNote: (note)=>{
          dispatch(deleteNote(note));
      }
  }
}

export default connect(state=>state,mapDispatchToProps)(Notes);
