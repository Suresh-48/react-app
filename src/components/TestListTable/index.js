import React, { Component } from "react";
import MaterialTable from "material-table";
import { Container } from "react-bootstrap";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import moment from "moment";

// Api
import Api from "../../Api";

// Component
import { tableIcons } from "../core/TableIcons";
import Loader from "../../components/core/Loader";
import { toast } from "react-toastify";

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
    field: "quizStatus",
  },
];

const token = localStorage.getItem("sessionId");

class TestListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isLoading: true,
      currentDate: "",
    };
  }

  //logout
  logout = () => {
    setTimeout(() => {
       localStorage.clear(this.props.history.push("/kharpi"));
       window.location.reload();
    }, 2000);
  };

  getCompleteClass = () => {
    const studentId = localStorage.getItem("studentId");
    const token = localStorage.getItem("sessionId");
    Api.get("api/v1/quizSchedule/student/list", {
      params: {
        studentId: studentId,
        token: token,
      },
    })
      .then((response) => {
        const data = response.data.quizList;
        data.sort(function compare(a, b) {
          var dateA = new Date(a.scheduleLesson.lessonDate);
          var dateB = new Date(b.scheduleLesson.lessonDate);
          return dateA - dateB;
        });
        this.setState({
          data: data,
          isLoading: false,
        });
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          this.logout();
          toast.error("Session Timeout");
        }
      });
  };

  componentDidMount() {
    const currentDate = moment().format();
    const date = moment(currentDate)
      .utc()
      .format();
    this.setState({ currentDate: date });
    this.getCompleteClass();
  }

  render() {
    const { isLoading, data, currentDate } = this.state;

    return (
      <div>
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            <div className="d-flex justify-content-center pt-3">
              <h5>Quiz</h5>
            </div>
            <div className="material-table-responsive">
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
                      emptyDataSourceMessage: "No Quiz List To Display",
                    },
                    header: {
                      actions: "Quiz",
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
                          {rowData.reviewStatus === "Open"
                            ? "Take Your Test"
                            : rowData.reviewStatus === "ReviewCompleted"
                            ? "View Result "
                            : "Preview Your Test"}
                        </p>
                      ),
                      tooltip: "Test",
                      onClick: (event, rowData) => {
                        if (rowData.scheduleLesson.timeStamp < currentDate) {
                          if (rowData.quizStatus === "Pending") {
                            this.props.history.push("/quiz", rowData);
                          } else {
                            this.props.history.push("/quiz/preview", rowData);
                          }
                        }
                      },
                    }),
                  ]}
                />
              </ThemeProvider>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default TestListTable;
