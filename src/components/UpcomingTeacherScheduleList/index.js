import MaterialTable from "material-table";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Modal, Row, Col, Form } from "react-bootstrap";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import moment from "moment";
import Select from "react-select";
import Avatar from "@material-ui/core/Avatar";
import Button from "@restart/ui/esm/Button";
import { Tab, Tabs } from "@material-ui/core";

// Component
import Loader from "../core/Loader";
import { tableIcons } from "../core/TableIcons";
import { ROLES_TEACHER } from "../../constants/roles";

// Api
import Api from "../../Api";
//icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
// style
import "../../css/UpcomingSchedule.scss";

function UpcomingTeacherScheduleList(props) {
  const [show, setshow] = useState(false);
  const [showAlert, setshowAlert] = useState(false);
  const [role, setrole] = useState("");
  const [data, setData] = useState([]);
  const [teacherUpcomingData, setTeacherUpcomingData] = useState([]);
  const [teacherCompletedData, setTeacherCompletedData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [ZoomLink, setZoomLink] = useState("");
  const [CurrentDate, setCurrentDate] = useState("");
  const [lessTime, setLessTime] = useState("");
  const [DateAndTime, setDateAndTime] = useState("");
  const [approvedTeachers, setApprovedTeachers] = useState([]);
  const [teacherName, setTeacherName] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [modelValue, setModelValue] = useState("");
  const [value, setValue] = useState(0);

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
      title: "Duration",
      render: (rowData) => `${rowData?.courseId.duration + " hour"}`,
    },
  ];
  const adminColumns = [
    {
      title: "S.no",
      width: "10%",
      render: (rowData) => `${rowData?.tableData?.id + 1}`,
    },
    {
      title: "Name",
      render: (rowData) =>
        rowData?.teacherId?.firstName === undefined
          ? "No Teacher"
          : `${rowData?.teacherId?.firstName + " " + rowData?.teacherId?.lastName}`,
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
      title: "Duration",
      render: (rowData) => `${rowData?.courseId.duration + "hour"}`,
    },
  ];

  const handleModal = () => {
    setshow(false);
  };

  const isTeacher = role === ROLES_TEACHER;

  function closeShow() {
    setshowAlert(false);
  }

  useEffect(() => {
    const role = localStorage.getItem("role");
    setrole(role);
    TeacherUpcomingScheduleData();
    TeacherCompletedScheduleData();
    AdminTeacherUpcomingScheduleData();
    const currentDate = moment().tz("America/Chicago").format();
    const date = moment(currentDate).utc().format("ll");
    var lessTime = moment(currentDate).format("LT");
    setCurrentDate(date);
    setLessTime(lessTime);
    getApprovedTeacher();
  }, []);

  // Get Teacher Upcoming Schedule
  const TeacherUpcomingScheduleData = () => {
    const teacherId = localStorage.getItem("teacherId");
    Api.get("/api/v1/teacherUpcomingSchedule/upcoming", {
      params: {
        teacherId: teacherId,
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

  // Get Completed Upcoming Schedule
  const TeacherCompletedScheduleData = () => {
    const teacherId = localStorage.getItem("teacherId");
    Api.get("/api/v1/teacherUpcomingSchedule/completed", {
      params: {
        teacherId: teacherId,
      },
    }).then((response) => {
      const teacherCompletedData = response.data.completedList;
      teacherCompletedData.sort(function compare(a, b) {
        var dateA = new Date(a.lessonDate);
        var dateB = new Date(b.lessonDate);
        return dateA - dateB;
      });
      setTeacherCompletedData(teacherCompletedData);
      const orginalTime = response.data.completedList;
      orginalTime.forEach(function (list) {
        const time = moment(list.courseScheduleId.startTime, "LT").subtract(15, "minutes").format("LT");
        list.courseScheduleId["zoomTime"] = time;
      });
      setisLoading(false);
    });
  };

  // Change Teacher
  const submitForm = () => {
    Api.post("api/v1/teacherUpcomingSchedule/update/teacher", {
      teacherId: teacherId,
      teacherScheduleId: modelValue.id,
    })
      .then((res) => {
        setTeacherName("");
        setshow(false);
        AdminTeacherUpcomingScheduleData();
      })
      .catch((error) => {
        if (error.response && error.response.status >= 400) {
          let errorMessage;
          const errorRequest = error.response.request;
          if (errorRequest && errorRequest.response) {
            errorMessage = JSON.parse(errorRequest.response).message;
          }
          toast.error(error.response.data.message);
        }
      });
  };

  // Get Teacher Upcoming Schedule for Admin
  const AdminTeacherUpcomingScheduleData = () => {
    Api.get("/api/v1/teacherUpcomingSchedule").then((response) => {
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

  const getApprovedTeacher = () => {
    Api.get(`api/v1/teacher/list`).then((res) => {
      const data = res.data.teacherList;
      setApprovedTeachers(data);
    });
  };

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

  return (
    <div>
      <Container>
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            {isTeacher ? (
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
                    style={{ width: "50%" }}
                    value={1}
                  />
                </Tabs>
                <hr />
                {value === 0 ? (
                  <div>
                    <div className="d-flex justify-content-center align-items-center py-3">
                      <h5>Upcoming Schedule List</h5>
                    </div>
                    <ThemeProvider theme={tableTheme}>
                      <MaterialTable
                        icons={tableIcons}
                        columns={teacherColumns}
                        data={teacherUpcomingData}
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
                        actions={[
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
                              if (rowData.lessonDate === CurrentDate && rowData.courseScheduleId.zoomTime <= lessTime) {
                                setshow(true);
                                setZoomLink(rowData.courseScheduleId);
                              } else {
                                setshowAlert(true);
                                setDateAndTime(rowData);
                              }
                            },
                          }),
                        ]}
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
                    <div className="d-flex justify-content-center align-items-center py-3">
                      <h5>Completed Schedule List</h5>
                    </div>
                    <ThemeProvider theme={tableTheme}>
                      <MaterialTable
                        icons={tableIcons}
                        columns={teacherColumns}
                        data={teacherCompletedData}
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
            ) : (
              <div>
                <div className="d-flex justify-content-center align-items-center py-3">
                  <h5>Teachers Upcoming Lesson List</h5>
                </div>
                <ThemeProvider theme={tableTheme}>
                  <MaterialTable
                    icons={tableIcons}
                    columns={adminColumns}
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
                    actions={[
                      (rowData) => ({
                        icon: () => <p className={"zoom-view-style"}>Change Teacher</p>,
                        tooltip: "Click",
                        onClick: (event, rowData) => {
                          setModelValue(rowData);
                          setshow(true);
                        },
                      }),
                    ]}
                    localization={{
                      body: {
                        emptyDataSourceMessage: "No Teacher Upcoming Lesson List",
                      },
                    }}
                  />
                </ThemeProvider>
                <Modal show={show} centered onHide={() => handleModal()}>
                  <Modal.Body id="contained-modal-title-vcenter">
                    <div className="container py-3">
                      <div className="row flex-direction-row">
                        <h3 className=" d-flex justify-content-center align-self-center ">Teachers List</h3>
                      </div>
                      <div className="mt-3">
                        <Row>
                          <Form className="category-form-style" onSubmit={() => submitForm()}>
                            <Form.Group className="form-row mb-3" style={{ width: "100%" }}>
                              <Form.Label notify={true} className="label-top">
                                Teachers
                              </Form.Label>
                              <Select
                                value={teacherName}
                                placeholder="Assign Teachers..."
                                onChange={(e) => {
                                  setTeacherName(e);
                                  setTeacherId(e.value);
                                }}
                                options={[
                                  {
                                    options: approvedTeachers.map((list) => ({
                                      value: list.id,
                                      label: (
                                        <div className="d-flex justify-content-start align-items-center">
                                          <Avatar round size="38" className="d-flex justify-content-center">
                                            <p className="dropdown-option mb-0">
                                              {list?.firstName.substring(0, 1)}
                                              {list.middleName
                                                ? list?.middleName.substring(0, 1)
                                                : list?.lastName.substring(0, 1)}
                                            </p>
                                          </Avatar>
                                          <div className="dropdown-names">
                                            {`${list.firstName + " " + list.middleName + " " + list.lastName + " "}`}
                                          </div>
                                        </div>
                                      ),
                                      name: ` ${list.firstName} ${list.middleName} ${list.lastName}`,
                                    })),
                                  },
                                ]}
                              />
                            </Form.Group>
                          </Form>
                        </Row>
                        <div className="button-div">
                          <Button className="submit-button" variant="contained" onClick={submitForm}>
                            SAVE CHANGES
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
export default UpcomingTeacherScheduleList;
