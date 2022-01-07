import React, { useState, useEffect } from "react";
import { Container, Row, Table, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";


// Styles
import DashboardTiles from "../../components/core/DashboardTiles";

// Styles
import "../../css/ParentDashboard.scss";

// Api
import Api from "../../Api";

import Loader from "../core/Loader";

function ParentDashboard() {
  const parent = localStorage.getItem("parentId");
  const [parentId, setparentId] = useState(parent);
  const [upcomingData, setUpcomingData] = useState([]);
  const [completeData, setCompeleteData] = useState([]);
  const [studentList, setstudentList] = useState([]);
  const [count, setCount] = useState("");
  const [isLoading, setisLoading] = useState(true);

  const history = useHistory();

  useEffect(() => {
    getStudentDetails();
    getDashboardDetails();
    getStudentUpcomingSchedule();
    getStudentCompletedSchedule();
  }, []);

  //get student upcoming schedule

  const getStudentUpcomingSchedule = () => {
    Api.get("api/v1/upcomingcourse/parent/list", {
      params: {
        parentId: parentId,
      },
    }).then((response) => {
      const dataValues = response?.data?.upcomingList;
      dataValues.sort(function compare(a, b) {
        var dateA = new Date(a.lessonDate);
        var dateB = new Date(b.lessonDate);
        return dateA - dateB;
      });
      setUpcomingData(dataValues);
      setisLoading(false);
    });
  };

  const getStudentCompletedSchedule = () => {
    const parentId = localStorage.getItem("parentId");
    Api.get("api/v1/upcomingcourse/parent/complete/list", {
      params: {
        parentId: parentId,
      },
    }).then((response) => {
      const completeData = 0;
      setCompeleteData(completeData);
    });
  };

  // get Student Details
  const getStudentDetails = () => {
    setparentId(parentId);
    Api.get("api/v1/parent/student/list", {
      params: {
        parentId: parentId,
      },
    }).then((res) => {
      const data = res?.data?.data?.studentList;
      setstudentList(data);
      setisLoading(false);
    });
  };

  // Get Details
  const getDashboardDetails = () => {
    Api.get("api/v1/dashboard/parent/", {
      params: {
        parentId: parentId,
      },
    }).then((res) => {
      const data = res?.data?.data;
      setCount(data);
    });
  };

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <Container className="mt-5">
          <Row className="main-card pt-5">
            <DashboardTiles label="Student" count={count?.totalStudent} url="/parent/student" />

            <DashboardTiles label="Active Enroll Courses" count={count.activeCourse} url="#" />

            <DashboardTiles label="Completed Courses" count={completeData} url="#" />
          </Row>

          <Row className="parentdash-two">
            <div className="d-flex justify-content-center align-items-center ">
              <h4>Upcoming Schedule List</h4>
            </div>

            <div className="enroll-link pb-2">
              <Button
                variant="primary"
                className="dashboard-button-style"
                onClick={() => history.push("/landing-page")}
              >
                Enroll
              </Button>
            </div>
            <Table striped bordered hover className="parent-table">
              <thead>
                <tr className="viewRow">
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Course Name</th>
                  <th>Lesson Name</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {upcomingData?.length > 0 ? (
                  upcomingData.slice(0, 5).map((list, i) => (
                    <tr className="viewRow">
                      <td>{i + 1}</td>
                      <td>{list?.studentId?.firstName + " " + list?.studentId?.lastName}</td>
                      <td>{list?.lessonDate}</td>
                      <td>{list?.courseScheduleId?.startTime}</td>
                      <td>{list?.courseScheduleId?.endTime}</td>
                      <td>{list?.courseId?.name}</td>
                      <td>{list?.courseLessonId?.lessonName}</td>
                      <td>{list?.courseId?.duration + " hour"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">
                      <h6 className="d-flex justify-content-center">No Records to Display</h6>
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
        </Container>
      )}
    </div>
  );
}

export default ParentDashboard;
