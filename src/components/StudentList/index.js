import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";
import {  useHistory } from 'react-router-dom'

// Styles
import "../../css/StudentList/_StudentList.scss";

// Api
import Api from "../../Api";

// Component
import { tableIcons } from '../core/TableIcons'
import Loader from '../../components/core/Loader'

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

function StudentList(props) {
  const [ parentId, setparentId ] = useState(props?.match?.params?.id);
  const [ details, setdetails ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true)
  const history = useHistory()

  const getStudentListData = () => {
    Api.get("api/v1/parent/student/list", {
      params: {
        parentId: parentId,
      },
    }).then((response) => {
      const data = response.data.data.studentList;
      setdetails(data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    getStudentListData();
  },[]);

  const columns = [
    { title: "S.no", field: "", render: (rowData) => rowData.tableData.id + 1, width: "3%" },
    { title: "FirstName", field: "firstName" },
    { title: "LastName", field: "lastName" },
    { title: "Email", field: "email" },
    { title: "Course Count", field: "totalCourseEnrolled" },
  ];

  return (
    <div className="student-margin">
      {isLoading ? (
        <Loader />) : (
        <Container>
          <Row className="pt-3">
            <h3 className="student-title">
              Student List
            </h3>
          </Row>
          <ThemeProvider theme={tableTheme}>
            <MaterialTable
              icons={tableIcons}
              data={details}
              columns={columns}
              options={{
                showTitle: false,
                headerStyle: {
                  fontWeight: "bold",
                  backgroundColor: "#CCE6FF",
                  zIndex: 0,
                },
                actionsColumnIndex: -1,
                addRowPosition: 'last',
              }}
              localization={{
                body: {
                  emptyDataSourceMessage: 'No Student List',
                },
              }}
                actions={[
                  {
                    icon: () => (
                      <p
                        className="enroll-style"
                        style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          marginBottom: 0,
                          color: '#0D6EFD',
                        }}
                      >
                        View
                      </p>
                    ),
                    onClick: (event, rowData) => {
                      history.push(`/upcoming/schedule/list/${rowData.id}`)
                    },
                    tooltip: 'View Upcoming Course Schedule',
                  },
                ]}
            />
          </ThemeProvider>
        </Container>
      )}
    </div>
  );
}

export default StudentList;