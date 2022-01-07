import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { Container } from "react-bootstrap";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";

// Api
import Api from "../../Api";

// Component
import { tableIcons } from "../core/TableIcons";
import Loader from "../../components/core/Loader";

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
    title: "First Name",
    field: "studentId.firstName",
  },
  {
    title: "Last Name",
    field: "studentId.lastName",
  },
  {
    title: "Email",
    field: "studentId.email",
  },
];

function EachClassStudentList(props) {
  const [scheduleId, setscheduleId] = useState(props?.match?.params?.id);
  const [data, setdata] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  const getStudentListForClass = () => {
    Api.get(`api/v1/teacher/schedule/student/list`, {
      params: {
        scheduleId: scheduleId,
      },
    }).then((response) => {
      const studentList = response.data.studentList;
      setdata(studentList);
      setisLoading(false);
    });
  };

  useEffect(() => {
    getStudentListForClass();
  }, []);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <Container>
          <div className="d-flex justify-content-center pt-3">
            <h5>Student List For Class</h5>
          </div>
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
                  emptyDataSourceMessage: "No Student List To Display",
                },
              }}
              actions={[
                (rowData) => ({
                  icon: () => (
                    <p className={"zoom-view-style"}>View Student Details</p>
                  ),
                  tooltip: "Student Details",
                  onClick: (event, rowData) => {},
                }),
              ]}
            />
          </ThemeProvider>
        </Container>
      )}
    </div>
  );
}
export default EachClassStudentList;
