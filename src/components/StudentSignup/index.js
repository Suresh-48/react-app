import React, { Component } from 'react';
import StudentRegistration from './StudentRegistration';

export default class StudentSignup extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render() {
    return (
      <div> <StudentRegistration props={this.props}/> </div>
    );
  }
}
