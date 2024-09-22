import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import FeedPosts from './screens/feedposts';


class AppRouter extends Component {
  constructor() {
    super();
    this.state = {}
  }



render() {
  
    
  return (
      
    <Switch>
      {
        
        <Route exact path="/" render={ (props) =>
          <FeedPosts {...props} /> 
        } /> 
      }
      <Redirect to="/" />
    </Switch>
        
    )
  }

}

const mapStateToProps = (state) => {
  return {
    
  }
}


export default connect(mapStateToProps, null)(AppRouter)