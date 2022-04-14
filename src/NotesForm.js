import React from "react";
import {connect} from 'react-redux';
import { addNote } from './store';

class NotesForm extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            text:''
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onSubmit(ev){
        ev.preventDefault();
        this.setState({text: ''});
    }

    onChange(ev){
        const change ={};
        change[ev.target.name] = ev.target.value;
        this.setState(change);
    }

    render(){
        const {text} = this.state;
        const {onChange, onSubmit} = this;
        const id = this.props.id;

        return(
            <div>
                <form onSubmit={onSubmit}>
                    <textarea className = 'form' type='text' value={text} placeholder='Note Text' name='text' onChange={ onChange}/><br/>

                    <button className = 'form' disabled={!text} onClick={()=>this.props.addNote({text:this.state.text, userId: id})}>Create</button>
                </form>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch)=>{
    return{
        addNote: (note)=>{
            dispatch(addNote(note));
        }
    }
}

export default connect(state=>state,mapDispatchToProps)(NotesForm);