import React, { Component } from "react";
import { ROLES_PARENT, ROLES_STUDENT, ROLES_TEACHER } from "../../constants/roles";
import AdminDashboard from "./AdminDashboard";
import ParentDashboard from "./ParentDashboard";
import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: "",
    };
  }

  componentDidMount() {
    const role = localStorage.getItem("role");
    this.setState({ role: role });
  }

  render() {
    const { role } = this.state;
    const isParent = role === ROLES_PARENT;
    const isStudent = role === ROLES_STUDENT;
    const isTeacher = role === ROLES_TEACHER;
    return (
      <div>
        {isParent ? (
          <ParentDashboard />
        ) : isStudent ? (
          <StudentDashboard />
        ) : isTeacher ? (
          <TeacherDashboard />
        ) : (
          <AdminDashboard />
        )}
      </div>
    );
  }
}

export default Dashboard;
