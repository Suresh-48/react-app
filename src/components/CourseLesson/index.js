import MaterialTable from "material-table";
import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { toast } from "react-toastify";

// Material Table Icons
import AddBox from "@material-ui/icons/AddBox";
import Edit from "@material-ui/icons/Edit";

// Api
import Api from "../../Api";

// Material Table Styles
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";

// Component
import Loader from "../core/Loader";
import CourseSideMenu from "../CourseSideMenu";
import { tableIcons } from "../core/TableIcons";

function CourseLesson(props) {
  const [data, setData] = useState([]);
  const [courseDetail, setCourseDetail] = useState([]);
  const [courseId, setcourseId] = useState(props.location.state.courseId);
  const [isLoading, setIsLoading] = useState(true);

  const history = useHistory();

  // Column Heading
  const columns = [
    {
      title: "Lesson",
      width: "5%",
      render: (rowData) => `${rowData?.tableData?.id + 1}`,
    },
    {
      title: "Lesson Name",
      field: "lessonName",
    },
    {
      title: "Description",
      render: (rowData) => (
        <div className="ellipsis-text" dangerouslySetInnerHTML={convertFromJSONToHTML(`${rowData.description}`)}></div>
      ),
      // cellStyle: {
      //   textOverflow: 'ellipsis',
      //   whiteSpace: 'nowrap',
      //   overflow: 'hidden',
      //   maxWidth: 350,
      // },
    },
    {
      title: "Duration",
      render: (rowData) => `1 hour`,
    },
  ];

  // Get Course Lesson List
  const courseLessonData = () => {
    Api.get("api/v1/courseLesson/lessonlist", {
      params: {
        courseId: courseId,
      },
    }).then((response) => {
      const data = response.data.lessonList;
      data.sort((a, b) => (a.lessonNumber > b.lessonNumber ? 1 : -1));
      setData(data);
      setIsLoading(false);
    });
  };

  // Get Course Detail
  const getCourseDetail = () => {
    Api.get(`api/v1/course/${courseId}`).then((response) => {
      const courseDetail = response.data.data;
      setCourseDetail(courseDetail);
    });
  };

  const convertFromJSONToHTML = (value) => {
    try {
      return { __html: stateToHTML(convertFromRaw(JSON.parse(value))) };
    } catch (exp) {
      return { __html: "Error" };
    }
  };

  useEffect(() => {
    courseLessonData();
    getCourseDetail();
  }, []);

  // Delete Lesson
  const deleteLesson = (data, reload) => {
    Api.delete("api/v1/courseLesson/" + data.id)
      .then((response) => {
        courseLessonData();
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

  // Style
  const tableTheme = createTheme({
    overrides: {
      MuiTableRow: {
        root: {
          "&:hover": {
            cursor: "pointer",
            backgroundColor: "rgba(224, 224, 224, 1) !important",
          },
          "&:nth-child(even)": {
            backgroundColor: "#f0f5f5",
          },
        },
      },
    },
  });

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
                <h4>Lesson List</h4>
              </div>
              <MaterialTable
                style={{ width: "100%" }}
                icons={tableIcons}
                title={data?.length === 0 ? "" : data[0]?.courseId?.name}
                data={data}
                columns={columns}
                actions={[
                  {
                    icon: () => <AddBox style={{ color: "#397AD4" }} />,
                    tooltip: "Add Lesson",
                    isFreeAction: true,
                    onClick: (event, rowData) => {
                      history.push({
                        pathname: "/course/lesson/add",
                        state: {
                          courseId: courseId,
                          courseName: courseDetail?.name,
                        },
                      });
                    },
                  },
                  {
                    icon: () => <Edit style={{ color: "#1458E0" }} />,
                    tooltip: "Edit Lesson",
                    onClick: (event, rowData) => {
                      history.push(`/course/lesson/edit/${rowData.id}`, rowData);
                    },
                  },
                ]}
                localization={{
                  body: {
                    emptyDataSourceMessage: "No Lessons Are Created",
                  },
                }}
                editable={{
                  onRowDelete: (selectedRow) =>
                    new Promise((resolve, reject) => {
                      deleteLesson(selectedRow, resolve);
                    }),
                  saveTooltip: "Delete",
                }}
                options={{
                  actionsColumnIndex: -1,
                  addRowPosition: "last",
                  headerStyle: {
                    backgroundColor: "#cce6ff",
                    fontWeight: "bold",
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
export default CourseLesson;
