import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const Notes = ({notes})=> {
  console.log(notes);
  return (
    <div>
      <Link to='/home'>Home</Link>
      <div>
        {
          notes.map( note=>{
            return(
              <div key={note.id}>
                {note.text}
              </div>
            )
          })
        }
      </div>
    </div>
  );
};

export default connect(state=>state)(Notes);
