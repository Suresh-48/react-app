import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import CountUp from "react-countup";
import Avatar from "react-avatar";

// Component
import Loader from "../core/Loader";

// Api
import Api from "../../Api";

// style
import "../../css/StudentDetails.scss";
import { convertToRaw } from "draft-js";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

function ParentPublicProfile(props) {
  const [userDetail, setUserDetail] = useState("");
  const [isLoading, setisLoading] = useState(true);
  const [cardDetail, setCardDetail] = useState([]);
  const token = localStorage.getItem("sessionId");
  const history = useHistory();

  useEffect(() => {
    userDetails();
    getDashboardDetails();
  }, []);

  //logout
  const logout = () => {
     setTimeout(() => {
       localStorage.clear(history.push("/kharpi"));
       window.location.reload();
     }, 2000);
  };

  const userDetails = () => {
    Api.get(`api/v1/parent/${props.parentId}`, { headers: { token: token } })
      .then((response) => {
        const data = response.data.data.getOne;
        setUserDetail(data);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };
  const getDashboardDetails = () => {
    Api.get("api/v1/dashboard/parent/", {
      params: {
        parentId: props.parentId,
        token: token,
      },
    })
      .then((res) => {
        const data = res?.data?.data;
        setCardDetail(data);
        setisLoading(false);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          logout();
          toast.error("Session Timeout");
        }
      });
  };
  return (
    <div>
      <Container>
        {isLoading ? (
          <Loader />
        ) : (
          <div>
            <Row className="student-details">
              <div xs={6} md={3} className="user-avatar-style">
                {userDetail.imageUrl === undefined || userDetail.imageUrl === "null" || userDetail.imageUrl === "" ? (
                  <Avatar
                    name={`${userDetail?.firstName} ${userDetail?.lastName}`}
                    size="170"
                    round={true}
                    color="silver"
                  />
                ) : (
                  <Avatar src={userDetail?.imageUrl} size="170" round={true} color="silver" />
                )}
              </div>
              <div>
                <p className="student-detail">
                  {userDetail?.firstName} {userDetail?.lastName}
                </p>
                <p className="student-detail">{userDetail?.email}</p>
                {userDetail?.phone && <p className="student-detail">{userDetail?.phone}</p>}
                {userDetail?.address1 && userDetail?.city && userDetail?.state && (
                  <div style={{ marginTop: 20 }}>
                    <p className="student-detail">{`${userDetail?.address1 + ", " + userDetail?.address2}`}</p>
                    <p className="student-detail">{`${userDetail?.city + ", " + userDetail?.state}`}</p>
                    <p className="student-detail">{`${userDetail?.country + " - " + userDetail?.zipCode}`}</p>
                  </div>
                )}
              </div>
              <Row style={{ marginBottom: 20 }}>
                <Col xs={12} sm={6} xd={6}>
                  <Card className="popup-card-shadow" style={{ marginTop: 20 }}>
                    <div style={{ textAlign: "center" }}>
                      <p className="popup-label-style">Enrolled Student</p>
                      <p className="popup-count-style">{cardDetail?.totalStudent}</p>
                    </div>
                  </Card>
                </Col>
                <Col xs={12} sm={6} xd={6}>
                  <Card className="popup-card-shadow" style={{ marginTop: 20 }}>
                    <div style={{ textAlign: "center" }}>
                      <p className="popup-label-style">Active Courses</p>
                      <p className="popup-count-style">{cardDetail?.activeCourse}</p>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Row>
          </div>
        )}
      </Container>
    </div>
  );
}

export default ParentPublicProfile;
