import React, { useState, useEffect } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
} from "reactstrap";
import Kharpi from "./Kharpi.jpg";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

// Style
import "../../css/HeaderNavbar.scss";

// Roles
import { ROLES_PARENT, ROLES_STUDENT, ROLES_ADMIN, ROLES_TEACHER } from "../../constants/roles";

// Api
import Api from "../../Api";

const HeaderNavbar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setrole] = useState("");
  const [userId, setuserId] = useState("");
  const [userDetails, setuserDetails] = useState("");
  const [show, setshow] = useState(false);
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [studentId, setstudentId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [image, setImage] = useState("");

  const history = useHistory();
  const pathName = history.location.pathname;
  const isParent = role === ROLES_PARENT;
  const isStudent = role === ROLES_STUDENT;
  const isAdmin = role === ROLES_ADMIN;
  const isTeacher = role === ROLES_TEACHER;

  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    getUserDetails();
  }, []);

  // Log out
  const logout = () => {
    setshow(!show);
    localStorage.clear(history.push("/login"));
    getUserDetails();
  };

  //get details
  const getUserDetails = () => {
    let role = localStorage.getItem("role");
    let userId = localStorage.getItem("userId");
    let studentId = localStorage.getItem("studentId");
    let teacherId = localStorage.getItem("teacherId");
    setuserId(userId);
    setrole(role);
    setstudentId(studentId);
    setTeacherId(teacherId);
    Api.get(`api/v1/user/${userId}`).then((response) => {
      const userDetails = response.data.data.getOne;
      setuserDetails(userDetails);
      setfirstName(userDetails.firstName);
      setlastName(userDetails.lastName);
      const parentId = userDetails.parentId;
      const studentId = userDetails.studentId;
      const teacherId = userDetails.teacherId;
      Api.get(
        `api/v1/${(parentId && studentId) || studentId ? "student" : parentId ? "parent" : "teacher"}/${
          (parentId && studentId) || studentId ? studentId : parentId ? parentId : teacherId
        }`
      ).then((response) => {
        const getImageDetails = response.data.data.getOne.imageUrl;
        setImage(getImageDetails);
      });
    });
  };

  return (
    <>
      <Navbar color="light" light expand="md" className="navbar-style">
        <Container>
          <NavbarBrand href="/landing-page">
            <img src={Kharpi} width="100" height="30" className="d-inline-block align-top" alt="logo" />
          </NavbarBrand>

          <NavbarToggler onClick={toggle} />
          {isParent === true || isStudent === true ? (
            <Collapse isOpen={isOpen} navbar>
              {isStudent ? (
                <Nav className="mr-auto" navbar>
                  <NavItem>
                    <NavLink href="/dashboard">Dashboard</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="/upcoming/schedule">Upcoming Schedule</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="/test/link">Quiz</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="/homework/link">Home Work</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href={`/student/transcript/${studentId}`}>Marks</NavLink>
                  </NavItem>
                  <NavLink href="/course/history">Course History</NavLink>
                </Nav>
              ) : (
                isParent && (
                  <Nav className="mr-auto" navbar>
                    <NavItem>
                      <NavLink href="/dashboard">Dashboard</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href="/upcoming/schedule">Upcoming Schedules</NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink href="/course/history">Course History</NavLink>
                    </NavItem>
                  </Nav>
                )
              )}
            </Collapse>
          ) : isAdmin ? (
            <Collapse isOpen={isOpen} navbar>
              <Nav className="mr-auto" navbar>
                <NavItem>
                  <NavLink href="/dashboard">Dashboard</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/course/list">Courses</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/course/category">Course Category</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/upcoming/teacher/schedule/list">Upcoming Course Schedeule</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/payment/list">Payment List</NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          ) : isTeacher ? (
            <Collapse isOpen={isOpen} navbar>
              <Nav className="mr-auto" navbar>
                <NavItem>
                  <NavLink href="/dashboard">Dashboard</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/upcoming/teacher/schedule/list">Upcoming Schedeule List</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/teacher/review/quiz">Quiz</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/teacher/review/homework">Homework</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/teacher/application/form">Teacher Application</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/not-available/time">Not Available</NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          ) : (
            <Collapse isOpen={isOpen} navbar style={{ justifyContent: "flex-end" }}>
              <Nav className="mr-auto" navbar>
                <NavItem className="">
                  <NavLink href="/about-us">About Us</NavLink>
                </NavItem>
                <NavItem className="">
                  <NavLink href="/help">Help</NavLink>
                </NavItem>
                {pathName !== "/login" && (
                  <NavItem className="ml-auto">
                    <NavLink href="/login">Login</NavLink>
                  </NavItem>
                )}
                {pathName !== "/teacher/signup" && (
                  <NavItem className="ml-auto">
                    <NavLink href="/teacher/signup">Teacher Signup</NavLink>
                  </NavItem>
                )}
              </Nav>
            </Collapse>
          )}
          {isParent || isStudent || isAdmin || isTeacher ? (
            <Collapse isOpen={isOpen} navbar style={{ justifyContent: "flex-end" }}>
              <Nav className="mr-auto" navbar>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav>
                    {image ? (
                      <Avatar
                        src={image}
                        size="45"
                        onClick={() => setshow(!show)}
                        round={true}
                        color="silver"
                        className="avatar-style"
                      />
                    ) : (
                      <Avatar
                        name={`${firstName} ${lastName}`}
                        size="40"
                        onClick={() => setshow(!show)}
                        round={true}
                        color="silver"
                        className="avatar-style"
                      />
                    )}
                  </DropdownToggle>
                  <DropdownMenu right className="dropdown-content">
                    <DropdownItem className="avatar-list">
                      <Link
                        to={{
                          pathname: isParent
                            ? "/edit-parent-details"
                            : isStudent
                            ? `/edit/student/details/${studentId}`
                            : isTeacher
                            ? `/teacher/edit/${teacherId}`
                            : "/admin/details",
                          userId: userId,
                        }}
                        onClick={() => setshow(!show)}
                        className="navigate-profile-link"
                      >
                        Edit Profile
                      </Link>
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem className="avatar-list">
                      <Link
                        to="#"
                        className="navigate-profile-link"
                        onClick={logout}
                        style={{ cursor: "pointer", zIndex: 0 }}
                      >
                        Logout
                      </Link>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            </Collapse>
          ) : null}
        </Container>
      </Navbar>
    </>
  );
};
export default HeaderNavbar;
