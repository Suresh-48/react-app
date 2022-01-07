import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import MaterialTable from "material-table";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core/styles";

// Api
import Api from "../../Api";

// Component
import Loader from "../core/Loader";
import { tableIcons } from "../core/TableIcons";

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

function CourseCategory(props) {
  const [isLoading, setisLoading] = useState(true);
  const [category, setcategory] = useState([]);

  // Column Heading
  const columns = [
    {
      title: "S.no",
      width: "10%",
      render: (rowData) => `${rowData?.tableData?.id + 1}`,
    },
    {
      title: "Category Name",
      field: "category.name",
      cellStyle: {
        cellWidth: "15%",
      },
    },
  ];

  useEffect(() => {
    courseCategoryData();
  }, []);

  // Get Course Category
  const courseCategoryData = () => {
    Api.get("api/v1/course").then((res) => {
      const data = res.data.data.data;
      setcategory(data);
      setisLoading(false);
    });
  };

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <Container className="my-5">
          <div className="d-flex justify-content-center align-items-center py-3">
            <h5>Course Category List</h5>
          </div>
          <ThemeProvider theme={tableTheme}>
            <div>
              <MaterialTable
                icons={tableIcons}
                data={category}
                columns={columns}
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
              />
            </div>
          </ThemeProvider>
        </Container>
      )}
    </div>
  );
}

export default CourseCategory;
