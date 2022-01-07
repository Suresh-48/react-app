import MaterialTable from "material-table";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Modal, Row, Col } from "react-bootstrap";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import moment from "moment";
import { Tab, Tabs } from "@material-ui/core";
import Button from "@restart/ui/esm/Button";

// Component
import Loader from "../core/Loader";
import { tableIcons } from "../core/TableIcons";
import { ROLES_PARENT, ROLES_STUDENT } from "../../constants/roles";

// Api
import Api from "../../Api";

//icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

// style
import "../../css/UpcomingSchedule.scss";

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

function UpcomingSchedule(props) {
  const [show, setshow] = useState(false);
  const [showAlert, setshowAlert] = useState(false);
  const [role, setrole] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [ZoomLink, setZoomLink] = useState("");
  const [CurrentDate, setCurrentDate] = useState("");
  const [lessTime, setLessTime] = useState("");
  const [DateAndTime, setDateAndTime] = useState("");
  const [value, setValue] = useState(0);
  const [completeData, setcompeleteData] = useState([]);

  // Column Heading
  const studentColumns = [
    {
      title: "S.no",
      width: "10%",
      render: (rowData) => `${rowData?.tableData?.id + 1}`,
    },
    {
      title: "Date",
      field: "lessonDate",
    },
    {
      title: "Start Time",
      field: "courseScheduleId.startTime",
    },
    {
      title: "End Time",
      field: "courseScheduleId.endTime",
    },
    {
      title: "Course Name",
      field: "courseId.name",
    },
    {
      title: "Lesson Name",
      field: "courseLessonId.lessonName",
    },
    {
      title: "Duration",
      render: (rowData) => `${rowData?.courseId.duration + "hour"}`,
    },
  ];

  const parentColumns = [
    {
      title: "S.no",
      width: "10%",
      render: (rowData) => `${rowData?.tableData?.id + 1}`,
    },
    {
      title: "First Name",
      field: "studentId.firstName",
    },
    {
      title: "Last Name",
      field: "studentId.lastName",
    },
    {
      title: "Age",
      field: "studentId.age",
    },
    {
      title: "Date",
      field: "lessonDate",
    },
    {
      title: "Start Time",
      field: "courseScheduleId.startTime",
    },
    {
      title: "End Time",
      field: "courseScheduleId.endTime",
    },
    {
      title: "Course Name",
      field: "courseId.name",
    },
    {
      title: "Lesson Name",
      field: "courseLessonId.lessonName",
    },
    {
      title: "Duration",
      render: (rowData) => `${rowData?.courseId.duration + "hour"}`,
    },
  ];

  const completeParentColumns = [
    {
      title: "S.no",
      width: "10%",
      render: (rowData) => `${rowData?.tableData?.id + 1}`,
    },
    {
      title: "First Name",
      field: "studentId.firstName",
    },
    {
      title: "Last Name",
      field: "studentId.lastName",
    },
    {
      title: "Age",
      field: "studentId.age",
    },
    {
      title: "Date",
      field: "lessonDate",
    },
    {
      title: "Start Time",
      field: "courseScheduleId.startTime",
    },
    {
      title: "End Time",
      field: "courseScheduleId.endTime",
    },
    {
      title: "Course Name",
      field: "courseId.name",
    },
    {
      title: "Lesson Name",
      field: "courseLessonId.lessonName",
    },
    {
      title: "Duration",
      render: (rowData) => `${rowData?.courseId.duration + "hour"}`,
    },
  ];

  const completeStudentColumns = [
    {
      title: "S.no",
      width: "10%",
      render: (rowData) => `${rowData?.tableData?.id + 1}`,
    },
    {
      title: "Date",
      field: "lessonDate",
    },
    {
      title: "Start Time",
      field: "courseScheduleId.startTime",
    },
    {
      title: "End Time",
      field: "courseScheduleId.endTime",
    },
    {
      title: "Course Name",
      field: "courseId.name",
    },
    {
      title: "Lesson Name",
      field: "courseLessonId.lessonName",
    },
    {
      title: "Duration",
      render: (rowData) => `${rowData?.courseId.duration + "hour"}`,
    },
  ];

  const handleModal = () => {
    setshow(false);
  };

  function closeShow() {
    setshowAlert(false);
  }

  const isParent = role === ROLES_PARENT;
  const isStudent = role === ROLES_STUDENT;

  useEffect(() => {
    const role = localStorage.getItem("role");
    const isParent = role === ROLES_PARENT;
    setrole(role);
    isParent ? ParentUpcomingScheduleData() : StudentUpcomingScheduleData();
    isParent ? ParentCompletelist() : StudentCompletelist();
    const currentDate = moment().tz("America/Chicago").format();
    const date = moment(currentDate).utc().format("ll");
    var lessTime = moment(currentDate).format("LT");
    setCurrentDate(date);
    setLessTime(lessTime);
  }, []);

  // Get Parent Upcoming Schedule
  const ParentUpcomingScheduleData = () => {
    const parentId = localStorage.getItem("parentId");
    Api.get("api/v1/upcomingcourse/parent/list", {
      params: {
        parentId: parentId,
      },
    }).then((response) => {
      const dataValues = response.data.upcomingList;
      dataValues.sort(function compare(a, b) {
        var dateA = new Date(a.lessonDate);
        var dateB = new Date(b.lessonDate);
        return dateA - dateB;
      });
      setData(dataValues);
      setisLoading(false);
    });
  };

  // Get Student Upcoming Schedule
  const StudentUpcomingScheduleData = () => {
    const studentId = localStorage.getItem("studentId");
    Api.get("api/v1/upcomingcourse/student/list", {
      params: {
        studentId: studentId,
      },
    }).then((response) => {
      const dataValues = response.data.upcomingList;
      dataValues.sort(function compare(a, b) {
        var dateA = new Date(a.lessonDate);
        var dateB = new Date(b.lessonDate);
        return dateA - dateB;
      });
      setData(dataValues);
      const orginalTime = response.data.upcomingList;
      orginalTime.forEach(function (list) {
        const time = moment(list.courseScheduleId.startTime, "LT").subtract(15, "minutes").format("LT");
        list.courseScheduleId["zoomTime"] = time;
      });
      setisLoading(false);
    });
  };

  //get student complete list
  const StudentCompletelist = () => {
    const studentId = localStorage.getItem("studentId");
    Api.get("api/v1/upcomingcourse/student/complete/list", {
      params: {
        studentId: studentId,
      },
    }).then((response) => {
      const completeData = response.data.upcomingList;
      completeData.sort(function compare(a, b) {
        var dateA = new Date(a.lessonDate);
        var dateB = new Date(b.lessonDate);
        return dateA - dateB;
      });
      setcompeleteData(completeData);
      setisLoading(false);
    });
  };

  //get parent complete list
  const ParentCompletelist = () => {
    const parentId = localStorage.getItem("parentId");
    Api.get("api/v1/upcomingcourse/parent/complete/list", {
      params: {
        parentId: parentId,
      },
    }).then((response) => {
      const completeData = response.data.upcomingList;
      completeData.sort(function compare(a, b) {
        var dateA = new Date(a.lessonDate);
        var dateB = new Date(b.lessonDate);
        return dateA - dateB;
      });
      setcompeleteData(completeData);
      setisLoading(false);
    });
  };
  return (
    <div>
      <Container>
        {isLoading ? (
          <Loader />
        ) : (
          <div>
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
                      <p className="tab-titles">Upcoming Schedule </p>
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
                      <p className="tab-titles">Completed Schedule </p>
                    </Col>
                  </Row>
                }
                style={{ width: "55%" }}
                value={1}
              />
            </Tabs>

            <hr />
            {value === 0 ? (
              <div>
                <h5 className="d-flex justify-content-center py-3">Upcoming Schedule List</h5>
                <ThemeProvider theme={tableTheme}>
                  <MaterialTable
                    icons={tableIcons}
                    data={data}
                    options={{
                      actionsColumnIndex: -1,
                      addRowPosition: "last",
                      headerStyle: {
                        fontWeight: "bold",
                        backgroundColor: "#CCE6FF",
                        zIndex: 0,
                      },
                      showTitle: false,
                    }}
                    columns={isParent ? parentColumns : studentColumns}
                    actions={
                      isStudent
                        ? [
                            (rowData) => ({
                              icon: () => (
                                <p
                                  className={`${
                                    rowData.lessonDate === CurrentDate && rowData.courseScheduleId.zoomTime <= lessTime
                                      ? "zoom-view-style"
                                      : "zoom-view-disable-style"
                                  }`}
                                >
                                  Join
                                </p>
                              ),
                              tooltip: "Zoom Link",
                              onClick: (event, rowData) => {
                                if (
                                  rowData.lessonDate === CurrentDate &&
                                  rowData.courseScheduleId.zoomTime <= lessTime
                                ) {
                                  setshow(true);
                                  setZoomLink(rowData.courseScheduleId);
                                } else {
                                  setshowAlert(true);
                                  setDateAndTime(rowData);
                                }
                              },
                            }),
                          ]
                        : null
                    }
                    localization={{
                      body: {
                        emptyDataSourceMessage: "No Upcoming Schedule List",
                      },
                    }}
                  />
                </ThemeProvider>
                {isStudent ? (
                  <div>
                    <Modal show={show} centered onHide={() => handleModal()}>
                      <Modal.Body id="contained-modal-title-vcenter">
                        <div className="align-items-center zoom-content">
                          <h4 className="mt-2">Zoom Link</h4>
                          <Row className="my-3 zoom-modal-style">
                            <h6 className="d-block">Link</h6>
                            <Col sm={10} className="copy-content">
                              <Link
                                className="link-text"
                                rel="noopener noreferrer"
                                target="_blank"
                                onClick={() => window.open(`${ZoomLink?.zoomId}+${ZoomLink?.zoomPassword}`, "_blank")}
                              >
                                {ZoomLink?.zoomId}
                              </Link>
                            </Col>
                            <Col sm={2} className="d-flex justify-content-center align-items-center">
                              <div>
                                <CopyToClipboard
                                  text={ZoomLink.zoomId}
                                  className="mx-1 copy-icon"
                                  onCopy={() => toast.success("Link Copied...")}
                                >
                                  <FontAwesomeIcon icon={faCopy} size="lg" color="#397ad4" />
                                </CopyToClipboard>
                              </div>
                            </Col>
                          </Row>
                          <Row className="mb-3 zoom-modal-style">
                            <h6 className="d-block">Password</h6>
                            <br />
                            <Col sm={10} className="copy-content">
                              <Link className="link-text text-decoration-none" style={{ fontSize: 14 }}>
                                {ZoomLink?.zoomPassword}
                              </Link>
                            </Col>
                            <Col sm={2} className="d-flex justify-content-center align-items-center">
                              <div>
                                <CopyToClipboard
                                  text={ZoomLink.zoomPassword}
                                  className="mx-1 copy-icon"
                                  onCopy={() => toast.success("Password Copied...")}
                                >
                                  <FontAwesomeIcon icon={faCopy} size="lg" color="#397ad4" />
                                </CopyToClipboard>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </Modal.Body>
                    </Modal>
                    <Modal show={showAlert} centered className="modal-main-content" onHide={() => closeShow()}>
                      <Modal.Body id="contained-modal-title-vcenter">
                        <div className="delete-content my-4">
                          <div className="mb-2">
                            <h5 className="d-flex justify-content-center align-items-center">Notification</h5>
                            <p className="d-flex justify-content-center">
                              {`${
                                "Zoom Link Activate Before 15 Minutes" +
                                " " +
                                "(" +
                                " " +
                                DateAndTime.lessonDate +
                                " " +
                                ")"
                              }`}
                            </p>
                          </div>
                          <Row>
                            <Col>
                              <Button className="delete-cancel" variant="light" onClick={() => closeShow()}>
                                OK
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      </Modal.Body>
                    </Modal>
                  </div>
                ) : null}
              </div>
            ) : (
              <div>
                <h5 className="d-flex justify-content-center py-3">Completed Schedule List</h5>
                <ThemeProvider theme={tableTheme}>
                  <MaterialTable
                    icons={tableIcons}
                    data={completeData}
                    columns={isParent ? completeParentColumns : completeStudentColumns}
                    options={{
                      actionsColumnIndex: -1,
                      addRowPosition: "last",
                      headerStyle: {
                        fontWeight: "bold",
                        backgroundColor: "#CCE6FF",
                        zIndex: 0,
                      },
                      showTitle: false,
                    }}
                    localization={{
                      body: {
                        emptyDataSourceMessage: "No Completed Schedule List",
                      },
                    }}
                  />
                </ThemeProvider>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}

export default UpcomingSchedule;
