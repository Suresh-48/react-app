import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Modal,
  Button,
  Dropdown,
} from "react-bootstrap";
import AddBox from "@material-ui/icons/AddBox";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

// Styles
import "../../css/ParentStudent.scss";

// Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";

// Component
import Loader from "../core/Loader";
import { tableIcons } from "../core/TableIcons";

// Api
import Api from "../../Api";

function ParentStudent(props) {
  const [show, setshow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  const parent = localStorage.getItem("parentId");
  const [studentList, setstudentList] = useState([]);
  const [parentId, setparentId] = useState(parent);
  const [studentData, setstudentData] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [colId, setColId] = useState("");

  const ToggleButton = () => setIsOpen(!isOpen);

  // Styles
  const tableTheme = createTheme({
    overrides: {
      MuiTableRow: {
        root: {
          "&:hover": {
            cursor: "pointer",
            backgroundColor: "rgba(224, 224, 224, 1) !important",
          },
        },
      },
    },
  });

  // Get Student Details
  const getStudentDetails = () => {
    Api.get("api/v1/parent/student/list", {
      params: {
        parentId: parentId,
      },
    }).then((response) => {
      const data = response.data.data.studentList;
      setstudentList(data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    getStudentDetails();
  }, []);

  // Column Heading
  const columns = [
    {
      title: "S.no",
      width: "5%",
      render: (rowData) => `${rowData?.tableData?.id + 1}`,
    },
    {
      title: "First Name",
      field: "firstName",
    },
    {
      title: "Last Name",
      field: "lastName",
    },
    {
      title: "Age",
      field: "age"
    },
    {
      title: "Email",
      field: "email",
    },
    {
      title: "Course Count",
      field: "totalCourseEnrolled",
    },
  ];

  const handleModal = () => {
    setshow(false);
  };

  // Delete Student
  const deleteStudent = () => {
    Api.delete(`api/v1/parent/remove/student/${studentData?.id}`).then(
      (response) => {
        setshow(false);
        getStudentDetails();
      }
    );
  };

  return (
    <div>
      <Container>
        {isLoading ? (
          <Loader />
        ) : (
          <Row>
            <Col className="materialtableps">
              <div className="d-flex justify-content-center align-items-center pb-3">
                <h4>Student List</h4>
              </div>
              <ThemeProvider theme={tableTheme}>
                <MaterialTable
                  style={{ width: "100%" }}
                  icons={tableIcons}
                  options={{
                    showTitle: false,
                    actionsColumnIndex: -1,
                    addRowPosition: "last",
                    headerStyle: {
                      fontWeight: "bold",
                      backgroundColor: "#CCE6FF",
                      zIndex: 0,
                    },
                  }}
                  actions={[
                    {
                      icon: () => <AddBox style={{ color: "#397ad4" }} />,
                      tooltip: "Add student",
                      isFreeAction: true,
                      onClick: (event, rowData) => {
                        history.push({
                          pathname: "/student/signup",
                        });
                      },
                    },
                    (rowData) => {
                      return rowData?.totalCourseEnrolled === 0
                        ? {
                            icon: () => (
                              <FontAwesomeIcon
                                icon={faTrashAlt}
                                className="delect-icon-style"
                                color={"#ba2727"}
                              />
                            ),
                            disable: true,
                            onClick: (event, rowData) => {
                              setshow(true);
                              setstudentData(rowData);
                            },
                            tooltip: "Delete",
                          }
                        : {
                            icon: () => (
                              <FontAwesomeIcon
                                icon={faTrashAlt}
                                className="delect-icon-style"
                                color={"#868686"}
                              />
                            ),
                            disable: false,
                            onClick: (rowData) => {},
                            tooltip: "Delete",
                          };
                    },
                    (rowData) => {
                      return {
                        icon: () => (
                          <Dropdown>
                            <Dropdown.Toggle
                              className="teacher-menu-dropdown"
                              varient="link"
                            >
                              <FontAwesomeIcon
                                icon={faEllipsisV}
                                size="sm"
                                color="#397ad4"
                              />
                            </Dropdown.Toggle>
                            {colId === rowData.id ? (
                              <Dropdown.Menu
                                right
                                className="menu-dropdown-status py-0"
                              >
                                <Dropdown.Item className="status-list">
                                  <Link
                                    to={{
                                      pathname: `/edit/student/details/${rowData.id}`,
                                      state: { studentId: rowData.id },
                                    }}
                                    className="collapse-text-style"
                                  >
                                    View & Edit Student Details
                                  </Link>
                                </Dropdown.Item>
                                <hr />
                                <Dropdown.Item className="status-list">
                                  <Link
                                    to={{
                                      pathname: `/upcoming/schedule/list/${rowData.id}`,
                                      state: { studentId: rowData.id },
                                    }}
                                    className="collapse-text-style"
                                  >
                                    Upcoming Schedule List
                                  </Link>
                                </Dropdown.Item>
                                <hr />
                                <Dropdown.Item className="status-list">
                                  <Link
                                    to={{
                                      pathname: `/student/transcript/${rowData.id}`,
                                      state: { studentId: rowData.id },
                                    }}
                                    className="collapse-text-style"
                                  >
                                    View Mark Details
                                  </Link>
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            ) : null}
                          </Dropdown>
                        ),
                        onClick: (event, rowData) => {
                          setColId(rowData.id);
                          setIsOpen(!isOpen);
                        },
                      };
                    },
                  ]}
                  columns={columns}
                  data={studentList}
                  localization={{
                    body: {
                      emptyDataSourceMessage: "No Student Record",
                    },
                  }}
                />
              </ThemeProvider>
              <Modal
                show={show}
                centered
                className="modal-main-content"
                onHide={() => handleModal()}
              >
                <Modal.Body id="contained-modal-title-vcenter">
                  <div className="delete-content my-4">
                    <div className="mb-4">
                      <h6 className="alert-text">
                        {`Are you sure want to delete " ${studentData?.firstName} ${studentData?.lastName} " account `}
                      </h6>
                    </div>
                    <Row>
                      <Col>
                        <Button
                          className="delete-cancel"
                          variant="light"
                          onClick={() => handleModal()}
                        >
                          Cancel
                        </Button>
                      </Col>
                      <Col>
                        <Button
                          className="confirmation-button"
                          variant="light"
                          onClick={() => deleteStudent()}
                        >
                          Delete
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </Modal.Body>
              </Modal>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}

export default ParentStudent;
