import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { Row, Col } from "react-bootstrap";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import moment from "moment";
import { Tab, Tabs } from "@material-ui/core";
import { useHistory } from "react-router-dom";

// Api
import Api from "../../Api";

// Component
import { tableIcons } from "../core/TableIcons";
import Loader from "../../components/core/Loader";

function HomeWorkListTable() {
  const [value, setValue] = useState(0);
  const [pendingData, setPendingData] = useState([]);
  const [completedData, setCompletedData] = useState([]);
  const [previewData, setPreviewData] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");
  const history = useHistory();

  // Column Heading
  const columns = [
    {
      title: "S.no",
      width: "10%",
      render: (rowData) => `${rowData?.tableData?.id + 1}`,
    },
    {
      title: "Day",
      field: "courseScheduleId.weeklyOn",
    },
    {
      title: "Date",
      field: "scheduleLesson.lessonDate",
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
      title: "Status",
      field: "homeworkStatus",
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

  const getPendingData = () => {
    const studentId = localStorage.getItem("studentId");
    Api.get("api/v1/homeworkSchedule/student/homework/pending", {
      params: {
        studentId: studentId,
      },
    }).then((response) => {
      const pendingData = response.data.pendingReviewList;
      pendingData.sort(function compare(a, b) {
        var dateA = new Date(a.scheduleLesson.lessonDate);
        var dateB = new Date(b.scheduleLesson.lessonDate);
        return dateA - dateB;
      });
      setPendingData(pendingData);
      setIsloading(false);
    });
  };

  const getCompletedData = () => {
    const studentId = localStorage.getItem("studentId");
    Api.get("api/v1/homeworkSchedule/student/homework/completed", {
      params: {
        studentId: studentId,
      },
    }).then((response) => {
      const completedData = response.data.pendingReviewList;
      completedData.sort(function compare(a, b) {
        var dateA = new Date(a.scheduleLesson.lessonDate);
        var dateB = new Date(b.scheduleLesson.lessonDate);
        return dateA - dateB;
      });
      setCompletedData(completedData);
      setIsloading(false);
    });
  };

  const getPreviewData = () => {
    const studentId = localStorage.getItem("studentId");
    Api.get("api/v1/homeworkSchedule/student/homework/review", {
      params: {
        studentId: studentId,
      },
    }).then((response) => {
      const previewData = response.data.pendingReviewList;
      previewData.sort(function compare(a, b) {
        var dateA = new Date(a.scheduleLesson.lessonDate);
        var dateB = new Date(b.scheduleLesson.lessonDate);
        return dateA - dateB;
      });
      setPreviewData(previewData);
      setIsloading(false);
    });
  };

  useEffect(() => {
    const currentDate = moment().format();
    const date = moment(currentDate).utc().format();
    getPreviewData();
    getCompletedData();
    getPendingData();
    setCurrentDate(date);
  }, []);

  return (
    <div>
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
                    <p className="tab-titles">PENDING </p>
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
                    <p className="tab-titles">COMPLETED </p>
                  </Col>
                </Row>
              }
              style={{ width: "50%" }}
              value={1}
            />
            <Tab
              label={
                <Row>
                  <Col>
                    <p className="tab-titles">PREVIEW </p>
                  </Col>
                </Row>
              }
              style={{ width: "50%" }}
              value={2}
            />
          </Tabs>
          <hr />
          {value === 0 ? (
            <div>
              <div>
                <h5 className="d-flex justify-content-center align-items-center py-3">Pending HomeWork</h5>
              </div>
              <ThemeProvider theme={tableTheme}>
                <MaterialTable
                  icons={tableIcons}
                  data={pendingData}
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
                      emptyDataSourceMessage: "No Home Work List To Display",
                    },
                    header: {
                      actions: "HomeWork",
                    },
                  }}
                  actions={[
                    (rowData) => ({
                      icon: () => (
                        <p
                          className={`${
                            rowData.scheduleLesson.timeStamp < currentDate
                              ? "zoom-view-style"
                              : "zoom-view-disable-style"
                          }`}
                        >
                          {rowData.reviewStatus === "Open" ? "Do your HomeWork" : null}
                        </p>
                      ),
                      tooltip: "HomeWork",
                      onClick: (event, rowData) => {
                        if (rowData.scheduleLesson.timeStamp < currentDate) {
                          history.push("/homework", rowData);
                        }
                      },
                    }),
                  ]}
                />
              </ThemeProvider>
            </div>
          ) : (
            <div>
              {value === 1 ? (
                <div>
                  <div>
                    <h5 className="d-flex justify-content-center align-items-center py-3">Completed HomeWork</h5>
                  </div>
                  <ThemeProvider theme={tableTheme}>
                    <MaterialTable
                      icons={tableIcons}
                      data={completedData}
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
                          emptyDataSourceMessage: "No Home Work List To Display",
                        },
                        header: {
                          actions: "HomeWork",
                        },
                      }}
                      actions={[
                        (rowData) => ({
                          icon: () => (
                            <p
                              className={`${
                                rowData.scheduleLesson.timeStamp < currentDate
                                  ? "zoom-view-style"
                                  : "zoom-view-disable-style"
                              }`}
                            >
                              {rowData.reviewStatus === "OnReview" ? "Preview your HomeWork" : null}
                            </p>
                          ),
                          tooltip: "Preview",
                          onClick: (event, rowData) => {
                            if (rowData.scheduleLesson.timeStamp < currentDate) {
                              history.push("/homework/preview", rowData);
                            }
                          },
                        }),
                      ]}
                    />
                  </ThemeProvider>
                </div>
              ) : (
                <div>
                  <div>
                    <h5 className="d-flex justify-content-center align-items-center py-3">Review Your HomeWork</h5>
                  </div>
                  <ThemeProvider theme={tableTheme}>
                    <MaterialTable
                      icons={tableIcons}
                      data={previewData}
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
                          emptyDataSourceMessage: "No Home Work List To Display",
                        },
                        header: {
                          actions: "HomeWork",
                        },
                      }}
                      actions={[
                        (rowData) => ({
                          icon: () => (
                            <p
                              className={`${
                                rowData.scheduleLesson.timeStamp < currentDate
                                  ? "zoom-view-style"
                                  : "zoom-view-disable-style"
                              }`}
                            >
                              {rowData.reviewStatus === "ReviewCompleted" ? "View Result" : null}
                            </p>
                          ),
                          tooltip: "View Result",
                          onClick: (event, rowData) => {
                            if (rowData.scheduleLesson.timeStamp < currentDate) {
                              history.push("/homework/answers", rowData);
                            }
                          },
                        }),
                      ]}
                    />
                  </ThemeProvider>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HomeWorkListTable;
