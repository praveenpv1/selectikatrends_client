import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import 'font-awesome/css/font-awesome.min.css';
import AppRouter from './AppRouter';



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    
    return (
      <Container fluid={true}>
       
        <Row className="justify-content-center text-center">
          <Col lg={12} sm={12} xs={12} md={12} xl={12} className={``} style={{ overflow: 'hidden' }}>
            <AppRouter />
          </Col>
        </Row>

      </Container>
    );
  }
}

const mapStateToApp = (state) => {
  return {
    
  };
};

const mapDispatchToProps = {

};

export default connect(mapStateToApp, mapDispatchToProps)(App);
