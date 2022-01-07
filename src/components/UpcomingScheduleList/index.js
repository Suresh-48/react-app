import MaterialTable from "material-table";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Modal } from "react-bootstrap";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import { Tab, Tabs } from "@material-ui/core";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import moment from "moment";
import Button from "@restart/ui/esm/Button";

// Component
import Loader from "../core/Loader";
import { tableIcons } from "../core/TableIcons";
import { ROLES_TEACHER } from "../../constants/roles";

// Api
import Api from "../../Api";

// style
import "../../css/UpcomingSchedule.scss";
//icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

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

function UpcomingScheduleList(props) {
  const [teacherId, setTeacherId] = useState("");
  const [role, setrole] = useState("");
  const [scheduleId, setscheduleId] = useState(props?.match?.params?.id);
  const [isLoading, setisLoading] = useState(true);
  const [value, setValue] = useState(0);
  const [teacherCompleteData, setTeacherCompleteData] = useState([]);
  const [teacherUpcomingData, setTeacherUpcomingData] = useState([]);
  const [CurrentDate, setCurrentDate] = useState("");
  const [lessTime, setLessTime] = useState("");
  const [DateAndTime, setDateAndTime] = useState("");
  const [showAlert, setshowAlert] = useState(false);
  const [show, setshow] = useState("");
  const [ZoomLink, setZoomLink] = useState("");

  function closeShow() {
    setshowAlert(false);
  }

  // Column Heading
  const teacherColumns = [
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
      title: "Durations",
      render: (rowData) => `${rowData?.courseId.duration + "hour"}`,
    },
  ];
  const isTeacher = role === ROLES_TEACHER;

  useEffect(() => {
    let role = localStorage.getItem("role");
    setrole(role);
    const isTeacher = role === ROLES_TEACHER;
    let id = localStorage.getItem("teacherId");
    const teacherId = isTeacher ? id : props?.location?.state?.rowData?.teacherId?._id;
    setTeacherId(teacherId);
    TeacherUpcomingScheduleData(teacherId);
    TeacherCompleteScheduleData(teacherId);
    const currentDate = moment().tz("America/Chicago").format();
    const date = moment(currentDate).utc().format("ll");
    var lessTime = moment(currentDate).format("LT");
    setCurrentDate(date);
    setLessTime(lessTime);
  }, []);

  // Get Teacher Upcoming Schedule
  const TeacherUpcomingScheduleData = (teacherId) => {
    Api.get("api/v1/teacherUpcomingSchedule/schedule/upcoming/list", {
      params: {
        teacherId: teacherId,
        courseScheduleId: scheduleId,
      },
    }).then((response) => {
      const teacherUpcomingData = response.data.upcomingList;
      teacherUpcomingData.sort(function compare(a, b) {
        var dateA = new Date(a.lessonDate);
        var dateB = new Date(b.lessonDate);
        return dateA - dateB;
      });
      setTeacherUpcomingData(teacherUpcomingData);
      const orginalTime = response.data.upcomingList;
      orginalTime.forEach(function (list) {
        const time = moment(list.courseScheduleId.startTime, "LT").subtract(15, "minutes").format("LT");
        list.courseScheduleId["zoomTime"] = time;
      });
      setisLoading(false);
    });
  };

  // Get Teacher Complete Schedule
  const TeacherCompleteScheduleData = (teacherId) => {
    Api.get("api/v1/teacherUpcomingSchedule/schedule/completed/list", {
      params: {
        teacherId: teacherId,
        courseScheduleId: scheduleId,
      },
    }).then((response) => {
      const teacherCompleteData = response.data.completedList;
      teacherCompleteData.sort(function compare(a, b) {
        var dateA = new Date(a.lessonDate);
        var dateB = new Date(b.lessonDate);
        return dateA - dateB;
      });
      setTeacherCompleteData(teacherCompleteData);
      setisLoading(false);
    });
  };

  const handleModal = () => {
    setshow(false);
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
                      <p className="tab-titles">Completed Schedule</p>
                    </Col>
                  </Row>
                }
                style={{ width: "53%" }}
                value={1}
              />
            </Tabs>
            <hr />
            {value === 0 ? (
              <div>
                <h5 className="d-flex justify-content-center align-items-center py-3">Upcoming Schedule List</h5>
                <ThemeProvider theme={tableTheme}>
                  <MaterialTable
                    icons={tableIcons}
                    data={teacherUpcomingData}
                    columns={teacherColumns}
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
                    actions={
                      isTeacher
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
                                  View
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
              </div>
            ) : (
              <div>
                <h5 className="d-flex justify-content-center align-items-center py-3">Completed Schedule List</h5>
                <ThemeProvider theme={tableTheme}>
                  <MaterialTable
                    icons={tableIcons}
                    data={teacherCompleteData}
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
                    columns={teacherColumns}
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

export default UpcomingScheduleList;
