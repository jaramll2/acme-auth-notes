import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { attemptLogin, fetchNotes, logout } from './store';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './Home';
import Notes from './Notes';
import SignIn from './SignIn';


class App extends React.Component{
  componentDidMount(){
    this.props.attemptLogin();
  }

  componentDidUpdate(prevProps){
    if(!prevProps.auth.id && this.props.auth.id){
      this.props.fetchNotes();
    }
  }

  render(){
    const { auth } = this.props;
    const { notes } = this.props;

    if(!auth.id){
      return (
        <Switch>
          <Route path='/signin' component={ SignIn } />
          <Redirect to='/signin' />
        </Switch>
      );
    }
    else {
      return (
        <Switch>
          <Route path='/home' component={ Home } />
          <Route path='/notes' component={ Notes } />
          <Redirect to='/home' />
        </Switch>
      );
    }
  }
}

const mapState = state => state;
const mapDispatch = (dispatch)=> {
  return {
    attemptLogin: ()=> {
      return dispatch(attemptLogin());
    },
    fetchNotes: ()=>{
      return dispatch(fetchNotes());
    }
  }
}

export default connect(mapState, mapDispatch)(App);
