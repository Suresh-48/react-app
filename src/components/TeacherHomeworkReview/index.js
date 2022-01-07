import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import { toast } from "react-toastify";
import { Tab, Tabs } from "@material-ui/core";

// Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";

// Api
import Api from "../../Api";

//component
import Loader from "../core/Loader";
import { tableIcons } from "../core/TableIcons";

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

function TeacherHomeworkReview(props) {
  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [value, setValue] = useState(0);
  const [completeData, setcompeleteData] = useState();
  const [teacherId, setTeacherId] = useState();

  const history = useHistory();

  // Column Heading
  const columns = [
    {
      title: "S.no",
      render: (rowData) => `${rowData?.tableData?.id + 1}`,
    },
    {
      title: "Date",
      field: "scheduleLesson.lessonDate",
    },
    {
      title: "Student Name",
      render: (rowData) => `${rowData.studentId.firstName + " " + rowData.studentId.lastName}`,
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
      title: "Start Time",
      field: "courseScheduleId.startTime",
    },
    {
      title: "End Time",
      field: "courseScheduleId.endTime",
    },
  ];

  useEffect(() => {
    const teacherId = localStorage.getItem("teacherId");
    setTeacherId(teacherId);
    getPendingReviewList(teacherId);
    getCompletedReviewList(teacherId);
  }, []);

  // Get pending Review list
  const getPendingReviewList = (teacher) => {
    Api.get("api/v1/homeworkSchedule/review/pending", {
      params: {
        teacherId: teacher,
      },
    })
      .then((response) => {
        const dataValues = response.data.pendingReviewList;
        dataValues.sort(function compare(a, b) {
          var dateA = new Date(a.lessonDate);
          var dateB = new Date(b.lessonDate);
          return dateA - dateB;
        });
        setData(dataValues);
        setisLoading(false);
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

  // Get completed Review list
  const getCompletedReviewList = (teacher) => {
    Api.get("api/v1/homeworkSchedule/review/completed", {
      params: {
        teacherId: teacher,
      },
    })
      .then((response) => {
        const dataValues = response.data.completedReviewList;
        dataValues.sort(function compare(a, b) {
          var dateA = new Date(a.lessonDate);
          var dateB = new Date(b.lessonDate);
          return dateA - dateB;
        });
        setcompeleteData(dataValues);
        setisLoading(false);
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
                      <p className="tab-titles">PENDING REVIEW LIST </p>
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
                      <p className="tab-titles">COMPLETED REVIEW LIST</p>
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
                <h5 className="d-flex justify-content-center align-items-center py-3">Pending Home Work Review List</h5>
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
                    columns={columns}
                    localization={{
                      body: {
                        emptyDataSourceMessage: "No  Home Work Reviews are Available",
                      },
                    }}
                    actions={[
                      {
                        icon: () => <FontAwesomeIcon icon={faClipboardList} size="sm" color="#397AD4" />,
                        tooltip: "Review Home Work",
                        onClick: (event, rowData) => {
                          history.push("/homework/preview", rowData);
                        },
                      },
                    ]}
                  />
                </ThemeProvider>
              </div>
            ) : (
              <div>
                <h5 className="d-flex justify-content-center align-items-center py-3">
                  Completed Home Work Review List
                </h5>
                <ThemeProvider theme={tableTheme}>
                  <MaterialTable
                    icons={tableIcons}
                    data={completeData}
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
                    columns={columns}
                    localization={{
                      body: {
                        emptyDataSourceMessage: "No Completed Review List",
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

export default TeacherHomeworkReview;
