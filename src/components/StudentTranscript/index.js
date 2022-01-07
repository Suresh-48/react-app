import MaterialTable from "material-table";
import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import { Container } from "react-bootstrap";
import Api from "../../Api";

// Component
import { tableIcons } from "../core/TableIcons";
import Loader from "../core/Loader";

function StudentTranscript(props) {
  const [studentId, setstudentId] = useState(props?.match?.params?.id);
  const [isLoading, setisLoading] = useState(true);
  const [data, setData] = useState([]);

  // Style
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

  const columns = [
    {
        title: "S.no",
        width: "10%",
        render: (rowData) => `${rowData?.tableData?.id + 1}`,
      },
      {
        title:"Catagory Name",
        field:"courseId.category.name"
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
      field: "scheduleLesson.lessonDate",
    },
    {
      title: "Scored",
      field: "scored",
    },
  ];

  const getStudentMarks = () => {
    Api.get(`api/v1/quizSchedule/student/completed/quiz/result`, {
      params: {
        studentId: studentId,
      },
    }).then((response) => {
      const data = response.data.getAll;
      setData(data);
      setisLoading(false);
    });
  };

  useEffect(() => {
    getStudentMarks();
  },[]);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <Container>
          <div>
            <h4 className="d-flex justify-content-center align-items-center py-3">
              Student Quiz Marks
            </h4>
          </div>
          <ThemeProvider theme={tableTheme}>
            <MaterialTable
              icons={tableIcons}
              columns={columns}
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
              localization={{
                body: {
                  emptyDataSourceMessage: 'No Student Marks',
                },
              }}
            />
          </ThemeProvider>
        </Container>
       )}  
    </div>
  );
}
export default StudentTranscript;
