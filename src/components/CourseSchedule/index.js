import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment-timezone";

// Material Table Icons
import AddBox from "@material-ui/icons/AddBox";
import Edit from "@material-ui/icons/Edit";

// Component
import Loader from "../core/Loader";
import CourseSideMenu from "../CourseSideMenu";
import { tableIcons } from "../core/TableIcons";

// Api
import Api from "../../Api";

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

function CourseSchedule(props) {
  const [data, setData] = useState([]);
  const [courseDetail, setCourseDetail] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [courseId, setcourseId] = useState(props?.location?.state?.courseId);
  const history = useHistory();

  // Column Heading
  const columns = [
    {
      title: "S.No",
      render: (rowData) => rowData?.tableData?.id + 1,
    },
    {
      title: "Weekly On",
      field: "weeklyOn",
      cellStyle: { width: 135 },
    },
    {
      title: "Start Date",
      field: "startDate",
      cellStyle: { width: 165 },
    },
    {
      title: "Start Time",
      field: "startTime",
    },
    {
      title: "End Time",
      field: "endTime",
    },
    {
      title: "Maximum Enroll Count",
      field: "totalStudentEnrolled",
      cellStyle: { width: 145 },
    },
    {
      title: "Teacher Assigned",
      render: (rowData) =>
        rowData.teacherId ? `${rowData.teacherId.firstName + " " + rowData.teacherId.lastName}` : "Not Scheduled",
    },
  ];

  // Get course schedule
  const courseSchedule = () => {
    Api.get("/api/v1/courseSchedule/course/list", {
      params: {
        courseId: courseId,
      },
    }).then((res) => {
      const list = res.data.courseList;
      setData(list);
      setIsLoading(false);
    });
  };

  // Get course detail
  const getCourseDetail = () => {
    Api.get(`api/v1/course/${courseId}`).then((response) => {
      const courseDetail = response.data.data;
      setCourseDetail(courseDetail);
    });
  };
  useEffect(() => {
    courseSchedule();
    getCourseDetail();
  }, []);

  // Delete Course Schedule
  const deleteCourseSchedule = (data, reload) => {
    const date = Date.now();
    const cTime = moment(date).tz("America/Chicago").format("LT");
    const cDate = moment(date).tz("America/Chicago").format("ll");

    Api.delete(`api/v1/courseSchedule/`, {
      params: {
        scheduleId: data.id,
        courseId: courseId,
        currentDate: cDate,
        currentTime: cTime,
      },
    })
      .then((res) => {
        courseSchedule();
        reload();
      })
      .catch((error) => {
        if (error.response && error.response.status >= 400) {
          let errorMessage;
          const errorRequest = error.response.request;
          if (errorRequest && errorRequest.response) {
            errorMessage = JSON.parse(errorRequest.response).message;
            reload();
          }
          reload();
          toast.error(error.response.data.message);
        }
      });
  };

  return (
    <Container>
      <CourseSideMenu courseId={courseId} />
      <div className=" row mt-3 main">
        <ThemeProvider theme={tableTheme}>
          {isLoading ? (
            <Loader />
          ) : (
            <div>
              <div className="d-flex justify-content-center align-items-center py-3">
                <h4>Schedule List</h4>
              </div>
              <MaterialTable
                style={{ width: "100%" }}
                icons={tableIcons}
                title={data?.length === 0 ? "" : data[0]?.courseId?.name}
                data={data}
                columns={columns}
                actions={[
                  {
                    icon: () => <AddBox style={{ color: "#397ad4" }} />,
                    tooltip: "Add Schedule",
                    isFreeAction: true,
                    onClick: (event, rowData) => {
                      history.push({
                        pathname: "/course/schedule/add",
                        state: {
                          courseId: courseId,
                          courseName: courseDetail?.name,
                        },
                      });
                    },
                  },
                  {
                    icon: () => <Edit style={{ color: "#1458e0" }} />,
                    tooltip: "Edit Schedule",
                    onClick: (event, rowData) => {
                      history.push("/course/schedule/update", rowData);
                    },
                  },
                ]}
                editable={{
                  onRowDelete: (selectedRow) =>
                    new Promise((resolve, reject) => {
                      deleteCourseSchedule(selectedRow, resolve);
                    }),
                }}
                localization={{
                  body: {
                    emptyDataSourceMessage: "Schedule Yet to be Created!.",
                  },
                }}
                options={{
                  actionsColumnIndex: -1,
                  addRowPosition: "last",
                  headerStyle: {
                    fontWeight: "bold",
                    backgroundColor: "#CCE6FF",
                    zIndex: 0,
                  },
                }}
              />
            </div>
          )}
        </ThemeProvider>
      </div>
    </Container>
  );
}

export default CourseSchedule;
