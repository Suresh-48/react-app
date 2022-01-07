import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { Container, Row, Col } from "react-bootstrap";
import { Tab, Tabs } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";

// Component
import Loader from "../core/Loader";
import { tableIcons } from "../core/TableIcons";

// Api
import Api from "../../Api";

function AdminStudentUpcomingScheduleList(props) {
  const [isLoading, setisLoading] = useState(true);
  const [studentUpcomingData, setStudentUpcomingData] = useState([]);
  const [studentCompleteData, setStudentCompleteData] = useState([]);
  const [value, setValue] = useState(0);
  const [studentId, setstudentId] = useState(props?.match?.params?.id);

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
      render: (rowData) => `${rowData?.courseId.duration + " hour"}`,
    },
  ];

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

  // Get Student Upcoming Schedule
  const StudentUpcomingScheduleData = () => {
    Api.get("api/v1/upcomingcourse/student/list", {
      params: {
        studentId: studentId,
      },
    }).then((response) => {
      const studentUpcomingData = response.data.upcomingList;
      studentUpcomingData.sort(function compare(a, b) {
        var dateA = new Date(a.lessonDate);
        var dateB = new Date(b.lessonDate);
        return dateA - dateB;
      });
      setStudentUpcomingData(studentUpcomingData);
      setisLoading(false);
    });
  };

  //Get student complete schedule
  const StudentCompleteScheduleData = () => {
    Api.get("api/v1/upcomingcourse/student/complete/list", {
      params: {
        studentId: studentId,
      },
    }).then((response) => {
      const studentCompleteData = response.data.upcomingList;
      studentCompleteData.sort(function compare(a, b) {
        var dateA = new Date(a.lessonDate);
        var dateB = new Date(b.lessonDate);
        return dateA - dateB;
      });
      setStudentCompleteData(studentCompleteData);
      setisLoading(false);
    });
  };

  useEffect(() => {
    StudentCompleteScheduleData();
    StudentUpcomingScheduleData();
  }, []);

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
                    data={studentUpcomingData}
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
                    columns={studentColumns}
                    localization={{
                      body: {
                        emptyDataSourceMessage: "No Upcoming Schedule List",
                      },
                    }}
                  />
                </ThemeProvider>
              </div>
            ) : (
              <div>
                <h5 className="d-flex justify-content-center align-items-center py-3">Completed Schedule List</h5>
                <ThemeProvider theme={tableTheme}>
                  <MaterialTable
                    icons={tableIcons}
                    data={studentCompleteData}
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
                    columns={studentColumns}
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

export default AdminStudentUpcomingScheduleList;
