import React, { useState, useEffect } from "react";
import { Container, Row, Table, Button, Modal, Col } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import moment from "moment";

//icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

// Component
import Loader from "../core/Loader";
import DashboardTiles from "../../components/core/DashboardTiles";

// Api
import Api from "../../Api";

// Styles
import "../../css/StudentDashboard.scss";

function StudentDashboard() {
  const [data, setData] = useState([]);
  const [upcomingData, setUpcomingData] = useState([]);
  const [completedList, setCompletedList] = useState([]);
  const [studentId, setstudentId] = useState([]);
  const history = useHistory();
  const [isLoading, setisLoading] = useState(true);
  const [CurrentDate, setCurrentDate] = useState("");
  const [lessTime, setLessTime] = useState("");
  const [DateAndTime, setDateAndTime] = useState("");
  const [ZoomLink, setZoomLink] = useState("");
  const [show, setshow] = useState(false);
  const [showAlert, setshowAlert] = useState(false);
  const [isStudent, setIsStudent] = useState(false);

  function closeShow() {
    setshowAlert(false);
  }

  // Get Student Data
  const getStudentDashboardData = () => {
    const studentId = localStorage.getItem("studentId");
    setstudentId(studentId);
    Api.get(`api/v1/dashboard/student/`, {
      params: {
        studentId: studentId,
      },
    }).then((response) => {
      const data = response?.data?.data;
      setData(data);
      setisLoading(false);
    });
  };

  const getStudentUpcomingSchedule = () => {
    const studentId = localStorage.getItem("studentId");
    Api.get("api/v1/upcomingcourse/student/list", {
      params: {
        studentId: studentId,
      },
    }).then((response) => {
      const dataValues = response?.data?.upcomingList;
      dataValues.sort(function compare(a, b) {
        var dateA = new Date(a.lessonDate);
        var dateB = new Date(b.lessonDate);
        return dateA - dateB;
      });
      setUpcomingData(dataValues);
      const orginalTime = response.data.upcomingList;
      orginalTime.forEach(function (list) {
        const time = moment(list.courseScheduleId.startTime, "LT").subtract(15, "minutes").format("LT");
        list.courseScheduleId["zoomTime"] = time;
      });
      setisLoading(false);
    });
  };

  const getStudentCompletedSchedule = () => {
    const studentId = localStorage.getItem("studentId");
    Api.get("api/v1/upcomingcourse/student/complete/list", {
      params: {
        studentId: studentId,
      },
    }).then((response) => {
      const dataValues = response?.data?.upcomingList;
      setCompletedList(dataValues);
    });
  };

  useEffect(() => {
    getStudentDashboardData();
    getStudentUpcomingSchedule();
    getStudentCompletedSchedule();
    const currentDate = moment().format();
    const date = moment(currentDate).utc().format("ll");
    var lessTime = moment(currentDate).format("LT");
    setCurrentDate(date);
    setLessTime(lessTime);
  }, []);

  const handleModal = () => {
    setshow(false);
  };

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <Container className="mt-5">
          <Row className="main-card py-3">
            <DashboardTiles label="Active Enroll Courses" count={data.activeCourse} url="#" />

            <DashboardTiles label="Completed Courses" count={data.completedCourse} url="#" />
          </Row>

          <div>
            <div className="d-flex justify-content-center align-items-center ">
              <h4>Upcoming Schedule List</h4>
            </div>
            <div className="enroll-link">
              <Button
                variant="primary"
                className="dashboard-button-style"
                onClick={() => history.push("/landing-page")}
              >
                Enroll
              </Button>
            </div>
            <Row className="studentdash-two ">
              <Table striped bordered hover className="student-table">
                <thead>
                  <tr className="viewRow">
                    <th>S.No</th>
                    <th>Date</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Course Name</th>
                    <th>Lesson Name</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingData?.length > 0 ? (
                    upcomingData.slice(0, 5).map((list, i) => (
                      <tr className="viewRow">
                        <td>{i + 1}</td>
                        <td>{list?.lessonDate}</td>
                        <td>{list?.courseScheduleId?.startTime}</td>
                        <td>{list?.courseScheduleId?.endTime}</td>
                        <td>{list?.courseId?.name}</td>
                        <td>{list?.courseLessonId?.lessonName}</td>
                        <td>{list?.courseId?.duration + " hour"}</td>
                        <td>
                          <p
                            className={`${
                              list?.lessonDate === CurrentDate && list.courseScheduleId.zoomTime <= lessTime
                                ? "zoom-view-style"
                                : "zoom-view-disable-style"
                            }`}
                            onClick={() => {
                              if (list?.lessonDate === CurrentDate && list.courseScheduleId.zoomTime <= lessTime) {
                                setshow(true);
                                setIsStudent(true);
                                setZoomLink(list?.courseScheduleId);
                              } else {
                                setshowAlert(true);
                                setDateAndTime(list);
                              }
                            }}
                          >
                            Join
                          </p>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">
                        <h6 className="d-flex justify-content-center">No Records To Display</h6>
                      </td>
                    </tr>
                  )}
                  {upcomingData?.length > 5 ? (
                    <tr>
                      <td colSpan="8">
                        <Link
                          to={{
                            pathname: `/upcoming/schedule`,
                          }}
                          className="viewAll-link"
                        >
                          View All
                        </Link>{" "}
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </Table>
            </Row>
          </div>

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
                            text={ZoomLink?.zoomId}
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
                            text={ZoomLink?.zoomPassword}
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
            </div>
          ) : null}
          <Modal show={showAlert} centered className="modal-main-content" onHide={() => closeShow()}>
            <Modal.Body id="contained-modal-title-vcenter">
              <div className="delete-content my-4">
                <div className="mb-2">
                  <h5 className="d-flex justify-content-center align-items-center">Notification</h5>
                  <p className="d-flex justify-content-center">
                    {`${"Zoom Link Activate Before 15 Minutes (" + DateAndTime.lessonDate + ")"}`}
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
        </Container>
      )}
    </div>
  );
}

export default StudentDashboard;
