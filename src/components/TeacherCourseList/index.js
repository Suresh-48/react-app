import React, { useState, useEffect } from "react";
import { tableIcons } from "../core/TableIcons";
import MaterialTable from "material-table";
import { ThemeProvider } from "@material-ui/styles";
import { Link } from "react-router-dom";
import { Container, Dropdown } from "react-bootstrap";

// Icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

// Api
import Api from "../../Api";
import Loader from "../core/Loader";
import { ROLES_ADMIN } from "../../constants/roles";

const columns = [
  { title: "S.no", render: (rowdata) => `${rowdata.tableData.id + 1}` },
  {
    title: "Category",
    field: "courseId.category.name",
  },
  {
    title: "CourseName",
    field: "courseId.name",
  },
  {
    title: "StartDate",
    field: "startDate",
  },
  {
    title: "Weekly On",
    field: "weeklyOn",
  },
  {
    title: "Start Time",
    field: "startTime",
  },
  {
    title: "End Time",
    field: "endTime",
  },
];

function TeacherCourseList(props) {
  const [teacherId, setTeacherId] = useState(props?.match?.params?.id);
  const [firstName, setfirstName] = useState(props?.location?.state?.rowData?.firstName);
  const [lastName, setlastName] = useState(props?.location?.state?.rowData?.lastName);
  const [data, setdata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState("");
  const [colId, setColId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const ToggleButton = () => setIsOpen(!isOpen);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setRole(role);
    getTeacherScheduleList();
  }, []);

  const isAdmin = role === ROLES_ADMIN;

  const getTeacherScheduleList = () => {
    Api.get(`api/v1/teacher/course/list`, {
      params: {
        teacherId: teacherId,
      },
    }).then((response) => {
      const data = response.data.teacherCourses;
      setdata(data);
      setIsLoading(false);
    });
  };

  return (
    <div>
      <Container>
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            {isAdmin ? (
              <div className="d-flex justify-content-center align-items-center py-3">
                <h5>{`${firstName + " " + lastName}`} Schedule List</h5>
              </div>
            ) : (
              <div className="d-flex justify-content-center align-items-center py-3">
                <h5> Schedule List</h5>
              </div>
            )}
            <ThemeProvider>
              <MaterialTable
                icons={tableIcons}
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
                data={data}
                actions={[
                  (rowData) => {
                    return {
                      icon: () => (
                        <Dropdown>
                          <Dropdown.Toggle className="teacher-menu-dropdown" varient="link">
                            <FontAwesomeIcon icon={faEllipsisV} size="sm" color="#397ad4" />
                          </Dropdown.Toggle>
                          {colId === rowData.id ? (
                            <Dropdown.Menu right className="menu-dropdown-status py-0">
                              <Dropdown.Item className="status-list">
                                <Link
                                  to={{
                                    pathname: `/upcoming/schedule/${colId}`,
                                    state: {
                                      rowData,
                                    },
                                  }}
                                  className="collapse-text-style"
                                >
                                  Upcoming Schedule
                                </Link>
                              </Dropdown.Item>
                              <hr />
                              <Dropdown.Item className="status-list">
                                <Link
                                  to={{
                                    pathname: `/class/student/list/${rowData.id}`,
                                    state: {
                                      rowData,
                                    },
                                  }}
                                  className="collapse-text-style"
                                >
                                  Students List
                                </Link>
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          ) : null}
                        </Dropdown>
                      ),
                      onClick: (event, rowData) => {
                        setColId(rowData.id);
                        setIsOpen(!isOpen);
                      },
                    };
                  },
                ]}
                localization={{
                  body: {
                    emptyDataSourceMessage: "Teacher Course List Yet to be Schedule",
                  },
                }}
              />
            </ThemeProvider>
          </div>
        )}
      </Container>
    </div>
  );
}

export default TeacherCourseList;
