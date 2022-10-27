import { Container, Form, Col, Row, Card, FormControl, Modal } from "react-bootstrap";
import React, { Component } from "react";
import Label from "../../components/core/Label";
import Select from "react-select";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";

import Api from "../../Api";
import { Typography } from "@material-ui/core";
import "../../css/Forum.scss";
import Loader from "../core/Loader";
import { toast } from "react-toastify";

class ForumSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: [],
      courseList: [],
      data: [],
      courseData: [],
      categoryName: "",
      latestData: [],
      isLoading: true,
    };
  }

  //logout
  logout = () => {
    setTimeout(() => {
       localStorage.clear(this.props.history.push("/kharpi"));
       window.location.reload();
    }, 2000);
  };

  getLatestConversation = () => {
    const token = localStorage.getItem("sessionId");
    Api.get("api/v1/forum/latest", { headers: { token: token } })
      .then((response) => {
        const data = response?.data?.forumList;
        this.setState({ latestData: data });
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          this.logout();
          toast.error("Session Timeout");
        }
      });
  };

  getCategory = () => {
    const token = localStorage.getItem("sessionId");
    const studentId = localStorage.getItem("studentId");
    Api.get("/api/v1/category/", { headers: { token: token } })
      .then((res) => {
        const data = res.data.data.data;
        this.setState({
          category: data,
          // categoryName: { value: data[0].id, label: data[0].name },
        });
        this.setState({ isLoading: false });
        // this.courseFilter(data[0].id);
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          this.logout();
          toast.error("Session Timeout");
        }
      });
  };

  courseFilter = (categoryId) => {
    const token = localStorage.getItem("sessionId");
    Api.get("/api/v1/forum/filter", {
      params: {
        categoryId: categoryId,
        token: token,
      },
    })
      .then((response) => {
        const data = response?.data?.getCourse;
        this.setState({ courseData: data });
        this.setState({ isLoading: false });
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          this.logout();
          toast.error("Session Timeout");
        }
      });
  };

  componentDidMount() {
    this.getCategory();
    this.getLatestConversation();
    this.getAllCources();
  }

  getAllCources = () => {
    const token = localStorage.getItem("sessionId");
    Api.get("/api/v1/course/publish", { headers: { token: token } })
      .then((res) => {
        const data = res?.data?.data?.data;
        this.setState({ courseData: data });
      })
      .catch((error) => {
        const errorStatus = error?.response?.status;
        if (errorStatus === 401) {
          this.logout();
          toast.error("Session Timeout");
        }
      });
  };

  convertFromJSONToHTML = (value) => {
    try {
      return { __html: stateToHTML(convertFromRaw(JSON.parse(value))) };
    } catch (exp) {
      return { __html: "Error" };
    }
  };
  render() {
    const { courseData, latestData } = this.state;

    return (
      <div>
        {this.state.isLoading ? (
          <Loader />
        ) : (
          <Container className="mb-3">
            <Row className="d-flex justify-content-center">
              <Col xs={8} sm={8} md={7} lg={6}>
                <Form.Group className="form-row mb-2" style={{ width: "100%" }}>
                  <Label className="mb-1">Category :</Label>
                  <Select
                    placeholder="Select Category"
                    name="category"
                    value={this?.state?.categoryName}
                    options={[
                      {
                        options: this?.state?.category?.map((list) => ({
                          value: list?.id,
                          label: list?.name,
                        })),
                      },
                    ]}
                    onChange={(e) => {
                      this.setState({ categoryName: e });
                      this.courseFilter(e.value);
                    }}
                    style={{ backgroundColor: "white" }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="my-3">
              <Col md={4}>
                <div className="forum-page-scrolldown mt-5">
                  {courseData &&
                    courseData?.map((course, index) => (
                      <Row className="mt-3 mb-3">
                        <div
                          className="d-flex flex-direction-row "
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            this.props.history.push({
                              pathname: `/forum`,
                              state: {
                                course: course,
                              },
                            })
                          }
                        >
                          <Col xs={3} sm={3} lg={3} md={3}>
                            <img
                              className="forum-image w-100"
                              src={course?.imageUrl}
                              alt={`${course?.category?.name}`}
                            />
                          </Col>
                          <Col xs={9} sm={9} lg={9} md={9}>
                            <div className="mx-2">
                              <b>{course?.name}</b>
                              <Typography
                                dangerouslySetInnerHTML={this.convertFromJSONToHTML(course?.description)}
                                className="forum-text"
                              ></Typography>
                            </div>
                          </Col>
                        </div>
                      </Row>
                    ))}
                </div>
              </Col>
              <Col md={8}>
                <h4 className="text-center mt-1">Recent Conversation</h4>
                <Card>
                  <div className="forum-scrolldown-bottom">
                    <div className="forum-page-content mb-2">
                      <h5 className="forum-new-message">What's New !</h5>
                    </div>
                    {latestData &&
                      latestData?.map((list, index) => (
                        <div
                          onClick={() => {
                            this.props.history.push({
                              pathname: "/forum/conversation",
                              state: { commentsData: list },
                            });
                          }}
                          className="recent-conver-cursor mx-2 my-2 pt-3 "
                        >
                          <div className="forum-column mx-3">
                            <b>{list?.courseId?.aliasName}</b>
                            <samp style={{ color: "#9e9e9e" }}>{list?.createdAt}</samp>
                          </div>
                          <Typography
                            dangerouslySetInnerHTML={this.convertFromJSONToHTML(list.question)}
                            className="forum-page-text  mt-1 "
                          ></Typography>
                          {/* <hr className="mb-1" /> */}
                        </div>
                      ))}
                  </div>
                </Card>
              </Col>
            </Row>
          </Container>
        )}
      </div>
    );
  }
}

export default ForumSelect;
