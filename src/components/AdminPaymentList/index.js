import MaterialTable from "material-table";
import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";

// Styles
import "../../css/AdminPaymentList.scss";

// Api
import Api from "../../Api";

// Component
import { tableIcons } from "../core/TableIcons";

//Loader
import Loader from "../../components/core/Loader";

function AdminPaymentList() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Column Heading
  const columns = [
    {
      title: "S.No",
      width: "3%",
      render: (rowData) => `${rowData.tableData.id + 1}`,
    },
    {
      title: "Name",
      render: (rowData) => `${rowData.firstName + " " + rowData.lastName}`,
    },
    {
      title: "Phone Number",
      field: "phone",
    },
    {
      title: "Email",
      field: "email",
      textAlign: "center",
    },
    {
      title: "Course Name",
      field: "courseId.name",
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
      title: "Payment",
      render: (rowData) => `${"$" + rowData.payment}`,
    },
  ];

  // Table Styles
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

  // Get Payment List
  const getAdminPaymentList = () => {
    Api.get("api/v1/dashboard/admin/billing/detail").then((response) => {
      const data = response.data.data;
      setData(data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    getAdminPaymentList();
  }, []);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <Container>
          <Row className="pt-3">
            <h5 className="adminpayment-title">Course Payments List</h5>
          </Row>
          <ThemeProvider theme={tableTheme}>
            <MaterialTable
              icons={tableIcons}
              columns={columns}
              data={data}
              options={{
                showTitle: false,
                headerStyle: {
                  fontWeight: "bold",
                  backgroundColor: "#CCE6FF",
                  zIndex: 0,
                  textAlign: "center",
                },
              }}
              localization={{
                body: {
                  emptyDataSourceMessage: "No Payment List",
                },
              }}
            />
          </ThemeProvider>
        </Container>
      )}
    </div>
  );
}

export default AdminPaymentList;
