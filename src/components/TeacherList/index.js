import MaterialTable from "material-table";
import React, { useState, useEffect } from "react";
import { Container, Row, Dropdown, Col } from "react-bootstrap";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { Tab, Tabs } from "@material-ui/core";
import { useHistory } from "react-router-dom";

// Component
import { toast } from "react-toastify";

// Api
import Api from "../../Api";

// Loader
import Loader from "../../components/core/Loader";
import { tableIcons } from "../core/TableIcons";

// Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarWeek } from "@fortawesome/free-solid-svg-icons";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

//css
import "../../css/TeacherList.scss";

function TeacherList(props) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [colId, setColId] = useState("");
  const [approvedData, setApprovedData] = useState([]);
  const [value, setValue] = useState(props.location.state.indexCount);

  const ToggleButton = () => setIsOpen(!isOpen);

  const history = useHistory();

  const tableTheme = createTheme({
    overrides: {
      MuiTableRow: {
        root: {
          overflowY: "unset",
          "&:hover": {
            cursor: "pointer",
            backgroundColor: "rgba(224, 224, 224, 1) !important",
          },
        },
      },
    },
  });

  const convertFromJSONToHTML = (value) => {
    try {
      return { __html: stateToHTML(convertFromRaw(JSON.parse(value))) };
    } catch (exp) {
      return { __html: "Error" };
    }
  };

  // Column Heading
  const columns = [
    {
      title: "S.no",
      width: "1%",
      render: (rowData) => `${rowData.tableData.id + 1}`,
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
      title: "Email",
      field: "email",
    },
    {
      title: "Speciality",
      field: "speciality",
    },
    {
      title: "Speciality Description",
      render: (rowData) => (
        <div
          className="ellipsis-text"
          dangerouslySetInnerHTML={convertFromJSONToHTML(`${rowData.specialityDescription}`)}
        ></div>
      ),
      cellStyle: {
        maxWidth: 850,
        position: "relative",
      },
    },
    {
      title: "Status",
      field: "status",
    },
  ];

  const getTeacherListData = () => {
    Api.get("api/v1/teacher").then((response) => {
      const data = response.data.data.data;
      setData(data);
      setIsLoading(false);
    });
  };

  //get approved teacher list
  const getTeacherApprovedListData = () => {
    Api.get("api/v1/teacher/list").then((response) => {
      const approvedData = response.data.teacherList;
      setApprovedData(approvedData);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    getTeacherListData();
    getTeacherApprovedListData();
  }, []);

  //change publish and draft course type
  const changeTeacherType = (status) => {
    Api.post("api/v1/teacher/status/", {
      teacherId: colId,
      status: status,
    }).then((response) => {
      if (response.status === 201) {
        getTeacherListData();
        getTeacherApprovedListData();
      } else {
        toast.error(response.data.message);
      }
    });
  };

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <Container>
          <Tabs
            value={value}
            indicatorColor="primary"
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          >
            <Tab
              label={
                <Row>
                  <Col>
                    <p className="tab-title">Approved Teachers List</p>
                  </Col>
                </Row>
              }
              style={{ width: "50%" }}
              value={0}
            />
            <Tab
              label={
                <Row>
                  <Col>
                    <p className="tab-title">All Teachers List</p>
                  </Col>
                </Row>
              }
              style={{ width: "50%" }}
              value={1}
            />
          </Tabs>
          <hr />
          {value === 0 ? (
            <div>
              <Row className="pt-3">
                <h5 className="teacher-title">Approved Teachers List</h5>
              </Row>
              <ThemeProvider theme={tableTheme}>
                <MaterialTable
                  style={{ overflowY: "unset" }}
                  icons={tableIcons}
                  columns={columns}
                  data={approvedData}
                  options={{
                    actionsColumnIndex: -1,
                    addRowPosition: "last",
                    showTitle: false,
                    headerStyle: {
                      backgroundColor: "#CCE6FF",
                      fontWeight: "bold",
                      zIndex: 0,
                    },
                  }}
                  actions={[
                    {
                      icon: () => <FontAwesomeIcon icon={faCalendarWeek} size="xs" color="#397AD4" />,
                      tooltip: "View Teacher Available Time",
                      onClick: (event, rowData) => {
                        history.push({
                          pathname: "/teacher/not-available",
                          state: {
                            rowData: rowData,
                          },
                        });
                      },
                    },
                    (rowData) => {
                      return {
                        icon: () => (
                          <Dropdown>
                            <Dropdown.Toggle className="teacher-menu-dropdown" varient="link">
                              <FontAwesomeIcon icon={faEllipsisV} size="sm" color="#397ad4" />
                            </Dropdown.Toggle>
                            {colId === rowData.id ? (
                              <Dropdown.Menu right className="menu-dropdown-status py-0">
                                <Dropdown.Item className="status-list">
                                  <Link
                                    to={{
                                      pathname: "/teacher/profile/public",
                                      state: {
                                        teacherId: colId,
                                      },
                                    }}
                                    className="collapse-text-style"
                                  >
                                    View As Public Page
                                  </Link>
                                </Dropdown.Item>
                                <hr />
                                <Dropdown.Item className="status-list">
                                  <Link
                                    to={{
                                      pathname: `/teacher/edit/${colId}`,
                                    }}
                                    className="collapse-text-style"
                                  >
                                    Edit Teacher Details
                                  </Link>
                                </Dropdown.Item>
                                <hr />
                                <Dropdown.Item className="status-list">
                                  <Link
                                    to={{
                                      pathname: `/teacher/schedule/${colId}`,
                                      state: {
                                        rowData,
                                      },
                                    }}
                                    className="collapse-text-style"
                                  >
                                    View course List
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
                  localization={{
                    body: {
                      emptyDataSourceMessage: "No Approved Teachers List",
                    },
                  }}
                />
              </ThemeProvider>
            </div>
          ) : (
            <div>
              <Row className="pt-3">
                <h5 className="teacher-title">All Teachers List</h5>
              </Row>
              <ThemeProvider theme={tableTheme}>
                <MaterialTable
                  style={{ overflowY: "unset" }}
                  icons={tableIcons}
                  columns={columns}
                  data={data}
                  options={{
                    actionsColumnIndex: -1,
                    addRowPosition: "last",
                    showTitle: false,
                    headerStyle: {
                      backgroundColor: "#CCE6FF",
                      fontWeight: "bold",
                      zIndex: 0,
                    },
                  }}
                  actions={[
                    (rowData) => {
                      return {
                        icon: () => (
                          <Dropdown>
                            <Dropdown.Toggle className="teacher-menu-dropdown" varient="link">
                              <FontAwesomeIcon icon={faEllipsisV} size="sm" color="#397ad4" />
                            </Dropdown.Toggle>
                            {colId === rowData.id ? (
                              <Dropdown.Menu right className="menu-dropdown-status py-0">
                                <Dropdown.Item className="status-list">
                                  <Link
                                    to="#"
                                    className="collapse-text-style"
                                    onClick={() => changeTeacherType("Approved")}
                                  >
                                    Approve
                                  </Link>
                                </Dropdown.Item>
                                <hr />
                                <Dropdown.Item className="status-list">
                                  <Link
                                    to="#"
                                    className="collapse-text-style"
                                    onClick={() => changeTeacherType("Pending")}
                                  >
                                    Pending
                                  </Link>
                                </Dropdown.Item>
                                <hr />
                                <Dropdown.Item className="status-list">
                                  <Link
                                    to="#"
                                    className="collapse-text-style"
                                    onClick={() => changeTeacherType("Rejected")}
                                  >
                                    Reject
                                  </Link>
                                </Dropdown.Item>
                                <hr />
                                <Dropdown.Item className="status-list">
                                  <Link
                                    to={{
                                      pathname: "/teacher/profile/public",
                                      state: {
                                        teacherId: colId,
                                      },
                                    }}
                                    className="collapse-text-style"
                                  >
                                    View Details
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
                  localization={{
                    body: {
                      emptyDataSourceMessage: "No Approved Teachers List",
                    },
                  }}
                />
              </ThemeProvider>
            </div>
          )}
        </Container>
      )}
    </div>
  );
}

export default TeacherList;
