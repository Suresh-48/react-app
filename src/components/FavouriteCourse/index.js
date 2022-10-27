import React, { Component } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

//Component
import CourseCard from "../../components/core/CourseCard";
import Loader from "../core/Loader";

// Api
import Api from "../../Api";

export default class FavouriteCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favouriteCourseList: [],
      isLoading: true,
      spinner: false,
    };
  }

  //logout
  logout = () => {
    setTimeout(() => {
       localStorage.clear(this.props.history.push("/kharpi"));
       window.location.reload();
    }, 2000);
  };

  componentDidMount() {
    this.getFavouriteList();
  }

  getFavouriteList = () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("sessionId");

    Api.get(`api/v1/favouriteCourse/user`, {
      params: {
        userId: userId,
        token: token,
      },
    })
      .then((response) => {
        const list = response.data.data.favouriteCourseList;
        this.setState({
          favouriteCourseList: list,
          isLoading: false,
          spinner: false,
        });
      })
      .catch((error) => {
        if (error.response && error.response.status >= 400) {
          let errorMessage;
          const errorRequest = error.response.request;
          if (errorRequest && errorRequest.response) {
            errorMessage = JSON.parse(errorRequest.response).message;
          }
        }

        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          this.logout();
          toast.error("Session Timeout");
        }

        toast.error(error?.response?.data?.message);
      });
  };

  spinnerLoader = () => {
    this.setState({ spinner: !this.state.spinner });
  };

  render() {
    return (
      <Container className="mx-4">
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <div>
            <h3 className="mt-3">Favourite Courses</h3>
            <br />
            {this.state.favouriteCourseList?.length > 0 ? (
              <Row>
                {this.state.favouriteCourseList?.map((course, index) => (
                  <Col xs={12} sm={6} md={6} lg={4} className="mb-5 mt-3">
                    <CourseCard
                      course={course.courseId}
                      key={index}
                      onClick={this.spinnerLoader}
                      reload={this.getFavouriteList}
                    />
                  </Col>
                ))}
                {this.state.spinner && (
                  <div className="spanner">
                    <Spinner animation="grow" variant="light" />
                    <span>
                      <h4 style={{ paddingLeft: 20 }}>Loading...</h4>
                    </span>
                  </div>
                )}
              </Row>
            ) : (
              <div style={{ marginTop: "150px" }} className="text-center">
                No Favourite Course List
              </div>
            )}
          </div>
        )}
      </Container>
    );
  }
}
