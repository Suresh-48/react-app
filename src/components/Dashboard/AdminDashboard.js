import React, { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";

// Component
import DashboardTiles from "../../components/core/DashboardTiles";

// Api
import Api from "../../Api";
import Loader from "../core/Loader";
import { useHistory } from "react-router-dom";

function AdminDashboard() {
  const [adminDashboard, setAdminDashboard] = useState("");
  const [approvedData, setApprovedData] = useState("");
  const [pendingData, setPendingData] = useState("");
  const [isLoading, setisLoading] = useState(true);
  const history = useHistory();

  const token = localStorage.getItem("sessionId");

  const getAdminDashboard = () => {
    Api.get("api/v1/dashboard/admin/", { headers: { token: token } }).then((response) => {
      const data = response.data.data;
      setAdminDashboard(data);
      setisLoading(false);
    });
  };

  // Log out
  const logout = () => {
    setTimeout(() => {
      localStorage.clear(history.push("/kharpi"));
      window.location.reload();
    }, 2000);
  };

  //get approved teacher list
  const getTeacherApprovedListData = () => {
    Api.get("api/v1/teacher/list").then((response) => {
      const approvedData = response.data.teacherList;
      setApprovedData(approvedData);
      setisLoading(false);
    });
  };

  // get pending teacher list
  const getTeacherPendingListData = () => {
    Api.get("api/v1/teacher/pending/list", { headers: { token: token } }).then((response) => {
      const pendingData = response.data.PendingList;
      setPendingData(pendingData);
      setisLoading(false);
    });
  };

  useEffect(() => {
    getTeacherApprovedListData();
    getAdminDashboard();
    getTeacherPendingListData();
  }, []);

  return (
    <div className="admin-dashboard-min-height mt-2">
      <Container>
        {isLoading ? (
          <Loader />
        ) : (
          <Row className="mb-4">
            <DashboardTiles label="Parents" count={adminDashboard?.totalParent} url="/parents/list" />
            <DashboardTiles label="Students" count={adminDashboard?.totalStudent} url="/students/list" />
            <DashboardTiles label="Courses" count={adminDashboard?.totalCourse} url="/course/list" />
            <DashboardTiles
              label="Approved Teachers"
              count={approvedData?.length}
              url={{
                pathname: "/teacher/list",
                state: {
                  indexCount: 0,
                },
              }}
            />
            <DashboardTiles
              label="Pending Teachers"
              count={pendingData?.length}
              url={{
                pathname: "/teacher/list",
                state: {
                  indexCount: 1,
                },
              }}
            />
            <DashboardTiles label="Amount Received" count={adminDashboard?.totalAmount} url="/payment/list" />
          </Row>
        )}
      </Container>
    </div>
  );
}

export default AdminDashboard;
